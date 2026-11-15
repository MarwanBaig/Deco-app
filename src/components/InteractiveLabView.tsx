import { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, Play, RotateCcw, XCircle, Zap } from 'lucide-react';
import {
  checkBooleanEquivalence,
  generateTruthTable,
  getRepeatedDivisionSteps,
  parseRadixInput,
  solveKMap
} from '../utils/digitalLogic';

type LabTab =
  | 'gates'
  | 'boolean-practice'
  | 'kmap'
  | 'numbers-hamming'
  | 'combinational'
  | 'flipflops'
  | 'cache';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
type FFType = 'SR' | 'JK' | 'D' | 'T';
type SeqCircuitMode = 'ripple-up' | 'sync-up' | 'sipo-shift' | 'ring';

interface InteractiveLabViewProps {
  initialSimulator?: string;
}

const BOOLEAN_CHALLENGES = [
  {
    id: 'bp1',
    title: 'Redundancy & Absorption Law',
    given: "A + A'·B",
    hint: "Use 2nd Distributive Law: A + A'B = (A + A')(A + B) = 1·(A + B).",
    answer: 'A + B'
  },
  {
    id: 'bp2',
    title: 'Consensus Theorem Elimination',
    given: "A·B + A'·C + B·C",
    hint: "Notice B·C is the consensus term of A·B and A'·C and is redundant.",
    answer: "A·B + A'·C"
  },
  {
    id: 'bp3',
    title: "De Morgan's + Double Negation",
    given: "(A' + B)' + A·B",
    hint: "Apply De Morgan to (A' + B)' → A·B', then factor A(B' + B).",
    answer: 'A'
  },
  {
    id: 'bp4',
    title: 'Factoring & Complementarity',
    given: "A·B·C + A·B·C' + A·B'·C",
    hint: "Group first two terms: AB(C+C') = AB; combine with AB'C → A(B + B'C) = A(B + C).",
    answer: 'A·B + A·C'
  },
  {
    id: 'bp5',
    title: 'POS Simplification',
    given: "(A + B)·(A + B')",
    hint: "Use Distributive Law: A + B·B' = A + 0.",
    answer: 'A'
  },
  {
    id: 'bp6',
    title: 'XOR Identification',
    given: "(A + B)·(A' + B')",
    hint: "Expand product: A·A' + A·B' + B·A' + B·B' = A'B + AB'.",
    answer: 'A ^ B'
  }
];

function renderGateShapeSvg(gate: GateType, inA: 0 | 1, inB: 0 | 1, out: 0 | 1) {
  const strokeA = inA ? '#0EA5E9' : '#64748B';
  const strokeB = inB ? '#0EA5E9' : '#64748B';
  const strokeOut = out ? '#10B981' : '#64748B';
  const hasBubble = gate === 'NOT' || gate === 'NAND' || gate === 'NOR' || gate === 'XNOR';
  const isOrFamily = gate === 'OR' || gate === 'NOR' || gate === 'XOR' || gate === 'XNOR';
  const isXorFamily = gate === 'XOR' || gate === 'XNOR';

  return (
    <svg viewBox="0 0 240 110" className="w-56 h-28 shrink-0 text-slate-800 dark:text-slate-100">
      <line
        x1="10"
        y1={gate === 'NOT' ? 55 : 35}
        x2={isOrFamily ? 76 : 70}
        y2={gate === 'NOT' ? 55 : 35}
        stroke={strokeA}
        strokeWidth="3.5"
      />
      {gate !== 'NOT' && (
        <line
          x1="10"
          y1="75"
          x2={isOrFamily ? 76 : 70}
          y2="75"
          stroke={strokeB}
          strokeWidth="3.5"
        />
      )}

      {gate === 'NOT' && (
        <polygon points="70,22 70,88 142,55" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
      )}

      {(gate === 'AND' || gate === 'NAND') && (
        <path
          d="M70,20 L110,20 A35,35 0 0,1 110,90 L70,90 Z"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
      )}

      {isOrFamily && (
        <>
          {isXorFamily && (
            <path d="M58,20 Q74,55 58,90" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
          )}
          <path
            d="M68,20 Q84,55 68,90 Q122,90 150,55 Q122,20 68,20 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />
        </>
      )}

      {hasBubble && (
        <circle
          cx={gate === 'NOT' ? 149 : isOrFamily ? 157 : 152}
          cy="55"
          r="6"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2.5"
        />
      )}

      <line
        x1={hasBubble ? (isOrFamily ? 163 : 158) : isOrFamily ? 150 : 145}
        y1="55"
        x2="228"
        y2="55"
        stroke={strokeOut}
        strokeWidth="3.5"
      />
      <text x="104" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fill="#94A3B8">
        {gate}
      </text>
    </svg>
  );
}

export function InteractiveLabView({ initialSimulator }: InteractiveLabViewProps) {
  const [activeTab, setActiveTab] = useState<LabTab>(() => {
    const valid: LabTab[] = [
      'gates',
      'boolean-practice',
      'kmap',
      'numbers-hamming',
      'combinational',
      'flipflops',
      'cache'
    ];
    if (initialSimulator && valid.includes(initialSimulator as LabTab)) {
      return initialSimulator as LabTab;
    }
    return 'gates';
  });

  // 1. Logic Gates & Truth Table Generator
  const [gate, setGate] = useState<GateType>('NAND');
  const [inA, setInA] = useState<0 | 1>(1);
  const [inB, setInB] = useState<0 | 1>(0);
  const [ttExpr, setTtExpr] = useState<string>("(A·B) + (A'·C)");

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
  const truthTable = useMemo(() => generateTruthTable(ttExpr), [ttExpr]);

  // 2. Boolean Algebra Practice Tool
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [userBoolAns, setUserBoolAns] = useState('');
  const [showBoolHint, setShowBoolHint] = useState(false);
  const [boolCheckResult, setBoolCheckResult] = useState<ReturnType<typeof checkBooleanEquivalence> | null>(null);
  const activeChallenge = BOOLEAN_CHALLENGES[challengeIdx];

  // 3. K-Map Visualiser & Simplifier
  const [kVars, setKVars] = useState<2 | 3 | 4>(4);
  const [kMode, setKMode] = useState<'SOP' | 'POS'>('SOP');
  const [kCells, setKCells] = useState<Record<number, 0 | 1 | 'X'>>({
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    5: 1,
    7: 1,
    8: 'X',
    10: 'X',
    13: 1,
    15: 1
  });
  const kResult = useMemo(() => solveKMap(kVars, kCells, kMode), [kVars, kCells, kMode]);

  const cycleKCell = (idx: number) => {
    setKCells((prev) => {
      const cur = prev[idx] ?? 0;
      const next: 0 | 1 | 'X' = cur === 0 ? 1 : cur === 1 ? 'X' : 0;
      return { ...prev, [idx]: next };
    });
  };

  // 4. Multi-Radix Number Systems & Hamming Code
  const [inputBase, setInputBase] = useState<2 | 8 | 10 | 16>(10);
  const [radixInput, setRadixInput] = useState<string>('42');
  const [showSteps, setShowSteps] = useState<boolean>(true);
  const [hammingData, setHammingData] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([1, 0, 1, 1]);
  const [flippedBitPos, setFlippedBitPos] = useState<number | null>(null);

  const parsedRadix = parseRadixInput(radixInput, inputBase);
  const decValue = parsedRadix.value ?? 0;
  const bitWidth = decValue > 255 ? 16 : 8;
  const binPad = decValue.toString(2).padStart(bitWidth, '0');
  const onesComp = binPad.split('').map((b) => (b === '0' ? '1' : '0')).join('');
  const twosComp = ((~decValue + 1) & ((1 << bitWidth) - 1)).toString(2).padStart(bitWidth, '0');
  const grayStr = decValue
    .toString(2)
    .split('')
    .map((bit, i, arr) => (i === 0 ? bit : String(Number(arr[i - 1]) ^ Number(bit))))
    .join('');
  const bcdStr = String(decValue)
    .split('')
    .map((d) => Number(d).toString(2).padStart(4, '0'))
    .join(' ');
  const xs3Str = String(decValue)
    .split('')
    .map((d) => (Number(d) + 3).toString(2).padStart(4, '0'))
    .join(' ');

  const divStepsBin = useMemo(() => getRepeatedDivisionSteps(decValue, 2), [decValue]);
  const divStepsHex = useMemo(() => getRepeatedDivisionSteps(decValue, 16), [decValue]);

  // Hamming (7,4)
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
    rx: (flippedBitPos === b.pos ? b.val ^ 1 : b.val) as 0 | 1
  }));
  const rxByPos = (pos: number) => received7.find((x) => x.pos === pos)!.rx;
  const c1 = rxByPos(1) ^ rxByPos(3) ^ rxByPos(5) ^ rxByPos(7);
  const c2 = rxByPos(2) ^ rxByPos(3) ^ rxByPos(6) ^ rxByPos(7);
  const c4 = rxByPos(4) ^ rxByPos(5) ^ rxByPos(6) ^ rxByPos(7);
  const syndromeVal = c4 * 4 + c2 * 2 + c1;

  // 5. Combinational Lab (Full Adder, 4:1 MUX, 1:4 DEMUX, 3:8 Decoder, 4:2 Priority Encoder)
  const [faA, setFaA] = useState<0 | 1>(1);
  const [faB, setFaB] = useState<0 | 1>(1);
  const [faCin, setFaCin] = useState<0 | 1>(0);
  const faSum = (faA ^ faB ^ faCin) as 0 | 1;
  const faCout = ((faA & faB) | (faCin & (faA ^ faB))) as 0 | 1;

  const [muxSel, setMuxSel] = useState<[0 | 1, 0 | 1]>([1, 0]);
  const [muxInputs, setMuxInputs] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([0, 1, 1, 0]);
  const muxIdx = muxSel[0] * 2 + muxSel[1];
  const muxOut = muxInputs[muxIdx];

  const [demuxIn, setDemuxIn] = useState<0 | 1>(1);
  const [demuxSel, setDemuxSel] = useState<[0 | 1, 0 | 1]>([0, 1]);
  const demuxIdx = demuxSel[0] * 2 + demuxSel[1];

  const [decSel, setDecSel] = useState<[0 | 1, 0 | 1, 0 | 1]>([1, 0, 1]);
  const [decEn, setDecEn] = useState<0 | 1>(1);
  const decActiveIdx = decSel[0] * 4 + decSel[1] * 2 + decSel[2];

  const [encInputs, setEncInputs] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([0, 1, 1, 0]); // I0, I1, I2, I3 (I3 highest priority)
  const encValid = encInputs.some((v) => v === 1) ? 1 : 0;
  const encOutVal = encInputs[3] ? 3 : encInputs[2] ? 2 : encInputs[1] ? 1 : 0;

  // 6. Sequential Flip-Flops, Counters & Registers Timing Lab
  const [ffType, setFfType] = useState<FFType>('JK');
  const [ffIn1, setFfIn1] = useState<0 | 1>(1);
  const [ffIn2, setFfIn2] = useState<0 | 1>(1);
  const [ffQ, setFfQ] = useState<0 | 1>(0);
  const [ffHistory, setFfHistory] = useState<{ q: 0 | 1; in1: 0 | 1; in2: 0 | 1; mode: string }[]>([
    { q: 0, in1: 0, in2: 0, mode: 'Init' }
  ]);

  const [seqMode, setSeqMode] = useState<SeqCircuitMode>('ripple-up');
  const [serialIn, setSerialIn] = useState<0 | 1>(1);
  const [regBits, setRegBits] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([0, 0, 0, 1]); // [Q3, Q2, Q1, Q0] or [Q0..Q3]
  const [seqWave, setSeqWave] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1][]>([[0, 0, 0, 0]]);

  const triggerClockEdge = () => {
    let nextQ: 0 | 1 = ffQ;
    let mode = 'Hold';
    if (ffType === 'SR') {
      if (ffIn1 === 0 && ffIn2 === 0) { nextQ = ffQ; mode = 'Hold'; }
      else if (ffIn1 === 0 && ffIn2 === 1) { nextQ = 0; mode = 'Reset'; }
      else if (ffIn1 === 1 && ffIn2 === 0) { nextQ = 1; mode = 'Set'; }
      else { nextQ = 0; mode = 'Invalid'; }
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

  const stepSeqCircuit = () => {
    setRegBits((prev) => {
      let next: [0 | 1, 0 | 1, 0 | 1, 0 | 1] = [...prev];
      if (seqMode === 'ripple-up' || seqMode === 'sync-up') {
        const curVal = prev[0] * 8 + prev[1] * 4 + prev[2] * 2 + prev[3];
        const nextVal = (curVal + 1) % 16;
        next = [
          ((nextVal >> 3) & 1) as 0 | 1,
          ((nextVal >> 2) & 1) as 0 | 1,
          ((nextVal >> 1) & 1) as 0 | 1,
          (nextVal & 1) as 0 | 1
        ];
      } else if (seqMode === 'sipo-shift') {
        next = [serialIn, prev[0], prev[1], prev[2]];
      } else {
        // 4-bit Ring Counter rotates MSB/LSB
        next = [prev[3], prev[0], prev[1], prev[2]];
      }
      setSeqWave((w) => [...w.slice(-7), next]);
      return next;
    });
  };

  const resetSeqCircuit = (mode: SeqCircuitMode) => {
    setSeqMode(mode);
    const initial: [0 | 1, 0 | 1, 0 | 1, 0 | 1] = mode === 'ring' ? [1, 0, 0, 0] : [0, 0, 0, 0];
    setRegBits(initial);
    setSeqWave([initial]);
  };

  // 7. Cache Mapping Simulator
  const [addrBits, setAddrBits] = useState<number>(32);
  const [cacheKB, setCacheKB] = useState<number>(64);
  const [blockBytes, setBlockBytes] = useState<number>(64);
  const [assoc, setAssoc] = useState<number>(1);
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

  // K-Map Gray Code Grid Builders
  const kRows = kVars === 2 ? [0, 1] : kVars === 3 ? [0, 1] : [0, 1, 3, 2];
  const kCols = kVars === 2 ? [0, 1] : [0, 1, 3, 2];
  const kRowLabels = kVars === 2 ? ['0', '1'] : kVars === 3 ? ['0', '1'] : ['00', '01', '11', '10'];
  const kColLabels = kVars === 2 ? ['0', '1'] : ['00', '01', '11', '10'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Interactive Digital Electronics &amp; Organization Lab
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Real-time circuit simulators, Truth Table generator, Boolean Algebra practice, K-Map simplifier, Counters &amp; Timing visualizer, and Cache address mapper.
        </p>
      </div>

      {/* Lab Module Navigation */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B]">
        {(
          [
            { id: 'gates', label: 'Gates & Truth Tables' },
            { id: 'boolean-practice', label: 'Boolean Practice' },
            { id: 'kmap', label: 'K-Map Simplifier' },
            { id: 'numbers-hamming', label: 'Radix & Hamming' },
            { id: 'combinational', label: 'MUX / DEMUX / Decoders' },
            { id: 'flipflops', label: 'Flip-Flops & Counters' },
            { id: 'cache', label: 'Cache Mapping' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. LOGIC GATES + TRUTH TABLE GENERATOR */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Interactive Logic Gate Bench
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGate(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        gate === g
                          ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                          : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-[#0D1512] p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setInA((p) => (p ? 0 : 1))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-bold font-mono tabular-nums cursor-pointer ${
                        inA
                          ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9] dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
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
                            ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9] dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
                            : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Input B = {inB} ({inB ? 'HIGH' : 'LOW'})
                      </button>
                    )}
                  </div>

                  {renderGateShapeSvg(gate, inA, inB, gateOut)}

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

            <div className="lg:col-span-5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {gate} Truth Table
              </h2>
              <table className="w-full text-left border-collapse text-sm tabular-nums border border-[#DCE3DC] dark:border-[#253830]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-[#DCE3DC] dark:border-[#253830]">
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
                          active
                            ? 'bg-[#E8EFE9] dark:bg-[#1D3329] font-bold text-[#1B4332] dark:text-[#8CE0B0]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
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
            </div>
          </div>

          {/* Truth Table Generator for Arbitrary Boolean Expressions */}
          <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Boolean Expression Truth Table Generator
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supports variables A–D, AND (·, *, implicit AB), OR (+), XOR (^), and NOT (&apos; or ~).
                </p>
                <input
                  type="text"
                  value={ttExpr}
                  onChange={(e) => setTtExpr(e.target.value)}
                  placeholder="Example: (A·B) + (A'·C)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-[#52B788]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["(A·B) + (A'·C)", "(A + B)·(A' + C)", 'A ^ B ^ C', "A'B + AB' + C'D"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTtExpr(preset)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-mono hover:border-[#1B4332] dark:hover:border-[#52B788] cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {truthTable.error ? (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3.5 text-sm text-rose-600 dark:text-rose-300">
                {truthTable.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                  <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/60 p-3 space-y-1">
                    <p className="font-sans font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      Minterms Σm({truthTable.minterms.join(', ') || '∅'})
                    </p>
                    <p className="break-all text-slate-700 dark:text-slate-300">
                      SOP = {truthTable.canonicalSop}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/60 p-3 space-y-1">
                    <p className="font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                      Maxterms ΠM({truthTable.maxterms.join(', ') || '∅'})
                    </p>
                    <p className="break-all text-slate-700 dark:text-slate-300">
                      POS = {truthTable.canonicalPos}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#DCE3DC] dark:border-[#253830]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono tabular-nums">
                    <thead>
                      <tr className="border-b border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/50">
                        <th className="px-3 py-2 text-slate-500">m#</th>
                        {truthTable.variables.map((v) => (
                          <th key={v} className="px-3 py-2">{v}</th>
                        ))}
                        {truthTable.intermediateExprs.map((sub) => (
                          <th key={sub} className="px-3 py-2 text-slate-500">{sub}</th>
                        ))}
                        <th className="px-3 py-2 text-[#0F766E] dark:text-[#2DD4BF] font-bold">Output F</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {truthTable.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={row.output ? 'bg-emerald-500/5' : ''}
                        >
                          <td className="px-3 py-1.5 text-slate-400">m{rIdx}</td>
                          {truthTable.variables.map((v) => (
                            <td key={v} className="px-3 py-1.5">{row.inputs[v]}</td>
                          ))}
                          {truthTable.intermediateExprs.map((sub) => (
                            <td key={sub} className="px-3 py-1.5 text-slate-500">
                              {row.intermediate[sub] ?? 0}
                            </td>
                          ))}
                          <td
                            className={`px-3 py-1.5 font-bold ${
                              row.output ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {row.output}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. BOOLEAN ALGEBRA PRACTICE TOOL */}
      {activeTab === 'boolean-practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 px-2">
              Simplification Drills
            </h2>
            <div className="space-y-1">
              {BOOLEAN_CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setChallengeIdx(idx);
                    setUserBoolAns('');
                    setShowBoolHint(false);
                    setBoolCheckResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                    idx === challengeIdx
                      ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-semibold opacity-80">Drill #{idx + 1}</p>
                  <p className="text-sm font-bold">{ch.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                Boolean Algebra Drill #{challengeIdx + 1}
              </p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                Simplify the Expression Using Boolean Laws
              </h2>
            </div>

            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/60 p-5 text-center font-mono">
              <p className="text-xs font-sans text-slate-500 mb-1">Given Expression</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                F = {activeChallenge.given}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Enter Your Simplified Expression (use A, B, C, +, · or *, &apos;, ^)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={userBoolAns}
                  onChange={(e) => setUserBoolAns(e.target.value)}
                  placeholder="Type simplified expression..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-[#52B788]"
                />
                <button
                  onClick={() =>
                    setBoolCheckResult(checkBooleanEquivalence(activeChallenge.given, userBoolAns))
                  }
                  disabled={!userBoolAns.trim()}
                  className="px-5 py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] disabled:opacity-40 text-white text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
                >
                  Verify Equivalence
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowBoolHint((p) => !p)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showBoolHint ? 'Hide Law Hint' : 'Show Boolean Law Hint'}</span>
              </button>
              <button
                onClick={() => {
                  setUserBoolAns(activeChallenge.answer);
                  setBoolCheckResult(checkBooleanEquivalence(activeChallenge.given, activeChallenge.answer));
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Reveal Minimal Form
              </button>
            </div>

            {showBoolHint && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold text-amber-700 dark:text-amber-300">Law Hint: </span>
                {activeChallenge.hint}
              </div>
            )}

            {boolCheckResult && (
              <div
                className={`rounded-lg border p-4 space-y-1.5 text-sm ${
                  boolCheckResult.error
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : boolCheckResult.equivalent
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                }`}
              >
                {boolCheckResult.error ? (
                  <p>{boolCheckResult.error}</p>
                ) : boolCheckResult.equivalent ? (
                  <>
                    <p className="font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Logically Equivalent! Literals reduced from {boolCheckResult.literalCountA} to{' '}
                        {boolCheckResult.literalCountB}.
                      </span>
                    </p>
                    <p className="text-xs opacity-90">
                      Reference minimal expression: <code className="font-mono font-bold">{activeChallenge.answer}</code>
                    </p>
                  </>
                ) : (
                  <p className="font-semibold flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Not equivalent — {boolCheckResult.mismatchRow}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. KARNAUGH MAP VISUALISER & QUINE-MCCLUSKEY SIMPLIFIER */}
      {activeTab === 'kmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Interactive {kVars}-Variable Karnaugh Map
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any cell to toggle 0 → 1 → X (Don&apos;t Care). Uses Gray code 00, 01, 11, 10.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                  {([2, 3, 4] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setKVars(n);
                        setKCells({});
                      }}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        kVars === n
                          ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {n}-Var
                    </button>
                  ))}
                </div>

                <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                  {(['SOP', 'POS'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setKMode(m)}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        kMode === m
                          ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setKCells({})}
                  className="px-2.5 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="mx-auto border-collapse font-mono text-sm tabular-nums">
                <thead>
                  <tr>
                    <th className="p-2 text-xs text-slate-500 border border-[#DCE3DC] dark:border-[#253830]">
                      {kVars === 2 ? 'A \\ B' : kVars === 3 ? 'A \\ BC' : 'AB \\ CD'}
                    </th>
                    {kColLabels.map((lbl) => (
                      <th
                        key={lbl}
                        className="p-2 text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] border border-[#DCE3DC] dark:border-[#253830] min-w-[68px]"
                      >
                        {lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kRows.map((rVal, rIdx) => (
                    <tr key={rVal}>
                      <th className="p-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-[#DCE3DC] dark:border-[#253830]">
                        {kRowLabels[rIdx]}
                      </th>
                      {kCols.map((cVal) => {
                        const cellIdx = kVars === 2 ? (rVal << 1) | cVal : (rVal << 2) | cVal;
                        const val = kCells[cellIdx] ?? 0;
                        const matchingGroups = kResult.groups.filter((g) => g.covered.includes(cellIdx));
                        const ringColor = matchingGroups[0]?.color;

                        return (
                          <td
                            key={cellIdx}
                            className="p-1 border border-[#DCE3DC] dark:border-[#253830]"
                          >
                            <button
                              onClick={() => cycleKCell(cellIdx)}
                              style={
                                ringColor
                                  ? {
                                      boxShadow: `inset 0 0 0 2.5px ${ringColor}`,
                                      backgroundColor: `${ringColor}18`
                                    }
                                  : undefined
                              }
                              className="w-16 h-14 rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            >
                              <span
                                className={`text-base font-bold ${
                                  val === 1
                                    ? 'text-[#1B4332] dark:text-[#8CE0B0]'
                                    : val === 'X'
                                    ? 'text-amber-500'
                                    : 'text-slate-400'
                                }`}
                              >
                                {val}
                              </span>
                              <span className="text-[10px] text-slate-400">m{cellIdx}</span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                Minimized {kMode} Expression
              </p>
              <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300 break-all">
                F = {kResult.expression}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Prime Implicant Groupings
              </h3>
              {kResult.groups.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Toggle 1s (for SOP) or 0s (for POS) on the K-Map grid to form groups.
                </p>
              ) : (
                <div className="space-y-2">
                  {kResult.groups.map((g, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{g.term}</span>
                      </div>
                      <span className="text-xs font-sans text-slate-500">
                        {g.isEssential ? 'Essential PI' : 'PI'} · cells [{g.covered.join(', ')}]
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Quine–McCluskey Reduction Log
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {kResult.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. MULTI-RADIX NUMBER CONVERTER & HAMMING CODE */}
      {activeTab === 'numbers-hamming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Multi-Radix Converter &amp; Steps
              </h2>
              <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                {(
                  [
                    { b: 2, label: 'Bin' },
                    { b: 8, label: 'Oct' },
                    { b: 10, label: 'Dec' },
                    { b: 16, label: 'Hex' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.b}
                    onClick={() => {
                      setInputBase(item.b);
                      setRadixInput(decValue.toString(item.b).toUpperCase());
                    }}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      inputBase === item.b
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Enter Base-{inputBase} Integer (up to 16-bit)
              </label>
              <input
                type="text"
                value={radixInput}
                onChange={(e) => setRadixInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 text-base font-mono font-bold tabular-nums"
              />
              {parsedRadix.error && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{parsedRadix.error}</p>
              )}
            </div>

            <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-[#DCE3DC] dark:border-[#253830] rounded-lg text-sm font-mono tabular-nums">
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Decimal / Octal / Hex</dt>
                <dd className="font-bold">
                  {decValue}₁₀ · {decValue.toString(8)}₈ · {decValue.toString(16).toUpperCase()}₁₆
                </dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">Binary ({bitWidth}-bit)</dt>
                <dd className="font-bold text-[#0F766E] dark:text-[#2DD4BF] break-all">{binPad}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">1&apos;s Complement</dt>
                <dd className="font-bold break-all">{onesComp}</dd>
              </div>
              <div className="p-3 flex justify-between gap-2">
                <dt className="font-sans text-slate-500">2&apos;s Complement (−N)</dt>
                <dd className="font-bold text-indigo-600 dark:text-indigo-400 break-all">{twosComp}</dd>
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

            <div className="space-y-2">
              <button
                onClick={() => setShowSteps((p) => !p)}
                className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                {showSteps ? 'Hide Intermediate Division Steps' : 'Show Intermediate Division Steps'}
              </button>
              {showSteps && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono tabular-nums">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#DCE3DC] dark:border-[#253830] p-3 space-y-1">
                    <p className="font-sans font-semibold text-slate-500 mb-1">
                      Repeated ÷ 2 (Read ↑ for Binary)
                    </p>
                    {divStepsBin.slice(0, 8).map((st, idx) => (
                      <p key={idx}>
                        {st.dividend} ÷ 2 = {st.quotient}, R = <strong>{st.remainder}</strong>
                      </p>
                    ))}
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#DCE3DC] dark:border-[#253830] p-3 space-y-1">
                    <p className="font-sans font-semibold text-slate-500 mb-1">
                      Repeated ÷ 16 (Read ↑ for Hex)
                    </p>
                    {divStepsHex.slice(0, 8).map((st, idx) => (
                      <p key={idx}>
                        {st.dividend} ÷ 16 = {st.quotient}, R = <strong>{st.remainder}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                (7,4) Even-Parity Hamming Simulator
              </h2>
              <button
                onClick={() => setFlippedBitPos(null)}
                className="text-xs font-medium text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
              >
                Clear Error
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                1. Toggle 4 Data Bits (D₇ D₆ D₅ D₃):
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
                    className="py-2 rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/75 dark:bg-[#1D3329] font-mono font-bold text-sm cursor-pointer"
                  >
                    {lbl} = {hammingData[idx]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                2. Click Any Bit Below to Inject a Channel Bit-Flip:
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
                          : 'border-[#DCE3DC] dark:border-[#253830]'
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

            <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/60 p-4 space-y-1.5 text-sm font-mono">
              <p>
                Syndrome C₄C₂C₁ = <strong className="text-[#0F766E] dark:text-[#2DD4BF]">{c4}{c2}{c1}</strong> (Bit #{syndromeVal})
              </p>
              <p className="font-sans text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {syndromeVal === 0
                  ? 'No error detected — received word matches encoded codeword cleanly.'
                  : `Single-bit error pinpointed at Bit Position #${syndromeVal}. Inverting bit #${syndromeVal} restores data ${d7}${d6}${d5}${d3}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. COMBINATIONAL CIRCUITS (ADDER, 4:1 MUX, 1:4 DEMUX, 3:8 DECODER, 4:2 PRIORITY ENCODER) */}
      {activeTab === 'combinational' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Full Adder */}
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Full Adder Interactive Circuit
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'A', val: faA, toggle: () => setFaA((p) => (p ? 0 : 1)) },
                  { label: 'B', val: faB, toggle: () => setFaB((p) => (p ? 0 : 1)) },
                  { label: 'C_in', val: faCin, toggle: () => setFaCin((p) => (p ? 0 : 1)) }
                ].map((inp) => (
                  <button
                    key={inp.label}
                    onClick={inp.toggle}
                    className={`py-2.5 rounded-lg border font-mono font-bold text-sm cursor-pointer ${
                      inp.val
                        ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9] dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {inp.label} = {inp.val}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center font-mono">
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3.5">
                  <p className="text-xs font-sans text-slate-500">Sum = A ⊕ B ⊕ C_in</p>
                  <p className={`text-3xl font-bold mt-1 ${faSum ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {faSum}
                  </p>
                </div>
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3.5">
                  <p className="text-xs font-sans text-slate-500">Carry = AB + C_in(A⊕B)</p>
                  <p className={`text-3xl font-bold mt-1 ${faCout ? 'text-[#0F766E] dark:text-[#2DD4BF]' : 'text-slate-400'}`}>
                    {faCout}
                  </p>
                </div>
              </div>
            </div>

            {/* 4:1 MUX + 1:4 DEMUX Paired */}
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                4:1 Multiplexer &amp; 1:4 Demultiplexer
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMuxSel(([s1, s0]) => [s1 ? 0 : 1, s0]);
                    setDemuxSel(([s1, s0]) => [s1 ? 0 : 1, s0]);
                  }}
                  className="py-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono font-bold text-xs sm:text-sm cursor-pointer"
                >
                  Select S₁ = {muxSel[0]}
                </button>
                <button
                  onClick={() => {
                    setMuxSel(([s1, s0]) => [s1, s0 ? 0 : 1]);
                    setDemuxSel(([s1, s0]) => [s1, s0 ? 0 : 1]);
                  }}
                  className="py-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono font-bold text-xs sm:text-sm cursor-pointer"
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
                    className={`py-2 rounded-lg border font-mono text-xs font-bold cursor-pointer ${
                      i === muxIdx
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                        : 'border-[#DCE3DC] dark:border-[#253830]'
                    }`}
                  >
                    I{i}={val}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/50 p-3 font-mono text-xs">
                <span>MUX Out Y = <strong>{muxOut}</strong> (from I{muxIdx})</span>
                <button
                  onClick={() => setDemuxIn((p) => (p ? 0 : 1))}
                  className="px-2.5 py-1 rounded border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/75 dark:bg-[#1D3329] font-bold cursor-pointer"
                >
                  DEMUX D = {demuxIn}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                {[0, 1, 2, 3].map((i) => {
                  const active = i === demuxIdx && demuxIn === 1;
                  return (
                    <div
                      key={i}
                      className={`py-2 rounded-lg border ${
                        active
                          ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-bold'
                          : 'border-[#DCE3DC] dark:border-[#253830] text-slate-400'
                      }`}
                    >
                      Y{i} = {i === demuxIdx ? demuxIn : 0}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3:8 Binary Decoder */}
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  3-to-8 Binary Decoder (Minterm Generator)
                </h2>
                <button
                  onClick={() => setDecEn((p) => (p ? 0 : 1))}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer ${
                    decEn ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500' : 'border-rose-500/40 text-rose-500'
                  }`}
                >
                  EN = {decEn}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['A (MSB)', 'B', 'C (LSB)'] as const).map((lbl, idx) => (
                  <button
                    key={lbl}
                    onClick={() =>
                      setDecSel((prev) => {
                        const copy = [...prev] as [0 | 1, 0 | 1, 0 | 1];
                        copy[idx] = copy[idx] ? 0 : 1;
                        return copy;
                      })
                    }
                    className="py-2 rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/75 dark:bg-[#1D3329] font-mono text-xs font-bold cursor-pointer"
                  >
                    {lbl} = {decSel[idx]}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono text-xs">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const active = decEn === 1 && i === decActiveIdx;
                  return (
                    <div
                      key={i}
                      className={`py-2.5 rounded-lg border ${
                        active
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold'
                          : 'border-[#DCE3DC] dark:border-[#253830] text-slate-400'
                      }`}
                    >
                      <span className="block">D{i}</span>
                      <span className="text-sm">{active ? 1 : 0}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4:2 Priority Encoder */}
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                4-to-2 Priority Encoder (D₃ Highest Priority)
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {encInputs.map((val, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setEncInputs((prev) => {
                        const next = [...prev] as [0 | 1, 0 | 1, 0 | 1, 0 | 1];
                        next[i] = next[i] ? 0 : 1;
                        return next;
                      })
                    }
                    className={`py-2.5 rounded-lg border font-mono text-xs font-bold cursor-pointer ${
                      val
                        ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9] dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
                        : 'border-[#DCE3DC] dark:border-[#253830] text-slate-500'
                    }`}
                  >
                    D{i} = {val}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3">
                  <p className="text-xs font-sans text-slate-500">Output A₁</p>
                  <p className="text-xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">{encValid ? (encOutVal >> 1) & 1 : 'X'}</p>
                </div>
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3">
                  <p className="text-xs font-sans text-slate-500">Output A₀</p>
                  <p className="text-xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">{encValid ? encOutVal & 1 : 'X'}</p>
                </div>
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3">
                  <p className="text-xs font-sans text-slate-500">Valid (V)</p>
                  <p className={`text-xl font-bold ${encValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {encValid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SEQUENTIAL FLIP-FLOPS, COUNTERS, SHIFT REGISTERS & TIMING VISUALIZER */}
      {activeTab === 'flipflops' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
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
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                        : 'border-[#DCE3DC] dark:border-[#253830]'
                    }`}
                  >
                    {t} Flip-Flop
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setFfIn1((p) => (p ? 0 : 1))}
                  className="flex-1 py-2.5 rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/75 dark:bg-[#1D3329] font-mono font-bold text-sm cursor-pointer"
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
                    setFfHistory([{ q: 0, in1: 0, in2: 0, mode: 'Clear' }]);
                  }}
                  className="px-3 py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Reset Waveform"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3">
                  <p className="text-xs font-sans text-slate-500">Present Q</p>
                  <p className="text-2xl font-bold text-emerald-500">{ffQ}</p>
                </div>
                <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3">
                  <p className="text-xs font-sans text-slate-500">Complement Q&apos;</p>
                  <p className="text-2xl font-bold text-cyan-500">{ffQ ? 0 : 1}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Single Flip-Flop Timing Diagram
              </h2>
              <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-[#0D1512] p-4 overflow-x-auto">
                <svg viewBox="0 0 540 130" className="w-full min-w-[440px]">
                  <text x="10" y="34" fontSize="11" fontWeight="700" fill="#F59E0B">CLK ↑</text>
                  <text x="10" y="92" fontSize="11" fontWeight="700" fill="#10B981">Output Q</text>
                  {ffHistory.map((step, i) => {
                    const x = 75 + i * 56;
                    const y = step.q ? 72 : 104;
                    const prevY = i > 0 ? (ffHistory[i - 1].q ? 72 : 104) : y;
                    return (
                      <g key={i}>
                        <polyline
                          points={`${x},42 ${x + 14},42 ${x + 14},18 ${x + 34},18 ${x + 34},42 ${x + 56},42`}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2"
                        />
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
            </div>
          </div>

          {/* 4-Bit Counters & Shift Register Multi-Channel Timing Diagram */}
          <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Counters &amp; Shift Registers — Multi-Bit Timing Visualizer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step clock pulses to visualize binary division (Q₃ Q₂ Q₁ Q₀), serial bit shifting, or ring rotation.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'ripple-up', label: '4-Bit Ripple Counter' },
                    { id: 'sync-up', label: '4-Bit Sync Counter' },
                    { id: 'sipo-shift', label: 'SIPO Shift Register' },
                    { id: 'ring', label: '4-Bit Ring Counter' }
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => resetSeqCircuit(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      seqMode === m.id
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                        : 'border-[#DCE3DC] dark:border-[#253830]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {seqMode === 'sipo-shift' && (
                <button
                  onClick={() => setSerialIn((p) => (p ? 0 : 1))}
                  className="px-4 py-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 font-mono text-xs sm:text-sm font-bold cursor-pointer"
                >
                  Serial Input D_in = {serialIn}
                </button>
              )}
              <button
                onClick={stepSeqCircuit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Pulse Clock (↑)</span>
              </button>
              <button
                onClick={() => resetSeqCircuit(seqMode)}
                className="px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium cursor-pointer"
              >
                Reset
              </button>
              <span className="ml-auto font-mono text-sm font-bold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
                State: {regBits.join('')}₂ ({regBits[0] * 8 + regBits[1] * 4 + regBits[2] * 2 + regBits[3]}₁₀)
              </span>
            </div>

            {/* Live Multi-Channel SVG Waveform */}
            <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-[#0D1512] p-4 overflow-x-auto">
              <svg viewBox="0 0 560 175" className="w-full min-w-[460px]">
                {['CLK', 'Q₃ (MSB)', 'Q₂', 'Q₁', 'Q₀ (LSB)'].map((lbl, rowIdx) => {
                  const baseY = 26 + rowIdx * 32;
                  const colors = ['#F59E0B', '#A855F7', '#38BDF8', '#22D3EE', '#10B981'];
                  return (
                    <g key={lbl}>
                      <text x="6" y={baseY + 4} fontSize="10" fontWeight="700" fill={colors[rowIdx]}>
                        {lbl}
                      </text>
                      {seqWave.map((bits, stepIdx) => {
                        const x = 78 + stepIdx * 56;
                        if (rowIdx === 0) {
                          return (
                            <polyline
                              key={stepIdx}
                              points={`${x},${baseY + 9} ${x + 14},${baseY + 9} ${x + 14},${baseY - 9} ${x + 34},${baseY - 9} ${x + 34},${baseY + 9} ${x + 56},${baseY + 9}`}
                              fill="none"
                              stroke={colors[0]}
                              strokeWidth="1.8"
                            />
                          );
                        }
                        const val = bits[rowIdx - 1];
                        const y = val ? baseY - 9 : baseY + 9;
                        const prevY =
                          stepIdx > 0 ? (seqWave[stepIdx - 1][rowIdx - 1] ? baseY - 9 : baseY + 9) : y;
                        return (
                          <g key={stepIdx}>
                            {stepIdx > 0 && prevY !== y && (
                              <line x1={x} y1={prevY} x2={x} y2={y} stroke={colors[rowIdx]} strokeWidth="2" />
                            )}
                            <line x1={x} y1={y} x2={x + 56} y2={y} stroke={colors[rowIdx]} strokeWidth="2" />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 7. CACHE MAPPING ADDRESS SPLITTER */}
      {activeTab === 'cache' && (
        <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Cache Memory Address Partitioning Simulator (Unit V)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Address Width (W)</label>
              <select
                value={addrBits}
                onChange={(e) => setAddrBits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900"
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
                className="w-full px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900"
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
                className="w-full px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900"
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
                className="w-full px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900"
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
                className="w-full px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono tabular-nums">
            <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/5 p-4">
              <p className="text-xs font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                TAG ({tagBits} bits)
              </p>
              <p className="text-sm font-bold mt-1 break-all">{tagSlice}</p>
              <p className="text-xs text-slate-500 mt-1">
                Hex: 0x{parseInt(tagSlice || '0', 2).toString(16).toUpperCase()}
              </p>
            </div>

            <div className="rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/45 dark:bg-[#182822] p-4">
              <p className="text-xs font-sans font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
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
              <p className="text-xs text-slate-500 mt-1">
                Byte #{parseInt(offsetSlice || '0', 2)} within {blockBytes}B block
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
