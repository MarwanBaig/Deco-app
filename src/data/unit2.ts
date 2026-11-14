import { Unit, ExamQuestion, QuizQuestion } from '../types/academic';

export const UNIT_2: Unit = {
  id: 'unit-2',
  number: 'Unit II',
  title: 'Combinational Circuits',
  syllabusExactText:
    'Combination Circuits: Implementation of logic functions using K-Map Quine- McCluskey Tabular method, Adders: half adder, full adder, Subtractors, Comparators, Multiplexers, De-multiplexers, Encoders and Decoders.',
  description:
    'Karnaugh Map (K-Map) and Quine–McCluskey tabular minimization, Half/Full Adders and Subtractors, Magnitude Comparators, Multiplexers, De-multiplexers, Encoders, and Decoders.',
  chapters: [
    {
      id: 'u2-c1',
      unitId: 'unit-2',
      chapterNumber: '2.1',
      title: 'Karnaugh Map (K-Map) Minimization',
      syllabusTopic: 'Implementation of logic functions using K-Map',
      estimatedMinutes: 30,
      diagramType: 'kmap-4var',
      diagramCaption: '4-variable Karnaugh Map layout with Gray-coded axes (00, 01, 11, 10) and Prime Implicant grouping.',
      introduction: {
        meaning:
          'A Karnaugh Map (K-Map) is a graphical grid representation of a truth table where adjacent cells differ by only one bit, enabling visual simplification of Boolean expressions.',
        importance:
          'Algebraic simplification becomes error-prone beyond 3 variables; K-Maps provide a systematic visual shortcut for 2, 3, and 4 variables.',
        whereUsed:
          'Design of combinational decoders, arithmetic control logic, and seven-segment display drivers.',
        problemSolved:
          'Eliminates guesswork in finding minimal SOP or POS expressions by converting algebraic combining into rectangle-grouping of 1s (or 0s).'
      },
      fundamentalConcept: {
        overview:
          'K-Map rows and columns are ordered in Gray code (00, 01, 11, 10) so that any two geometrically adjacent cells—including wrap-around edges and corners—differ in exactly one variable.',
        terms: [
          { term: 'Implicant', meaning: 'Any valid group of 1, 2, 4, 8, or 16 adjacent 1-cells (power of 2).' },
          { term: 'Prime Implicant (PI)', meaning: 'A group that cannot be enclosed inside any larger valid power-of-2 group.' },
          { term: 'Essential Prime Implicant (EPI)', meaning: 'A Prime Implicant that covers at least one 1-cell not covered by any other Prime Implicant.' },
          { term: 'Don’t-Care Condition (d / X)', meaning: 'An input combination that never occurs (or whose output is irrelevant), treated as 1 or 0 to enlarge groups.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. K-Map Grouping Rules for Minimal SOP',
          steps: [
            'Draw the grid (2-var: 4 cells; 3-var: 8 cells; 4-var: 16 cells) using Gray code labels.',
            'Plot 1s for minterms, X for don’t-cares, and 0s elsewhere.',
            'Form the largest possible rectangular groups of size 2ᵏ (16, 8, 4, 2, 1) containing only 1s and useful Xs (never include X-only groups).',
            'Use wrap-around adjacency: top row wraps to bottom row; left column wraps to right column; all 4 corners form a quad.',
            'Select all Essential Prime Implicants first, then pick the fewest remaining PIs to cover every 1.'
          ]
        },
        {
          heading: '2. Variable Elimination by Group Size (for 4 Variables)',
          table: {
            caption: 'Literals Retained in a 4-Variable K-Map Group',
            headers: ['Group Size (2ᵏ)', 'Variables Eliminated (k)', 'Literals in Resulting Product Term'],
            rows: [
              ['1 cell (Single)', '0', '4 literals (e.g., A\'BC\'D)'],
              ['2 cells (Pair)', '1', '3 literals (e.g., A\'BC\')'],
              ['4 cells (Quad)', '2', '2 literals (e.g., BD\')'],
              ['8 cells (Octet)', '3', '1 literal (e.g., A\')'],
              ['16 cells (Full map)', '4', 'Constant 1']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u2-c1-ex1',
          title: '4-Variable K-Map Simplification with Don’t-Cares',
          problemStatement: 'Minimize F(A, B, C, D) = Σm(1, 3, 7, 11, 15) + d(0, 2, 5) in SOP form using a 4-variable K-Map.',
          given: ['Minterms (1s): 1, 3, 7, 11, 15', 'Don’t-cares (Xs): 0, 2, 5'],
          required: 'Minimal SOP expression for F',
          formulaLatex: 'F(A,B,C,D) = \\sum m(1,3,7,11,15) + \\sum d(0,2,5)',
          substitutionLatex: '\\text{Quad 1: } \\{3, 7, 11, 15\\} \\implies CD, \\quad \\text{Quad 2: } \\{0, 1, 2, 3\\} \\implies A\'B\'',
          calculationSteps: [
            'Plot 1s at cells 1, 3, 7, 11, 15 and X at 0, 2, 5.',
            'Cells {3, 7, 11, 15} form column CD = 11 (vertical quad) → eliminates A and B → term CD. Covers 11 and 15 uniquely (Essential PI).',
            'Remaining uncovered minterm is 1. Using don’t-cares 0 and 2, row AB = 00 {0, 1, 2, 3} forms a horizontal quad → eliminates C and D → term A\'B\'.',
            'Don’t-care 5 is not needed and left uncovered.'
          ],
          finalAnswer: 'F = A\'B\' + CD',
          interpretation: 'Don’t-care cells 0 and 2 doubled a pair {1,3} into a quad {0,1,2,3}, saving one literal and one gate input.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-1',
          unitId: 'unit-2',
          chapterId: 'u2-c1',
          chapterTitle: 'Karnaugh Map (K-Map) Minimization',
          name: 'K-Map Group-Size Literal Rule',
          latex: '\\text{Literals per term} = n - k \\quad \\text{for a group of } 2^k \\text{ adjacent cells in an } n\\text{-variable K-Map}',
          symbols: [
            { symbol: 'n', meaning: 'Total number of input variables' },
            { symbol: 'k', meaning: 'Power of 2 of the group size (group size = 2ᵏ)' }
          ],
          units: 'Literals',
          conditions: 'Valid for n ≤ 4 (and 5–6 variable layered K-maps).',
          miniExample: 'A quad (2² = 4 cells) in a 4-variable map yields 4 − 2 = 2 literals.'
        }
      ],
      applications: [
        { area: '7-Segment BCD Decoder', detail: 'Each of the 7 LED segments (a–g) is minimized using a 4-variable K-Map where BCD codes 10–15 are Don’t-Cares.' },
        { area: 'Combinational Control Units', detail: 'Minimizes opcode decoding logic in small processors.' }
      ],
      summary: [
        'K-Map axes follow Gray code so adjacent cells differ by 1 bit.',
        'Group 1s (with helpful don’t-cares) into maximal power-of-2 rectangles for SOP; group 0s for POS.',
        'Include all Essential Prime Implicants first, then minimal cover for remaining 1s.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Essential Prime Implicant', definition: 'A prime implicant containing at least one minterm not covered by any other prime implicant.' },
          { term: 'Don’t-Care (d)', definition: 'Unused input state that can be treated as 1 (in SOP) or 0 (in POS) only if it enlarges a group.' }
        ],
        corePoints: [
          'Axes order: 00, 01, 11, 10.',
          'Allowed group sizes: 1, 2, 4, 8, 16 (never 3, 5, 6, 7).',
          'For Minimal POS: group the 0s of the K-Map and write sum terms (0 → unprimed, 1 → primed).'
        ],
        examReminders: [
          'Check wrap-around edges and the 4 corners—forgetting wrap-around quads is the #1 reason students lose marks on K-Map problems.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c1-q1',
          question: 'In a 4-variable K-Map, how many literals remain in the product term of an 8-cell group (octet)?',
          options: ['1 literal', '2 literals', '3 literals', '4 literals'],
          correctIndex: 0,
          explanation: 'Since 8 = 2³, 3 variables are eliminated, leaving 4 − 3 = 1 literal.'
        },
        {
          id: 'u2-c1-q2',
          question: 'Which cell is NOT adjacent to cell m₀ (0000) in a 4-variable K-Map?',
          options: ['m₁ (0001)', 'm₂ (0010)', 'm₈ (1000)', 'm₃ (0011)'],
          correctIndex: 3,
          explanation: 'm₃ (0011) differs from m₀ (0000) in two bits (C and D), whereas m₁, m₂, and m₈ differ in only 1 bit.'
        },
        {
          id: 'u2-c1-q3',
          question: 'To obtain a Minimal POS expression directly from a K-Map, you should group:',
          options: ['Only don’t-cares', 'The 0-cells (with helpful don’t-cares)', 'Only odd minterms', 'Diagonally adjacent 1s'],
          correctIndex: 1,
          explanation: 'Grouping 0s yields minimal sum terms for the Product of Sums (POS) form.'
        }
      ]
    },
    {
      id: 'u2-c2',
      unitId: 'unit-2',
      chapterNumber: '2.2',
      title: 'Quine–McCluskey (Tabulation) Method',
      syllabusTopic: 'Quine- McCluskey Tabular method',
      estimatedMinutes: 30,
      diagramType: 'quine-mccluskey',
      diagramCaption: 'Two-phase Quine–McCluskey pipeline: Iterative bit-group pairing for Prime Implicants followed by the PI Coverage Chart.',
      introduction: {
        meaning:
          'The Quine–McCluskey (Q–M) method is a tabular, algorithmic technique for minimizing Boolean functions of any number of variables.',
        importance:
          'K-Maps rely on human visual pattern recognition and break down above 4–5 variables; Q–M is deterministic and ideal for computer-aided logic synthesis.',
        whereUsed:
          'EDA (Electronic Design Automation) CAD tools, Espresso heuristic minimizers, and multi-variable (>4) digital design.',
        problemSolved:
          'Guarantees finding all Prime Implicants and the exact minimum cover systematically without relying on visual adjacency.'
      },
      fundamentalConcept: {
        overview:
          'Two minterms can combine (XY + XY\' = X) if and only if they differ in exactly one bit position—which can only happen between minterms whose binary weights (count of 1s) differ by 1!',
        terms: [
          { term: 'Index (Weight) Group', meaning: 'Grouping minterms by the number of 1s in their binary representation (Index 0, 1, 2, 3, 4).' },
          { term: 'Dash Notation (–)', meaning: 'Marks an eliminated variable when two terms merge (e.g., 0100 + 0101 → 010–).' },
          { term: 'Prime Implicant Chart', meaning: 'A matrix with PIs as rows and required minterms (excluding don’t-cares) as columns used to select Essential PIs.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Step-by-Step Quine–McCluskey Algorithm',
          steps: [
            'List all minterms AND don’t-cares in binary, sorted into groups by their count of 1s (Index 0, 1, 2...).',
            'Compare every term in Group k with every term in Group k + 1. If they differ in exactly 1 bit position, combine them by placing a dash (–) at that bit, and checkmark (✓) both source terms.',
            'Repeat combining across adjacent groups (terms must have dashes in the exact same positions and differ in 1 remaining bit) until no further combinations are possible.',
            'All un-checkmarked terms at the end of all passes are the Prime Implicants (PIs).',
            'Build the Prime Implicant Chart using ONLY the true minterms (omit don’t-cares from columns). Any column with a single X identifies an Essential Prime Implicant (EPI).',
            'Select all EPIs, cross out the minterms they cover, and cover any remaining minterms with the fewest/smallest PIs (Petrick’s method or inspection).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c2-ex1',
          title: 'Minimizing a 4-Variable Function via Quine–McCluskey',
          problemStatement: 'Minimize F(A, B, C, D) = Σm(0, 1, 2, 5, 6, 7, 8, 9, 10, 14) using the Quine–McCluskey method.',
          given: ['Minterms: 0, 1, 2, 5, 6, 7, 8, 9, 10, 14'],
          required: 'All Prime Implicants and Minimal SOP expression',
          formulaLatex: 'X \\cdot Y + X \\cdot Y\' = X',
          substitutionLatex: '\\text{Group 0: } m_0(0000); \\; \\text{Group 1: } m_1, m_2, m_8; \\; \\text{Group 2: } m_5, m_6, m_9, m_{10}; \\; \\text{Group 3: } m_7, m_{14}',
          calculationSteps: [
            'Pass 1 (Pairs): (0,1)=000-, (0,2)=00-0, (0,8)=-000; (1,5)=0-01, (1,9)=-001, (2,6)=0-10, (2,10)=-010, (8,9)=100-, (8,10)=10-0; (5,7)=01-1, (6,7)=011-, (6,14)=-110, (10,14)=1-10.',
            'Pass 2 (Quads): (0,1,8,9)=-00- (B\'C\'), (0,2,8,10)=-0-0 (B\'D\'), (2,6,10,14)=--10 (CD\').',
            'Unchecked PIs: P1=(0,1,8,9)=B\'C\', P2=(0,2,8,10)=B\'D\', P3=(2,6,10,14)=CD\', P4=(1,5)=A\'C\'D, P5=(5,7)=A\'BD, P6=(6,7)=A\'BC.',
            'PI Chart single-X columns: m₀→covered by P1/P2; m₉→only P1 (EPI!); m₁₄→only P3 (EPI!); m₅→covered by P4/P5; m₇→covered by P5/P6.',
            'Select EPIs P1 (B\'C\') and P3 (CD\'). Covered so far: {0, 1, 2, 6, 8, 9, 10, 14}. Remaining minterms: {5, 7}.',
            'PI P5=(5,7)=A\'BD covers both 5 and 7 in a single 3-literal term!'
          ],
          finalAnswer: 'F = B\'C\' + CD\' + A\'BD',
          interpretation: 'Notice that P2 (B\'D\'), P4, and P6 became redundant once EPIs and P5 were chosen.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-2',
          unitId: 'unit-2',
          chapterId: 'u2-c2',
          chapterTitle: 'Quine–McCluskey (Tabulation) Method',
          name: 'Hamming-Weight Adjacency Criterion',
          latex: '|w(m_i) - w(m_j)| = 1 \\quad \\text{and} \\quad \\text{HammingDistance}(m_i, m_j) = 1',
          symbols: [
            { symbol: 'w(m_i)', meaning: 'Number of 1s in the binary representation of minterm mᵢ' }
          ],
          units: 'Bit count',
          conditions: 'Necessary and sufficient condition for two minterms to combine in Pass 1.',
          miniExample: 'm₁ (0001, weight 1) and m₅ (0101, weight 2) differ only at bit B → combine to 0–01.'
        }
      ],
      applications: [
        { area: 'Logic Synthesis Software', detail: 'Forms the exact foundation for automated combinational optimization in FPGA and ASIC compilers.' }
      ],
      summary: [
        'Quine–McCluskey is an exact tabular alternative to K-Maps suitable for >4 variables and software automation.',
        'Phase 1 finds all Prime Implicants via iterative 1-bit merging; Phase 2 uses a PI chart to select Essential PIs and minimal cover.',
        'Include don’t-cares in Phase 1 (to enlarge PIs) but omit them from Phase 2 columns.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Prime Implicant', definition: 'An un-checkmarked term remaining after all possible combinations in Q–M passes.' },
          { term: 'Essential PI', definition: 'A PI that has the sole X in at least one minterm column of the PI chart.' }
        ],
        corePoints: [
          'Only compare adjacent weight groups (e.g., 1-one with 2-ones).',
          'In Pass 2+, dashes (–) must align at identical bit positions before comparing.',
          'Exclude don’t-cares from the PI coverage chart columns.'
        ],
        examReminders: [
          'To avoid missing a quad, remember that every quad appears twice in Pass 2 (e.g., (0,1)+(8,9) and (0,8)+(1,9)); write it once and checkmark all 4 pairs.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c2-q1',
          question: 'In the Quine–McCluskey method, which terms are omitted from the columns of the Prime Implicant coverage chart?',
          options: ['Odd minterms', 'Even minterms', 'Don’t-care terms', 'Zero-weight minterms'],
          correctIndex: 2,
          explanation: 'Don’t-cares help enlarge Prime Implicants in Phase 1, but we do NOT need to cover them in Phase 2.'
        },
        {
          id: 'u2-c2-q2',
          question: 'Can terms 0–10 and 10–0 be combined in Pass 2 of the Q–M method?',
          options: ['Yes, they differ in 1 bit', 'No, their dashes (–) are not in the same position', 'Yes, always', 'Only if there are 5 variables'],
          correctIndex: 1,
          explanation: 'Terms in Pass 2+ can combine only when their dash positions match identically and their remaining bits differ in exactly 1 position.'
        },
        {
          id: 'u2-c2-q3',
          question: 'Why is Quine–McCluskey preferred over K-Maps for 6 or more variables?',
          options: ['It uses fewer gates', 'It is algorithmic and scales cleanly beyond 4 variables', 'It avoids Boolean algebra', 'It does not use binary numbers'],
          correctIndex: 1,
          explanation: 'K-Maps become visually hard to read past 4 variables, whereas Q–M is purely tabular and programmable.'
        }
      ]
    },
    {
      id: 'u2-c3',
      unitId: 'unit-2',
      chapterNumber: '2.3',
      title: 'Binary Adders: Half Adder, Full Adder & Parallel Adder',
      syllabusTopic: 'Adders: half adder, full adder',
      estimatedMinutes: 25,
      diagramType: 'half-full-adder',
      diagramCaption: 'Logic diagrams of a Half Adder, a Full Adder built from two Half Adders + OR gate, and a 4-bit Ripple-Carry Adder.',
      introduction: {
        meaning:
          'Binary adders are combinational circuits that compute the arithmetic sum and carry-out of binary bits.',
        importance:
          'Addition is the core arithmetic operation inside every ALU—subtraction, multiplication, division, and address indexing all rely on fast adders.',
        whereUsed:
          'CPU ALUs, Program Counter incrementers (+1/+4), DSP multiply-accumulate units, and address generators.',
        problemSolved:
          'Enables multi-bit binary arithmetic by propagating carries cleanly from LSB to MSB.'
      },
      fundamentalConcept: {
        overview:
          'A Half Adder adds two 1-bit numbers (A, B) without a carry-in. To chain adders together for multi-bit addition, we need a Full Adder that accepts three inputs (A, B, and C_in from the previous stage).',
        terms: [
          { term: 'Half Adder (HA)', meaning: '2-input (A, B), 2-output (Sum S, Carry C) combinational circuit.' },
          { term: 'Full Adder (FA)', meaning: '3-input (A, B, C_in), 2-output (Sum S, Carry C_out) combinational circuit.' },
          { term: 'Ripple-Carry Adder', meaning: 'n Full Adders cascaded in series where each C_out drives the next stage’s C_in.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Truth Tables & Boolean Equations',
          table: {
            caption: 'Full Adder Truth Table (Half Adder is rows where C_in = 0)',
            headers: ['A', 'B', 'C_in', 'Sum (S)', 'Carry (C_out)'],
            rows: [
              ['0', '0', '0', '0', '0'],
              ['0', '0', '1', '1', '0'],
              ['0', '1', '0', '1', '0'],
              ['0', '1', '1', '0', '1'],
              ['1', '0', '0', '1', '0'],
              ['1', '0', '1', '0', '1'],
              ['1', '1', '0', '0', '1'],
              ['1', '1', '1', '1', '1']
            ]
          }
        },
        {
          heading: '2. Half Adder vs Full Adder Expressions',
          bullets: [
            'Half Adder: S = A ⊕ B; C = A · B (1 XOR gate + 1 AND gate).',
            'Full Adder: S = A ⊕ B ⊕ C_in; C_out = AB + BC_in + AC_in = AB + C_in(A ⊕ B).',
            'Building a Full Adder from Half Adders: 2 Half Adders + 1 OR gate! HA1 computes S₁ = A ⊕ B, C₁ = AB; HA2 computes S = S₁ ⊕ C_in, C₂ = S₁·C_in; OR gate computes C_out = C₁ + C₂.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c3-ex1',
          title: 'Tracing a Full Adder & 4-Bit Ripple-Carry Delay',
          problemStatement: 'Given A = 1, B = 1, C_in = 1, calculate the Full Adder outputs S and C_out. Also find total worst-case propagation delay of a 4-bit Ripple-Carry Adder if each FA has a carry delay of t_c = 12 ns and sum delay of t_s = 15 ns.',
          given: ['A = 1, B = 1, C_in = 1', 't_c = 12 ns, t_s = 15 ns, n = 4 bits'],
          required: 'Sum S, Carry C_out, and 4-bit adder worst-case delay',
          formulaLatex: 'S = A \\oplus B \\oplus C_{in}, \\quad C_{out} = AB + C_{in}(A \\oplus B), \\quad T_{total} = (n-1)t_c + \\max(t_c, t_s)',
          substitutionLatex: 'S = 1 \\oplus 1 \\oplus 1, \\quad C_{out} = 1\\cdot1 + 1(1\\oplus1), \\quad T_{total} = 3(12) + 15',
          calculationSteps: [
            'S = (1 ⊕ 1) ⊕ 1 = 0 ⊕ 1 = 1.',
            'C_out = (1 · 1) + 1 · (0) = 1 + 0 = 1.',
            'For 4-bit ripple carry: Stages 0, 1, 2 ripple carries in 3 × 12 ns = 36 ns; final stage computes Sum in 15 ns → 36 + 15 = 51 ns.'
          ],
          finalAnswer: 'S = 1, C_out = 1; 4-bit worst-case delay = 51 ns',
          interpretation: 'Carry propagation through all n stages is the speed bottleneck of ripple-carry adders.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-3',
          unitId: 'unit-2',
          chapterId: 'u2-c3',
          chapterTitle: 'Binary Adders: Half Adder, Full Adder & Parallel Adder',
          name: 'Half Adder & Full Adder Equations',
          latex: 'S_{HA} = A \\oplus B, \\; C_{HA} = AB \\qquad S_{FA} = A \\oplus B \\oplus C_{in}, \\; C_{out} = AB + C_{in}(A \\oplus B)',
          symbols: [
            { symbol: 'A, B', meaning: 'Addend and augend input bits' },
            { symbol: 'C_in', meaning: 'Carry-in bit from previous less-significant stage' }
          ],
          units: 'Binary logic {0, 1}',
          conditions: 'Full Adder reduces to Half Adder when C_in = 0.',
          miniExample: 'If A=1, B=0, C_in=1: S = 0, C_out = 1 (binary 10 = 2).'
        }
      ],
      applications: [
        { area: 'Processor ALU', detail: 'Cascaded Full Adders form n-bit integer adders (and subtractors via 2’s complement).' },
        { area: 'Multipliers', detail: 'Binary array multipliers use grids of Half Adders and Full Adders to sum partial products.' }
      ],
      summary: [
        'Half Adder adds 2 bits (S = A ⊕ B, C = AB); cannot handle carry-in.',
        'Full Adder adds 3 bits (A, B, C_in) and can be built from 2 Half Adders + 1 OR gate.',
        'Cascading n Full Adders forms an n-bit Parallel Ripple-Carry Adder.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Half Adder', definition: 'Adds two 1-bit inputs → Sum (A⊕B) and Carry (AB).' },
          { term: 'Full Adder', definition: 'Adds three 1-bit inputs → Sum (A⊕B⊕C_in) and Carry-out.' }
        ],
        corePoints: [
          '1 Full Adder = 2 Half Adders + 1 OR gate.',
          'Full Adder Sum = Σm(1, 2, 4, 7); Carry = Σm(3, 5, 6, 7).'
        ],
        examReminders: [
          'When asked to realize a Full Adder using Half Adders, always prove C_out = AB + (A⊕B)C_in algebraically equals AB + BC_in + AC_in.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c3-q1',
          question: 'How many Half Adders and OR gates are needed to build one Full Adder?',
          options: ['1 HA + 1 OR', '2 HA + 1 OR', '2 HA + 2 OR', '3 HA + 1 AND'],
          correctIndex: 1,
          explanation: 'A Full Adder requires 2 Half Adders and 1 OR gate to combine their carry outputs.'
        },
        {
          id: 'u2-c3-q2',
          question: 'For a Full Adder, the Sum output is HIGH (1) for which minterms?',
          options: ['Σm(3, 5, 6, 7)', 'Σm(1, 2, 4, 7)', 'Σm(0, 3, 5, 6)', 'Σm(1, 2, 3, 7)'],
          correctIndex: 1,
          explanation: 'Sum = 1 when an odd number of inputs are 1, which occurs at rows 1, 2, 4, and 7.'
        },
        {
          id: 'u2-c3-q3',
          question: 'In a 4-bit parallel adder, what should C_in of the LSB Full Adder be tied to for pure addition?',
          options: ['1', '0', 'C_out', 'A₀'],
          correctIndex: 1,
          explanation: 'For addition A + B, initial carry-in C₀ = 0 (or replace the LSB stage with a Half Adder).'
        }
      ]
    },
    {
      id: 'u2-c4',
      unitId: 'unit-2',
      chapterNumber: '2.4',
      title: 'Binary Subtractors & Combined Adder–Subtractor',
      syllabusTopic: 'Subtractors',
      estimatedMinutes: 20,
      diagramType: 'subtractor-adder',
      diagramCaption: 'Half/Full Subtractor logic and 4-bit Parallel Adder–Subtractor controlled by Mode input M.',
      introduction: {
        meaning:
          'Binary subtractors compute the Difference (D) and Borrow (B_out) when subtracting bit B (and Borrow-in B_in) from bit A.',
        importance:
          'Understanding dedicated subtractors as well as the unified 2’s complement Adder–Subtractor shows how CPUs avoid duplicating arithmetic hardware.',
        whereUsed:
          'Digital comparators, down-counters, and unified ALU adder–subtractor blocks.',
        problemSolved:
          'Performs binary subtraction A − B cleanly and demonstrates how XOR-controlled inversion merges addition and subtraction into one circuit.'
      },
      fundamentalConcept: {
        overview:
          'Just like adders, a Half Subtractor subtracts B from A (A − B), while a Full Subtractor computes A − B − B_in. Notice the Difference expression matches the Adder Sum expression—only the Borrow logic flips A to A\'!',
        terms: [
          { term: 'Half Subtractor (HS)', meaning: 'Computes Difference D = A ⊕ B and Borrow B_out = A\'B.' },
          { term: 'Full Subtractor (FS)', meaning: 'Computes D = A ⊕ B ⊕ B_in and B_out = A\'B + B_in(A ⊕ B)\'.' },
          { term: 'Mode Control (M)', meaning: 'Control line in an Adder–Subtractor: M = 0 performs A + B; M = 1 performs A − B via 2’s complement.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Full Subtractor Truth Table & Equations',
          table: {
            caption: 'Full Subtractor Truth Table (A − B − B_in)',
            headers: ['A', 'B', 'B_in', 'Difference (D)', 'Borrow (B_out)'],
            rows: [
              ['0', '0', '0', '0', '0'],
              ['0', '0', '1', '1', '1'],
              ['0', '1', '0', '1', '1'],
              ['0', '1', '1', '0', '1'],
              ['1', '0', '0', '1', '0'],
              ['1', '0', '1', '0', '0'],
              ['1', '1', '0', '0', '0'],
              ['1', '1', '1', '1', '1']
            ]
          }
        },
        {
          heading: '2. 4-Bit Parallel Adder–Subtractor Using XOR Gates',
          bullets: [
            'Each bit Bᵢ passes through a 2-input XOR gate along with Mode bit M before entering the Full Adder.',
            'When M = 0: Bᵢ ⊕ 0 = Bᵢ and C₀ = 0 → Circuit computes A + B.',
            'When M = 1: Bᵢ ⊕ 1 = Bᵢ\' (1’s complement) and C₀ = 1 → Circuit computes A + B\' + 1 = A − B (2’s complement subtraction)!'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c4-ex1',
          title: 'Tracing 4-Bit Adder–Subtractor in Subtract Mode (M = 1)',
          problemStatement: 'Trace the 4-bit Adder–Subtractor for A = 1001₂ (9) and B = 0101₂ (5) with Mode M = 1.',
          given: ['A = 1001', 'B = 0101', 'M = 1 (C₀ = 1)'],
          required: 'XOR outputs, 4-bit Sum S₃S₂S₁S₀, and Carry-out C₄',
          formulaLatex: 'S = A + (B \\oplus M) + M',
          substitutionLatex: 'B \\oplus 1 = 0101 \\oplus 1111 = 1010, \\quad C_0 = 1',
          calculationSteps: [
            'XOR gates invert B = 0101 to 1010.',
            'Add A + B\' + C₀ = 1001 + 1010 + 1 = 10100 (5 bits).',
            'Lower 4 bits S₃S₂S₁S₀ = 0100₂ (4₁₀), and C₄ = 1 (end-carry discarded).'
          ],
          finalAnswer: 'S = 0100₂ (+4₁₀), C₄ = 1',
          interpretation: 'A single 4-bit adder plus 4 XOR gates executes both 9 + 5 and 9 − 5.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-4',
          unitId: 'unit-2',
          chapterId: 'u2-c4',
          chapterTitle: 'Binary Subtractors & Combined Adder–Subtractor',
          name: 'Half & Full Subtractor Equations',
          latex: 'D_{HS} = A \\oplus B, \\; B_{out,HS} = A\'B \\qquad D_{FS} = A \\oplus B \\oplus B_{in}, \\; B_{out,FS} = A\'B + B_{in}(A \\oplus B)\'',
          symbols: [
            { symbol: 'A, B', meaning: 'Minuend and subtrahend bits' },
            { symbol: 'B_in, B_out', meaning: 'Borrow-in and Borrow-out bits' }
          ],
          units: 'Binary logic',
          conditions: 'Full Subtractor = 2 Half Subtractors + 1 OR gate.',
          miniExample: 'If A=0, B=1, B_in=0: D = 1, B_out = 1 (representing −1 = −2 + 1).'
        }
      ],
      applications: [
        { area: 'ALU Core', detail: 'Unified Adder–Subtractor saves ~40% transistor area over separate adder and subtractor circuits.' }
      ],
      summary: [
        'Half Subtractor: D = A ⊕ B, Borrow = A\'B; Full Subtractor: D = A ⊕ B ⊕ B_in, Borrow = A\'B + B_in(A ⊕ B)\'.',
        'A single 4-bit parallel adder with XOR gates on input B and M connected to C₀ serves as both Adder (M=0) and Subtractor (M=1).'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Half Subtractor', definition: 'Subtracts B from A; D = A⊕B, B_out = A\'B.' },
          { term: 'Adder–Subtractor', definition: 'Uses XOR gates with Mode M: M=0 adds, M=1 subtracts via 2’s complement.' }
        ],
        corePoints: [
          'Difference D in subtractor equals Sum S in adder.',
          'Borrow in HS is A\'B (only 1 when 0 − 1).'
        ],
        examReminders: [
          'Remember C₀ must also be connected to M in the Adder–Subtractor so +1 is added for 2’s complement when M = 1.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c4-q1',
          question: 'In a Half Subtractor computing A − B, when is the Borrow output equal to 1?',
          options: ['A=1, B=0', 'A=0, B=1', 'A=1, B=1', 'A=0, B=0'],
          correctIndex: 1,
          explanation: 'B_out = A\'B, which is 1 only when subtracting 1 from 0 (A=0, B=1).'
        },
        {
          id: 'u2-c4-q2',
          question: 'In a 4-bit Adder–Subtractor, what value of Mode M and C₀ performs A − B?',
          options: ['M = 0, C₀ = 0', 'M = 1, C₀ = 0', 'M = 1, C₀ = 1', 'M = 0, C₀ = 1'],
          correctIndex: 2,
          explanation: 'M = 1 inverts all bits of B (1’s complement) and C₀ = 1 adds 1 to form 2’s complement.'
        },
        {
          id: 'u2-c4-q3',
          question: 'How many Half Subtractors and OR gates are needed to build one Full Subtractor?',
          options: ['2 HS + 1 OR', '1 HS + 1 OR', '2 HS + 1 AND', '3 HS'],
          correctIndex: 0,
          explanation: 'Just like a Full Adder uses 2 HA + 1 OR, a Full Subtractor uses 2 HS + 1 OR.'
        }
      ]
    },
    {
      id: 'u2-c5',
      unitId: 'unit-2',
      chapterNumber: '2.5',
      title: 'Magnitude Comparators',
      syllabusTopic: 'Comparators',
      estimatedMinutes: 25,
      diagramType: 'magnitude-comparator',
      diagramCaption: '1-bit and 2-bit Magnitude Comparator logic producing mutually exclusive outputs A > B, A = B, and A < B.',
      introduction: {
        meaning:
          'A magnitude comparator is a combinational circuit that compares two binary numbers A and B and indicates whether A > B, A = B, or A < B.',
        importance:
          'Branching decisions (`if (a > b)`), sorting hardware, address matching, and cache tag comparison all depend on fast magnitude/equality comparators.',
        whereUsed:
          'CPU branch units, digital sorting networks, ADC flash comparators, and 7485 4-bit comparator ICs.',
        problemSolved:
          'Determines numeric ordering directly from bit patterns in parallel without performing a full subtraction.'
      },
      fundamentalConcept: {
        overview:
          'Comparison starts from the Most Significant Bit (MSB) downward: if the MSBs differ, the number with 1 is strictly larger; only if the MSBs are equal do we inspect the next lower bit pair.',
        terms: [
          { term: 'Equality Output (A = B)', meaning: 'HIGH when every corresponding bit pair matches (using XNOR gates combined by an AND gate).' },
          { term: 'Cascading Inputs', meaning: 'Extra inputs (I_{A>B}, I_{A=B}, I_{A<B}) on ICs like 7485 allowing 4-bit chips to chain into 8-bit or 16-bit comparators.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. 1-Bit and 2-Bit Comparator Equations',
          bullets: [
            '1-Bit Comparator: (A > B) = A · B\'; (A < B) = A\' · B; (A = B) = A ⊙ B = AB + A\'B\'.',
            '2-Bit Comparator for A = A₁A₀ and B = B₁B₀: Let x₁ = (A₁ ⊙ B₁) and x₀ = (A₀ ⊙ B₀).',
            'Equality: (A = B) = x₁ · x₀.',
            'Greater Than: (A > B) = A₁B₁\' + x₁ A₀B₀\'.',
            'Less Than: (A < B) = A₁\'B₁ + x₁ A₀\'B₀.'
          ]
        },
        {
          heading: '2. Generalizing to 4-Bit Magnitude Comparator (A₃A₂A₁A₀ vs B₃B₂B₁B₀)',
          bullets: [
            'Define xᵢ = AᵢBᵢ + Aᵢ\'Bᵢ\' (bit i equality) for i = 3, 2, 1, 0.',
            '(A = B) = x₃ x₂ x₁ x₀.',
            '(A > B) = A₃B₃\' + x₃A₂B₂\' + x₃x₂A₁B₁\' + x₃x₂x₁A₀B₀\'.',
            '(A < B) = A₃\'B₃ + x₃A₂\'B₂ + x₃x₂A₁\'B₁ + x₃x₂x₁A₀\'B₀.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c5-ex1',
          title: 'Evaluating a 2-Bit Magnitude Comparator',
          problemStatement: 'Evaluate the 2-bit comparator outputs for A = 10₂ and B = 11₂.',
          given: ['A₁ = 1, A₀ = 0', 'B₁ = 1, B₀ = 1'],
          required: 'Values of (A > B), (A = B), and (A < B)',
          formulaLatex: 'x_i = A_i \\odot B_i, \\quad (A < B) = A_1\'B_1 + x_1 A_0\'B_0',
          substitutionLatex: 'x_1 = (1 \\odot 1) = 1, \\quad x_0 = (0 \\odot 1) = 0',
          calculationSteps: [
            'Bit-pair equalities: x₁ = 1 (MSBs match), x₀ = 0 (LSBs differ).',
            '(A = B) = x₁ · x₀ = 1 · 0 = 0.',
            '(A > B) = A₁B₁\' + x₁A₀B₀\' = 1(0) + 1(0)(0) = 0.',
            '(A < B) = A₁\'B₁ + x₁A₀\'B₀ = 0(1) + 1(1)(1) = 1.'
          ],
          finalAnswer: '(A > B) = 0, (A = B) = 0, (A < B) = 1',
          interpretation: 'Since the MSBs tied (x₁ = 1), the LSB pair broke the tie (A₀=0 < B₀=1).'
        }
      ],
      formulas: [
        {
          id: 'f-u2-5',
          unitId: 'unit-2',
          chapterId: 'u2-c5',
          chapterTitle: 'Magnitude Comparators',
          name: 'n-Bit Equality & 2-Bit Inequality Equations',
          latex: '(A = B) = \\prod_{i=0}^{n-1} (A_i \\odot B_i), \\qquad (A > B)_{2\\text{-bit}} = A_1B_1\' + (A_1 \\odot B_1)A_0B_0\'',
          symbols: [
            { symbol: 'A_i, B_i', meaning: 'i-th bits of numbers A and B' },
            { symbol: '\\odot', meaning: 'XNOR bit-equality operator' }
          ],
          units: 'Boolean logic',
          conditions: 'Exactly one of the three outputs (>, =, <) is 1 for any input pair.',
          miniExample: '4-bit equality requires 4 XNOR gates feeding one 4-input AND gate.'
        }
      ],
      applications: [
        { area: 'Cache Tag Matching', detail: 'High-speed XNOR equality comparators check if a memory address tag matches a cache line tag in 1 clock cycle.' },
        { area: 'Digital Process Control', detail: 'Compares sensor ADC outputs against threshold setpoints.' }
      ],
      summary: [
        'A magnitude comparator generates three mutually exclusive outputs: A > B, A = B, and A < B.',
        'Equality uses XNOR on each bit pair followed by an AND gate.',
        'Inequality checks MSB first and falls back to lower bits only when higher bits are equal.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Magnitude Comparator', definition: 'Combinational circuit comparing two binary words to output >, =, or <.' }
        ],
        corePoints: [
          '1-bit comparator: A>B = AB\', A<B = A\'B, A=B = A⊙B.',
          'Always compare MSB-to-LSB using xᵢ = Aᵢ ⊙ Bᵢ.'
        ],
        examReminders: [
          'Double-check that for any input combination, the sum of outputs (A>B) + (A=B) + (A<B) equals 1.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c5-q1',
          question: 'Which logic gate is used to test equality of individual bit pairs Aᵢ and Bᵢ in a comparator?',
          options: ['XOR', 'XNOR', 'NAND', 'NOR'],
          correctIndex: 1,
          explanation: 'XNOR outputs 1 if and only if Aᵢ = Bᵢ.'
        },
        {
          id: 'u2-c5-q2',
          question: 'How many total input combinations exist in the truth table of a 2-bit magnitude comparator?',
          options: ['4', '8', '16', '32'],
          correctIndex: 2,
          explanation: 'Two 2-bit numbers give 4 total input bits → 2⁴ = 16 rows.'
        },
        {
          id: 'u2-c5-q3',
          question: 'In a 2-bit comparator, if A₁ = 1 and B₁ = 0, does the circuit need A₀ and B₀ to determine A > B?',
          options: ['Yes, always', 'No, A₁B₁\' = 1 immediately guarantees A > B', 'Only if A₀ = 0', 'Only in 1’s complement'],
          correctIndex: 1,
          explanation: 'Because MSB weight 2¹ dominates 2⁰, A₁=1 and B₁=0 makes A > B regardless of A₀, B₀.'
        }
      ]
    },
    {
      id: 'u2-c6',
      unitId: 'unit-2',
      chapterNumber: '2.6',
      title: 'Multiplexers (MUX) & Logic Function Implementation',
      syllabusTopic: 'Multiplexers',
      estimatedMinutes: 30,
      diagramType: 'multiplexer-4to1',
      diagramCaption: '4-to-1 Multiplexer internal AND-OR architecture with select lines S₁, S₀ and Enable input E.',
      introduction: {
        meaning:
          'A Multiplexer (MUX), or Data Selector, is a combinational circuit with 2ⁿ data inputs, n select lines, and 1 output that routes the selected input line to the output.',
        importance:
          'MUXes serve both as digital switches/parallel-to-serial converters AND as universal building blocks to implement any Boolean function without K-Map hardware.',
        whereUsed:
          'CPU register-file read ports, ALU output selection, FPGA Look-Up Tables (LUTs), and time-division multiplexing.',
        problemSolved:
          'Shares a single communication line or bus across multiple data sources and replaces discrete gate networks with a single IC.'
      },
      fundamentalConcept: {
        overview:
          'Think of a 2ⁿ:1 MUX as a digitally controlled rotary switch: the n-bit binary number on the select lines (Sₙ₋₁...S₀) selects which input Iₖ is connected to output Y.',
        terms: [
          { term: 'Data Inputs (I₀ ... I_{2ⁿ−1})', meaning: 'The 2ⁿ parallel input channels competing for the single output.' },
          { term: 'Select Lines (Sₙ₋₁ ... S₀)', meaning: 'Control bits determining which data input routes to Y.' },
          { term: 'MUX Expansion (Cascading)', meaning: 'Combining smaller MUXes (e.g., two 4:1 MUXes + one 2:1 MUX) to build a larger 8:1 MUX.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. 4-to-1 Multiplexer Function Table & Equation',
          table: {
            caption: '4:1 MUX Operation (Active-High Enable E = 1)',
            headers: ['S₁', 'S₀', 'Selected Input', 'Output Y'],
            rows: [
              ['0', '0', 'I₀', 'I₀'],
              ['0', '1', 'I₁', 'I₁'],
              ['1', '0', 'I₂', 'I₂'],
              ['1', '1', 'I₃', 'I₃']
            ]
          }
        },
        {
          heading: '2. Implementing an m-Variable Function Using a 2^(m−1):1 MUX',
          steps: [
            'Connect the (m − 1) lower variables (e.g., B, C, D) to the select lines of the MUX, leaving 1 variable (e.g., A) as the input-table variable.',
            'Create an implementation table with columns for each MUX input I₀ through I_{2^(m−1)−1}.',
            'Place A\'-minterms (0 to 2^(m−1)−1) in the top row and A-minterms (2^(m−1) to 2^m−1) in the bottom row.',
            'Circle the minterms present in F. For each column: neither circled → tie Iₖ to 0; both circled → tie Iₖ to 1; only top circled → tie Iₖ to A\'; only bottom circled → tie Iₖ to A.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c6-ex1',
          title: 'Implementing a 3-Variable Function Using a 4:1 MUX',
          problemStatement: 'Implement F(A, B, C) = Σm(1, 3, 5, 6) using a 4-to-1 Multiplexer with B and C connected to select lines S₁ and S₀.',
          given: ['F(A, B, C) = Σm(1, 3, 5, 6)', 'Select lines: S₁ = B, S₀ = C'],
          required: 'Connections for MUX data inputs I₀, I₁, I₂, I₃',
          formulaLatex: 'Y = S_1\'S_0\'I_0 + S_1\'S_0I_1 + S_1S_0\'I_2 + S_1S_0I_3',
          substitutionLatex: 'I_0: (0,4), \\; I_1: (1,5), \\; I_2: (2,6), \\; I_3: (3,7)',
          calculationSteps: [
            'Column I₀ (BC=00): Top=m₀(0), Bottom=m₄(4). Neither is in Σm(1,3,5,6) → I₀ = 0.',
            'Column I₁ (BC=01): Top=m₁(1), Bottom=m₅(5). Both are circled → I₁ = 1.',
            'Column I₂ (BC=10): Top=m₂(2), Bottom=m₆(6). Only bottom m₆ is circled → I₂ = A.',
            'Column I₃ (BC=11): Top=m₃(3), Bottom=m₇(7). Only top m₃ is circled → I₃ = A\'.'
          ],
          finalAnswer: 'Connect S₁=B, S₀=C, and I₀=0, I₁=1, I₂=A, I₃=A\'',
          interpretation: 'Any 3-variable Boolean function can be realized with just one 4:1 MUX and at most one inverter.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-6',
          unitId: 'unit-2',
          chapterId: 'u2-c6',
          chapterTitle: 'Multiplexers (MUX) & Logic Function Implementation',
          name: 'General 2ⁿ:1 Multiplexer Output Equation',
          latex: 'Y = E \\sum_{k=0}^{2^n - 1} m_k(S_{n-1}, \\dots, S_0) \\cdot I_k',
          symbols: [
            { symbol: 'n', meaning: 'Number of select lines' },
            { symbol: 'I_k', meaning: 'k-th data input channel' },
            { symbol: 'E', meaning: 'Active-high Enable signal' }
          ],
          units: 'Boolean logic',
          conditions: 'Requires 2ⁿ data lines for n select lines.',
          miniExample: 'For 2:1 MUX: Y = S\'I₀ + SI₁.'
        }
      ],
      applications: [
        { area: 'FPGA Architecture', detail: 'Modern FPGAs implement logic inside Look-Up Tables (LUTs), which are fundamentally SRAM-fed Multiplexers.' },
        { area: 'CPU Datapath', detail: 'Selects whether the ALU input comes from a register, an immediate constant, or the Program Counter.' }
      ],
      summary: [
        'A 2ⁿ:1 MUX routes one of 2ⁿ inputs to a single output using n select lines.',
        'Any n-variable function can be implemented with a 2ⁿ⁻¹:1 MUX (and one inverter) or directly with a 2ⁿ:1 MUX.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Multiplexer (MUX)', definition: 'Many-to-one data selector with 2ⁿ inputs, n select lines, and 1 output.' }
        ],
        corePoints: [
          '2:1 MUX: Y = S\'I₀ + SI₁.',
          '4:1 MUX uses 2 select lines; 8:1 MUX uses 3 select lines; 16:1 MUX uses 4 select lines.',
          '3-variable function → needs 4:1 MUX; 4-variable function → needs 8:1 MUX.'
        ],
        examReminders: [
          'Check which variable is left out for the data inputs—if you put A on MSB, the top row is 0..3 and bottom row is 4..7.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c6-q1',
          question: 'How many select lines are required for a 16-to-1 Multiplexer?',
          options: ['2', '3', '4', '8'],
          correctIndex: 2,
          explanation: 'Since 16 = 2⁴, a 16:1 MUX requires 4 select lines.'
        },
        {
          id: 'u2-c6-q2',
          question: 'Which size Multiplexer is sufficient to implement ANY 4-variable Boolean function using at most one inverter?',
          options: ['4:1 MUX', '8:1 MUX', '2:1 MUX', '32:1 MUX'],
          correctIndex: 1,
          explanation: 'Three variables drive the select lines of an 8:1 MUX (2³ = 8), and the 4th variable feeds the 8 data inputs.'
        },
        {
          id: 'u2-c6-q3',
          question: 'A Multiplexer is also commonly known as a:',
          options: ['Data Distributor', 'Data Selector', 'Priority Encoder', 'Code Converter'],
          correctIndex: 1,
          explanation: 'A MUX selects one of many inputs; a DEMUX distributes one input to many outputs.'
        }
      ]
    },
    {
      id: 'u2-c7',
      unitId: 'unit-2',
      chapterNumber: '2.7',
      title: 'De-multiplexers (DEMUX)',
      syllabusTopic: 'De-multiplexers',
      estimatedMinutes: 20,
      diagramType: 'demultiplexer-1to4',
      diagramCaption: '1-to-4 De-multiplexer routing single data input D_in to one of four outputs Y₀–Y₃ via S₁, S₀.',
      introduction: {
        meaning:
          'A De-multiplexer (DEMUX), or Data Distributor, performs the reverse operation of a multiplexer: it takes a single data input and routes it to one of 2ⁿ possible output lines based on n select lines.',
        importance:
          'Essential at the receiving end of time-division multiplexed communication channels and for distributing serial data to parallel registers.',
        whereUsed:
          'Serial-to-parallel receivers, memory chip-select routing, and LED matrix column/row scanning.',
        problemSolved:
          'Separates combined multiplexed streams back into their individual destination channels.'
      },
      fundamentalConcept: {
        overview:
          'A 1:2ⁿ DEMUX is structurally identical to an n-to-2ⁿ Decoder with an Enable line—the Decoder’s Enable input simply acts as the DEMUX’s Data input D_in!',
        terms: [
          { term: 'Data Distributor', meaning: 'Alternative name for a De-multiplexer (1 input → 2ⁿ outputs).' },
          { term: 'Unselected Outputs', meaning: 'All 2ⁿ − 1 outputs not chosen by the select lines remain at logic 0 (for active-high outputs).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. 1-to-4 De-multiplexer Truth Table & Equations',
          table: {
            caption: '1:4 DEMUX Output Routing',
            headers: ['S₁', 'S₀', 'Y₀', 'Y₁', 'Y₂', 'Y₃'],
            rows: [
              ['0', '0', 'D_in', '0', '0', '0'],
              ['0', '1', '0', 'D_in', '0', '0'],
              ['1', '0', '0', '0', 'D_in', '0'],
              ['1', '1', '0', '0', '0', 'D_in']
            ]
          }
        },
        {
          heading: '2. Output Equations',
          bullets: [
            'Y₀ = S₁\' · S₀\' · D_in',
            'Y₁ = S₁\' · S₀ · D_in',
            'Y₂ = S₁ · S₀\' · D_in',
            'Y₃ = S₁ · S₀ · D_in'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c7-ex1',
          title: 'Designing a 1-to-8 DEMUX from Two 1-to-4 DEMUXes',
          problemStatement: 'Show how to construct a 1-to-8 De-multiplexer using two 1-to-4 DEMUX ICs with active-high Enable (E) inputs.',
          given: ['Two 1:4 DEMUX blocks (select lines S₁, S₀, Data D, Enable E)', '3 total select lines A, B, C (A = MSB)'],
          required: 'Circuit interconnection for Y₀ through Y₇',
          formulaLatex: 'E_{top} = A\', \\quad E_{bottom} = A',
          substitutionLatex: 'S_1 = B, \\; S_0 = C, \\; D_{in} \\to \\text{both DEMUXes}',
          calculationSteps: [
            'Connect common data input D_in to the data pin of both 1:4 DEMUXes.',
            'Connect lower select bits B and C to S₁ and S₀ of both 1:4 DEMUXes.',
            'Connect MSB select line A through an inverter (A\') to Enable E₁ of the top DEMUX (outputs Y₀–Y₃).',
            'Connect A directly to Enable E₂ of the bottom DEMUX (outputs Y₄–Y₇).'
          ],
          finalAnswer: 'A=0 enables Y₀–Y₃; A=1 enables Y₄–Y₇',
          interpretation: 'MSB acts as the bank-enable selector, scaling 1:4 DEMUXes cleanly to 1:8.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-7',
          unitId: 'unit-2',
          chapterId: 'u2-c7',
          chapterTitle: 'De-multiplexers (DEMUX)',
          name: '1:2ⁿ DEMUX Output Equation',
          latex: 'Y_k = m_k(S_{n-1}, \\dots, S_0) \\cdot D_{in} \\quad \\text{for } k = 0, 1, \\dots, 2^n - 1',
          symbols: [
            { symbol: 'D_in', meaning: 'Single serial data input' },
            { symbol: 'm_k', meaning: 'k-th minterm of the select lines' }
          ],
          units: 'Boolean logic',
          conditions: 'Assumes active-high outputs and active-high data.',
          miniExample: 'In a 1:4 DEMUX, if S₁S₀ = 10 and D_in = 1, then Y₂ = 1 and Y₀=Y₁=Y₃=0.'
        }
      ],
      applications: [
        { area: 'Communication Demultiplexing', detail: 'Pairs with a MUX over a single wire to separate interleaved voice/data streams.' },
        { area: 'ALU Destination Routing', detail: 'Routes computed results to the selected target register.' }
      ],
      summary: [
        'A 1:2ⁿ DEMUX sends 1 input to 1 of 2ⁿ outputs selected by n select lines.',
        'A Decoder with an Enable pin functions identically to a DEMUX when Enable is used as the Data input.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'De-multiplexer', definition: 'One-to-many data distributor (1 input, n select lines, 2ⁿ outputs).' }
        ],
        corePoints: [
          'MUX = Many-to-1; DEMUX = 1-to-Many.',
          'Decoder with Enable = DEMUX.'
        ],
        examReminders: [
          'State clearly that unselected outputs stay 0 (for active-high) or 1 (for active-low) rather than floating.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c7-q1',
          question: 'A 1-to-8 De-multiplexer has how many select lines?',
          options: ['2', '3', '4', '8'],
          correctIndex: 1,
          explanation: '8 outputs = 2³ → 3 select lines.'
        },
        {
          id: 'u2-c7-q2',
          question: 'Which combinational block directly acts as a 1-to-4 De-multiplexer when its Enable pin is driven by Data?',
          options: ['4:2 Encoder', '2-to-4 Decoder', 'Full Adder', '2-bit Comparator'],
          correctIndex: 1,
          explanation: 'A 2-to-4 Decoder with Enable generates the exact 4 minterm-gated outputs Yₖ = mₖ · E.'
        },
        {
          id: 'u2-c7-q3',
          question: 'In a 1-to-4 active-high DEMUX with S₁=1, S₀=1 and D_in=0, what are the outputs (Y₃Y₂Y₁Y₀)?',
          options: ['1000', '0000', '0111', '0001'],
          correctIndex: 1,
          explanation: 'Y₃ receives D_in = 0, and unselected outputs Y₂, Y₁, Y₀ are also 0, so all outputs are 0000.'
        }
      ]
    },
    {
      id: 'u2-c8',
      unitId: 'unit-2',
      chapterNumber: '2.8',
      title: 'Encoders, Priority Encoders & Decoders',
      syllabusTopic: 'Encoders and Decoders',
      estimatedMinutes: 30,
      diagramType: 'encoder-decoder',
      diagramCaption: '3-to-8 Binary Decoder (with Enable) and 4-to-2 Priority Encoder with Valid (V) indicator.',
      introduction: {
        meaning:
          'Decoders convert an n-bit binary code into up to 2ⁿ distinct output lines (minterms), while Encoders perform the inverse operation—compressing 2ⁿ active input lines into an n-bit binary code.',
        importance:
          'Decoders activate the exact memory word or I/O port matching a binary address; Priority Encoders resolve simultaneous hardware interrupt requests.',
        whereUsed:
          'RAM address decoding, 7-segment display drivers, keyboard matrix encoding, and CPU interrupt controllers.',
        problemSolved:
          'Translates between compact binary codes used inside processors and one-hot control lines required by physical devices.'
      },
      fundamentalConcept: {
        overview:
          'A standard 2ⁿ-to-n encoder breaks if two inputs go HIGH simultaneously. A Priority Encoder solves this by assigning strict priority (usually highest index wins) and adding a Valid (V) bit to distinguish "input 0 active" from "no input active".',
        terms: [
          { term: 'n-to-2ⁿ Decoder', meaning: 'Asserts the single output Dₖ corresponding to the n-bit input code (produces all 2ⁿ minterms).' },
          { term: 'Encoder (2ⁿ-to-n)', meaning: 'Generates the n-bit binary index of whichever single input line is active.' },
          { term: 'Priority Encoder', meaning: 'An encoder that resolves multiple simultaneous active inputs by outputting the binary code of the highest-priority active input.' },
          { term: 'Valid Bit (V)', meaning: 'Output flag in a Priority Encoder that is 1 if at least one input is active, and 0 when all inputs are inactive.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. 4-to-2 Priority Encoder Truth Table (D₃ Highest Priority)',
          table: {
            caption: '4-to-2 Priority Encoder (D₃ > D₂ > D₁ > D₀)',
            headers: ['D₃', 'D₂', 'D₁', 'D₀', 'Y₁', 'Y₀', 'Valid (V)'],
            rows: [
              ['0', '0', '0', '0', 'X', 'X', '0'],
              ['0', '0', '0', '1', '0', '0', '1'],
              ['0', '0', '1', 'X', '0', '1', '1'],
              ['0', '1', 'X', 'X', '1', '0', '1'],
              ['1', 'X', 'X', 'X', '1', '1', '1']
            ]
          }
        },
        {
          heading: '2. Implementing Any Boolean Function Using a Decoder',
          bullets: [
            'An n-to-2ⁿ active-high Decoder produces all 2ⁿ minterms m₀, m₁, ..., m_{2ⁿ−1}.',
            'Therefore, any n-variable function F = Σm(...) is implemented simply by connecting the corresponding decoder outputs into an external OR gate (or NAND gate if the decoder has active-low outputs!).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u2-c8-ex1',
          title: 'Implementing a Full Adder Using a 3-to-8 Decoder',
          problemStatement: 'Implement the Sum (S) and Carry (C_out) of a Full Adder using a 3-to-8 Decoder and OR gates.',
          given: ['Inputs A, B, C_in connected to Decoder select lines A₂, A₁, A₀', 'S = Σm(1, 2, 4, 7)', 'C_out = Σm(3, 5, 6, 7)'],
          required: 'Decoder output connections for S and C_out',
          formulaLatex: 'S(A,B,C_{in}) = \\sum m(1, 2, 4, 7), \\quad C_{out}(A,B,C_{in}) = \\sum m(3, 5, 6, 7)',
          substitutionLatex: 'S = D_1 + D_2 + D_4 + D_7, \\quad C_{out} = D_3 + D_5 + D_6 + D_7',
          calculationSteps: [
            'Feed A, B, C_in into the 3 inputs of the 3-to-8 Decoder (outputs D₀ to D₇).',
            'Connect decoder outputs D₁, D₂, D₄, D₇ to a 4-input OR gate to produce Sum S.',
            'Connect decoder outputs D₃, D₅, D₆, D₇ to a second 4-input OR gate to produce Carry C_out.'
          ],
          finalAnswer: 'One 3-to-8 Decoder + two 4-input OR gates implement a complete Full Adder',
          interpretation: 'Notice how multi-output functions share the exact same decoder, making decoders very efficient for multiple outputs.'
        }
      ],
      formulas: [
        {
          id: 'f-u2-8',
          unitId: 'unit-2',
          chapterId: 'u2-c8',
          chapterTitle: 'Encoders, Priority Encoders & Decoders',
          name: '4-to-2 Priority Encoder Equations (D₃ Highest Priority)',
          latex: 'Y_1 = D_3 + D_2, \\qquad Y_0 = D_3 + D_2\'D_1, \\qquad V = D_3 + D_2 + D_1 + D_0',
          symbols: [
            { symbol: 'D_0..D_3', meaning: 'Active-high request inputs (D₃ highest priority)' },
            { symbol: 'Y_1, Y_0', meaning: 'Encoded 2-bit binary output' },
            { symbol: 'V', meaning: 'Valid output indicator' }
          ],
          units: 'Boolean logic',
          conditions: 'Valid when D₃ > D₂ > D₁ > D₀.',
          miniExample: 'If D₃=0, D₂=1, D₁=1, D₀=1 → Y₁ = 1, Y₀ = 0 (outputs 10₂ for D₂).'
        }
      ],
      applications: [
        { area: 'Memory Address Decoding', detail: 'Decodes upper address bits to assert Chip Select (CS) on the correct RAM/ROM bank.' },
        { area: 'Interrupt Priority Controllers', detail: 'Priority encoders select the highest-priority IRQ line when multiple peripherals interrupt the CPU simultaneously.' }
      ],
      summary: [
        'Decoder converts n inputs to 2ⁿ minterm outputs; Encoder converts 2ⁿ inputs to an n-bit code.',
        'Priority Encoders resolve simultaneous active inputs and include a Valid (V) output.',
        'An n-to-2ⁿ Decoder + external OR gates can implement any multi-output n-variable Boolean function.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Decoder', definition: 'n-to-2ⁿ circuit generating all minterms of its n inputs.' },
          { term: 'Priority Encoder', definition: 'Outputs binary code of the highest-priority active input, plus a Valid flag V.' }
        ],
        corePoints: [
          'Active-high decoder + OR gate = SOP.',
          'Active-low decoder (74138) + NAND gate = SOP.',
          '8-to-3 Octal-to-Binary encoder: Y₂ = D₄+D₅+D₆+D₇, Y₁ = D₂+D₃+D₆+D₇, Y₀ = D₁+D₃+D₅+D₇.'
        ],
        examReminders: [
          'For active-low decoders (bubble on outputs), use NAND gates instead of OR gates to realize Σm functions.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u2-c8-q1',
          question: 'In a 4-to-2 Priority Encoder (D₃ highest priority), what is the output Y₁Y₀V when inputs D₃D₂D₁D₀ = 0101?',
          options: ['001', '101', '111', '011'],
          correctIndex: 1,
          explanation: 'D₂ has higher priority than D₀, so the encoder outputs binary 2 (Y₁Y₀ = 10) with V = 1 → 101.'
        },
        {
          id: 'u2-c8-q2',
          question: 'To implement F(A, B, C) = Σm(0, 2, 5) using an active-low 3-to-8 Decoder (outputs D₀\'..D₇\'), which external gate should combine D₀\', D₂\', D₅\'?',
          options: ['OR gate', 'AND gate', 'NAND gate', 'XOR gate'],
          correctIndex: 2,
          explanation: 'By De Morgan, (m₀\' · m₂\' · m₅\')\' = m₀ + m₂ + m₅, so an external NAND gate produces F.'
        },
        {
          id: 'u2-c8-q3',
          question: 'How many output lines does a 4-to-16 Decoder have?',
          options: ['4', '8', '16', '32'],
          correctIndex: 2,
          explanation: 'An n-to-2ⁿ decoder with n = 4 has 2⁴ = 16 output lines.'
        }
      ]
    }
  ]
};

export const UNIT_2_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-u2-1',
    unitId: 'unit-2',
    chapterId: 'u2-c1',
    topicName: 'K-Map Minimization',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Define Prime Implicant and Essential Prime Implicant in the context of a Karnaugh Map.',
    answerSections: [
      {
        bullets: [
          'Prime Implicant (PI): A maximal valid power-of-2 group of 1-cells in a K-Map that cannot be enclosed within any larger valid group.',
          'Essential Prime Implicant (EPI): A Prime Implicant that covers at least one 1-cell (minterm) not covered by any other Prime Implicant; every minimal SOP expression must include all EPIs.'
        ]
      }
    ]
  },
  {
    id: 'eq-u2-2',
    unitId: 'unit-2',
    chapterId: 'u2-c3',
    topicName: 'Half Adder & Full Adder',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Write the Boolean expressions for Sum and Carry of a Half Adder and a Full Adder.',
    answerSections: [
      {
        latex: [
          '\\text{Half Adder: } S = A \\oplus B, \\quad C = A \\cdot B',
          '\\text{Full Adder: } S = A \\oplus B \\oplus C_{in}, \\quad C_{out} = AB + BC_{in} + AC_{in}'
        ]
      }
    ]
  },
  {
    id: 'eq-u2-3',
    unitId: 'unit-2',
    chapterId: 'u2-c6',
    topicName: 'Multiplexers & De-multiplexers',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Compare a Multiplexer and a De-multiplexer.',
    answerSections: [
      {
        bullets: [
          'Multiplexer (MUX): Many-to-one data selector with 2ⁿ data inputs, n select lines, and 1 output.',
          'De-multiplexer (DEMUX): One-to-many data distributor with 1 data input, n select lines, and 2ⁿ outputs.'
        ]
      }
    ]
  },
  {
    id: 'eq-u2-4',
    unitId: 'unit-2',
    chapterId: 'u2-c6',
    topicName: 'MUX Function Implementation',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Implement the Boolean function F(A, B, C, D) = Σm(0, 1, 3, 4, 8, 9, 15) using an 8-to-1 Multiplexer.',
    answerSections: [
      {
        heading: '1. Select Line Assignment',
        paragraphs: ['Choose B, C, D as select lines S₂, S₁, S₀ and A as the data-input variable.']
      },
      {
        heading: '2. Implementation Table Analysis (I₀ through I₇)',
        bullets: [
          'I₀ (0, 8): both 0 and 8 are present → I₀ = 1.',
          'I₁ (1, 9): both 1 and 9 are present → I₁ = 1.',
          'I₂ (2, 10): neither present → I₂ = 0.',
          'I₃ (3, 11): only 3 (A\') present → I₃ = A\'.',
          'I₄ (4, 12): only 4 (A\') present → I₄ = A\'.',
          'I₅ (5, 13): neither present → I₅ = 0.',
          'I₆ (6, 14): neither present → I₆ = 0.',
          'I₇ (7, 15): only 15 (A) present → I₇ = A.'
        ]
      }
    ]
  },
  {
    id: 'eq-u2-5',
    unitId: 'unit-2',
    chapterId: 'u2-c5',
    topicName: 'Magnitude Comparator',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Design a 2-bit Magnitude Comparator with neat Boolean expressions for A > B, A = B, and A < B.',
    answerSections: [
      {
        heading: '1. Bitwise Equality Terms',
        latex: ['x_1 = A_1B_1 + A_1\'B_1\', \\qquad x_0 = A_0B_0 + A_0\'B_0\'']
      },
      {
        heading: '2. Final Output Equations',
        latex: [
          '(A = B) = x_1 x_0',
          '(A > B) = A_1B_1\' + x_1 A_0 B_0\'',
          '(A < B) = A_1\'B_1 + x_1 A_0\' B_0'
        ]
      }
    ]
  },
  {
    id: 'eq-u2-6',
    unitId: 'unit-2',
    chapterId: 'u2-c2',
    topicName: 'Quine–McCluskey Tabular Method',
    marks: 'long-answer',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Minimize the Boolean function F(A, B, C, D) = Σm(0, 1, 2, 5, 6, 7, 8, 9, 10, 14) using the Quine–McCluskey (Tabulation) method and verify the result using a 4-variable K-Map.',
    answerSections: [
      {
        heading: 'Phase 1: Grouping by Number of 1s & Merging',
        bullets: [
          'Group 0: m₀ (0000); Group 1: m₁(0001), m₂(0010), m₈(1000); Group 2: m₅(0101), m₆(0110), m₉(1001), m₁₀(1010); Group 3: m₇(0111), m₁₄(1110).',
          'Pass 2 Quads: (0,1,8,9) = –00– (B\'C\'), (0,2,8,10) = –0–0 (B\'D\'), (2,6,10,14) = ––10 (CD\').',
          'Remaining unchecked pairs: (1,5) = A\'C\'D, (5,7) = A\'BD, (6,7) = A\'BC.'
        ]
      },
      {
        heading: 'Phase 2: Prime Implicant Chart & Minimal Cover',
        paragraphs: [
          'Essential Prime Implicants: B\'C\' (sole cover for m₉) and CD\' (sole cover for m₁₄). Together they cover {0, 1, 2, 6, 8, 9, 10, 14}.',
          'The remaining uncovered minterms {5, 7} are both covered by the single PI (5,7) = A\'BD.'
        ],
        latex: ['F(A,B,C,D) = B\'C\' + CD\' + A\'BD']
      }
    ]
  }
];

export const UNIT_2_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-u2-1',
    unitId: 'unit-2',
    chapterId: 'u2-c1',
    format: 'mcq',
    prompt: 'In a 4-variable K-Map, a group of 4 adjacent 1s (a quad) eliminates how many variables?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '2',
    explanation: 'Since 4 = 2², a quad eliminates 2 variables, leaving 4 − 2 = 2 literals.'
  },
  {
    id: 'qz-u2-2',
    unitId: 'unit-2',
    chapterId: 'u2-c3',
    format: 'numerical',
    prompt: 'How many 2-input AND gates are required to construct a Full Adder using two Half Adders and an OR gate?',
    correctAnswer: '2',
    tolerance: 0,
    explanation: 'Each Half Adder uses 1 XOR gate and 1 AND gate, so 2 Half Adders use 2 AND gates total.'
  },
  {
    id: 'qz-u2-3',
    unitId: 'unit-2',
    chapterId: 'u2-c4',
    format: 'true-false',
    prompt: 'True or False: In a 4-bit Adder–Subtractor using XOR gates, setting Mode M = 1 converts the circuit into a 2’s complement subtractor.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'M = 1 complements every bit of B via XOR and sets C₀ = 1 to add 1, computing A + B\' + 1 = A − B.'
  },
  {
    id: 'qz-u2-4',
    unitId: 'unit-2',
    chapterId: 'u2-c6',
    format: 'fill-blank',
    prompt: 'An 8-to-1 Multiplexer requires ____ select lines.',
    correctAnswer: '3',
    explanation: '2³ = 8, so 3 select lines are required.'
  },
  {
    id: 'qz-u2-5',
    unitId: 'unit-2',
    chapterId: 'u2-c8',
    format: 'mcq',
    prompt: 'In a 4-to-2 Priority Encoder (D₃ highest priority), what is the Valid output V when all four inputs D₃D₂D₁D₀ = 0000?',
    options: ['1', '0', 'X (don’t care)', 'Depends on Y₀'],
    correctAnswer: '0',
    explanation: 'V = D₃ + D₂ + D₁ + D₀ = 0 when no input is active, preventing confusion with D₀ = 1 (output 00).'
  }
];
