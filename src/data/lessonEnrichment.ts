import { LessonEnrichment, UnitId } from '../types/academic';

export const UNIT_LEARNING_OBJECTIVES: Record<
  UnitId,
  { outcome: string; objectives: string[] }
> = {
  'unit-1': {
    outcome: 'CO1: Demonstrate number system conversions and simplify Boolean functions.',
    objectives: [
      'Convert integers and fractions cleanly across binary, octal, decimal, and hexadecimal radices.',
      'Perform signed and unsigned subtraction using (r-1)’s and r’s complements without borrow errors.',
      'Compare weighted codes (8421 BCD, 2421) and non-weighted codes (Gray, Excess-3), plus detect/correct single-bit errors using parity and Hamming codes.',
      'Simplify switching functions into Canonical and Standard SOP/POS forms using Boolean theorems and realize circuits with universal NAND/NOR gates.'
    ]
  },
  'unit-2': {
    outcome:
      'CO2: Analyze and simplify Boolean expressions using Karnaugh-maps, tabulation method and design combinational circuits.',
    objectives: [
      'Minimize 2-, 3-, and 4-variable Boolean functions (including don’t-care conditions) using Karnaugh Maps.',
      'Apply the Quine–McCluskey tabular method systematically for algorithmic multi-variable minimization.',
      'Design Half/Full Adders, Subtractors, and Magnitude Comparators from truth tables.',
      'Implement combinational logic functions using Multiplexers, Demultiplexers, Encoders, and Decoders.'
    ]
  },
  'unit-3': {
    outcome: 'CO3: Analyze and design various Sequential circuits.',
    objectives: [
      'Contrast combinational and sequential architectures by identifying feedback paths and memory elements.',
      'Analyze NOR and NAND SR latches and resolve the forbidden input condition.',
      'Derive characteristic tables, excitation tables, and next-state equations for SR, JK, JK Master-Slave, D, and T flip-flops.',
      'Convert any given flip-flop into another target flip-flop type using excitation tables and K-Maps.'
    ]
  },
  'unit-4': {
    outcome: 'CO4: Illustrate the operation of digital computer and understand its organization.',
    objectives: [
      'Explain the functional block diagram of a digital computer and roles of ALU, Control Unit, Memory, and I/O.',
      'Trace instruction execution cycles using stored-program registers (PC, MAR, MDR, IR, AC) and single/multiple bus structures.',
      'Classify 0-, 1-, 2-, and 3-address instruction formats and addressing tradeoffs.',
      'Compare Programmed I/O, Interrupt-driven I/O, Direct Memory Access (DMA), and Strobe vs. Handshaking asynchronous data transfer.'
    ]
  },
  'unit-5': {
    outcome: 'CO5: Understand the various memory types and memory hierarchy organization.',
    objectives: [
      'Evaluate memory hierarchy tradeoffs across access speed, bit capacity, volatility, and cost per bit.',
      'Distinguish SRAM vs. DRAM semiconductor RAM cells and ROM variants (PROM, EPROM, EEPROM, Flash).',
      'Explain Associative (CAM) parallel tag matching and Primary vs. Auxiliary storage.',
      'Solve cache address partitioning problems (Direct, Set-Associative, Fully Associative) and explain Virtual Memory paging and TLB translation.'
    ]
  }
};

export const LESSON_ENRICHMENT: Record<string, LessonEnrichment> = {
  // UNIT I
  'u1-c1': {
    learningObjectives: [
      'Convert between binary, octal, decimal, and hexadecimal for both integer and fractional parts.',
      'Use fast 3-bit (octal) and 4-bit (hex) grouping shortcuts accurately.'
    ],
    commonMistakes: [
      {
        mistake: 'Reading remainders top-to-bottom during repeated division of the integer part.',
        correction: 'Always read integer remainders bottom-to-top (last remainder = MSB), and fractional carries top-to-bottom.'
      },
      {
        mistake: 'Grouping binary fractions from right to left around the radix point.',
        correction: 'Group integer bits right-to-left from the radix point, and fractional bits left-to-right from the radix point (pad trailing zeros on the right).'
      }
    ],
    notebookNotes: [
      'Integer conversion: divide by target base r, collect remainders upward (MSB at bottom).',
      'Fraction conversion: multiply by target base r, collect integer carries downward.',
      'Binary ↔ Octal uses 3-bit groups; Binary ↔ Hexadecimal uses 4-bit groups.'
    ]
  },
  'u1-c2': {
    learningObjectives: [
      'Compute (r-1)’s and r’s complements in binary and decimal radices.',
      'Execute subtraction M - N via addition and interpret end-around carry vs. negative result.'
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to pad the subtrahend N with leading zeros to match the bit width of M.',
        correction: 'Always equalize both operands to n digits before taking 1’s or 2’s complement.'
      },
      {
        mistake: 'Adding end-around carry in 2’s complement subtraction.',
        correction: 'Discard the end carry in r’s (2’s/10’s) complement; ONLY add end-around carry in (r-1)’s (1’s/9’s) complement.'
      }
    ],
    notebookNotes: [
      '2’s comp = 1’s comp + 1 = copy from LSB up to first 1, then invert remaining bits.',
      'If M ≥ N: r’s comp produces an end carry (discard it, result is positive).',
      'If M < N: no end carry; take r’s comp of sum and attach a minus sign.'
    ]
  },
  'u1-c3': {
    learningObjectives: [
      'Encode decimal digits into 8421 BCD, 2421, Excess-3, and binary numbers into Gray code.',
      'Distinguish weighted vs. non-weighted and self-complementing codes.'
    ],
    commonMistakes: [
      {
        mistake: 'Treating multi-digit BCD conversion like pure binary conversion (e.g., writing 12 as 1100 in BCD).',
        correction: 'Convert EACH decimal digit separately to a 4-bit nibble: 12 in BCD is 0001 0010.'
      },
      {
        mistake: 'Forgetting the +6 correction when BCD addition yields 1010–1111 or a carry out.',
        correction: 'Whenever a 4-bit BCD sum > 9 or generates carry-out = 1, add 0110 (+6) to restore valid BCD.'
      }
    ],
    notebookNotes: [
      'Weighted codes: 8421 BCD, 2421, 5211. Non-weighted: Excess-3, Gray.',
      'Self-complementing codes (sum of weights = 9): Excess-3 and 2421.',
      'Gray code changes by exactly 1 bit per increment (unit-distance code).'
    ]
  },
  'u1-c4': {
    learningObjectives: [
      'Compute even/odd parity bits and explain parity limitations for multi-bit errors.',
      'Construct (7,4) Hamming codewords and use syndrome bits to locate and fix 1-bit errors.'
    ],
    commonMistakes: [
      {
        mistake: 'Placing parity bits at sequential indices 1, 2, 3 instead of powers of two.',
        correction: 'Parity bits ALWAYS occupy bit positions 2⁰=1, 2¹=2, 2²=4, 2³=8.'
      },
      {
        mistake: 'Including the wrong bit positions when checking P2 or P4.',
        correction: 'Check position index in binary: P1 checks bit indices with LSB=1 (1,3,5,7), P2 checks bit-1=1 (2,3,6,7), P4 checks bit-2=1 (4,5,6,7).'
      }
    ],
    notebookNotes: [
      'Minimum parity bits p must satisfy 2^p ≥ m + p + 1.',
      'Even parity: total number of 1s in covered group must be even.',
      'Syndrome C4C2C1 = 000 means no single-bit error; non-zero points directly to erroneous bit #.'
    ]
  },
  'u1-c5': {
    learningObjectives: [
      'State and prove Boolean algebra laws including Distributive, Consensus, and De Morgan’s theorems.',
      'Apply duality principle correctly to derive dual Boolean identities.'
    ],
    commonMistakes: [
      {
        mistake: 'Applying De Morgan’s theorem by keeping the operator unchanged: (A+B)’ = A’ + B’.',
        correction: 'Always break the bar AND flip the operator: (A+B)’ = A’·B’ and (A·B)’ = A’ + B’.'
      },
      {
        mistake: 'Confusing Dual with Complement of a Boolean expression.',
        correction: 'Dual swaps AND↔OR and 0↔1 WITHOUT complementing variables; Complement swaps AND↔OR, 0↔1 AND complements every variable.'
      }
    ],
    notebookNotes: [
      'Consensus Theorem: AB + A’C + BC = AB + A’C (BC is redundant).',
      'Absorption: A + AB = A and A(A + B) = A.',
      'Second Distributive Law (unique to Boolean algebra): A + BC = (A+B)(A+C).'
    ]
  },
  'u1-c6': {
    learningObjectives: [
      'Convert between truth tables, minterm (Σm) canonical SOP, and maxterm (ΠM) canonical POS.',
      'Expand standard forms into canonical minterm/maxterm forms.'
    ],
    commonMistakes: [
      {
        mistake: 'Writing 0 as uncomplemented variable in a maxterm.',
        correction: 'In a Minterm, 1=X and 0=X’ (product); in a Maxterm, 0=X and 1=X’ (sum), and Σm indices are exact complements of ΠM indices.'
      }
    ],
    notebookNotes: [
      'For n variables there are 2^n minterms (m_i) and 2^n maxterms (M_i), with m_i’ = M_i.',
      'F = Σm(missing indices in ΠM) directly converts SOP ↔ POS.',
      'Canonical form requires EVERY literal in EVERY term; Standard form allows missing literals.'
    ]
  },
  'u1-c7': {
    learningObjectives: [
      'Reduce algebraic Boolean expressions systematically to minimum literal count.',
      'Verify algebraic equivalence using intermediate steps and laws.'
    ],
    commonMistakes: [
      {
        mistake: 'Stopping simplification before checking Consensus (AB + A’C + BC) or Redundancy (A + A’B = A + B).',
        correction: 'Always scan for A + A’B = A + B and redundant consensus pairs after factoring.'
      }
    ],
    notebookNotes: [
      'Order of attack: 1) De Morgan, 2) Factor common terms, 3) Apply X+X’=1, 4) Apply A+A’B=A+B, 5) Drop consensus terms.'
    ]
  },
  'u1-c8': {
    learningObjectives: [
      'Identify IEEE logic symbols, truth tables, and Boolean equations for all 7 basic/universal/derived gates.',
      'Implement any Boolean function using only NAND gates or only NOR gates.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming NAND and NOR are associative: (A NAND B) NAND C = A NAND (B NAND C).',
        correction: 'NAND and NOR are commutative but NOT associative! Multi-input NAND ≠ cascaded 2-input NANDs without inversion.'
      }
    ],
    notebookNotes: [
      'Universal Gates: NAND and NOR can build NOT, AND, OR, XOR, and any logic circuit.',
      'Two-level SOP maps directly to NAND–NAND; two-level POS maps directly to NOR–NOR.',
      'Bubbled OR = NAND; Bubbled AND = NOR (De Morgan equivalents).'
    ]
  },

  // UNIT II
  'u2-c1': {
    learningObjectives: [
      'Construct 2-, 3-, and 4-variable Karnaugh maps with Gray-code labeling and plot SOP/POS/don’t-care cells.',
      'Identify Prime Implicants (PIs) and Essential Prime Implicants (EPIs) to obtain minimal expressions.'
    ],
    commonMistakes: [
      {
        mistake: 'Labeling K-map rows/columns as 00, 01, 10, 11 instead of 00, 01, 11, 10.',
        correction: 'Adjacent cells must differ by ONLY 1 bit (Gray sequence: 00, 01, 11, 10).'
      },
      {
        mistake: 'Including an all-X (don’t-care only) group or forming groups of size 3 or 6.',
        correction: 'Group sizes MUST be powers of 2 (1, 2, 4, 8, 16) and never cover only X cells.'
      }
    ],
    notebookNotes: [
      'Always form the LARGEST possible power-of-2 rectangles (including wrap-around edges & corners).',
      'Start by encircling minterms covered by ONLY ONE prime implicant (these are Essential PIs).',
      'Grouping 2^k cells in an n-variable map leaves (n - k) literals in that product term.'
    ]
  },
  'u2-c2': {
    learningObjectives: [
      'Group minterms by Hamming weight (number of 1s) and iteratively combine terms differing by 1 bit.',
      'Build a Prime Implicant (PI) chart to identify essential prime implicants and minimal cover.'
    ],
    commonMistakes: [
      {
        mistake: 'Combining terms from adjacent groups whose dash (‘-’) positions do not align.',
        correction: 'Two terms can merge ONLY if dashes appear in identical bit positions and the remaining bits differ in exactly ONE bit.'
      },
      {
        mistake: 'Including don’t-care minterms as required columns in the PI cover chart.',
        correction: 'Include don’t-cares during Phase 1 grouping, then OMIT don’t-care columns from the Phase 2 PI selection chart!'
      }
    ],
    notebookNotes: [
      'Stage 1: Group by count of 1s → merge adjacent groups differing by 1 bit → repeat until no merges occur.',
      'Stage 2: Unchecked terms are Prime Implicants → cross-mark required minterms → pick columns with single X (EPIs).'
    ]
  },
  'u2-c3': {
    learningObjectives: [
      'Derive Boolean equations and logic diagrams for Half Adder (2 inputs) and Full Adder (3 inputs).',
      'Construct a Full Adder using two Half Adders and an OR gate, and explain Ripple Carry Adder propagation.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Half Adder can add multi-bit numbers without modification.',
        correction: 'Half Adder has no Carry-In (C_in), so multi-bit LSB can use a Half Adder, while all higher bits require a Full Adder.'
      }
    ],
    notebookNotes: [
      'Half Adder: Sum = A ⊕ B, Carry = A·B.',
      'Full Adder: Sum = A ⊕ B ⊕ C_in, Carry = AB + C_in(A ⊕ B).',
      '4-bit Ripple Carry Adder delay = 4 × full-adder carry delay.'
    ]
  },
  'u2-c4': {
    learningObjectives: [
      'Derive Difference and Borrow equations for Half Subtractor and Full Subtractor.',
      'Explain how a single 4-bit Adder-Subtractor handles both M+N and M-N using XOR gates and Mode control M.'
    ],
    commonMistakes: [
      {
        mistake: 'Writing Borrow_out = A·B’ instead of A’·B for subtraction A - B.',
        correction: 'A borrow occurs when minuend A=0 and subtrahend B=1, so Borrow = A’·B.'
      }
    ],
    notebookNotes: [
      'Half Subtractor: Diff = A ⊕ B, Borrow = A’B.',
      'Full Subtractor: Diff = A ⊕ B ⊕ B_in, Borrow = A’B + B_in(A ⊕ B)’.',
      'Adder-Subtractor: when Mode M=1, B_i ⊕ 1 = B_i’ and C_0 = 1 → computes A + B’ + 1 (2’s complement subtraction).'
    ]
  },
  'u2-c5': {
    learningObjectives: [
      'Design 1-bit and 2-bit/4-bit Magnitude Comparators using equality XNOR terms x_i = A_i ⊙ B_i.',
      'Write hierarchical priority expressions for A > B, A = B, and A < B.'
    ],
    commonMistakes: [
      {
        mistake: 'Comparing LSBs before MSBs in multi-bit magnitude comparison.',
        correction: 'Magnitude priority ALWAYS starts from the MSB downward; lower bits matter only if all higher bit pairs are equal (x_3 = x_2 = ... = 1).'
      }
    ],
    notebookNotes: [
      'Bit equality: x_i = (A_i ⊙ B_i) = A_i B_i + A_i’ B_i’.',
      '4-bit (A = B) = x_3 x_2 x_1 x_0.',
      '4-bit (A > B) = A_3 B_3’ + x_3 A_2 B_2’ + x_3 x_2 A_1 B_1’ + x_3 x_2 x_1 A_0 B_0’.'
    ]
  },
  'u2-c6': {
    learningObjectives: [
      'Analyze 2:1, 4:1, and 8:1 Multiplexer architectures and implement arbitrary Boolean functions using an n-to-1 MUX.',
      'Use an n-1 select-line MUX with the remaining variable folded into data inputs (0, 1, D, D’).'
    ],
    commonMistakes: [
      {
        mistake: 'Swapping MSB and LSB select lines when mapping minterms to MUX inputs I_0..I_k.',
        correction: 'Keep MSB select line aligned with the most significant variable in the truth table.'
      }
    ],
    notebookNotes: [
      '2^n : 1 MUX has 2^n data inputs, n select lines, and 1 output.',
      'A 4:1 MUX can implement ANY 3-variable Boolean function using 2 variables as select lines.'
    ]
  },
  'u2-c7': {
    learningObjectives: [
      'Design 1:2 and 1:4 Demultiplexers and contrast their role with Multiplexers.',
      'Explain how a Decoder with an Enable input functions directly as a Demultiplexer.'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking a DEMUX generates new logic functions by itself without a data source.',
        correction: 'A DEMUX routes 1 input bit D to 1 of 2^n outputs; unselected outputs stay inactive (0 for active-HIGH).'
      }
    ],
    notebookNotes: [
      '1 : 2^n DEMUX: 1 data input, n select lines, 2^n output lines.',
      'Y_i = D · m_i(select lines).'
    ]
  },
  'u2-c8': {
    learningObjectives: [
      'Design 2:4 and 3:8 Decoders and realize SOP Boolean functions by OR-ing decoder minterm outputs.',
      'Design 4:2 Binary and Priority Encoders and derive the Valid (V) output bit.'
    ],
    commonMistakes: [
      {
        mistake: 'Confusing Encoder (2^n inputs → n outputs) with Decoder (n inputs → 2^n outputs).',
        correction: 'Remember: DE-coder EXPANDS n bits into 2^n minterm lines; EN-coder COMPRESSES 2^n lines into n-bit binary.'
      }
    ],
    notebookNotes: [
      'n-to-2^n Decoder generates all 2^n minterms (active-HIGH) or maxterms (active-LOW).',
      'Priority Encoder assigns precedence when multiple inputs are 1 simultaneously; Valid bit V = OR of all inputs.'
    ]
  },

  // UNIT III
  'u3-c1': {
    learningObjectives: [
      'Contrast combinational and sequential logic circuits across memory, feedback, clock, and state.',
      'Distinguish synchronous (clocked) vs. asynchronous (unclocked) sequential systems.'
    ],
    commonMistakes: [
      {
        mistake: 'Treating a combinational circuit with many gates as sequential because it has propagation delay.',
        correction: 'Sequential behavior strictly requires a feedback memory path storing past state Q(t).'
      }
    ],
    notebookNotes: [
      'Combinational: Output = f(Present Inputs only); no feedback, no memory.',
      'Sequential: Output = f(Present Inputs, Present State Q(t)); uses feedback/flip-flops.'
    ]
  },
  'u3-c2': {
    learningObjectives: [
      'Analyze cross-coupled NOR (active-HIGH S,R) and cross-coupled NAND (active-LOW S’,R’) latches.',
      'Trace hold, set, reset, and forbidden states step by step.'
    ],
    commonMistakes: [
      {
        mistake: 'Using active-HIGH rules on a basic cross-coupled NAND latch.',
        correction: 'Basic NAND latch is active-LOW (S’=0 sets Q=1; S’=R’=0 is forbidden; S’=R’=1 holds state).'
      }
    ],
    notebookNotes: [
      'NOR SR Latch: S=R=0 Hold; S=1,R=0 Set; S=0,R=1 Reset; S=R=1 Forbidden (Q=Q’=0).',
      'Latches are level-sensitive (transparent whenever Enable is active).'
    ]
  },
  'u3-c3': {
    learningObjectives: [
      'Explain edge-triggered SR and D flip-flops and why D flip-flop eliminates the forbidden state.',
      'Write characteristic equations Q(t+1) for SR and D flip-flops.'
    ],
    commonMistakes: [
      {
        mistake: 'Ignoring the constraint S·R = 0 in the SR characteristic equation.',
        correction: 'Q(t+1) = S + R’Q is valid ONLY under the constraint SR = 0.'
      }
    ],
    notebookNotes: [
      'SR FF: Q(t+1) = S + R’Q (with SR = 0).',
      'D FF: Q(t+1) = D (transparent data storage on clock edge; zero forbidden states).'
    ]
  },
  'u3-c4': {
    learningObjectives: [
      'Explain how JK flip-flop converts S=R=1 into Toggle and why race-around condition occurs in level-triggered JK latches.',
      'Describe how JK Master-Slave and T (Toggle) flip-flops eliminate race-around oscillation.'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking race-around occurs on narrow edge-triggered flip-flops.',
        correction: 'Race-around happens in level-triggered JK latches when J=K=1 and clock pulse width t_p > t_pd (propagation delay).'
      }
    ],
    notebookNotes: [
      'JK FF: Q(t+1) = JQ’ + K’Q. When J=K=1 → Toggle (Q’)!',
      'Master-Slave JK: Master samples on CLK=1; Slave updates on falling edge CLK=0 → immune to race-around.',
      'T FF (J=K=T): Q(t+1) = T ⊕ Q (divides clock frequency by 2 when T=1).'
    ]
  },
  'u3-c5': {
    learningObjectives: [
      'Construct full excitation tables (Q(t), Q(t+1) → required inputs) for SR, JK, D, and T flip-flops.',
      'Explain why don’t-care (X) entries in SR and JK excitation tables simplify sequential design.'
    ],
    commonMistakes: [
      {
        mistake: 'Confusing the Characteristic Table (Inputs + Q(t) → Q(t+1)) with the Excitation Table (Q(t) + Q(t+1) → Inputs).',
        correction: 'Characteristic predicts next output during analysis; Excitation finds required inputs during circuit synthesis.'
      }
    ],
    notebookNotes: [
      'D excitation: D = Q(t+1). T excitation: T = Q(t) ⊕ Q(t+1).',
      'JK excitation: 0→0 (0,X), 0→1 (1,X), 1→0 (X,1), 1→1 (X,0).'
    ]
  },
  'u3-c6': {
    learningObjectives: [
      'Execute the 4-step flip-flop conversion procedure from any available FF to any target FF.',
      'Draw the complete converted logic circuit combining combinational gates with the available FF.'
    ],
    commonMistakes: [
      {
        mistake: 'Looking up the excitation table of the TARGET flip-flop instead of the AVAILABLE flip-flop.',
        correction: 'Always use the TARGET FF’s characteristic table to find Q(t+1), and the AVAILABLE FF’s excitation table to solve for its inputs!'
      }
    ],
    notebookNotes: [
      'Key conversions: JK → D (J=D, K=D’); JK → T (J=K=T); D → T (D = T ⊕ Q); T → D (T = D ⊕ Q).'
    ]
  },

  // UNIT IV
  'u4-c1': {
    learningObjectives: [
      'Classify computer types (Micro, Mini, Mainframe, Supercomputer, Embedded) by scale and application.',
      'Draw and explain the five functional units of a stored-program digital computer.'
    ],
    commonMistakes: [
      {
        mistake: 'Placing the Control Unit inside Main Memory instead of the CPU.',
        correction: 'The CPU consists of the ALU (data processing), Control Unit (timing/control signals), and Registers.'
      }
    ],
    notebookNotes: [
      'Five Von Neumann functional units: Input, Output, Memory, ALU, Control Unit.',
      'Von Neumann stores both instructions and data inside the same memory.'
    ]
  },
  'u4-c2': {
    learningObjectives: [
      'Trace the Fetch–Decode–Execute cycle step by step using registers PC, MAR, MDR, IR, and AC.',
      'Explain how Control Unit signals sequence register transfers.'
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting when the Program Counter (PC) increments during fetch.',
        correction: 'PC increments to point to the next sequential instruction immediately after loading its current address into MAR / fetching the instruction.'
      }
    ],
    notebookNotes: [
      'Instruction Fetch: MAR ← PC; MDR ← M[MAR], PC ← PC + 1; IR ← MDR.',
      'MAR holds memory addresses; MDR buffers data/instructions moving to/from memory.'
    ]
  },
  'u4-c3': {
    learningObjectives: [
      'Compare Single-Bus, Two-Bus, and Three-Bus CPU/system organizations.',
      'Explain bus arbitration, data/address/control lines, and bus contention issues.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming the Address Bus is bidirectional like the Data Bus.',
        correction: 'Address Bus is unidirectional (CPU/DMA master → Memory/I/O), whereas the Data Bus is bidirectional.'
      }
    ],
    notebookNotes: [
      'System Bus = Address Bus + Data Bus + Control Bus.',
      'Single bus is low-cost but allows only one transfer per cycle (requires temporary register Y/Z in ALU ops).'
    ]
  },
  'u4-c4': {
    learningObjectives: [
      'Explain Mano’s Stored Program Organization and list the roles and bit widths of key CPU registers.',
      'Contrast 3-address, 2-address, 1-address (Accumulator), and 0-address (Stack) instruction formats.'
    ],
    commonMistakes: [
      {
        mistake: 'Confusing 0-address stack instructions as having no operands at all.',
        correction: '0-address instructions use implicit operands at the Top of Stack (TOS), except PUSH/POP which take one memory address.'
      }
    ],
    notebookNotes: [
      'PC (12-bit), AR (12-bit), DR (16-bit), AC (16-bit), IR (16-bit), TR (16-bit) in Mano’s basic computer.',
      'Fewer addresses per instruction → shorter instructions, more instructions needed per task.'
    ]
  },
  'u4-c5': {
    learningObjectives: [
      'Draw the I/O Interface block diagram and explain Address Decoder, Control/Status Registers, and Data Buffers.',
      'Compare Memory-Mapped I/O and Isolated (I/O-Mapped) I/O.'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking peripherals connect directly to the system data bus without synchronization logic.',
        correction: 'An I/O interface bridges speed, voltage, format, and bus protocol mismatches between CPU and slow peripherals.'
      }
    ],
    notebookNotes: [
      'Memory-Mapped I/O shares memory address space and uses standard memory instructions.',
      'Isolated I/O uses separate IN/OUT instructions and separate IORD/IOWR control lines.'
    ]
  },
  'u4-c6': {
    learningObjectives: [
      'Compare Programmed I/O (polling), Interrupt-Driven I/O, and Direct Memory Access (DMA).',
      'Trace the DMA cycle using BR (Bus Request), BG (Bus Grant), and burst vs. cycle-stealing modes.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming the CPU stays actively moving every word during a DMA transfer.',
        correction: 'The CPU only initializes DMA (Address, Word Count, Mode); the DMA controller transfers directly to/from RAM and interrupts CPU upon completion.'
      }
    ],
    notebookNotes: [
      'Polling wastes CPU cycles; Interrupts alert CPU only when ready; DMA bypasses CPU for bulk blocks.',
      'DMA Cycle Stealing borrows 1 memory cycle at a time; Burst mode takes the bus for the whole block.'
    ]
  },
  'u4-c7': {
    learningObjectives: [
      'Draw timing diagrams for Source-Initiated and Destination-Initiated Strobe data transfers.',
      'Explain 2-wire Request/Acknowledge Handshaking and why it prevents data loss or double reading.'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Strobe control guarantees the receiver actually read the data.',
        correction: 'Strobe has NO feedback acknowledgement; Handshaking solves this with REQ + ACK closed-loop signals.'
      }
    ],
    notebookNotes: [
      'Strobe: single control line (sender does not know if receiver latched data).',
      'Handshaking: REQ (Data Valid) → Receiver latches → ACK (Data Accepted) → REQ drops → ACK drops.'
    ]
  },

  // UNIT V
  'u5-c1': {
    learningObjectives: [
      'Explain the Speed–Size–Cost tradeoff across CPU Registers, Cache, Main Memory, and Secondary Storage.',
      'Define access time, cycle time, bandwidth, and Principle of Locality (temporal & spatial).'
    ],
    commonMistakes: [
      {
        mistake: 'Equating Access Time with Memory Cycle Time.',
        correction: 'Cycle Time = Access Time + Recovery/Precharge Time (crucial in destructive-read or DRAM memories).'
      }
    ],
    notebookNotes: [
      'Moving down hierarchy: Cost/bit ↓, Capacity ↑, Access Time ↑ (slower).',
      'Effective Access Time: T_avg = H·T_cache + (1 - H)·(T_cache + T_mem).'
    ]
  },
  'u5-c2': {
    learningObjectives: [
      'Contrast 6-transistor SRAM cells with 1-transistor/1-capacitor DRAM cells (refresh, speed, density).',
      'Calculate total address pins and decoder/chip count when building larger memory banks.'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking SRAM needs periodic refresh like DRAM.',
        correction: 'SRAM uses bistable flip-flops so it retains data without refresh as long as power is on; only DRAM capacitor charge leaks and needs refresh.'
      }
    ],
    notebookNotes: [
      'SRAM = fast, expensive, 6T, no refresh → used for CPU Cache.',
      'DRAM = high density, cheap, 1T+1C, needs periodic refresh → used for Main Memory.'
    ]
  },
  'u5-c3': {
    learningObjectives: [
      'Differentiate Masked ROM, PROM, EPROM (UV erasable), EEPROM (byte erasable), and Flash (block erasable).',
      'Explain how ROMs implement combinational look-up tables.'
    ],
    commonMistakes: [
      {
        mistake: 'Confusing EEPROM with Flash erase granularity.',
        correction: 'EEPROM erases/writes at byte level; Flash erases in large sectors/blocks for higher density.'
      }
    ],
    notebookNotes: [
      'Non-volatile memories retain firmware/BIOS without power.',
      'EPROM requires UV light through a quartz window; EEPROM and Flash are electrically erasable.'
    ]
  },
  'u5-c4': {
    learningObjectives: [
      'Compare Primary Memory (RAM/ROM, CPU-directly addressable) and Auxiliary Storage (HDD, SSD, Optical, Magnetic Tape).',
      'Explain sequential access vs. random/direct access storage mechanisms.'
    ],
    commonMistakes: [
      {
        mistake: 'Thinking the CPU executes instructions directly off an HDD or SSD.',
        correction: 'Instructions/data on auxiliary storage must first be loaded into Primary Memory (RAM) before CPU fetch.'
      }
    ],
    notebookNotes: [
      'Primary: volatile (mostly), ns access, directly on memory bus.',
      'Auxiliary: non-volatile, μs–ms access, accessed via I/O & DMA controllers.'
    ]
  },
  'u5-c5': {
    learningObjectives: [
      'Explain the hardware architecture of Associative Memory (CAM): Argument Register (A), Key Register (K), and Match Logic (M).',
      'Derive match cell equation m_i and describe parallel content-based search in TLBs and caches.'
    ],
    commonMistakes: [
      {
        mistake: 'Searching associative memory using a numeric address instead of data content.',
        correction: 'CAM searches ALL words simultaneously in parallel by matching a masked data key against stored contents.'
      }
    ],
    notebookNotes: [
      'Associative search time is O(1) parallel hardware comparison.',
      'Key register K masks bits: K_j = 1 requires match (A_j ⊙ F_ij), K_j = 0 treats bit as don’t care.'
    ]
  },
  'u5-c6': {
    learningObjectives: [
      'Partition physical addresses into Tag, Set/Line Index, and Block Offset for Direct, k-Way Set-Associative, and Fully Associative caches.',
      'Compare hit rate, conflict misses, tag comparator hardware cost, and replacement policies (LRU, FIFO).'
    ],
    commonMistakes: [
      {
        mistake: 'Using total cache size instead of (cache lines / associativity) to compute Set Index bits.',
        correction: 'Number of Sets S = (Total Cache Size) / (Block Size × Associativity k); Index bits = log2(S).'
      }
    ],
    notebookNotes: [
      'Direct Mapped (k=1): Index = L mod C_lines; cheap 1 comparator, high conflict misses.',
      'Fully Associative (S=1): 0 Index bits; all bits except Offset are Tag.',
      'Tag bits = W - Index bits - Offset bits.'
    ]
  },
  'u5-c7': {
    learningObjectives: [
      'Explain Virtual Memory address translation using Page Number, Page Offset, Page Table, and TLB.',
      'Describe page faults, working sets, thrashing, and memory management protection requirements.'
    ],
    commonMistakes: [
      {
        mistake: 'Changing the Page Offset bits during Virtual-to-Physical address translation.',
        correction: 'ONLY the Virtual Page Number (VPN) translates to a Physical Frame Number (PFN); the Page Offset bits stay identical!'
      }
    ],
    notebookNotes: [
      'Memory Management Requirements: Relocation, Protection, Sharing, Logical & Physical Organization.',
      'TLB is an associative cache for recent VPN → PFN page-table entries.',
      'Page fault triggers OS to swap the needed page from auxiliary disk into a RAM frame.'
    ]
  }
};
