import { Unit, ExamQuestion, QuizQuestion } from '../types/academic';

export const UNIT_3: Unit = {
  id: 'unit-3',
  number: 'Unit III',
  title: 'Sequential Circuits',
  syllabusExactText:
    'Sequential circuits: Basic Architectural Distinctions between Combinational and Sequential circuits, SR Latch, Flip Flops: SR, JK, JK Master Slave, D and T Type Flip Flops. Excitation Table of all Flip Flops, Conversion from one type of Flip-Flop to another.',
  description:
    'Combinational vs sequential architecture, NOR/NAND SR latches, clocked SR, D, JK, JK Master–Slave, and T flip-flops, excitation tables, and systematic flip-flop conversion.',
  chapters: [
    {
      id: 'u3-c1',
      unitId: 'unit-3',
      chapterNumber: '3.1',
      title: 'Combinational vs. Sequential Circuit Architecture',
      syllabusTopic: 'Basic Architectural Distinctions between Combinational and Sequential circuits',
      estimatedMinutes: 20,
      diagramType: 'comb-vs-seq',
      diagramCaption: 'Structural block diagram comparing memoryless Combinational logic against feedback-driven Sequential circuits with Clocked Memory.',
      introduction: {
        meaning:
          'Digital systems divide into Combinational circuits (whose outputs depend solely on present inputs) and Sequential circuits (whose outputs depend on both present inputs and past history stored in memory).',
        importance:
          'Without sequential memory and synchronization, computers could not store instructions, count clock ticks, or execute multi-step programs.',
        whereUsed:
          'CPU registers, finite state machines (FSMs), counters, shift registers, and traffic light controllers.',
        problemSolved:
          'Gives digital hardware the ability to remember past events and step through ordered sequences reliably.'
      },
      fundamentalConcept: {
        overview:
          'A sequential circuit consists of a combinational logic block paired with a memory block connected via a feedback loop. The stored bits define the circuit’s Present State Q(t), which combines with external inputs to determine both external outputs and the Next State Q(t + 1).',
        terms: [
          { term: 'Present State Q(t)', meaning: 'Binary values currently stored in the memory elements before the next clock transition.' },
          { term: 'Next State Q(t + 1)', meaning: 'Binary values that will be stored immediately after the active clock event.' },
          { term: 'Synchronous Sequential Circuit', meaning: 'State transitions happen only at discrete instants controlled by a global Clock (CLK) signal.' },
          { term: 'Asynchronous Sequential Circuit', meaning: 'State changes immediately whenever inputs change, without a clock pulse (prone to race hazards).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Architectural Comparison Table',
          table: {
            caption: 'Combinational Circuits vs. Sequential Circuits',
            headers: ['Feature', 'Combinational Circuits', 'Sequential Circuits'],
            rows: [
              ['Output Dependency', 'Present inputs only', 'Present inputs + Past outputs (Present State)'],
              ['Memory Elements', 'None (memoryless)', 'Yes (Latches or Flip-Flops)'],
              ['Feedback Path', 'No feedback', 'Feedback from memory outputs back to combinational inputs'],
              ['Clock Signal', 'Not required', 'Required for Synchronous circuits'],
              ['Design Tools', 'Truth Table, Boolean Algebra, K-Map', 'State Table, State Diagram, Excitation Table'],
              ['Examples', 'Adders, MUX, Decoder, Comparator', 'Flip-Flops, Counters, Shift Registers, FSMs']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u3-c1-ex1',
          title: 'Identifying Circuit Type & State Capacity',
          problemStatement: 'A synchronous sequential controller uses 4 D-type flip-flops and 3 external input lines. How many distinct internal states can the circuit represent, and how many rows are in its state table?',
          given: ['Number of flip-flops k = 4', 'External inputs m = 3'],
          required: 'Maximum states and state-table row count',
          formulaLatex: 'N_{states} = 2^k, \\qquad \\text{Rows} = 2^{k + m}',
          substitutionLatex: 'N_{states} = 2^4, \\quad \\text{Rows} = 2^{4 + 3}',
          calculationSteps: [
            'Each flip-flop stores 1 bit, so 4 flip-flops can encode 2⁴ = 16 unique binary states.',
            'Each state can occur with any of the 2³ = 8 external input combinations.',
            'Total rows in the complete state transition table = 16 × 8 = 2⁷ = 128 rows.'
          ],
          finalAnswer: '16 distinct states; 128 state-table rows',
          interpretation: 'Adding just 1 flip-flop doubles the state capacity of a sequential machine.'
        }
      ],
      formulas: [
        {
          id: 'f-u3-1',
          unitId: 'unit-3',
          chapterId: 'u3-c1',
          chapterTitle: 'Combinational vs. Sequential Circuit Architecture',
          name: 'Sequential State Capacity & Next-State Function',
          latex: 'N_{\\text{states}} \\le 2^k, \\qquad Q(t+1) = f(X(t), Q(t))',
          symbols: [
            { symbol: 'k', meaning: 'Number of 1-bit flip-flops in memory block' },
            { symbol: 'X(t)', meaning: 'External input vector at time t' },
            { symbol: 'Q(t)', meaning: 'Present state vector stored in flip-flops' }
          ],
          units: 'States / Boolean vector',
          conditions: 'Synchronous circuits update Q(t+1) only at the active clock edge.',
          miniExample: 'A Mod-10 decade counter needs at least k = 4 flip-flops since 2³ = 8 < 10 ≤ 2⁴ = 16.'
        }
      ],
      applications: [
        { area: 'CPU Control Unit', detail: 'Hardwired and microprogrammed control units are synchronous sequential machines stepping through Fetch, Decode, and Execute.' }
      ],
      summary: [
        'Combinational circuits have no memory or feedback; Sequential circuits combine combinational logic with memory and feedback.',
        'Synchronous systems use a shared clock for predictable timing; Asynchronous systems react continuously to input changes.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Combinational', definition: 'Output = f(Present Inputs); no memory, no clock.' },
          { term: 'Sequential', definition: 'Output = f(Present Inputs, Present State); has memory and feedback.' }
        ],
        corePoints: [
          'k flip-flops hold up to 2ᵏ states.',
          'Latch = level-sensitive; Flip-Flop = edge-triggered.'
        ],
        examReminders: [
          'Include a neat block diagram showing Combinational Logic + Memory Elements + Feedback Loop whenever asked for architectural distinctions.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c1-q1',
          question: 'Which statement accurately distinguishes a sequential circuit from a combinational circuit?',
          options: ['Sequential circuits never use AND/OR gates', 'Sequential circuits contain memory elements and feedback paths', 'Combinational circuits require a clock signal', 'Sequential circuit outputs depend only on present inputs'],
          correctIndex: 1,
          explanation: 'Memory elements + feedback allow sequential outputs to depend on past history as well as present inputs.'
        },
        {
          id: 'u3-c1-q2',
          question: 'Minimum number of flip-flops needed to design a sequential circuit with 12 distinct states:',
          options: ['3', '4', '6', '12'],
          correctIndex: 1,
          explanation: '2³ = 8 is insufficient; 2⁴ = 16 ≥ 12, so 4 flip-flops are required.'
        },
        {
          id: 'u3-c1-q3',
          question: 'A synchronous sequential circuit changes state:',
          options: ['Whenever any input changes', 'Only at active transitions of a clock signal', 'Only at power-on', 'Without memory'],
          correctIndex: 1,
          explanation: 'Synchronous sequential circuits are synchronized by a periodic clock pulse.'
        }
      ]
    },
    {
      id: 'u3-c2',
      unitId: 'unit-3',
      chapterNumber: '3.2',
      title: 'SR Latch (NOR-Based, NAND-Based & Gated SR Latch)',
      syllabusTopic: 'SR Latch',
      estimatedMinutes: 25,
      diagramType: 'sr-latch-nor-nand',
      diagramCaption: 'Cross-coupled NOR SR Latch (active-high S, R) and cross-coupled NAND S\'R\' Latch (active-low).',
      introduction: {
        meaning:
          'An SR (Set–Reset) Latch is the simplest 1-bit bistable storage element built from two cross-coupled NOR or NAND gates.',
        importance:
          'Every flip-flop and SRAM cell is built on top of a cross-coupled bistable latch.',
        whereUsed:
          'Switch debouncing circuits, basic level-sensitive transparent storage, and the internal core of flip-flops.',
        problemSolved:
          'Holds 1 bit of binary state (Q = 0 or Q = 1) indefinitely until an explicit Set or Reset pulse changes it.'
      },
      fundamentalConcept: {
        overview:
          'Because the output of Gate 1 feeds the input of Gate 2 and vice versa, the circuit locks into one of two stable complementary states (Q = 1, Q\' = 0 or Q = 0, Q\' = 1).',
        terms: [
          { term: 'Set (S = 1)', meaning: 'Forces stored output Q to 1 (and Q\' to 0).' },
          { term: 'Reset (R = 1)', meaning: 'Forces stored output Q to 0 (and Q\' to 1).' },
          { term: 'Hold / Memory State', meaning: 'When inactive (S=0, R=0 for NOR latch), outputs retain their prior value.' },
          { term: 'Forbidden / Invalid State', meaning: 'In a NOR SR latch, S = 1 and R = 1 forces both Q and Q\' to 0, violating Q\' = NOT(Q); releasing both together causes an unpredictable race.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. NOR SR Latch vs. NAND S\'R\' Latch Truth Tables',
          table: {
            caption: 'Function Table of Active-High NOR SR Latch',
            headers: ['S', 'R', 'Q(t+1)', 'Q\'(t+1)', 'Operating Mode'],
            rows: [
              ['0', '0', 'Q(t)', 'Q\'(t)', 'Hold (No Change)'],
              ['0', '1', '0', '1', 'Reset'],
              ['1', '0', '1', '0', 'Set'],
              ['1', '1', '0', '0', 'Forbidden / Invalid (Q = Q\' = 0)']
            ]
          }
        },
        {
          heading: '2. Gated (Enabled) SR Latch',
          bullets: [
            'Adding two AND gates (or NAND gates) controlled by an Enable/Control input C gates S and R.',
            'When C = 0: inputs S and R are blocked, so the latch stays locked in Hold mode.',
            'When C = 1: the latch becomes transparent and responds immediately to changes in S and R.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u3-c2-ex1',
          title: 'Tracing a NOR SR Latch Input Sequence',
          problemStatement: 'An active-high NOR SR latch starts in Reset state (Q = 0, Q\' = 1). Trace Q across the input sequence (S,R): (1,0) → (0,0) → (0,1) → (0,0) → (1,1).',
          given: ['Initial state: Q = 0, Q\' = 1', 'NOR SR Latch'],
          required: 'Output (Q, Q\') after each step',
          formulaLatex: 'Q = \\overline{R + Q\'}, \\qquad Q\' = \\overline{S + Q}',
          substitutionLatex: '\\text{Apply } (S, R) \\text{ sequentially}',
          calculationSteps: [
            'Step 1 (S=1, R=0): Set mode → Q\' = (1 + 0)\' = 0; Q = (0 + 0)\' = 1 → (1, 0).',
            'Step 2 (S=0, R=0): Hold mode → retains Q = 1, Q\' = 0.',
            'Step 3 (S=0, R=1): Reset mode → Q = (1 + 0)\' = 0; Q\' = (0 + 0)\' = 1 → (0, 1).',
            'Step 4 (S=0, R=0): Hold mode → retains Q = 0, Q\' = 1.',
            'Step 5 (S=1, R=1): Forbidden → Q = (1+1)\'=0 and Q\' = (1+0)\'=0 → (0, 0).'
          ],
          finalAnswer: '(1,0) → (1,0) → (0,1) → (0,1) → (0,0 invalid)',
          interpretation: 'Notice that (0,0) remembers whether the last active input was Set or Reset!'
        }
      ],
      formulas: [
        {
          id: 'f-u3-2',
          unitId: 'unit-3',
          chapterId: 'u3-c2',
          chapterTitle: 'SR Latch (NOR-Based, NAND-Based & Gated SR Latch)',
          name: 'SR Latch Characteristic Equation',
          latex: 'Q(t+1) = S + R\'Q(t), \\qquad \\text{with constraint } S \\cdot R = 0',
          symbols: [
            { symbol: 'S, R', meaning: 'Set and Reset inputs' },
            { symbol: 'Q(t), Q(t+1)', meaning: 'Present and next state outputs' }
          ],
          units: 'Boolean logic',
          conditions: 'Valid when S = R = 1 is prohibited (SR = 0).',
          miniExample: 'If S=0, R=0, Q(t)=1: Q(t+1) = 0 + 1·1 = 1 (Hold).'
        }
      ],
      applications: [
        { area: 'Mechanical Switch Debouncer', detail: 'An SPDT toggle switch connected to an S\'R\' NAND latch completely removes mechanical contact bounce.' }
      ],
      summary: [
        'NOR SR latch is active-high (Hold at 00, Forbidden at 11); bare NAND S\'R\' latch is active-low (Hold at 11, Forbidden at 00).',
        'A Gated SR latch adds an Enable input C to block input changes when C = 0.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Latch', definition: 'Level-sensitive bistable memory element.' },
          { term: 'Forbidden State', definition: 'S = R = 1 in NOR SR latch where Q = Q\' = 0.' }
        ],
        corePoints: [
          'NOR SR: 00 = Hold, 01 = Reset, 10 = Set, 11 = Invalid.',
          'NAND S\'R\': 11 = Hold, 10 = Reset, 01 = Set, 00 = Invalid.'
        ],
        examReminders: [
          'Always specify whether your SR latch diagram uses NOR gates (active-high S, R) or bare NAND gates (active-low S\', R\').'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c2-q1',
          question: 'In an active-high NOR SR latch, which input combination represents the Hold (No Change) state?',
          options: ['S = 0, R = 0', 'S = 0, R = 1', 'S = 1, R = 0', 'S = 1, R = 1'],
          correctIndex: 0,
          explanation: 'With S = 0 and R = 0, cross-coupled NOR gates act as back-to-back inverters, preserving Q.'
        },
        {
          id: 'u3-c2-q2',
          question: 'In a bare cross-coupled NAND latch (inputs S\', R\'), the invalid state (both Q = 1 and Q\' = 1) occurs when:',
          options: ['S\' = 1, R\' = 1', 'S\' = 0, R\' = 0', 'S\' = 1, R\' = 0', 'S\' = 0, R\' = 1'],
          correctIndex: 1,
          explanation: 'Any 0 into a NAND gate forces output 1, so S\'=0 and R\'=0 forces both Q and Q\' to 1.'
        },
        {
          id: 'u3-c2-q3',
          question: 'How does a Latch differ from a Flip-Flop?',
          options: ['A latch is edge-triggered; a flip-flop is level-sensitive', 'A latch is level-sensitive; a flip-flop is edge-triggered', 'Latches cannot store 1 bit', 'Flip-flops have no feedback'],
          correctIndex: 1,
          explanation: 'Latches stay transparent during an active clock/enable level; flip-flops sample inputs only at a rising or falling clock edge.'
        }
      ]
    },
    {
      id: 'u3-c3',
      unitId: 'unit-3',
      chapterNumber: '3.3',
      title: 'SR & D Type Flip-Flops',
      syllabusTopic: 'Flip Flops: SR, D Type Flip Flops',
      estimatedMinutes: 25,
      diagramType: 'sr-d-flipflop',
      diagramCaption: 'Clocked edge-triggered SR Flip-Flop and D (Data/Delay) Flip-Flop showing elimination of the invalid state.',
      introduction: {
        meaning:
          'Flip-flops are edge-triggered synchronous bistable devices. The SR Flip-Flop adds clock-edge control to an SR latch, while the D Flip-Flop ties R = S\' so it stores a single Data bit cleanly without any forbidden state.',
        importance:
          'The D Flip-Flop is the universal workhorse of modern digital hardware—almost every CPU register, pipeline stage, and shift register is built from D Flip-Flops.',
        whereUsed:
          'Parallel data registers, pipeline latches, shift registers, and synchronous state machines.',
        problemSolved:
          'Edge-triggering prevents continuous input transparency during a clock HIGH period, and the D input completely eliminates the SR forbidden state.'
      },
      fundamentalConcept: {
        overview:
          'An edge-detector (or master-slave pairing) restricts state updates to the exact rising (↑) or falling (↓) clock edge. Connecting an inverter between S and R creates the D (Data/Delay) Flip-Flop: whatever logic level sits at D right before the clock edge becomes Q right after the edge.',
        terms: [
          { term: 'Edge Triggering', meaning: 'Flip-flop samples inputs only during a rising (0→1) or falling (1→0) clock transition.' },
          { term: 'D Flip-Flop', meaning: 'Single-input Data/Delay flip-flop where Q(t+1) = D.' },
          { term: 'Setup & Hold Time', meaning: 'Setup time (t_su) is how long D must be stable BEFORE the clock edge; Hold time (t_h) is how long D must stay stable AFTER the clock edge.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Characteristic Tables of Clocked SR & D Flip-Flops',
          table: {
            caption: 'SR and D Flip-Flop Characteristic Behavior (at active CLK edge)',
            headers: ['SR Inputs (S, R)', 'SR Next State Q(t+1)', 'D Input (D)', 'D Next State Q(t+1)'],
            rows: [
              ['0, 0', 'Q(t) (Hold)', '0', '0 (Reset)'],
              ['0, 1', '0 (Reset)', '1', '1 (Set)'],
              ['1, 0', '1 (Set)', '—', '—'],
              ['1, 1', 'Invalid / Indeterminate', '—', '—']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u3-c3-ex1',
          title: 'Deriving the Characteristic Equation of SR & D Flip-Flops',
          problemStatement: 'Derive the characteristic equation Q(t+1) of an SR flip-flop using a 3-variable K-Map over (S, R, Q(t)).',
          given: ['Variables: S, R, Q(t)', 'Q(t+1) = 1 at (S,R,Q) ∈ {001, 100, 101}', 'Don’t-cares at S=1,R=1: {110, 111}'],
          required: 'Simplified characteristic equation Q(t+1)',
          formulaLatex: 'Q(t+1) = \\sum m(1, 4, 5) + \\sum d(6, 7)',
          substitutionLatex: '\\text{Quad } \\{4,5,6,7\\} \\implies S, \\quad \\text{Pair } \\{1,5\\} \\implies R\'Q(t)',
          calculationSteps: [
            'Plot 1s at minterms m₁ (001), m₄ (100), m₅ (101), and X at m₆ (110), m₇ (111).',
            'Group quad {4, 5, 6, 7} → gives S.',
            'Group pair {1, 5} → gives R\'Q(t).',
            'Combining both prime implicants gives Q(t+1) = S + R\'Q(t) with SR = 0.'
          ],
          finalAnswer: 'SR: Q(t+1) = S + R\'Q(t) (SR=0); D: Q(t+1) = D',
          interpretation: 'Substituting R = S\' and S = D into S + R\'Q(t) gives D + D·Q(t) = D, proving the D flip-flop equation!'
        }
      ],
      formulas: [
        {
          id: 'f-u3-3',
          unitId: 'unit-3',
          chapterId: 'u3-c3',
          chapterTitle: 'SR & D Type Flip-Flops',
          name: 'SR and D Flip-Flop Characteristic Equations',
          latex: 'Q(t+1)_{SR} = S + R\'Q(t) \\; (SR=0), \\qquad Q(t+1)_D = D',
          symbols: [
            { symbol: 'S, R', meaning: 'Synchronous Set and Reset inputs' },
            { symbol: 'D', meaning: 'Data input sampled on active clock edge' }
          ],
          units: 'Boolean logic',
          conditions: 'Evaluated at the active clock edge.',
          miniExample: 'A 4-bit register uses 4 D flip-flops sharing a common CLK line to load 4 bits simultaneously.'
        }
      ],
      applications: [
        { area: 'CPU Registers & Pipelines', detail: '32-bit and 64-bit processor registers (PC, IR, MAR, MDR) are arrays of edge-triggered D flip-flops.' },
        { area: 'Shift Registers', detail: 'Connecting Q of one D flip-flop to D of the next creates serial-in/parallel-out data converters.' }
      ],
      summary: [
        'SR flip-flop updates on a clock edge and retains the S=R=1 forbidden condition.',
        'D flip-flop sets S=D and R=D\', completely eliminating the forbidden state and yielding Q(t+1) = D.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'D Flip-Flop', definition: 'Transparent-free edge-triggered storage element where Q(t+1) = D.' }
        ],
        corePoints: [
          'SR characteristic equation: Q(t+1) = S + R\'Q(t), constraint SR = 0.',
          'D characteristic equation: Q(t+1) = D (no forbidden state).'
        ],
        examReminders: [
          'Draw the small triangle (>) at the CLK pin of a flip-flop symbol to denote edge-triggering (with a bubble ○> if negative-edge triggered).'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c3-q1',
          question: 'How is an SR flip-flop converted into a D flip-flop?',
          options: ['Tie S and R together', 'Connect D to S and D\' to R via an inverter', 'Connect Q\' to S', 'Tie R to logic 1'],
          correctIndex: 1,
          explanation: 'Connecting S = D and R = D\' guarantees S and R are never both 1, eliminating the forbidden state.'
        },
        {
          id: 'u3-c3-q2',
          question: 'What is the characteristic equation of a D flip-flop?',
          options: ['Q(t+1) = D\'', 'Q(t+1) = D ⊕ Q(t)', 'Q(t+1) = D', 'Q(t+1) = D + Q(t)'],
          correctIndex: 2,
          explanation: 'At every active clock edge, the next state simply copies the Data input D.'
        },
        {
          id: 'u3-c3-q3',
          question: 'A small triangle with an inversion bubble (○>) on a flip-flop clock input indicates:',
          options: ['Positive level-sensitive', 'Positive edge-triggered', 'Negative (falling) edge-triggered', 'Asynchronous reset'],
          correctIndex: 2,
          explanation: 'The triangle denotes edge-triggering and the bubble denotes active-low / falling-edge (1 → 0) triggering.'
        }
      ]
    },
    {
      id: 'u3-c4',
      unitId: 'unit-3',
      chapterNumber: '3.4',
      title: 'JK, JK Master–Slave & T Type Flip-Flops',
      syllabusTopic: 'Flip Flops: JK, JK Master Slave, and T Type Flip Flops',
      estimatedMinutes: 30,
      diagramType: 'jk-master-slave-t',
      diagramCaption: 'JK Flip-Flop, Master–Slave JK architecture (inverted clocks preventing race-around), and Toggle (T) Flip-Flop.',
      introduction: {
        meaning:
          'The JK Flip-Flop improves upon the SR Flip-Flop by turning the forbidden S=R=1 condition into a useful Toggle mode (Q\'(t)). The T (Toggle) Flip-Flop wires J = K = T for frequency division and binary counting.',
        importance:
          'Counters and clock dividers rely heavily on JK and T flip-flops, and the Master–Slave topology solves the classic level-triggered Race-Around Condition.',
        whereUsed:
          'Ripple and synchronous binary counters, frequency dividers (divide-by-2ⁿ), and state machines.',
        problemSolved:
          'Turns the useless SR forbidden state into Toggle, and uses Master–Slave isolation to stop continuous oscillation during wide clock pulses.'
      },
      fundamentalConcept: {
        overview:
          'In a level-triggered JK flip-flop with J = K = 1, Q feeds back to the input gates. If the clock pulse width t_p exceeds the flip-flop propagation delay t_pd, Q toggles repeatedly during a single clock HIGH—this instability is the Race-Around Condition.',
        terms: [
          { term: 'Toggle Mode (J=1, K=1)', meaning: 'Next state complements the present state: Q(t+1) = Q\'(t).' },
          { term: 'Race-Around Condition', meaning: 'Uncontrolled multiple toggling in a level-triggered JK flip-flop when J=K=1 and t_p > t_pd.' },
          { term: 'Master–Slave JK Flip-Flop', meaning: 'Two cascaded latches (Master driven by CLK, Slave driven by CLK\') so only one latch is ever active at a time, eliminating race-around.' },
          { term: 'T (Toggle) Flip-Flop', meaning: 'Single-input flip-flop formed by tying J = K = T: T=0 holds Q; T=1 toggles Q.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. JK & T Flip-Flop Characteristic Table',
          table: {
            caption: 'JK and T Flip-Flop Operation',
            headers: ['J', 'K', 'Q(t+1)', 'Mode', 'T Input', 'T Next State Q(t+1)'],
            rows: [
              ['0', '0', 'Q(t)', 'Hold', '0', 'Q(t) (Hold)'],
              ['0', '1', '0', 'Reset', '1', 'Q\'(t) (Toggle)'],
              ['1', '0', '1', 'Set', '—', '—'],
              ['1', '1', 'Q\'(t)', 'Toggle', '—', '—']
            ]
          }
        },
        {
          heading: '2. How JK Master–Slave Eliminates Race-Around',
          steps: [
            'During CLK = 1 (HIGH): Master latch is enabled and samples J, K, and Slave output Q; Slave latch is disabled (since CLK\' = 0), holding Q steady.',
            'Because Q does not change while CLK = 1, the feedback to Master remains constant—preventing multiple toggles!',
            'At the falling edge (CLK transitions 1 → 0): Master locks its sampled state, and Slave (now seeing CLK\' = 1) copies Master’s output to Q.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u3-c4-ex1',
          title: 'Clock Frequency Division with T Flip-Flops',
          problemStatement: 'A 16 MHz clock feeds a cascade of 3 T flip-flops where each flip-flop has T = 1 and is clocked by the Q output of the previous stage. Find the output frequency at Q₃.',
          given: ['Input clock f_in = 16 MHz', '3 cascaded T flip-flops with T = 1'],
          required: 'Output frequency f_out at stage 3',
          formulaLatex: 'f_{out} = \\frac{f_{in}}{2^n}',
          substitutionLatex: 'f_{out} = \\frac{16\\text{ MHz}}{2^3} = \\frac{16}{8}',
          calculationSteps: [
            'Stage 1 (T=1) toggles on every active clock edge → period doubles, frequency halves: f₁ = 16 / 2 = 8 MHz.',
            'Stage 2 divides f₁ by 2: f₂ = 8 / 2 = 4 MHz.',
            'Stage 3 divides f₂ by 2: f₃ = 4 / 2 = 2 MHz.'
          ],
          finalAnswer: 'f_out = 2 MHz',
          interpretation: 'Each toggle flip-flop acts as an exact divide-by-2 frequency divider.'
        }
      ],
      formulas: [
        {
          id: 'f-u3-4',
          unitId: 'unit-3',
          chapterId: 'u3-c4',
          chapterTitle: 'JK, JK Master–Slave & T Type Flip-Flops',
          name: 'JK & T Flip-Flop Characteristic Equations',
          latex: 'Q(t+1)_{JK} = JQ\'(t) + K\'Q(t), \\qquad Q(t+1)_T = T \\oplus Q(t) = TQ\'(t) + T\'Q(t)',
          symbols: [
            { symbol: 'J, K', meaning: 'Synchronous Set-like (J) and Reset-like (K) inputs' },
            { symbol: 'T', meaning: 'Toggle control input' }
          ],
          units: 'Boolean logic',
          conditions: 'Valid without any forbidden input combinations.',
          miniExample: 'When J=1, K=1: Q(t+1) = 1·Q\'(t) + 0·Q(t) = Q\'(t).'
        }
      ],
      applications: [
        { area: 'Binary Counters', detail: 'Synchronous and ripple counters use T or JK flip-flops to count clock pulses.' },
        { area: 'Clock Prescalers', detail: 'Microcontroller timers divide high-frequency crystal oscillators down to baud-rate or millisecond ticks.' }
      ],
      summary: [
        'JK flip-flop replaces SR’s invalid 11 state with Toggle: Q(t+1) = JQ\' + K\'Q.',
        'Race-around occurs in level-triggered JK flip-flops when J=K=1 and pulse width t_p > propagation delay t_pd.',
        'Master–Slave JK uses two latches clocked on opposite phases (CLK and CLK\') to eliminate race-around.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Race-Around Condition', definition: 'Repeated unwanted toggling when J=K=1 and CLK=1 lasts longer than propagation delay.' },
          { term: 'Master–Slave FF', definition: 'Master tracks input during CLK=1; Slave updates output on CLK falling edge.' }
        ],
        corePoints: [
          'JK equation: Q(t+1) = JQ\' + K\'Q.',
          'T equation: Q(t+1) = T ⊕ Q.',
          'T Flip-Flop = JK with J and K tied together.'
        ],
        examReminders: [
          'Remember: Master–Slave JK still suffers from "1s catching" if J/K glitch during CLK=1; modern edge-triggered flip-flops avoid even that.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c4-q1',
          question: 'When does the Race-Around Condition occur in a level-triggered JK flip-flop?',
          options: ['J=0, K=0', 'J=1, K=0', 'J=1, K=1 with t_pulse > t_pd', 'J=0, K=1 with edge triggering'],
          correctIndex: 2,
          explanation: 'With J=K=1, the output toggles and feeds back before the clock pulse ends if t_pulse > t_pd.'
        },
        {
          id: 'u3-c4-q2',
          question: 'In a Master–Slave JK flip-flop, the Slave latch is clocked by:',
          options: ['The same CLK signal as Master', 'The inverted clock (CLK\')', 'The J input', 'An external oscillator'],
          correctIndex: 1,
          explanation: 'Inverting the clock ensures Master and Slave are never simultaneously transparent.'
        },
        {
          id: 'u3-c4-q3',
          question: 'What is the next state Q(t+1) of a T flip-flop when Q(t) = 1 and T = 1?',
          options: ['1', '0', 'Invalid', 'Depends on clock duty cycle'],
          correctIndex: 1,
          explanation: 'T = 1 toggles the state, so Q(t) = 1 becomes Q(t+1) = 0.'
        }
      ]
    },
    {
      id: 'u3-c5',
      unitId: 'unit-3',
      chapterNumber: '3.5',
      title: 'Excitation Tables of All Flip-Flops (SR, JK, D, T)',
      syllabusTopic: 'Excitation Table of all Flip Flops',
      estimatedMinutes: 25,
      diagramType: 'excitation-tables',
      diagramCaption: 'Unified Excitation Matrix mapping desired state transitions Q(t) → Q(t+1) to required SR, JK, D, and T inputs.',
      introduction: {
        meaning:
          'While a Characteristic Table tells us what next state Q(t+1) results from given inputs, an Excitation Table reverses the question: given a desired transition Q(t) → Q(t+1), what inputs must we apply?',
        importance:
          'Excitation tables are the indispensable design tool for building synchronous counters, sequence detectors, and converting one flip-flop type into another.',
        whereUsed:
          'Synchronous counter design, Finite State Machine (FSM) synthesis, and flip-flop conversions.',
        problemSolved:
          'Determines the exact minimal Boolean expressions (often including valuable Don’t-Cares X) for driving flip-flop inputs.'
      },
      fundamentalConcept: {
        overview:
          'Each row of an excitation table lists one of the 4 possible transitions of a single bit: 0→0, 0→1, 1→0, and 1→1. Notice how SR and JK excitation tables include Don’t-Care (X) entries because two different input combinations can achieve the same transition!',
        terms: [
          { term: 'Characteristic Table', meaning: 'Analysis table: Present Inputs + Q(t) → Q(t+1).' },
          { term: 'Excitation Table', meaning: 'Synthesis/Design table: Transition Q(t) → Q(t+1) → Required Inputs.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete Master Excitation Table (All Four Flip-Flops)',
          table: {
            caption: 'Excitation Table for SR, JK, D, and T Flip-Flops',
            headers: ['Q(t)', 'Q(t+1)', 'S', 'R', 'J', 'K', 'D', 'T'],
            rows: [
              ['0', '0', '0', 'X', '0', 'X', '0', '0'],
              ['0', '1', '1', '0', '1', 'X', '1', '1'],
              ['1', '0', '0', '1', 'X', '1', '0', '1'],
              ['1', '1', 'X', '0', 'X', '0', '1', '0']
            ]
          }
        },
        {
          heading: '2. Why Each Row Has Don’t-Cares (Intuition)',
          bullets: [
            'SR for 0 → 0: Either Hold (S=0, R=0) or Reset (S=0, R=1) produces 0, so S=0 and R=X.',
            'JK for 0 → 1: Either Set (J=1, K=0) or Toggle (J=1, K=1) changes 0 to 1, so J=1 and K=X!',
            'D Flip-Flop: D simply equals Q(t+1) directly in all 4 rows.',
            'T Flip-Flop: T equals Q(t) ⊕ Q(t+1) (0 when state stays same, 1 when state changes).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u3-c5-ex1',
          title: 'Using Excitation Tables to Find Synchronous Counter Inputs',
          problemStatement: 'A 2-bit synchronous binary counter cycles 00 → 01 → 10 → 11 → 00 using JK flip-flops (Q₁ MSB, Q₀ LSB). Find the required JK excitations for transition 01 → 10.',
          given: ['Present State: Q₁=0, Q₀=1', 'Next State: Q₁+=1, Q₀+=0'],
          required: 'Required inputs J₁, K₁, J₀, K₀',
          formulaLatex: '0 \\to 1 \\implies (J=1, K=X), \\qquad 1 \\to 0 \\implies (J=X, K=1)',
          substitutionLatex: 'Q_1: 0 \\to 1, \\quad Q_0: 1 \\to 0',
          calculationSteps: [
            'For MSB Q₁: Transition is 0 → 1. From JK excitation table, J₁ = 1, K₁ = X.',
            'For LSB Q₀: Transition is 1 → 0. From JK excitation table, J₀ = X, K₀ = 1.'
          ],
          finalAnswer: 'J₁ = 1, K₁ = X, J₀ = X, K₀ = 1',
          interpretation: 'Notice that choosing X = 1 gives J=K=1 (toggle) for both bits on the 01 → 10 step!'
        }
      ],
      formulas: [
        {
          id: 'f-u3-5',
          unitId: 'unit-3',
          chapterId: 'u3-c5',
          chapterTitle: 'Excitation Tables of All Flip-Flops (SR, JK, D, T)',
          name: 'D and T Excitation Equations',
          latex: 'D = Q(t+1), \\qquad T = Q(t) \\oplus Q(t+1)',
          symbols: [
            { symbol: 'Q(t)', meaning: 'Current state before clock edge' },
            { symbol: 'Q(t+1)', meaning: 'Desired next state after clock edge' }
          ],
          units: 'Boolean logic',
          conditions: 'Universal for every synchronous design using D or T flip-flops.',
          miniExample: 'Transition 1 → 0 requires D = 0 and T = 1 ⊕ 0 = 1.'
        }
      ],
      applications: [
        { area: 'Synchronous Counter Design', detail: 'Used to synthesize Mod-N, Up/Down, and arbitrary sequence counters.' }
      ],
      summary: [
        'Excitation tables map Q(t) → Q(t+1) transitions to required flip-flop inputs.',
        'JK has the most Don’t-Cares (4 Xs), resulting in simpler K-Map hardware than SR or D.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Excitation Table', definition: 'Lists required inputs for each of the four Q(t) → Q(t+1) transitions.' }
        ],
        corePoints: [
          'SR: 0→0 (0X), 0→1 (10), 1→0 (01), 1→1 (X0).',
          'JK: 0→0 (0X), 0→1 (1X), 1→0 (X1), 1→1 (X0).',
          'D = Q(t+1); T = Q(t) ⊕ Q(t+1).'
        ],
        examReminders: [
          'Memorize the JK pattern: top half K=X (0X, 1X), bottom half J=X (X1, X0)!'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c5-q1',
          question: 'In a JK flip-flop excitation table, what are (J, K) for the transition Q(t) = 0 → Q(t+1) = 1?',
          options: ['(0, X)', '(1, 0)', '(1, X)', '(X, 1)'],
          correctIndex: 2,
          explanation: 'Both (1,0) Set and (1,1) Toggle move 0 to 1, so J = 1 and K = X.'
        },
        {
          id: 'u3-c5-q2',
          question: 'In an SR flip-flop excitation table, what are (S, R) for the transition 1 → 1?',
          options: ['(1, 0)', '(X, 0)', '(0, X)', '(X, 1)'],
          correctIndex: 1,
          explanation: 'Hold (0,0) and Set (1,0) both result in Q(t+1) = 1 from Q(t) = 1, so S = X and R = 0.'
        },
        {
          id: 'u3-c5-q3',
          question: 'For a T flip-flop, when does T = 1 in the excitation table?',
          options: ['When Q(t) = Q(t+1)', 'When Q(t) ≠ Q(t+1)', 'Only when Q(t+1) = 1', 'Only when Q(t) = 1'],
          correctIndex: 1,
          explanation: 'T = 1 is required whenever the state must change (0→1 or 1→0).'
        }
      ]
    },
    {
      id: 'u3-c6',
      unitId: 'unit-3',
      chapterNumber: '3.6',
      title: 'Conversion from One Type of Flip-Flop to Another',
      syllabusTopic: 'Conversion from one type of Flip-Flop to another',
      estimatedMinutes: 30,
      diagramType: 'flipflop-conversion',
      diagramCaption: 'Combinational input-adapter topology wrapping an Available Flip-Flop to behave as a Target Flip-Flop.',
      introduction: {
        meaning:
          'Flip-flop conversion designs a small combinational circuit at the inputs of an *available* flip-flop so that the combined module behaves identically to a *required* flip-flop.',
        importance:
          'In IC design and FPGA libraries, only one flip-flop primitive (often D or JK) may be available; conversion lets engineers realize any required behavior.',
        whereUsed:
          'Standard-cell ASIC mapping, 74xx IC prototyping, and classic university design problems.',
        problemSolved:
          'Provides a universal 4-step recipe to convert any flip-flop (SR, JK, D, T) into any other flip-flop.'
      },
      fundamentalConcept: {
        overview:
          'The secret is combining TWO tables: the Characteristic Table of the *Required* (target) flip-flop on the left, and the Excitation Table of the *Available* (given) flip-flop on the right!',
        terms: [
          { term: 'Available Flip-Flop', meaning: 'The physical flip-flop IC you already have in hardware (its inputs are the outputs of your combinational adapter).' },
          { term: 'Required (Target) Flip-Flop', meaning: 'The flip-flop behavior you want to emulate (its inputs + Q(t) are the inputs to your K-Map).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Four-Step Universal Flip-Flop Conversion Procedure',
          steps: [
            'Write the Characteristic Table of the REQUIRED flip-flop: list all combinations of Required Inputs + Present State Q(t), and determine Next State Q(t+1).',
            'Append columns for the inputs of the AVAILABLE flip-flop using its Excitation Table based on each Q(t) → Q(t+1) row.',
            'Plot a K-Map for each input of the AVAILABLE flip-flop as a function of (Required Inputs, Q(t)).',
            'Simplify via K-Map and draw the combinational gates feeding the Available Flip-Flop.'
          ]
        },
        {
          heading: '2. Quick Reference Summary of Standard Conversions',
          table: {
            caption: 'Common Flip-Flop Conversion Equations',
            headers: ['Conversion (Available → Required)', 'Adapter Equation(s)'],
            rows: [
              ['SR → D', 'S = D, R = D\''],
              ['SR → JK', 'S = J·Q\', R = K·Q'],
              ['SR → T', 'S = T·Q\', R = T·Q'],
              ['JK → D', 'J = D, K = D\''],
              ['JK → T', 'J = T, K = T'],
              ['JK → SR', 'J = S, K = R'],
              ['D → T', 'D = T ⊕ Q = T·Q\' + T\'·Q'],
              ['D → JK', 'D = J·Q\' + K\'·Q'],
              ['D → SR', 'D = S + R\'·Q'],
              ['T → D', 'T = D ⊕ Q']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u3-c6-ex1',
          title: 'Converting an SR Flip-Flop into a JK Flip-Flop',
          problemStatement: 'Design the combinational logic required to convert an SR Flip-Flop (available) into a JK Flip-Flop (required).',
          given: ['Available: SR Flip-Flop', 'Required: JK Flip-Flop'],
          required: 'Boolean expressions for S and R in terms of J, K, and Q(t)',
          formulaLatex: 'Q(t+1)_{JK} = JQ\' + K\'Q',
          substitutionLatex: '\\text{Map } (J, K, Q) \\to Q(t+1) \\to (S, R)',
          calculationSteps: [
            'Build 8-row conversion table for (J, K, Q) → Q(t+1): 000→0 (S=0,R=X); 001→1 (S=X,R=0); 010→0 (S=0,R=X); 011→0 (S=0,R=1); 100→1 (S=1,R=0); 101→1 (S=X,R=0); 110→1 (S=1,R=0); 111→0 (S=0,R=1).',
            '3-variable K-Map for S(J,K,Q): 1s at m₄(100), m₆(110); X at m₁(001), m₅(101). Grouping m₄ and m₆ gives S = J·Q\'.',
            '3-variable K-Map for R(J,K,Q): 1s at m₃(011), m₇(111); X at m₀(000), m₂(010). Grouping m₃ and m₇ gives R = K·Q.'
          ],
          finalAnswer: 'S = J · Q\' and R = K · Q',
          interpretation: 'When Q=1, only R = K·1 can reset; when Q=0, only S = J·1 can set—so S and R can never both be 1 simultaneously!'
        }
      ],
      formulas: [
        {
          id: 'f-u3-6',
          unitId: 'unit-3',
          chapterId: 'u3-c6',
          chapterTitle: 'Conversion from One Type of Flip-Flop to Another',
          name: 'D-to-JK and SR-to-JK Conversion Identities',
          latex: 'D = JQ\' + K\'Q \\quad (\\text{D} \\to \\text{JK}), \\qquad S = JQ\', \\; R = KQ \\quad (\\text{SR} \\to \\text{JK})',
          symbols: [
            { symbol: 'Q, Q\'', meaning: 'Present state outputs fed back from the available flip-flop' }
          ],
          units: 'Boolean logic',
          conditions: 'All inputs share the same clock pulse.',
          miniExample: 'To build a T flip-flop from a D flip-flop, connect an XOR gate: D = T ⊕ Q.'
        }
      ],
      applications: [
        { area: 'FPGA Synthesis', detail: 'FPGAs contain only D flip-flops in every logic slice; synthesis tools automatically convert JK/T RTL structures into D + LUT feedback equations.' }
      ],
      summary: [
        'Use Required Characteristic Table + Available Excitation Table + K-Map.',
        'Key results: D → T uses D = T ⊕ Q; D → JK uses D = JQ\' + K\'Q; SR → JK uses S = JQ\', R = KQ.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Flip-Flop Conversion', definition: 'Adding combinational logic in front of an available flip-flop to emulate a target flip-flop.' }
        ],
        corePoints: [
          'Always place Available FF inputs on the output side of the conversion table.',
          'Notice D = Characteristic Equation of the Target Flip-Flop! (Because D = Q(t+1)).'
        ],
        examReminders: [
          'Shortcut check: Whenever the AVAILABLE flip-flop is D, the required D expression is ALWAYS identical to the target flip-flop’s characteristic equation!'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u3-c6-q1',
          question: 'When converting a D flip-flop (available) into a T flip-flop (required), what is the expression for D?',
          options: ['D = T', 'D = T\'', 'D = T ⊕ Q', 'D = T · Q'],
          correctIndex: 2,
          explanation: 'Since D = Q(t+1), D simply equals the T flip-flop characteristic equation T ⊕ Q.'
        },
        {
          id: 'u3-c6-q2',
          question: 'To convert an SR flip-flop into a JK flip-flop, S and R are connected as:',
          options: ['S = J, R = K', 'S = JQ\', R = KQ', 'S = JQ, R = KQ\'', 'S = J + Q, R = K + Q\''],
          correctIndex: 1,
          explanation: 'ANDing J with Q\' and K with Q prevents S=R=1 and produces toggle when J=K=1.'
        },
        {
          id: 'u3-c6-q3',
          question: 'Which table of the AVAILABLE flip-flop is used during flip-flop conversion?',
          options: ['Characteristic Table', 'Excitation Table', 'State Diagram', 'Truth Table of NAND'],
          correctIndex: 1,
          explanation: 'We know Q(t) and Q(t+1) from the target flip-flop, so we look up the Available FF’s Excitation Table to find its required inputs.'
        }
      ]
    }
  ]
};

export const UNIT_3_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-u3-1',
    unitId: 'unit-3',
    chapterId: 'u3-c1',
    topicName: 'Combinational vs Sequential Circuits',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'List four architectural differences between Combinational and Sequential circuits.',
    answerSections: [
      {
        bullets: [
          'Memory: Combinational circuits have no memory; Sequential circuits contain latches/flip-flops.',
          'Output Dependency: Combinational outputs depend only on present inputs; Sequential outputs depend on present inputs and previous state.',
          'Feedback: No feedback in combinational circuits; feedback exists from memory outputs in sequential circuits.',
          'Clock: Combinational circuits do not need a clock; Synchronous sequential circuits require a clock.'
        ]
      }
    ]
  },
  {
    id: 'eq-u3-2',
    unitId: 'unit-3',
    chapterId: 'u3-c4',
    topicName: 'Race-Around Condition',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'What is the Race-Around Condition in a JK flip-flop and how is it eliminated?',
    answerSections: [
      {
        paragraphs: [
          'In a level-triggered JK flip-flop, when J = 1, K = 1, and the clock pulse width t_p is greater than the propagation delay t_pd of the flip-flop, the output toggles continuously multiple times during a single clock HIGH pulse. This unpredictable oscillation is the Race-Around Condition.',
          'It is eliminated by using a Master–Slave JK flip-flop or an edge-triggered JK flip-flop.'
        ]
      }
    ]
  },
  {
    id: 'eq-u3-3',
    unitId: 'unit-3',
    chapterId: 'u3-c5',
    topicName: 'Excitation Table',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Write the excitation table for a JK flip-flop and a T flip-flop.',
    answerSections: [
      {
        bullets: [
          'Q(t)=0 → Q(t+1)=0: J=0, K=X | T=0',
          'Q(t)=0 → Q(t+1)=1: J=1, K=X | T=1',
          'Q(t)=1 → Q(t+1)=0: J=X, K=1 | T=1',
          'Q(t)=1 → Q(t+1)=1: J=X, K=0 | T=0'
        ]
      }
    ]
  },
  {
    id: 'eq-u3-4',
    unitId: 'unit-3',
    chapterId: 'u3-c4',
    topicName: 'JK Master–Slave Flip-Flop',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Explain the construction and working principle of a Master–Slave JK Flip-Flop.',
    answerSections: [
      {
        heading: '1. Construction',
        paragraphs: [
          'A Master–Slave JK flip-flop cascades two gated SR latches: the Master latch receives external J and K (gated by Q\' and Q from Slave) and is clocked by CLK; the Slave latch receives Master outputs (Y, Y\') and is clocked by inverted clock CLK\'.'
        ]
      },
      {
        heading: '2. Two-Phase Operation',
        bullets: [
          'When CLK = 1 (Positive half-cycle): Master is active and samples J, K. Slave is disabled (CLK\' = 0), so external output Q remains frozen.',
          'When CLK = 0 (Negative half-cycle): Master is disabled and locks its state. Slave becomes enabled (CLK\' = 1) and transfers Master’s state to Q.',
          'Because Q changes only after Master is disabled, feedback cannot loop back within the same clock cycle—eliminating Race-Around.'
        ]
      }
    ]
  },
  {
    id: 'eq-u3-5',
    unitId: 'unit-3',
    chapterId: 'u3-c6',
    topicName: 'Flip-Flop Conversion',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Convert a D Flip-Flop into a JK Flip-Flop using excitation tables and K-Map simplification.',
    answerSections: [
      {
        heading: '1. Conversion Table & K-Map',
        paragraphs: [
          'List J, K, Q(t) → Q(t+1) for a JK flip-flop. Since for a D flip-flop D = Q(t+1), the 1s of D occur at minterms (J,K,Q) = (0,0,1), (0,1,0)—no, wait: (0,0,1)→1, (1,0,0)→1, (1,0,1)→1, (1,1,0)→1 → Σm(1, 4, 5, 6).'
        ],
        latex: ['D = JQ\' + K\'Q']
      }
    ]
  },
  {
    id: 'eq-u3-6',
    unitId: 'unit-3',
    chapterId: 'u3-c6',
    topicName: 'Flip-Flop Conversions & Excitation',
    marks: 'long-answer',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Explain the working of an SR Latch using NOR gates. Derive the characteristic equations and excitation tables for SR, JK, D, and T flip-flops, and show how to convert an SR flip-flop into a T flip-flop.',
    answerSections: [
      {
        heading: '1. NOR SR Latch & Characteristic Equations',
        latex: [
          'Q(t+1)_{SR} = S + R\'Q(t) \\; (SR=0)',
          'Q(t+1)_{JK} = JQ\'(t) + K\'Q(t)',
          'Q(t+1)_D = D, \\qquad Q(t+1)_T = T \\oplus Q(t)'
        ]
      },
      {
        heading: '2. SR-to-T Flip-Flop Conversion',
        paragraphs: [
          'For (T, Q) → Q(t+1): (0,0)→0 (S=0,R=X); (0,1)→1 (S=X,R=0); (1,0)→1 (S=1,R=0); (1,1)→0 (S=0,R=1).',
          'Simplifying via 2-variable K-Map yields S = T·Q\' and R = T·Q.'
        ],
        latex: ['S = T \\cdot Q\', \\qquad R = T \\cdot Q']
      }
    ]
  }
];

export const UNIT_3_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-u3-1',
    unitId: 'unit-3',
    chapterId: 'u3-c1',
    format: 'true-false',
    prompt: 'True or False: The output of a combinational circuit depends on both present inputs and previous stored states.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Combinational circuits are memoryless; only sequential circuits depend on previous stored states.'
  },
  {
    id: 'qz-u3-2',
    unitId: 'unit-3',
    chapterId: 'u3-c3',
    format: 'mcq',
    prompt: 'Which flip-flop is widely used as a 1-bit delay/data storage element with Q(t+1) = D?',
    options: ['SR Flip-Flop', 'D Flip-Flop', 'JK Flip-Flop', 'T Flip-Flop'],
    correctAnswer: 'D Flip-Flop',
    explanation: 'The D (Data/Delay) flip-flop copies input D to output Q at every active clock edge.'
  },
  {
    id: 'qz-u3-3',
    unitId: 'unit-3',
    chapterId: 'u3-c4',
    format: 'fill-blank',
    prompt: 'In a JK flip-flop, setting J = 1 and K = 1 puts the flip-flop into ____ mode.',
    correctAnswer: 'toggle',
    explanation: 'When J = K = 1, the output switches to its complement Q\'(t) on the active clock edge.'
  },
  {
    id: 'qz-u3-4',
    unitId: 'unit-3',
    chapterId: 'u3-c5',
    format: 'mcq',
    prompt: 'In the SR excitation table, what inputs (S, R) are required for the transition Q(t) = 1 → Q(t+1) = 0?',
    options: ['(0, X)', '(1, 0)', '(0, 1)', '(X, 0)'],
    correctAnswer: '(0, 1)',
    explanation: 'Only Reset (S = 0, R = 1) drives Q from 1 down to 0.'
  },
  {
    id: 'qz-u3-5',
    unitId: 'unit-3',
    chapterId: 'u3-c6',
    format: 'mcq',
    prompt: 'Which gate converts a D flip-flop into a T flip-flop when feeding Q back with input T?',
    options: ['AND gate', 'OR gate', 'XOR gate', 'NAND gate'],
    correctAnswer: 'XOR gate',
    explanation: 'D = T ⊕ Q causes Q to hold when T=0 and invert when T=1.'
  }
];
