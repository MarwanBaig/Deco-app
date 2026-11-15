import { QuizQuestion } from '../types/academic';

export const EXTRA_ASSESSMENT_QUIZZES: QuizQuestion[] = [
  // Unit I extra drills
  {
    id: 'qz-u1-x1',
    unitId: 'unit-1',
    chapterId: 'u1-c2',
    format: 'mcq',
    prompt: 'In 2’s complement subtraction M - N (both n-bit unsigned numbers), what does an end-around carry of 1 indicate?',
    options: [
      'Result is positive; discard the carry',
      'Result is negative; invert and add 1',
      'Overflow error occurred',
      'Result is positive; add carry back to LSB'
    ],
    correctAnswer: 'Result is positive; discard the carry',
    explanation: 'In r’s complement subtraction (2’s or 10’s), an end carry means M ≥ N, so you discard the carry and keep the sum directly. (Adding end-around carry applies to (r-1)’s complement.)'
  },
  {
    id: 'qz-u1-x2',
    unitId: 'unit-1',
    chapterId: 'u1-c6',
    format: 'mcq',
    prompt: 'If a 3-variable Boolean function F(A, B, C) = Σm(0, 2, 5, 7), what is its canonical POS form?',
    options: [
      'ΠM(1, 3, 4, 6)',
      'ΠM(0, 2, 5, 7)',
      'Σm(1, 3, 4, 6)',
      'ΠM(1, 2, 4, 6)'
    ],
    correctAnswer: 'ΠM(1, 3, 4, 6)',
    explanation: 'Canonical POS collects all maxterm indices where F = 0, which are exactly the remaining indices from 0..7 not in Σm.'
  },
  // Unit II extra drills
  {
    id: 'qz-u2-x1',
    unitId: 'unit-2',
    chapterId: 'u2-c1',
    format: 'numerical',
    prompt: 'In a 4-variable Karnaugh Map, a group of 8 adjacent 1s (an octet) produces a product term containing how many literals?',
    correctAnswer: '1',
    tolerance: 0,
    explanation: 'A group of 2^k cells in an n-variable K-Map leaves (n - k) literals. With n = 4 and 2^3 = 8, literals left = 4 - 3 = 1.'
  },
  {
    id: 'qz-u2-x2',
    unitId: 'unit-2',
    chapterId: 'u2-c6',
    format: 'mcq',
    prompt: 'How many select lines are required for a 16-to-1 Multiplexer?',
    options: ['2', '3', '4', '8'],
    correctAnswer: '4',
    explanation: 'A 2^n : 1 multiplexer requires n select lines. Since 16 = 2^4, 4 select lines are needed.'
  },
  {
    id: 'qz-u2-x3',
    unitId: 'unit-2',
    chapterId: 'u2-c8',
    format: 'mcq',
    prompt: 'Which combinational circuit asserts a Valid (V) output bit and encodes only the highest-precedence active input line?',
    options: ['3:8 Decoder', 'Priority Encoder', '4:1 Multiplexer', 'Magnitude Comparator'],
    correctAnswer: 'Priority Encoder',
    explanation: 'A Priority Encoder resolves simultaneous active inputs by outputting the binary code of the highest-priority line alongside a Valid indicator V.'
  },
  // Unit III extra drills
  {
    id: 'qz-u3-x1',
    unitId: 'unit-3',
    chapterId: 'u3-c4',
    format: 'mcq',
    prompt: 'What is the characteristic next-state equation of a JK flip-flop?',
    options: [
      'Q(t+1) = JQ’ + K’Q',
      'Q(t+1) = JQ + K’Q’',
      'Q(t+1) = J + K’Q',
      'Q(t+1) = J ⊕ K'
    ],
    correctAnswer: 'Q(t+1) = JQ’ + K’Q',
    explanation: 'Solving the JK K-map across J, K, and Q(t) gives Q(t+1) = JQ’ + K’Q. When J=K=1, Q(t+1) = Q’ (Toggle).'
  },
  {
    id: 'qz-u3-x2',
    unitId: 'unit-3',
    chapterId: 'u3-c5',
    format: 'mcq',
    prompt: 'In an SR flip-flop excitation table, what inputs (S, R) are needed for the transition Q(t)=0 → Q(t+1)=0?',
    options: ['S = 0, R = X', 'S = X, R = 0', 'S = 1, R = 0', 'S = 0, R = 1'],
    correctAnswer: 'S = 0, R = X',
    explanation: 'To keep Q at 0, S must be 0, while R can be either 0 (Hold 0) or 1 (Reset to 0), hence R = X (don’t care).'
  },
  {
    id: 'qz-u3-x3',
    unitId: 'unit-3',
    chapterId: 'u3-c6',
    format: 'mcq',
    prompt: 'To convert a D flip-flop into a T (Toggle) flip-flop, what Boolean expression drives input D?',
    options: ['D = T ⊕ Q', 'D = T · Q', 'D = T + Q’', 'D = T’ · Q'],
    correctAnswer: 'D = T ⊕ Q',
    explanation: 'Since a T flip-flop has next state Q(t+1) = T ⊕ Q and a D flip-flop sets Q(t+1) = D, we simply wire D = T ⊕ Q.'
  },
  // Unit IV extra drills
  {
    id: 'qz-u4-x1',
    unitId: 'unit-4',
    chapterId: 'u4-c2',
    format: 'mcq',
    prompt: 'During instruction fetch, which CPU register receives the memory address from the Program Counter (PC) first?',
    options: [
      'Memory Address Register (MAR)',
      'Instruction Register (IR)',
      'Accumulator (AC)',
      'Stack Pointer (SP)'
    ],
    correctAnswer: 'Memory Address Register (MAR)',
    explanation: 'In the fetch step, PC transfers the instruction address to MAR (MAR ← PC), which drives the memory address bus.'
  },
  {
    id: 'qz-u4-x2',
    unitId: 'unit-4',
    chapterId: 'u4-c6',
    format: 'mcq',
    prompt: 'Which I/O transfer mechanism allows high-speed peripherals to move blocks directly to/from Main Memory without per-byte CPU execution?',
    options: [
      'Direct Memory Access (DMA)',
      'Programmed I/O Polling',
      'Strobe-Only Transfer',
      'Single-Byte Interrupt'
    ],
    correctAnswer: 'Direct Memory Access (DMA)',
    explanation: 'A DMA controller requests bus ownership (BR/BG) and transfers whole data blocks directly between I/O and RAM without CPU instruction loops.'
  },
  {
    id: 'qz-u4-x3',
    unitId: 'unit-4',
    chapterId: 'u4-c7',
    format: 'true-false',
    prompt: 'True or False: Two-wire asynchronous handshaking uses both Request and Acknowledge lines so the sender knows when the receiver has accepted the data.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Unlike open-loop strobe control, closed-loop handshaking uses Request + Acknowledge signals to synchronize sender and receiver regardless of speed mismatch.'
  },
  {
    id: 'qz-u4-x4',
    unitId: 'unit-4',
    chapterId: 'u4-c4',
    format: 'mcq',
    prompt: 'Which instruction format uses an Accumulator (AC) as an implicit source and destination operand?',
    options: ['1-Address Format', '3-Address Format', '2-Address Format', '0-Address Format'],
    correctAnswer: '1-Address Format',
    explanation: 'A 1-address architecture specifies one memory operand explicitly and uses the Accumulator (AC) implicitly for the second operand and result.'
  },
  // Unit V extra drills
  {
    id: 'qz-u5-x1',
    unitId: 'unit-5',
    chapterId: 'u5-c2',
    format: 'mcq',
    prompt: 'Why is SRAM preferred over DRAM for CPU L1/L2 caches despite higher cost per bit?',
    options: [
      'Lower access latency and no periodic refresh cycles needed',
      'Higher storage density per square millimeter',
      'Non-volatility without power',
      'Requires only 1 transistor and 1 capacitor'
    ],
    correctAnswer: 'Lower access latency and no periodic refresh cycles needed',
    explanation: '6-transistor SRAM cells latch bits statically without capacitor leak/refresh stalls, making them far faster for CPU caches.'
  },
  {
    id: 'qz-u5-x2',
    unitId: 'unit-5',
    chapterId: 'u5-c6',
    format: 'numerical',
    prompt: 'A 32-bit processor uses a 32 KB Direct-Mapped Cache with 64-byte blocks. How many bits are used for the Cache Line Index field?',
    correctAnswer: '9',
    tolerance: 0,
    explanation: 'Total lines = 32 KB / 64 B = 32,768 / 64 = 512 lines = 2^9. Therefore, Index requires 9 bits (Tag = 17, Index = 9, Offset = 6).'
  },
  {
    id: 'qz-u5-x3',
    unitId: 'unit-5',
    chapterId: 'u5-c7',
    format: 'mcq',
    prompt: 'During Virtual-to-Physical address translation, which portion of the virtual address remains completely unchanged?',
    options: [
      'Page Offset',
      'Virtual Page Number (VPN)',
      'Page Table Base Pointer',
      'TLB Tag'
    ],
    correctAnswer: 'Page Offset',
    explanation: 'Only the Virtual Page Number maps to a Physical Frame Number; the low-order Page Offset bits remain identical because page size equals frame size.'
  }
];
