import { DiagramType } from '../types/academic';

interface TopicDiagramProps {
  type: DiagramType;
  caption: string;
}

export function TopicDiagram({ type, caption }: TopicDiagramProps) {
  return (
    <figure className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F172A] p-4 sm:p-5">
      <div className="overflow-x-auto">{renderSvg(type)}</div>
      <figcaption className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Figure: </span>
        {caption}
      </figcaption>
    </figure>
  );
}

function renderSvg(type: DiagramType) {
  const stroke = 'currentColor';

  switch (type) {
    case 'number-systems-radix':
      return (
        <svg viewBox="0 0 680 190" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Positional weights and base conversions">
          <rect x="20" y="20" width="140" height="58" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="90" y="45" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Decimal (Base 10)</text>
          <text x="90" y="64" textAnchor="middle" fontSize="11" fill="#94A3B8">Digits 0–9</text>

          <rect x="270" y="20" width="140" height="58" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="340" y="45" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Binary (Base 2)</text>
          <text x="340" y="64" textAnchor="middle" fontSize="11" fill="#94A3B8">Bits 0, 1 (r = 2)</text>

          <rect x="520" y="20" width="140" height="58" rx="8" fill="none" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="590" y="45" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">Hex (Base 16)</text>
          <text x="590" y="64" textAnchor="middle" fontSize="11" fill="#94A3B8">0–9, A–F (4-bit)</text>

          <line x1="160" y1="42" x2="266" y2="42" stroke="#38BDF8" strokeWidth="1.6" />
          <polygon points="266,42 258,38 258,46" fill="#38BDF8" />
          <text x="213" y="34" textAnchor="middle" fontSize="10" fill="#38BDF8">÷2 (Int) / ×2 (Frac)</text>

          <line x1="270" y1="58" x2="164" y2="58" stroke="#94A3B8" strokeWidth="1.4" />
          <polygon points="164,58 172,54 172,62" fill="#94A3B8" />
          <text x="217" y="73" textAnchor="middle" fontSize="10" fill="#94A3B8">Σ bᵢ · 2ⁱ</text>

          <line x1="410" y1="49" x2="516" y2="49" stroke="#22D3EE" strokeWidth="1.6" />
          <polygon points="516,49 508,45 508,53" fill="#22D3EE" />
          <text x="463" y="40" textAnchor="middle" fontSize="10" fill="#22D3EE">4-bit groups</text>

          {/* Positional Weight Strip */}
          <text x="20" y="114" fontSize="12" fontWeight="600" fill="currentColor">Binary Positional Weights (1011.01)₂:</text>
          {[
            { bit: '1', wt: '2³ = 8' },
            { bit: '0', wt: '2² = 4' },
            { bit: '1', wt: '2¹ = 2' },
            { bit: '1', wt: '2⁰ = 1' },
            { bit: '.', wt: 'Point' },
            { bit: '0', wt: '2⁻¹ = 0.5' },
            { bit: '1', wt: '2⁻² = 0.25' }
          ].map((item, idx) => (
            <g key={idx} transform={`translate(${20 + idx * 90}, 125)`}>
              <rect x="0" y="0" width="80" height="48" rx="6" fill="none" stroke={item.bit === '.' ? '#64748B' : '#38BDF8'} strokeWidth="1.2" />
              <text x="40" y="21" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">{item.bit}</text>
              <text x="40" y="39" textAnchor="middle" fontSize="10" fill="#94A3B8">{item.wt}</text>
            </g>
          ))}
        </svg>
      );

    case 'complements-arithmetic':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="2s complement adder-subtractor flow">
          <rect x="30" y="25" width="130" height="45" rx="6" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
          <text x="95" y="52" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">Minuend M</text>

          <rect x="30" y="100" width="130" height="45" rx="6" fill="none" stroke="#818CF8" strokeWidth="1.6" />
          <text x="95" y="127" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">Subtrahend N</text>

          <rect x="200" y="100" width="130" height="45" rx="6" fill="none" stroke="#22D3EE" strokeWidth="1.6" />
          <text x="265" y="122" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">1’s Comp + 1</text>
          <text x="265" y="137" textAnchor="middle" fontSize="10" fill="#94A3B8">(2’s Comp of N)</text>

          <rect x="375" y="58" width="110" height="60" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="430" y="84" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">n-Bit Adder</text>
          <text x="430" y="101" textAnchor="middle" fontSize="10" fill="#94A3B8">M + (2ⁿ − N)</text>

          <line x1="160" y1="47" x2="375" y2="75" stroke={stroke} strokeWidth="1.4" />
          <line x1="160" y1="122" x2="200" y2="122" stroke={stroke} strokeWidth="1.4" />
          <line x1="330" y1="122" x2="375" y2="100" stroke={stroke} strokeWidth="1.4" />

          <rect x="520" y="25" width="140" height="52" rx="6" fill="none" stroke="#10B981" strokeWidth="1.5" />
          <text x="590" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill="#10B981">Carry = 1 (M ≥ N)</text>
          <text x="590" y="63" textAnchor="middle" fontSize="10" fill="currentColor">Discard carry → +Sum</text>

          <rect x="520" y="98" width="140" height="58" rx="6" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="590" y="119" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F59E0B">Carry = 0 (M &lt; N)</text>
          <text x="590" y="136" textAnchor="middle" fontSize="10" fill="currentColor">Take 2’s Comp(Sum)</text>
          <text x="590" y="149" textAnchor="middle" fontSize="10" fill="currentColor">&amp; attach minus (−)</text>

          <line x1="485" y1="75" x2="520" y2="52" stroke="#10B981" strokeWidth="1.4" />
          <line x1="485" y1="100" x2="520" y2="122" stroke="#F59E0B" strokeWidth="1.4" />
        </svg>
      );

    case 'codes-bcd-gray':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Binary to Gray XOR Converter">
          <text x="30" y="26" fontSize="12" fontWeight="700" fill="#38BDF8">Binary-to-Gray Code Hardware Converter (G₃G₂G₁G₀)</text>
          {[0, 1, 2, 3].map((i) => {
            const y = 45 + i * 34;
            return (
              <g key={i}>
                <text x="35" y={y + 4} fontSize="12" fontWeight="600" fill="currentColor">B{3 - i}</text>
                <line x1="60" y1={y} x2={i === 0 ? 520 : 240} y2={y} stroke={stroke} strokeWidth="1.5" />
                {i > 0 && (
                  <>
                    <line x1="150" y1={y - 34} x2="150" y2={y - 8} stroke="#818CF8" strokeWidth="1.4" />
                    <line x1="150" y1={y - 8} x2="240" y2={y - 8} stroke="#818CF8" strokeWidth="1.4" />
                    <path d={`M 235 ${y - 16} Q 245 ${y - 4} 235 ${y + 8}`} fill="none" stroke="#38BDF8" strokeWidth="1.8" />
                    <path d={`M 242 ${y - 16} Q 252 ${y - 4} 242 ${y + 8} Q 275 ${y - 4} 290 ${y - 4} Q 275 ${y - 4} 242 ${y - 16}`} fill="none" stroke="#38BDF8" strokeWidth="1.8" />
                    <line x1="290" y1={y - 4} x2="520" y2={y - 4} stroke="#38BDF8" strokeWidth="1.5" />
                  </>
                )}
                <text x="535" y={i === 0 ? y + 4 : y} fontSize="12" fontWeight="700" fill="#22D3EE">
                  G{3 - i} {i === 0 ? '= B₃' : `= B${4 - i} ⊕ B${3 - i}`}
                </text>
              </g>
            );
          })}
        </svg>
      );

    case 'hamming-parity':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="7-bit Hamming Code structure">
          <text x="20" y="26" fontSize="12" fontWeight="700" fill="#38BDF8">Hamming (7, 4) Codeword Bit Positions (Bit 7 → Bit 1)</text>
          {[
            { pos: 7, lbl: 'D₇', isP: false },
            { pos: 6, lbl: 'D₆', isP: false },
            { pos: 5, lbl: 'D₅', isP: false },
            { pos: 4, lbl: 'P₄', isP: true },
            { pos: 3, lbl: 'D₃', isP: false },
            { pos: 2, lbl: 'P₂', isP: true },
            { pos: 1, lbl: 'P₁', isP: true }
          ].map((b, idx) => (
            <g key={b.pos} transform={`translate(${25 + idx * 90}, 42)`}>
              <rect x="0" y="0" width="76" height="48" rx="6" fill="none" stroke={b.isP ? '#22D3EE' : '#818CF8'} strokeWidth="1.8" />
              <text x="38" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill={b.isP ? '#22D3EE' : 'currentColor'}>{b.lbl}</text>
              <text x="38" y="39" textAnchor="middle" fontSize="10" fill="#94A3B8">Pos {b.pos} ({b.pos.toString(2).padStart(3, '0')})</text>
            </g>
          ))}
          <text x="25" y="120" fontSize="11" fill="#22D3EE">P₁ covers odd positions (LSB=1): {`{1, 3, 5, 7}`} → P₁ = D₃ ⊕ D₅ ⊕ D₇</text>
          <text x="25" y="142" fontSize="11" fill="#38BDF8">P₂ covers bit-2=1 positions: {`{2, 3, 6, 7}`} → P₂ = D₃ ⊕ D₆ ⊕ D₇</text>
          <text x="25" y="164" fontSize="11" fill="#818CF8">P₄ covers bit-4=1 positions: {`{4, 5, 6, 7}`} → P₄ = D₅ ⊕ D₆ ⊕ D₇</text>
        </svg>
      );

    case 'logic-gates-symbols':
      return (
        <svg viewBox="0 0 680 210" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Standard logic gate symbols">
          {/* AND */}
          <g transform="translate(20,20)">
            <line x1="0" y1="12" x2="25" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="25" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M25,4 L50,4 A18,18 0 0,1 50,40 L25,40 Z" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <line x1="68" y1="22" x2="95" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="48" y="58" textAnchor="middle" fontSize="11" fontWeight="700">AND (A·B)</text>
          </g>
          {/* OR */}
          <g transform="translate(185,20)">
            <line x1="0" y1="12" x2="28" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="28" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M22,4 Q35,22 22,40 Q52,40 70,22 Q52,4 22,4 Z" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <line x1="70" y1="22" x2="95" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="48" y="58" textAnchor="middle" fontSize="11" fontWeight="700">OR (A+B)</text>
          </g>
          {/* NOT */}
          <g transform="translate(350,20)">
            <line x1="0" y1="22" x2="25" y2="22" stroke={stroke} strokeWidth="1.6" />
            <polygon points="25,6 25,38 56,22" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="61" cy="22" r="4.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <line x1="66" y1="22" x2="95" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="48" y="58" textAnchor="middle" fontSize="11" fontWeight="700">NOT (A')</text>
          </g>
          {/* NAND */}
          <g transform="translate(515,20)">
            <line x1="0" y1="12" x2="25" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="25" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M25,4 L50,4 A18,18 0 0,1 50,40 L25,40 Z" fill="none" stroke="#22D3EE" strokeWidth="2" />
            <circle cx="73" cy="22" r="4.5" fill="none" stroke="#22D3EE" strokeWidth="2" />
            <line x1="78" y1="22" x2="100" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="50" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#22D3EE">NAND (Universal)</text>
          </g>
          {/* NOR */}
          <g transform="translate(95,120)">
            <line x1="0" y1="12" x2="28" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="28" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M22,4 Q35,22 22,40 Q52,40 70,22 Q52,4 22,4 Z" fill="none" stroke="#22D3EE" strokeWidth="2" />
            <circle cx="75" cy="22" r="4.5" fill="none" stroke="#22D3EE" strokeWidth="2" />
            <line x1="80" y1="22" x2="105" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="52" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#22D3EE">NOR (Universal)</text>
          </g>
          {/* XOR */}
          <g transform="translate(290,120)">
            <line x1="0" y1="12" x2="22" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="22" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M16,4 Q29,22 16,40" fill="none" stroke="#818CF8" strokeWidth="2" />
            <path d="M24,4 Q37,22 24,40 Q54,40 72,22 Q54,4 24,4 Z" fill="none" stroke="#818CF8" strokeWidth="2" />
            <line x1="72" y1="22" x2="98" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="50" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#818CF8">XOR (A ⊕ B)</text>
          </g>
          {/* XNOR */}
          <g transform="translate(475,120)">
            <line x1="0" y1="12" x2="22" y2="12" stroke={stroke} strokeWidth="1.6" />
            <line x1="0" y1="32" x2="22" y2="32" stroke={stroke} strokeWidth="1.6" />
            <path d="M16,4 Q29,22 16,40" fill="none" stroke="#818CF8" strokeWidth="2" />
            <path d="M24,4 Q37,22 24,40 Q54,40 72,22 Q54,4 24,4 Z" fill="none" stroke="#818CF8" strokeWidth="2" />
            <circle cx="77" cy="22" r="4.5" fill="none" stroke="#818CF8" strokeWidth="2" />
            <line x1="82" y1="22" x2="105" y2="22" stroke={stroke} strokeWidth="1.6" />
            <text x="52" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#818CF8">XNOR (A ⊙ B)</text>
          </g>
        </svg>
      );

    case 'kmap-4var':
      return (
        <svg viewBox="0 0 680 230" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="4-Variable K-Map Gray Code Layout">
          <text x="20" y="24" fontSize="12" fontWeight="700" fill="#38BDF8">4-Variable Karnaugh Map (AB rows × CD columns — Gray Order)</text>
          <line x1="80" y1="38" x2="130" y2="68" stroke="#64748B" strokeWidth="1.3" />
          <text x="112" y="50" fontSize="11" fontWeight="700">CD</text>
          <text x="82" y="65" fontSize="11" fontWeight="700">AB</text>

          {['00', '01', '11', '10'].map((lbl, c) => (
            <text key={lbl} x={170 + c * 75} y="56" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22D3EE">{lbl}</text>
          ))}
          {['00', '01', '11', '10'].map((lbl, r) => (
            <text key={lbl} x="115" y={93 + r * 36} textAnchor="end" fontSize="12" fontWeight="700" fill="#22D3EE">{lbl}</text>
          ))}

          {[
            [0, 1, 3, 2],
            [4, 5, 7, 6],
            [12, 13, 15, 14],
            [8, 9, 11, 10]
          ].map((row, r) =>
            row.map((m, c) => {
              const isQuad = [3, 7, 15, 11].includes(m);
              const isTop = [0, 1, 3, 2].includes(m);
              return (
                <g key={m}>
                  <rect x={132 + c * 75} y={70 + r * 36} width="75" height="36" fill="none" stroke="#475569" strokeWidth="1.2" />
                  <text x={140 + c * 75} y={82 + r * 36} fontSize="9" fill="#94A3B8">m{m}</text>
                  <text x={170 + c * 75} y={96 + r * 36} textAnchor="middle" fontSize="13" fontWeight="700" fill={isQuad || isTop ? '#38BDF8' : '#64748B'}>
                    {m === 1 || m === 3 || m === 7 || m === 11 || m === 15 ? '1' : m === 0 || m === 2 ? 'X' : '0'}
                  </text>
                </g>
              );
            })
          )}
          {/* Quad highlight CD */}
          <rect x="286" y="73" width="67" height="138" rx="8" fill="none" stroke="#38BDF8" strokeWidth="2.2" />
          {/* Quad highlight A'B' */}
          <rect x="136" y="73" width="292" height="30" rx="8" fill="none" stroke="#818CF8" strokeWidth="2.2" />
          <text x="460" y="105" fontSize="11" fontWeight="600" fill="#818CF8">Quad 1 (Row 00): A'B'</text>
          <text x="460" y="130" fontSize="11" fontWeight="600" fill="#38BDF8">Quad 2 (Col 11): CD</text>
          <text x="460" y="160" fontSize="12" fontWeight="700" fill="currentColor">Minimal SOP: F = A'B' + CD</text>
        </svg>
      );

    case 'half-full-adder':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Full Adder built from two Half Adders">
          <text x="20" y="24" fontSize="12" fontWeight="700" fill="#38BDF8">Full Adder Realized Using Two Half Adders + One OR Gate</text>
          <rect x="115" y="45" width="130" height="65" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="180" y="74" textAnchor="middle" fontSize="12" fontWeight="700">Half Adder 1</text>
          <text x="180" y="92" textAnchor="middle" fontSize="10" fill="#94A3B8">S₁ = A⊕B, C₁ = AB</text>

          <rect x="315" y="45" width="130" height="65" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="380" y="74" textAnchor="middle" fontSize="12" fontWeight="700">Half Adder 2</text>
          <text x="380" y="92" textAnchor="middle" fontSize="10" fill="#94A3B8">Sum = S₁⊕C_in</text>

          <rect x="495" y="110" width="75" height="44" rx="8" fill="none" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="532" y="137" textAnchor="middle" fontSize="12" fontWeight="700">OR</text>

          <line x1="35" y1="62" x2="115" y2="62" stroke={stroke} strokeWidth="1.5" />
          <text x="20" y="66" fontSize="12" fontWeight="700">A</text>
          <line x1="35" y1="92" x2="115" y2="92" stroke={stroke} strokeWidth="1.5" />
          <text x="20" y="96" fontSize="12" fontWeight="700">B</text>
          <line x1="35" y1="138" x2="280" y2="138" stroke={stroke} strokeWidth="1.5" />
          <line x1="280" y1="138" x2="280" y2="92" stroke={stroke} strokeWidth="1.5" />
          <line x1="280" y1="92" x2="315" y2="92" stroke={stroke} strokeWidth="1.5" />
          <text x="16" y="142" fontSize="12" fontWeight="700">C_in</text>

          <line x1="245" y1="62" x2="315" y2="62" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="245" y1="95" x2="265" y2="95" stroke="#22D3EE" strokeWidth="1.5" />
          <line x1="265" y1="95" x2="265" y2="145" stroke="#22D3EE" strokeWidth="1.5" />
          <line x1="265" y1="145" x2="495" y2="145" stroke="#22D3EE" strokeWidth="1.5" />

          <line x1="445" y1="95" x2="465" y2="95" stroke="#22D3EE" strokeWidth="1.5" />
          <line x1="465" y1="95" x2="465" y2="120" stroke="#22D3EE" strokeWidth="1.5" />
          <line x1="465" y1="120" x2="495" y2="120" stroke="#22D3EE" strokeWidth="1.5" />

          <line x1="445" y1="62" x2="605" y2="62" stroke="#10B981" strokeWidth="1.8" />
          <text x="615" y="66" fontSize="12" fontWeight="700" fill="#10B981">Sum (S)</text>
          <line x1="570" y1="132" x2="605" y2="132" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="615" y="136" fontSize="12" fontWeight="700" fill="#22D3EE">C_out</text>
        </svg>
      );

    case 'multiplexer-4to1':
      return (
        <svg viewBox="0 0 680 190" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="4 to 1 Multiplexer block diagram">
          <polygon points="240,25 360,55 360,135 240,165" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <text x="300" y="92" textAnchor="middle" fontSize="14" fontWeight="700">4 : 1</text>
          <text x="300" y="110" textAnchor="middle" fontSize="12" fill="#94A3B8">MUX</text>

          {[0, 1, 2, 3].map((i) => {
            const y = 45 + i * 32;
            return (
              <g key={i}>
                <line x1="150" y1={y} x2="240" y2={y} stroke={stroke} strokeWidth="1.5" />
                <text x="135" y={y + 4} textAnchor="end" fontSize="12" fontWeight="600">I{i}</text>
              </g>
            );
          })}
          <line x1="360" y1="95" x2="450" y2="95" stroke="#10B981" strokeWidth="2" />
          <text x="462" y="99" fontSize="13" fontWeight="700" fill="#10B981">Y = Σ mₖ(S₁,S₀)·Iₖ</text>
          <line x1="280" y1="155" x2="280" y2="180" stroke="#818CF8" strokeWidth="1.6" />
          <line x1="320" y1="145" x2="320" y2="180" stroke="#818CF8" strokeWidth="1.6" />
          <text x="275" y="182" textAnchor="end" fontSize="11" fontWeight="700" fill="#818CF8">S₁</text>
          <text x="330" y="182" fontSize="11" fontWeight="700" fill="#818CF8">S₀</text>
        </svg>
      );

    case 'comb-vs-seq':
      return (
        <svg viewBox="0 0 680 190" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Sequential circuit block diagram">
          <rect x="135" y="30" width="180" height="70" rx="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <text x="225" y="61" textAnchor="middle" fontSize="13" fontWeight="700">Combinational</text>
          <text x="225" y="79" textAnchor="middle" fontSize="12" fill="#94A3B8">Logic Network</text>

          <rect x="165" y="125" width="140" height="48" rx="8" fill="none" stroke="#818CF8" strokeWidth="2" />
          <text x="235" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818CF8">Memory Elements</text>
          <text x="235" y="163" textAnchor="middle" fontSize="10" fill="#94A3B8">(Flip-Flops)</text>

          <line x1="40" y1="55" x2="135" y2="55" stroke={stroke} strokeWidth="1.6" />
          <text x="32" y="50" fontSize="11" fontWeight="700">Inputs X(t)</text>

          <line x1="315" y1="55" x2="430" y2="55" stroke="#10B981" strokeWidth="1.6" />
          <text x="440" y="59" fontSize="12" fontWeight="700" fill="#10B981">Outputs Z(t)</text>

          {/* Next State path */}
          <polyline points="315,78 360,78 360,149 305,149" fill="none" stroke="#22D3EE" strokeWidth="1.6" />
          <text x="370" y="116" fontSize="10" fill="#22D3EE">Next State Q(t+1)</text>

          {/* Present State feedback */}
          <polyline points="165,149 90,149 90,82 135,82" fill="none" stroke="#818CF8" strokeWidth="1.6" />
          <text x="95" y="118" fontSize="10" fill="#818CF8">Present State Q(t)</text>

          {/* Clock */}
          <line x1="80" y1="175" x2="165" y2="165" stroke="#F59E0B" strokeWidth="1.4" />
          <text x="35" y="178" fontSize="11" fontWeight="700" fill="#F59E0B">Clock (CLK)</text>
        </svg>
      );

    case 'sr-latch-nor-nand':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Cross-coupled NOR SR Latch">
          <text x="20" y="24" fontSize="12" fontWeight="700" fill="#38BDF8">Cross-Coupled NOR SR Latch (Active-High S, R)</text>
          {/* Top NOR (R) */}
          <path d="M200,45 Q214,63 200,81 Q230,81 248,63 Q230,45 200,45 Z" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="253" cy="63" r="4.5" fill="none" stroke="#38BDF8" strokeWidth="2" />
          {/* Bottom NOR (S) */}
          <path d="M200,115 Q214,133 200,151 Q230,151 248,133 Q230,115 200,115 Z" fill="none" stroke="#818CF8" strokeWidth="2" />
          <circle cx="253" cy="133" r="4.5" fill="none" stroke="#818CF8" strokeWidth="2" />

          <line x1="115" y1="53" x2="203" y2="53" stroke={stroke} strokeWidth="1.6" />
          <text x="95" y="57" fontSize="12" fontWeight="700">R</text>
          <line x1="115" y1="143" x2="203" y2="143" stroke={stroke} strokeWidth="1.6" />
          <text x="95" y="147" fontSize="12" fontWeight="700">S</text>

          <line x1="258" y1="63" x2="360" y2="63" stroke="#10B981" strokeWidth="1.8" />
          <text x="370" y="67" fontSize="13" fontWeight="700" fill="#10B981">Q</text>

          <line x1="258" y1="133" x2="360" y2="133" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="370" y="137" fontSize="13" fontWeight="700" fill="#22D3EE">Q'</text>

          {/* Cross coupling */}
          <polyline points="295,63 295,88 175,112 175,123 203,123" fill="none" stroke="#10B981" strokeWidth="1.4" />
          <polyline points="315,133 315,105 175,85 175,73 203,73" fill="none" stroke="#22D3EE" strokeWidth="1.4" />

          <text x="435" y="68" fontSize="11" fill="currentColor">S=0, R=0 → Hold Q(t)</text>
          <text x="435" y="90" fontSize="11" fill="currentColor">S=1, R=0 → Set (Q=1)</text>
          <text x="435" y="112" fontSize="11" fill="currentColor">S=0, R=1 → Reset (Q=0)</text>
          <text x="435" y="134" fontSize="11" fill="#F59E0B">S=1, R=1 → Invalid (0,0)</text>
        </svg>
      );

    case 'sr-d-flipflop':
    case 'jk-master-slave-t':
    case 'excitation-tables':
    case 'flipflop-conversion':
      return (
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Master-Slave JK Flip-Flop and conversion topology">
          <rect x="130" y="42" width="135" height="90" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="197" y="75" textAnchor="middle" fontSize="13" fontWeight="700">Master Latch</text>
          <text x="197" y="94" textAnchor="middle" fontSize="10" fill="#94A3B8">Active on CLK = 1</text>

          <rect x="335" y="42" width="135" height="90" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="402" y="75" textAnchor="middle" fontSize="13" fontWeight="700">Slave Latch</text>
          <text x="402" y="94" textAnchor="middle" fontSize="10" fill="#94A3B8">Active on CLK' = 1</text>

          <line x1="65" y1="62" x2="130" y2="62" stroke={stroke} strokeWidth="1.5" />
          <text x="45" y="66" fontSize="12" fontWeight="700">J</text>
          <line x1="65" y1="112" x2="130" y2="112" stroke={stroke} strokeWidth="1.5" />
          <text x="45" y="116" fontSize="12" fontWeight="700">K</text>

          <line x1="265" y1="62" x2="335" y2="62" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="265" y1="112" x2="335" y2="112" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="300" y="54" textAnchor="middle" fontSize="10" fill="#94A3B8">Y</text>
          <text x="300" y="104" textAnchor="middle" fontSize="10" fill="#94A3B8">Y'</text>

          <line x1="470" y1="62" x2="545" y2="62" stroke="#10B981" strokeWidth="1.8" />
          <text x="558" y="66" fontSize="13" fontWeight="700" fill="#10B981">Q</text>
          <line x1="470" y1="112" x2="545" y2="112" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="558" y="116" fontSize="13" fontWeight="700" fill="#22D3EE">Q'</text>

          {/* Clock + Inverter */}
          <line x1="65" y1="158" x2="300" y2="158" stroke="#F59E0B" strokeWidth="1.6" />
          <text x="32" y="162" fontSize="12" fontWeight="700" fill="#F59E0B">CLK</text>
          <line x1="197" y1="158" x2="197" y2="132" stroke="#F59E0B" strokeWidth="1.5" />
          <polygon points="300,148 300,168 320,158" fill="none" stroke="#F59E0B" strokeWidth="1.6" />
          <circle cx="324" cy="158" r="3.5" fill="none" stroke="#F59E0B" strokeWidth="1.6" />
          <polyline points="328,158 402,158 402,132" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      );

    case 'computer-block-diagram':
    case 'bus-structures':
    case 'stored-program-registers':
      return (
        <svg viewBox="0 0 680 215" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Digital Computer Block Diagram and Bus Structure">
          <rect x="25" y="35" width="110" height="58" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="80" y="68" textAnchor="middle" fontSize="12" fontWeight="700">Input Unit</text>

          <rect x="180" y="20" width="130" height="65" rx="8" fill="none" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="245" y="48" textAnchor="middle" fontSize="12" fontWeight="700">Memory Unit</text>
          <text x="245" y="66" textAnchor="middle" fontSize="10" fill="#94A3B8">RAM &amp; ROM</text>

          <rect x="355" y="20" width="150" height="105" rx="8" fill="none" stroke="#818CF8" strokeWidth="2" />
          <text x="430" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818CF8">CPU</text>
          <rect x="370" y="52" width="120" height="28" rx="4" fill="none" stroke="#38BDF8" strokeWidth="1.3" />
          <text x="430" y="70" textAnchor="middle" fontSize="11">ALU + Registers</text>
          <rect x="370" y="88" width="120" height="28" rx="4" fill="none" stroke="#22D3EE" strokeWidth="1.3" />
          <text x="430" y="106" textAnchor="middle" fontSize="11">Control Unit</text>

          <rect x="545" y="35" width="110" height="58" rx="8" fill="none" stroke="#10B981" strokeWidth="1.8" />
          <text x="600" y="68" textAnchor="middle" fontSize="12" fontWeight="700">Output Unit</text>

          {/* System Bus */}
          <line x1="25" y1="160" x2="655" y2="160" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="25" y1="175" x2="655" y2="175" stroke="#818CF8" strokeWidth="2.5" />
          <line x1="25" y1="190" x2="655" y2="190" stroke="#22D3EE" strokeWidth="2" strokeDasharray="5,4" />
          <text x="35" y="154" fontSize="10" fontWeight="700" fill="#38BDF8">Address Bus (Unidirectional)</text>
          <text x="260" y="154" fontSize="10" fontWeight="700" fill="#818CF8">Data Bus (Bidirectional)</text>
          <text x="480" y="154" fontSize="10" fontWeight="700" fill="#22D3EE">Control Bus (R/W, IRQ, CLK)</text>

          <line x1="80" y1="93" x2="80" y2="190" stroke={stroke} strokeWidth="1.4" />
          <line x1="245" y1="85" x2="245" y2="190" stroke={stroke} strokeWidth="1.4" />
          <line x1="430" y1="125" x2="430" y2="190" stroke={stroke} strokeWidth="1.4" />
          <line x1="600" y1="93" x2="600" y2="190" stroke={stroke} strokeWidth="1.4" />
        </svg>
      );

    case 'io-interrupts':
    case 'dma-controller':
    case 'async-strobe-handshake':
      return (
        <svg viewBox="0 0 680 190" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="DMA Controller Bus Arbitration">
          <rect x="30" y="35" width="120" height="70" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="90" y="65" textAnchor="middle" fontSize="13" fontWeight="700">CPU</text>
          <text x="90" y="85" textAnchor="middle" fontSize="10" fill="#94A3B8">High-Z during BG=1</text>

          <rect x="240" y="35" width="160" height="70" rx="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <text x="320" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill="#38BDF8">DMA Controller</text>
          <text x="320" y="79" textAnchor="middle" fontSize="10" fill="#94A3B8">Addr Reg · Word Count</text>
          <text x="320" y="93" textAnchor="middle" fontSize="10" fill="#94A3B8">Control Reg</text>

          <rect x="490" y="35" width="150" height="70" rx="8" fill="none" stroke="#10B981" strokeWidth="1.8" />
          <text x="565" y="65" textAnchor="middle" fontSize="13" fontWeight="700">Main RAM</text>
          <text x="565" y="83" textAnchor="middle" fontSize="10" fill="#94A3B8">Direct Block Read/Write</text>

          <line x1="150" y1="52" x2="240" y2="52" stroke="#F59E0B" strokeWidth="1.6" />
          <text x="195" y="45" textAnchor="middle" fontSize="10" fontWeight="700" fill="#F59E0B">← BR (Bus Req)</text>
          <line x1="150" y1="74" x2="240" y2="74" stroke="#22D3EE" strokeWidth="1.6" />
          <text x="195" y="69" textAnchor="middle" fontSize="10" fontWeight="700" fill="#22D3EE">BG (Grant) →</text>
          <line x1="150" y1="96" x2="240" y2="96" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="195" y="112" textAnchor="middle" fontSize="10" fill="#10B981">← INTR (Done)</text>

          <line x1="30" y1="155" x2="640" y2="155" stroke="#38BDF8" strokeWidth="2.5" />
          <text x="340" y="175" textAnchor="middle" fontSize="11" fontWeight="600" fill="#38BDF8">System Bus (Address, Data, Read/Write)</text>
          <line x1="90" y1="105" x2="90" y2="155" stroke={stroke} strokeWidth="1.4" />
          <line x1="320" y1="105" x2="320" y2="155" stroke={stroke} strokeWidth="1.6" />
          <line x1="565" y1="105" x2="565" y2="155" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );

    case 'memory-hierarchy':
    case 'semiconductor-ram':
    case 'rom-architecture':
    case 'primary-auxiliary':
      return (
        <svg viewBox="0 0 680 205" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Memory Hierarchy Pyramid">
          <polygon points="340,18 280,58 400,58" fill="none" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="340" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#22D3EE">Registers</text>

          <polygon points="274,64 406,64 445,104 235,104" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="340" y="89" textAnchor="middle" fontSize="12" fontWeight="700" fill="#38BDF8">Cache Memory (SRAM · L1/L2/L3)</text>

          <polygon points="229,110 451,110 495,150 185,150" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="340" y="135" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818CF8">Main / Primary Memory (DRAM)</text>

          <polygon points="179,156 501,156 545,196 135,196" fill="none" stroke="#10B981" strokeWidth="1.8" />
          <text x="340" y="181" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10B981">Auxiliary Storage (SSD · HDD · Optical · Tape)</text>

          {/* Left/Right Trade-off Arrows */}
          <line x1="85" y1="185" x2="85" y2="30" stroke="#38BDF8" strokeWidth="1.8" />
          <polygon points="85,26 80,35 90,35" fill="#38BDF8" />
          <text x="72" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#38BDF8" transform="rotate(-90 72 100)">Speed &amp; Cost/Bit ↑</text>

          <line x1="595" y1="30" x2="595" y2="185" stroke="#10B981" strokeWidth="1.8" />
          <polygon points="595,190 590,181 600,181" fill="#10B981" />
          <text x="612" y="108" textAnchor="middle" fontSize="11" fontWeight="700" fill="#10B981" transform="rotate(90 612 108)">Capacity &amp; Access Time ↑</text>
        </svg>
      );

    case 'associative-cam':
    case 'cache-mapping':
    case 'virtual-memory-paging':
      return (
        <svg viewBox="0 0 680 190" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Cache Mapping and Paging Translation">
          <text x="25" y="25" fontSize="12" fontWeight="700" fill="#38BDF8">Physical Address Partitioning (Set-Associative / Direct Cache Mapping)</text>
          <rect x="25" y="42" width="220" height="44" rx="6" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="135" y="69" textAnchor="middle" fontSize="13" fontWeight="700" fill="#818CF8">Tag (W − s − b bits)</text>

          <rect x="245" y="42" width="200" height="44" rx="6" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="345" y="69" textAnchor="middle" fontSize="13" fontWeight="700" fill="#38BDF8">Set / Line Index (s bits)</text>

          <rect x="445" y="42" width="200" height="44" rx="6" fill="none" stroke="#22D3EE" strokeWidth="1.8" />
          <text x="545" y="69" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22D3EE">Block Offset (b bits)</text>

          <rect x="25" y="118" width="290" height="52" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.5" />
          <text x="170" y="141" textAnchor="middle" fontSize="12" fontWeight="700">Tag Comparators (XNOR)</text>
          <text x="170" y="157" textAnchor="middle" fontSize="10" fill="#94A3B8">Hit = (Tag Match) AND (Valid == 1)</text>

          <rect x="355" y="118" width="290" height="52" rx="8" fill="none" stroke="#10B981" strokeWidth="1.5" />
          <text x="500" y="141" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10B981">Cache Data Line Array</text>
          <text x="500" y="157" textAnchor="middle" fontSize="10" fill="#94A3B8">Selects word via Block Offset b</text>

          <line x1="135" y1="86" x2="135" y2="118" stroke="#818CF8" strokeWidth="1.5" />
          <line x1="345" y1="86" x2="430" y2="118" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="545" y1="86" x2="545" y2="118" stroke="#22D3EE" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 680 150" className="w-full max-w-2xl mx-auto text-slate-700 dark:text-slate-200" role="img" aria-label="Boolean simplification flow">
          <rect x="30" y="35" width="160" height="65" rx="8" fill="none" stroke="#818CF8" strokeWidth="1.8" />
          <text x="110" y="65" textAnchor="middle" fontSize="12" fontWeight="700">Boolean / Tabular</text>
          <text x="110" y="83" textAnchor="middle" fontSize="11" fill="#94A3B8">Input Specification</text>

          <line x1="190" y1="67" x2="250" y2="67" stroke="#38BDF8" strokeWidth="1.8" />
          <polygon points="250,67 242,63 242,71" fill="#38BDF8" />

          <rect x="255" y="35" width="170" height="65" rx="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="340" y="65" textAnchor="middle" fontSize="12" fontWeight="700">Systematic Reduction</text>
          <text x="340" y="83" textAnchor="middle" fontSize="11" fill="#94A3B8">Laws · K-Map · Q-M</text>

          <line x1="425" y1="67" x2="485" y2="67" stroke="#10B981" strokeWidth="1.8" />
          <polygon points="485,67 477,63 477,71" fill="#10B981" />

          <rect x="490" y="35" width="160" height="65" rx="8" fill="none" stroke="#10B981" strokeWidth="1.8" />
          <text x="570" y="65" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10B981">Minimal Hardware</text>
          <text x="570" y="83" textAnchor="middle" fontSize="11" fill="#94A3B8">Fewer Gates &amp; Delay</text>
        </svg>
      );
  }
}
