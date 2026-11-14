import { useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';

type LabTab = 'gates' | 'numbers-hamming' | 'combinational' | 'flipflops' | 'cache';
type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
type FFType = 'SR' | 'JK' | 'D' | 'T';

interface InteractiveLabViewProps {
  initialSimulator?: string;
}

export function InteractiveLabView({ initialSimulator }: InteractiveLabViewProps) {
  const [activeTab, setActiveTab] = useState<LabTab>(() => {
    if (
      initialSimulator === 'gates' ||
      initialSimulator === 'numbers-hamming' ||
      initialSimulator === 'combinational' ||
      initialSimulator === 'flipflops' ||
      initialSimulator === 'cache'
    ) {
      return initialSimulator;
    }
    return 'gates';
  });

  // 1. Logic Gate State
  const [gate, setGate] = useState<GateType>('NAND');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(0);

  const evalGate = (g: GateType, a: 0 | 1, b: 0 | 1): 0 | 1 => {
    switch (g) {
      case 'AND': return a & b ? 1 : 0;
      case 'OR': return a | b ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'NAND': return !(a & b) ? 1 : 0;
      case 'NOR': return !(a | b) ? 1 : 0;
      case 'XOR': return a ^ b ? 1 : 0;
      case 'XNOR': return !(a ^ b) ? 1 : 0;
    }
  };
  const gateOut = evalGate(gate, inA, inB);

  // 2. Number Systems & Hamming Code State
  const [decInput, setDecInput] = useState<string>('42');
  const [hammingData, setHammingData] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([1, 0, 1, 1]); // D7, D6, D5, D3
  const [flippedBitPos, setFlippedBitPos] = useState<number | null>(null); // 1..7

  const parsedDec = Number.isFinite(Number(decInput)) ? Math.trunc(Number(decInput)) : 0;
  const clampedUnsigned = Math.max(0, Math.min(255, Math.abs(parsedDec)));
  const bin8 = clampedUnsigned.toString(2).padStart(8, '0');
  const onesComp8 = bin8.split('').map((b) => (b === '0' ? '1' : '0')).join('');
  const twosComp8 = ((~clampedUnsigned + 1) & 0xff).toString(2).padStart(8, '0');
  const grayStr = clampedUnsigned
    .toString(2)
    .split('')
    .map((bit, i, arr) => (i === 0 ? bit : String(Number(arr[i - 1]) ^ Number(bit))))
    .join('');
  const bcdStr = String(clampedUnsigned)
    .split('')
    .map((d) => Number(d).toString(2).padStart(4, '0'))
    .join(' ');
  const xs3Str = String(clampedUnsigned)
    .split('')
    .map((d) => (Number(d) + 3).toString(2).padStart(4, '0'))
    .join(' ');

  // Hamming (7,4) Even Parity calculation: [D7, D6, D5, P4, D3, P2, P1]
  const [d7, d6, d5, d3] = hammingData;
  const p1 = (d3 ^ d5 ^ d7) as 0 | 1;
  const p2 = (d3 ^ d6 ^ d7) as 0 | 1;
  const p4 = (d5 ^ d6 ^ d7) as 0 | 1;
  const encoded7 = [
    { pos: 7, label: 'D₇', val: d7 },
    { pos: 6, label: 'D₆', val: d6 },
    { pos: 5, label: 'D₅', val: d5 },
    { pos: 4, label: 'P₄', val: p4 },
    { pos: 3, label: 'D₃', val: d3 },
    { pos: 2, label: 'P₂', val: p2 },
    { pos: 1, label: 'P₁', val: p1 }
  ];
  const received7 = encoded7.map((b) => ({
    ...b,
    rx: (flippedBitPos === b.pos ? (b.val ^ 1) : b.val) as 0 | 1
  }));
  const rxByPos = (pos: number) => received7.find((x) => x.pos === pos)!.rx;
  const c1 = rxByPos(1) ^ rxByPos(3) ^ rxByPos(5) ^ rxByPos(7);
  const c2 = rxByPos(2) ^ rxByPos(3) ^ rxByPos(6) ^ rxByPos(7);
  const c4 = rxByPos(4) ^ rxByPos(5) ^ rxByPos(6) ^ rxByPos(7);
  const syndromeVal = c4 * 4 + c2 * 2 + c1;

  // 3. Combinational Lab (Full Adder & 4:1 MUX)
  const [faA, setFaA] = useState<0 | 1>(1);
  const [faB, setFaB] = useState<0 | 1>(1);
  const [faCin, setFaCin] = useState<0 | 1>(0);
  const faSum = (faA ^ faB ^ faCin) as 0 | 1;
  const faCout = ((faA & faB) | (faCin & (faA ^ faB))) as 0 | 1;

  const [muxSel, setMuxSel] = useState<[0 | 1, 0 | 1]>([1, 0]);
  const [muxInputs, setMuxInputs] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([0, 1, 1, 0]);
  const muxIdx = muxSel[0] * 2 + muxSel[1];
  const muxOut = muxInputs[muxIdx];

  // 4. Sequential Flip-Flop Lab
  const [ffType, setFfType] = useState<FFType>('JK');
  const [ffIn1, setFfIn1] = useState<0 | 1>(1); // S, J, D, T
  const [ffIn2, setFfIn2] = useState<0 | 1>(1); // R, K
  const [ffQ, setFfQ] = useState<0 | 1>(0);
  const [ffHistory, setFfHistory] = useState<{ q: 0 | 1; in1: 0 | 1; in2: 0 | 1; mode: string }[]>([
    { q: 0, in1: 0, in2: 0, mode: 'Initial' }
  ]);

  const triggerClockEdge = () => {
    let nextQ: 0 | 1 = ffQ;
    let mode = 'Hold';
    if (ffType === 'SR') {
      if (ffIn1 === 0 && ffIn2 === 0) { nextQ = ffQ; mode = 'Hold'; }
      else if (ffIn1 === 0 && ffIn2 === 1) { nextQ = 0; mode = 'Reset'; }
      else if (ffIn1 === 1 && ffIn2 === 0) { nextQ = 1; mode = 'Set'; }
      else { nextQ = 0; mode = 'Forbidden (S=R=1)'; }
    } else if (ffType === 'JK') {
      if (ffIn1 === 0 && ffIn2 === 0) { nextQ = ffQ; mode = 'Hold'; }
      else if (ffIn1 === 0 && ffIn2 === 1) { nextQ = 0; mode = 'Reset'; }
      else if (ffIn1 === 1 && ffIn2 === 0) { nextQ = 1; mode = 'Set'; }
      else { nextQ = ffQ ? 0 : 1; mode = 'Toggle'; }
    } else if (ffType === 'D') {
      nextQ = ffIn1;
      mode = ffIn1 ? 'Load 1' : 'Load 0';
    } else {
      nextQ = ffIn1 ? (ffQ ? 0 : 1) : ffQ;
      mode = ffIn1 ? 'Toggle' : 'Hold';
    }
    setFfQ(nextQ);
    setFfHistory((prev) => [...prev.slice(-7), { q: nextQ, in1: ffIn1, in2: ffIn2, mode }]);
  };

  // 5. Cache Mapping Simulator
  const [addrBits, setAddrBits] = useState<number>(32);
  const [cacheKB, setCacheKB] = useState<number>(64);
  const [blockBytes, setBlockBytes] = useState<number>(64);
  const [assoc, setAssoc] = useState<number>(1); // 1=Direct, 2,4,8, 0=Fully Assoc
  const [hexAddr, setHexAddr] = useState<string>('0x1A3F004C');

  const offsetBits = Math.round(Math.log2(blockBytes));
  const totalLines = (cacheKB * 1024) / blockBytes;
  const numSets = assoc === 0 ? 1 : Math.max(1, totalLines / assoc);
  const indexBits = assoc === 0 ? 0 : Math.round(Math.log2(numSets));
  const tagBits = Math.max(1, addrBits - indexBits - offsetBits);

  const cleanHex = hexAddr.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '') || '0';
  const addrNum = parseInt(cleanHex.slice(-8), 16) >>> 0;
  const binAddr = addrNum.toString(2).padStart(addrBits, '0').slice(-addrBits);
  const tagSlice = binAddr.slice(0, tagBits);
  const indexSlice = indexBits > 0 ? binAddr.slice(tagBits, tagBits + indexBits) : '';
  const offsetSlice = binAddr.slice(tagBits + indexBits);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Interactive Digital Electronics &amp; Organization Lab
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Hands-on circuit simulators, code converters, Hamming error correction, flip-flop timing, and cache address mapping aligned with U24EC304.
        </p>
      </div>

      {/* Simulator Selector */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B]">
        {(
          [
            { id: 'gates', label: 'Logic Gates' },
            { id: 'numbers-hamming', label: 'Numbers & Hamming Code' },
            { id: 'combinational', label: 'Adders & MUX' },
            { id: 'flipflops', label: 'Flip-Flop Timing' },
            { id: 'cache', label: 'Cache Mapping' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. LOGIC GATES SIMULATOR */}
      {activeTab === 'gates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGate(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    gate === g
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Interactive SVG Gate Stage */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setInA((p) => (p ? 0 : 1))}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-bold font-mono tabular-nums cursor-pointer ${
                      inA
                        ? 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Input A = {inA} ({inA ? 'HIGH' : 'LOW'})
                  </button>
                  {gate !== 'NOT' && (
                    <button
                      onClick={() => setInB((p) => (p ? 0 : 1))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-bold font-mono tabular-nums cursor-pointer ${
                        inB
                          ? 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Input B = {inB} ({inB ? 'HIGH' : 'LOW'})
                    </button>
                  )}
                </div>

                <svg viewBox="0 0 220 110" className="w-52 h-28 shrink-0">
                  <line x1="10" y1={gate === 'NOT' ? 55 : 35} x2="65" y2={gate === 'NOT' ? 55 : 35} stroke={inA ? '#0EA5E9' : '#64748B'} strokeWidth="4" />
                  {gate !== 'NOT' && (
                    <line x1="10" y1="75" x2="65" y2="75" stroke={inB ? '#0EA5E9' : '#64748B'} strokeWidth="4" />
                  )}
                  <rect x="65" y="18" width="85" height="74" rx="12" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                  <text x="107" y="60" textAnchor="middle" fontSize="15" fontWeight="800" fill="currentColor">{gate}</text>
                  <line x1="150" y1="55" x2="210" y2="55" stroke={gateOut ? '#10B981' : '#64748B'} strokeWidth="4" />
                </svg>

                <div
                  className={`px-5 py-4 rounded-xl border text-center font-mono tabular-nums ${
                    gateOut
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <p className="text-xs font-sans font-semibold">Output Y</p>
                  <p className="text-3xl font-bold mt-1">{gateOut}</p>
                  <p className="text-xs font-sans mt-0.5">{gateOut ? 'HIGH (1)' : 'LOW (0)'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{gate} Gate Truth Table</h2>
            <table className="w-full text-left border-collapse text-sm tabular-nums border border-slate-200 dark:border-slate-800">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-2.5">A</th>
                  {gate !== 'NOT' && <th className="px-4 py-2.5">B</th>}
                  <th className="px-4 py-2.5">Output Y</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(gate === 'NOT' ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]).map((row, idx) => {
                  const a = row[0] as 0 | 1;
                  const b = (row[1] ?? 0) as 0 | 1;
                  const y = evalGate(gate, a, b);
                  const active = gate === 'NOT' ? a === inA : a === inA && b === inB;
                  return (
                    <tr
                      key={idx}
                      onClick={() => {
                        setInA(a);
                        if (gate !== 'NOT') setInB(b);
                      }}
                      className={`cursor-pointer ${
                        active ? 'bg-sky-500/15 font-bold text-sky-700 dark:text-sky-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-4 py-2.5">{a}</td>
                      {gate !== 'NOT' && <td className="px-4 py-2.5">{b}</td>}
                      <td className="px-4 py-2.5">{y}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tip: Click any row in the truth table or toggle A/B switches directly.
            </p>
          </div>
        </div>
      )}

      {/* 2. NUMBER SYSTEMS, COMPLEMENTS & HAMMING CODE */}
      {activeTab === 'numbers-hamming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Base, Complement &amp; Code Converter (0–255)
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Enter Decimal Value (0–255)
              </label>
              <input
                type="number"
                min={0}
                max={255}
                value={decInput}
                onChange={(e) => setDecInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base font-mono font-bold tabular-nums"
              />
            </div>

            <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono tabular-nums">
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Binary (8-bit)</dt>
                <dd className="font-bold text-sky-600 dark:text-sky-400">{bin8}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Octal / Hex</dt>
                <dd className="font-bold">{clampedUnsigned.toString(8)}₈ · {clampedUnsigned.toString(16).toUpperCase()}₁₆</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">1’s Complement (8-bit)</dt>
                <dd className="font-bold">{onesComp8}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">2’s Complement (−N)</dt>
                <dd className="font-bold text-indigo-600 dark:text-indigo-400">{twosComp8}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Gray Code</dt>
                <dd className="font-bold text-cyan-600 dark:text-cyan-400">{grayStr}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">BCD (8421)</dt>
                <dd className="font-bold">{bcdStr}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Excess-3</dt>
                <dd className="font-bold">{xs3Str}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                (7,4) Even-Parity Hamming Simulator
              </h2>
              <button
                onClick={() => setFlippedBitPos(null)}
                className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Clear Error
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                1. Click 4 Data Bits (D₇ D₆ D₅ D₃) to Encode:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(['D₇', 'D₆', 'D₅', 'D₃'] as const).map((lbl, idx) => (
                  <button
                    key={lbl}
                    onClick={() =>
                      setHammingData((prev) => {
                        const copy = [...prev] as [0 | 1, 0 | 1, 0 | 1, 0 | 1];
                        copy[idx] = copy[idx] ? 0 : 1;
                        return copy;
                      })
                    }
                    className="py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 font-mono font-bold text-sm cursor-pointer"
                  >
                    {lbl} = {hammingData[idx]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                2. Click Any Transmitted Bit Below to Inject a Single-Bit Channel Error:
              </p>
              <div className="grid grid-cols-7 gap-1.5 text-center font-mono">
                {received7.map((b) => {
                  const isFlipped = flippedBitPos === b.pos;
                  return (
                    <button
                      key={b.pos}
                      onClick={() => setFlippedBitPos((p) => (p === b.pos ? null : b.pos))}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                        isFlipped
                          ? 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-300'
                          : b.label.startsWith('P')
                          ? 'border-cyan-500/40 bg-cyan-500/10'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="block text-[10px] text-slate-500">{b.label}</span>
                      <span className="block text-base font-bold">{b.rx}</span>
                      <span className="block text-[10px] text-slate-400">#{b.pos}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-1.5 text-sm font-mono">
              <p>
                Syndrome C₄C₂C₁ = <strong className="text-sky-600 dark:text-sky-400">{c4}{c2}{c1}</strong> (Decimal: {syndromeVal})
              </p>
              <p className="font-sans text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {syndromeVal === 0
                  ? 'No error detected — received word matches encoded codeword cleanly.'
                  : `Single-bit error pinpointed at Bit Position #${syndromeVal}! Flipping bit #${syndromeVal} restores original data ${d7}${d6}${d5}${d3}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. COMBINATIONAL CIRCUITS (FULL ADDER & 4:1 MUX) */}
      {activeTab === 'combinational' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Full Adder Interactive Circuit</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'A', val: faA, toggle: () => setFaA((p) => (p ? 0 : 1)) },
                { label: 'B', val: faB, toggle: () => setFaB((p) => (p ? 0 : 1)) },
                { label: 'C_in', val: faCin, toggle: () => setFaCin((p) => (p ? 0 : 1)) }
              ].map((inp) => (
                <button
                  key={inp.label}
                  onClick={inp.toggle}
                  className={`py-3 rounded-lg border font-mono font-bold text-sm cursor-pointer ${
                    inp.val
                      ? 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-300'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {inp.label} = {inp.val}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center font-mono">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-xs font-sans text-slate-500">Sum = A ⊕ B ⊕ C_in</p>
                <p className={`text-3xl font-bold mt-1 ${faSum ? 'text-emerald-500' : 'text-slate-400'}`}>{faSum}</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-xs font-sans text-slate-500">Carry = AB + C_in(A⊕B)</p>
                <p className={`text-3xl font-bold mt-1 ${faCout ? 'text-sky-500' : 'text-slate-400'}`}>{faCout}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center">
              Arithmetic check: {faA} + {faB} + {faCin} = ({faCout}{faSum})₂ = {faA + faB + faCin}₁₀
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">4-to-1 Multiplexer Router</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMuxSel(([s1, s0]) => [s1 ? 0 : 1, s0])}
                className="py-2.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono font-bold text-sm cursor-pointer"
              >
                Select S₁ = {muxSel[0]}
              </button>
              <button
                onClick={() => setMuxSel(([s1, s0]) => [s1, s0 ? 0 : 1])}
                className="py-2.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono font-bold text-sm cursor-pointer"
              >
                Select S₀ = {muxSel[1]}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {muxInputs.map((val, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setMuxInputs((prev) => {
                      const next = [...prev] as [0 | 1, 0 | 1, 0 | 1, 0 | 1];
                      next[i] = next[i] ? 0 : 1;
                      return next;
                    })
                  }
                  className={`py-2.5 rounded-lg border font-mono text-sm font-bold cursor-pointer ${
                    i === muxIdx
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  I{i} = {val}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-center font-mono">
              <p className="text-xs font-sans text-slate-600 dark:text-slate-300">
                Selected Channel: <strong>I{muxIdx}</strong> (S₁S₀ = {muxSel[0]}{muxSel[1]})
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 mt-1">
                Output Y = {muxOut}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEQUENTIAL FLIP-FLOPS & TIMING WAVEFORM */}
      {activeTab === 'flipflops' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {(['SR', 'JK', 'D', 'T'] as FFType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFfType(t);
                    setFfQ(0);
                    setFfHistory([{ q: 0, in1: 0, in2: 0, mode: 'Reset' }]);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    ffType === t
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t} Flip-Flop
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFfIn1((p) => (p ? 0 : 1))}
                className="flex-1 py-2.5 rounded-lg border border-sky-500/40 bg-sky-500/10 font-mono font-bold text-sm cursor-pointer"
              >
                {ffType === 'SR' ? 'S' : ffType === 'JK' ? 'J' : ffType} = {ffIn1}
              </button>
              {(ffType === 'SR' || ffType === 'JK') && (
                <button
                  onClick={() => setFfIn2((p) => (p ? 0 : 1))}
                  className="flex-1 py-2.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono font-bold text-sm cursor-pointer"
                >
                  {ffType === 'SR' ? 'R' : 'K'} = {ffIn2}
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={triggerClockEdge}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Trigger Clock Edge (↑)</span>
              </button>
              <button
                onClick={() => {
                  setFfQ(0);
                  setFfHistory([{ q: 0, in1: 0, in2: 0, mode: 'Cleared' }]);
                }}
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Reset Waveform"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center font-mono">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs font-sans text-slate-500">Present Q</p>
                <p className="text-2xl font-bold text-emerald-500">{ffQ}</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs font-sans text-slate-500">Complement Q'</p>
                <p className="text-2xl font-bold text-cyan-500">{ffQ ? 0 : 1}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Live Timing Waveform &amp; State History
            </h2>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] p-4 overflow-x-auto">
              <svg viewBox="0 0 540 130" className="w-full min-w-[440px]">
                <text x="10" y="34" fontSize="11" fontWeight="700" fill="#F59E0B">CLK ↑</text>
                <text x="10" y="92" fontSize="11" fontWeight="700" fill="#10B981">Output Q</text>
                {ffHistory.map((step, i) => {
                  const x = 75 + i * 56;
                  const yHigh = 72;
                  const yLow = 104;
                  const y = step.q ? yHigh : yLow;
                  const prevY = i > 0 ? (ffHistory[i - 1].q ? yHigh : yLow) : y;
                  return (
                    <g key={i}>
                      {/* Clock pulse */}
                      <polyline
                        points={`${x},42 ${x + 14},42 ${x + 14},18 ${x + 34},18 ${x + 34},42 ${x + 56},42`}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2"
                      />
                      {/* Vertical transition */}
                      {i > 0 && prevY !== y && (
                        <line x1={x} y1={prevY} x2={x} y2={y} stroke="#10B981" strokeWidth="2.4" />
                      )}
                      <line x1={x} y1={y} x2={x + 56} y2={y} stroke="#10B981" strokeWidth="2.4" />
                      <text x={x + 28} y="122" textAnchor="middle" fontSize="9" fill="#94A3B8">
                        {step.mode}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click "Trigger Clock Edge (↑)" repeatedly after changing inputs to observe Set, Reset, Hold, and Toggle transitions.
            </p>
          </div>
        </div>
      )}

      {/* 5. CACHE MAPPING ADDRESS SPLITTER */}
      {activeTab === 'cache' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Cache Memory Address Partitioning Simulator (Unit V)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Address Width (W)</label>
              <select
                value={addrBits}
                onChange={(e) => setAddrBits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                {[16, 20, 24, 32].map((w) => (
                  <option key={w} value={w}>{w} bits</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Cache Size</label>
              <select
                value={cacheKB}
                onChange={(e) => setCacheKB(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                {[4, 16, 32, 64, 128, 256].map((kb) => (
                  <option key={kb} value={kb}>{kb} KB</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Block Size</label>
              <select
                value={blockBytes}
                onChange={(e) => setBlockBytes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                {[16, 32, 64, 128].map((b) => (
                  <option key={b} value={b}>{b} Bytes</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Mapping Scheme</label>
              <select
                value={assoc}
                onChange={(e) => setAssoc(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              >
                <option value={1}>Direct Mapped (1-Way)</option>
                <option value={2}>2-Way Set Associative</option>
                <option value={4}>4-Way Set Associative</option>
                <option value={8}>8-Way Set Associative</option>
                <option value={0}>Fully Associative</option>
              </select>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hex Physical Address</label>
              <input
                type="text"
                value={hexAddr}
                onChange={(e) => setHexAddr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono tabular-nums">
            <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/5 p-4">
              <p className="text-xs font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                TAG ({tagBits} bits)
              </p>
              <p className="text-sm font-bold mt-1 break-all">{tagSlice}</p>
              <p className="text-xs text-slate-500 mt-1">Hex: 0x{parseInt(tagSlice || '0', 2).toString(16).toUpperCase()}</p>
            </div>

            <div className="rounded-lg border border-sky-500/40 bg-sky-500/5 p-4">
              <p className="text-xs font-sans font-semibold text-sky-600 dark:text-sky-400">
                {assoc === 0 ? 'SET INDEX (0 bits — Fully Assoc)' : `SET / LINE INDEX (${indexBits} bits)`}
              </p>
              <p className="text-sm font-bold mt-1 break-all">{indexSlice || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">
                {assoc === 0 ? 'Searches all lines via CAM' : `Set #${parseInt(indexSlice, 2)} of ${numSets}`}
              </p>
            </div>

            <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/5 p-4">
              <p className="text-xs font-sans font-semibold text-cyan-600 dark:text-cyan-400">
                BLOCK OFFSET ({offsetBits} bits)
              </p>
              <p className="text-sm font-bold mt-1 break-all">{offsetSlice}</p>
              <p className="text-xs text-slate-500 mt-1">Byte #{parseInt(offsetSlice || '0', 2)} within {blockBytes}B block</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
