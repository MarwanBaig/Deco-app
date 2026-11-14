import { Unit, ExamQuestion, QuizQuestion } from '../types/academic';

export const UNIT_4: Unit = {
  id: 'unit-4',
  number: 'Unit IV',
  title: 'Basic Structure of Computers & I/O Organization',
  syllabusExactText:
    'Basic Structure of Computers: Computer Types, Block diagram of Digital computer, Basic Operational Concepts, Bus Structures, Stored program organization and computer registers, Instruction formats, Input/output Organization: Block diagram of I/O organization, Interrupts, direct memory access. Asynchronous data transfer: strobe control and hand shaking.',
  description:
    'Computer classifications, functional block diagram, operational instruction cycle, bus structures, stored-program registers, instruction formats, I/O interface, interrupts, DMA, and asynchronous strobe/handshaking.',
  chapters: [
    {
      id: 'u4-c1',
      unitId: 'unit-4',
      chapterNumber: '4.1',
      title: 'Computer Types & Block Diagram of a Digital Computer',
      syllabusTopic: 'Computer Types, Block diagram of Digital computer',
      estimatedMinutes: 20,
      diagramType: 'computer-block-diagram',
      diagramCaption: 'Five functional units of a Digital Computer: Input, Memory, Arithmetic & Logic Unit (ALU), Control Unit, and Output.',
      introduction: {
        meaning:
          'Computer Organization studies how the hardware subsystems of a digital computer—processor, memory, buses, and I/O—are interconnected and coordinated to execute programs.',
        importance:
          'Bridges logic gates and flip-flops (Units I–III) to real programmable machines capable of running software.',
        whereUsed:
          'Microcontrollers, laptops, workstations, cloud servers, and supercomputers.',
        problemSolved:
          'Organizes billions of transistors into five modular functional blocks with clear data and control flows.'
      },
      fundamentalConcept: {
        overview:
          'Every digital computer—from a smartwatch microcontroller to an exascale supercomputer—implements five core functional units: Input, Memory, Arithmetic & Logic (ALU), Control (CU), and Output.',
        terms: [
          { term: 'CPU (Processor)', meaning: 'Combination of the Arithmetic & Logic Unit (ALU) and Control Unit (CU) plus internal registers.' },
          { term: 'Primary (Main) Memory', meaning: 'Fast semiconductor RAM holding active program instructions and data.' },
          { term: 'Control Unit (CU)', meaning: 'The nervous system of the computer that generates timing and control signals governing all transfers.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Classification of Computer Types',
          table: {
            caption: 'Major Classes of Digital Computers',
            headers: ['Computer Type', 'Scale & Capacity', 'Typical Applications'],
            rows: [
              ['Embedded Systems / Microcomputers', 'Single-chip or compact PC/laptop', 'Home appliances, personal computing, IoT'],
              ['Workstations', 'High-resolution graphics & fast floating-point CPU', 'CAD, 3D modeling, AI/ML model prototyping'],
              ['Enterprise Servers / Mainframes', 'High I/O throughput, massive RAM, multi-user', 'Banking transactions, cloud web hosting'],
              ['Supercomputers', 'Thousands of parallel CPUs/GPUs', 'Climate modeling, molecular dynamics, large-scale AI training']
            ]
          }
        },
        {
          heading: '2. Five Functional Units of a Digital Computer',
          bullets: [
            'Input Unit: Accepts coded information from keyboards, mice, sensors, or network interfaces and converts it to binary.',
            'Memory Unit: Stores instructions and data in addressable words (Primary RAM for speed; Secondary SSD/HDD for bulk capacity).',
            'ALU (Arithmetic & Logic Unit): Executes arithmetic (+, −, ×, ÷) and logic (AND, OR, NOT, shift, compare) on binary operands in registers.',
            'Control Unit: Fetches instructions from memory, decodes opcodes, and issues control signals to ALU, Memory, and I/O.',
            'Output Unit: Sends processed binary results to displays, printers, actuators, or storage.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u4-c1-ex1',
          title: 'Memory Word Capacity & Address Bit Calculation',
          problemStatement: 'A digital computer has a Main Memory of 64K words, where each word is 32 bits wide. Calculate (a) the number of address bits required, and (b) total memory capacity in Bytes.',
          given: ['Word count = 64K = 64 × 1024 = 65,536 words', 'Word size = 32 bits = 4 Bytes'],
          required: 'Address bus width and total byte capacity',
          formulaLatex: 'N_{\\text{words}} = 2^k, \\qquad \\text{Bytes} = \\frac{N_{\\text{words}} \\times \\text{Word bits}}{8}',
          substitutionLatex: '64\\text{K} = 2^6 \\times 2^{10} = 2^{16}, \\quad \\text{Bytes} = 65536 \\times 4',
          calculationSteps: [
            '64K = 64 × 1024 = 2⁶ × 2¹⁰ = 2¹⁶ words → requires k = 16 address lines.',
            '32 bits per word = 32 / 8 = 4 Bytes per word.',
            'Total capacity = 65,536 × 4 = 262,144 Bytes = 256 KB.'
          ],
          finalAnswer: '16 address bits; 256 KB total capacity',
          interpretation: 'Word-addressable size determines address lines, while word width scales total byte storage.'
        }
      ],
      formulas: [
        {
          id: 'f-u4-1',
          unitId: 'unit-4',
          chapterId: 'u4-c1',
          chapterTitle: 'Computer Types & Block Diagram of a Digital Computer',
          name: 'Addressable Memory Space',
          latex: 'M_{\\text{words}} = 2^k \\implies k = \\log_2(M_{\\text{words}})',
          symbols: [
            { symbol: 'k', meaning: 'Number of bits in the address bus / MAR' },
            { symbol: 'M_words', meaning: 'Total number of uniquely addressable memory locations' }
          ],
          units: 'Bits / Locations',
          conditions: 'Applies to binary-addressed primary memory.',
          miniExample: 'A 20-bit address bus addresses 2²⁰ = 1,048,576 (1M) locations.'
        }
      ],
      applications: [
        { area: 'Embedded SoC Design', detail: 'System-on-Chip architectures integrate CPU, SRAM, and I/O peripherals using these exact five functional boundaries.' }
      ],
      summary: [
        'Digital computers span Embedded/Personal systems, Workstations, Servers/Mainframes, and Supercomputers.',
        'All digital computers comprise five functional units: Input, Memory, ALU, Control Unit, and Output.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'ALU', definition: 'Performs arithmetic and bitwise logic operations on register operands.' },
          { term: 'Control Unit', definition: 'Coordinates instruction fetch, decode, and execution via timing signals.' }
        ],
        corePoints: [
          'CPU = ALU + Control Unit + Registers.',
          '1K = 2¹⁰ = 1024; 1M = 2²⁰; 1G = 2³⁰.'
        ],
        examReminders: [
          'In the block diagram, draw solid arrows for data/instruction paths and dashed/labeled arrows from Control Unit to every other unit for control signals.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c1-q1',
          question: 'Which two units together form the Central Processing Unit (CPU)?',
          options: ['Input and Memory', 'ALU and Control Unit', 'Memory and Output', 'Cache and Auxiliary Storage'],
          correctIndex: 1,
          explanation: 'The CPU comprises the ALU, Control Unit, and processor registers.'
        },
        {
          id: 'u4-c1-q2',
          question: 'How many address lines are needed to address 1M (1,048,576) memory words?',
          options: ['10', '16', '20', '32'],
          correctIndex: 2,
          explanation: '1M = 2²⁰, so 20 address bits are needed.'
        },
        {
          id: 'u4-c1-q3',
          question: 'Which functional unit sends timing and control signals to all other subsystems?',
          options: ['ALU', 'Control Unit', 'Input Unit', 'Primary Memory'],
          correctIndex: 1,
          explanation: 'The Control Unit acts as the coordinator issuing Read/Write and ALU control signals.'
        }
      ]
    },
    {
      id: 'u4-c2',
      unitId: 'unit-4',
      chapterNumber: '4.2',
      title: 'Basic Operational Concepts & Bus Structures',
      syllabusTopic: 'Basic Operational Concepts, Bus Structures',
      estimatedMinutes: 25,
      diagramType: 'bus-structures',
      diagramCaption: 'Single-Bus Architecture linking Processor, Memory, and I/O via Address, Data, and Control lines.',
      introduction: {
        meaning:
          'Basic Operational Concepts explain step-by-step how an instruction moves from memory into the CPU to execute, while Bus Structures define the shared electrical pathways linking computer modules.',
        importance:
          'Understanding the Fetch–Decode–Execute flow with MAR, MDR, PC, and IR is fundamental to all computer architecture.',
        whereUsed:
          'CPU-to-memory interconnects, PCIe/AMBA system buses, and microcontroller pinouts.',
        problemSolved:
          'Replaces expensive point-to-point wiring between every pair of devices with a shared, standardized multi-line Bus.'
      },
      fundamentalConcept: {
        overview:
          'A Bus is a group of parallel wires carrying signals between subsystems, divided into three functional groups: Address Bus (unidirectional from CPU), Data Bus (bidirectional), and Control Bus (Read/Write, Clock, Interrupts).',
        terms: [
          { term: 'PC (Program Counter)', meaning: 'Holds the memory address of the NEXT instruction to be fetched.' },
          { term: 'IR (Instruction Register)', meaning: 'Holds the instruction currently being decoded and executed.' },
          { term: 'MAR (Memory Address Register)', meaning: 'Holds the address of the memory location to be read from or written to.' },
          { term: 'MDR (Memory Data Register)', meaning: 'Holds the data word just fetched from memory or about to be written to memory.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Step-by-Step Operational Concept (Instruction Execution)',
          steps: [
            'PC holds the address of the first instruction. Its contents are transferred to MAR, and a Read signal is sent on the Control Bus.',
            'Memory places the addressed instruction word on the Data Bus, which loads into MDR, and then transfers into IR.',
            'Meanwhile, PC is incremented (PC ← PC + 1 or + 4) to point to the next instruction.',
            'Control Unit decodes the instruction in IR. If an operand in memory is needed (e.g., `Add LOCA, R0`), LOCA is loaded into MAR → Read → operand arrives in MDR.',
            'ALU adds MDR and R0 and stores the sum back in R0.'
          ]
        },
        {
          heading: '2. Single-Bus vs. Multiple-Bus Structures',
          table: {
            caption: 'Comparison of Bus Topologies',
            headers: ['Topology', 'Hardware Cost', 'Concurrency & Speed', 'Use Case'],
            rows: [
              ['Single-Bus Structure', 'Low (1 shared bus)', 'Lower (only 1 transfer at a time)', 'Low-cost embedded controllers'],
              ['Two-Bus / Multi-Bus Structure', 'Higher (buffer registers & extra lines)', 'High (CPU-Memory separate from I/O or 3-bus ALU)', 'Modern high-performance CPUs']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u4-c2-ex1',
          title: 'Micro-Operations for Fetching and Executing LOAD R1, [2000]',
          problemStatement: 'Write the register-transfer sequence to fetch an instruction located at PC = 1000 and execute `LOAD R1, [2000]`.',
          given: ['Initial PC = 1000', 'Instruction at 1000: LOAD R1, [2000]', 'Memory[2000] = 45'],
          required: 'Register-transfer steps through MAR, MDR, IR, PC, R1',
          formulaLatex: '\\text{Fetch: } MAR \\leftarrow PC; \\; MDR \\leftarrow M[MAR]; \\; IR \\leftarrow MDR; \\; PC \\leftarrow PC + 1',
          substitutionLatex: '\\text{Execute: } MAR \\leftarrow IR_{\\text{addr}}(2000); \\; MDR \\leftarrow M[2000]; \\; R1 \\leftarrow MDR',
          calculationSteps: [
            'T1: MAR ← 1000 (from PC), issue Memory Read.',
            'T2: MDR ← M[1000] (`LOAD R1, [2000]`), and PC ← 1001.',
            'T3: IR ← MDR; CU decodes opcode LOAD and address field 2000.',
            'T4: MAR ← 2000, issue Memory Read.',
            'T5: MDR ← 45; R1 ← MDR (R1 now holds 45).'
          ],
          finalAnswer: 'PC = 1001, IR = LOAD R1, [2000], R1 = 45',
          interpretation: 'Notice that every memory access always passes through the MAR (for address) and MDR (for data).'
        }
      ],
      formulas: [
        {
          id: 'f-u4-2',
          unitId: 'unit-4',
          chapterId: 'u4-c2',
          chapterTitle: 'Basic Operational Concepts & Bus Structures',
          name: 'Bus Bandwidth (Peak Data Transfer Rate)',
          latex: '\\text{Bus Bandwidth} = W_{\\text{bytes}} \\times f_{\\text{bus}}',
          symbols: [
            { symbol: 'W_bytes', meaning: 'Data bus width in bytes (bits / 8)' },
            { symbol: 'f_bus', meaning: 'Bus clock frequency (cycles per second, Hz)' }
          ],
          units: 'Bytes/sec (MB/s or GB/s)',
          conditions: 'Assumes 1 data word transferred per bus clock cycle.',
          miniExample: 'A 64-bit (8-Byte) data bus running at 200 MHz has peak bandwidth = 8 × 200 MB/s = 1.6 GB/s.'
        }
      ],
      applications: [
        { area: 'Buffer Registers on Shared Buses', detail: 'Because I/O devices (keyboard) are much slower than Memory/CPU, buffer registers prevent slow peripherals from stalling the CPU.' }
      ],
      summary: [
        'Key CPU–Memory interface registers: PC, IR, MAR, MDR, and General-Purpose Registers (R0–Rn).',
        'A System Bus comprises Address (unidirectional), Data (bidirectional), and Control lines.',
        'Single-bus minimizes cost; multi-bus increases concurrency by allowing parallel transfers.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'MAR / MDR', definition: 'MAR holds memory address; MDR holds memory data.' },
          { term: 'PC / IR', definition: 'PC points to next instruction; IR holds current instruction.' }
        ],
        corePoints: [
          'Address Bus = Unidirectional (CPU → Memory/IO).',
          'Data Bus = Bidirectional (CPU ↔ Memory/IO).',
          'Control Bus = Read, Write, Clock, Reset, IRQ.'
        ],
        examReminders: [
          'Always mention that speed mismatch between CPU and I/O on a single bus is managed using buffer registers and wait/ready control signals.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c2-q1',
          question: 'Which CPU register holds the memory address of the NEXT instruction to be fetched?',
          options: ['IR', 'MDR', 'PC', 'MAR'],
          correctIndex: 2,
          explanation: 'The Program Counter (PC) automatically increments to point to the next instruction.'
        },
        {
          id: 'u4-c2-q2',
          question: 'Which bus is strictly unidirectional from the CPU to Memory and I/O devices?',
          options: ['Data Bus', 'Address Bus', 'Power Bus', 'Local Register Bus'],
          correctIndex: 1,
          explanation: 'Only the CPU (or active bus master/DMA) outputs addresses onto the Address Bus.'
        },
        {
          id: 'u4-c2-q3',
          question: 'Which register temporarily holds the instruction word immediately after it is read from memory for decoding?',
          options: ['PC', 'MAR', 'IR', 'SP'],
          correctIndex: 2,
          explanation: 'The Instruction Register (IR) holds the fetched instruction while the Control Unit decodes it.'
        }
      ]
    },
    {
      id: 'u4-c3',
      unitId: 'unit-4',
      chapterNumber: '4.3',
      title: 'Stored Program Organization & Computer Registers',
      syllabusTopic: 'Stored program organization and computer registers',
      estimatedMinutes: 25,
      diagramType: 'stored-program-registers',
      diagramCaption: 'Basic Computer Common Bus System connecting AR, PC, DR, AC, IR, TR, INPR, OUTR, and 4096×16 Memory.',
      introduction: {
        meaning:
          'Stored Program Organization (the Von Neumann concept) stores both program instructions and program data inside the same shared main memory, processed through a dedicated set of computer registers.',
        importance:
          'Enables general-purpose computing—changing a computer’s task simply means loading a new sequence of instruction words into memory without rewiring hardware.',
        whereUsed:
          'Every general-purpose CPU architecture (following Morris Mano’s Basic Computer and Hamacher’s Von Neumann model).',
        problemSolved:
          'Eliminates fixed-program patchboards and provides fast scratchpad registers inside the CPU to avoid slow repeated memory reads.'
      },
      fundamentalConcept: {
        overview:
          'In Morris Mano’s Stored Program Basic Computer (16-bit word, 4096-word memory), each instruction word splits into an Opcode, an Indirect bit (I), and a 12-bit Address field, coordinated across 8 standard registers connected to a 16-bit Common Bus.',
        terms: [
          { term: 'Accumulator (AC)', meaning: '16-bit primary arithmetic/processing register where ALU results are accumulated.' },
          { term: 'Data Register (DR)', meaning: '16-bit register holding operands read from memory.' },
          { term: 'Address Register (AR)', meaning: '12-bit register holding memory addresses (equivalent to MAR).' },
          { term: 'Temporary Register (TR)', meaning: '16-bit scratchpad register holding temporary data during execution.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete Register Set of the Basic Stored-Program Computer',
          table: {
            caption: 'Eight Standard Computer Registers (Mano Basic Computer)',
            headers: ['Symbol', 'Bits', 'Register Name', 'Primary Function'],
            rows: [
              ['DR', '16', 'Data Register', 'Holds memory operand fetched for ALU'],
              ['AR', '12', 'Address Register', 'Holds 12-bit address for 4096-word memory'],
              ['AC', '16', 'Accumulator', 'General-purpose processor register for ALU output'],
              ['IR', '16', 'Instruction Register', 'Holds the current instruction code'],
              ['PC', '12', 'Program Counter', 'Holds address of next instruction'],
              ['TR', '16', 'Temporary Register', 'Holds temporary intermediate data'],
              ['INPR', '8', 'Input Register', 'Receives 8-bit character from input device'],
              ['OUTR', '8', 'Output Register', 'Holds 8-bit character for output device']
            ]
          }
        },
        {
          heading: '2. Direct vs. Indirect Addressing in Stored Program Format',
          bullets: [
            'A 16-bit Memory-Reference Instruction has: Bit 15 = I (Mode), Bits 14–12 = Opcode (3 bits), Bits 11–0 = 12-bit Address.',
            'When I = 0 (Direct Addressing): Bits 11–0 contain the actual address of the operand.',
            'When I = 1 (Indirect Addressing): Bits 11–0 point to a memory word whose contents hold the Effective Address of the operand (AR ← M[AR]).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u4-c3-ex1',
          title: 'Finding Effective Address in Direct vs. Indirect Mode',
          problemStatement: 'A Basic Computer instruction at address 021 is `ADD 300` (Opcode 001). Memory[300] = 1350 and Memory[1350] = 0042 (hex). Find the Effective Address (EA) and operand added to AC when (a) I = 0 and (b) I = 1.',
          given: ['Instruction address field = 300', 'M[300] = 1350', 'M[1350] = 0042'],
          required: 'Effective Address (EA) and Operand for I = 0 and I = 1',
          formulaLatex: 'I=0 \\implies EA = \\text{Addr}; \\qquad I=1 \\implies EA = M[\\text{Addr}]',
          substitutionLatex: 'I=0: EA = 300; \\quad I=1: EA = M[300] = 1350',
          calculationSteps: [
            'Case (a) I = 0 (Direct): Effective Address EA = 300; Operand = M[300] = 1350 is added to AC.',
            'Case (b) I = 1 (Indirect): CPU fetches M[300] = 1350 as the pointer → Effective Address EA = 1350; Operand = M[1350] = 0042 is added to AC.'
          ],
          finalAnswer: '(a) EA = 300, Operand = 1350; (b) EA = 1350, Operand = 0042',
          interpretation: 'Indirect addressing enables pointers in high-level languages like C.'
        }
      ],
      formulas: [
        {
          id: 'f-u4-3',
          unitId: 'unit-4',
          chapterId: 'u4-c3',
          chapterTitle: 'Stored Program Organization & Computer Registers',
          name: 'Common Bus Selection Lines (S₂S₁S₀)',
          latex: '2^k \\ge N_{\\text{sources}} \\implies k = 3 \\text{ select lines for } 7 \\text{ bus sources } (1..7)',
          symbols: [
            { symbol: 'S_2S_1S_0', meaning: '3-bit multiplexer select code choosing which register drives the 16-bit common bus' }
          ],
          units: 'Select lines',
          conditions: 'In Mano’s Basic Computer: 001=AR, 010=PC, 011=DR, 100=AC, 101=IR, 110=TR, 111=Memory.',
          miniExample: 'Setting S₂S₁S₀ = 010 and LD(AR) = 1 executes AR ← PC in one clock cycle.'
        }
      ],
      applications: [
        { area: 'Von Neumann Bottleneck', detail: 'Because instructions and data share one memory bus, CPU speed is often limited by memory fetch bandwidth—motivating Cache memories in Unit V.' }
      ],
      summary: [
        'Stored program computers hold both instructions and data in the same addressable memory.',
        'Standard registers: AR (12b), PC (12b), DR (16b), AC (16b), IR (16b), TR (16b), INPR (8b), OUTR (8b).',
        'A common bus with 3 select lines (S₂S₁S₀) allows any register to transfer data to any other with Load (LD) enabled.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Stored Program Concept', definition: 'Instructions and data reside together in main RAM (Von Neumann architecture).' },
          { term: 'Accumulator (AC)', definition: 'Primary 16-bit arithmetic register.' }
        ],
        corePoints: [
          'AR and PC are 12 bits (4096 = 2¹² words).',
          'DR, AC, IR, TR are 16 bits.',
          'INPR and OUTR are 8 bits (1 ASCII character).'
        ],
        examReminders: [
          'Remember why AR and PC are 12 bits while DR/AC/IR are 16 bits in a 4K × 16 computer: 4K = 2¹² locations!'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c3-q1',
          question: 'In a 4096 × 16-bit stored-program computer, what is the bit width of the Address Register (AR) and Program Counter (PC)?',
          options: ['8 bits', '12 bits', '16 bits', '32 bits'],
          correctIndex: 1,
          explanation: '4096 = 2¹², so memory addresses require exactly 12 bits.'
        },
        {
          id: 'u4-c3-q2',
          question: 'Which register acts as the primary processor arithmetic accumulator?',
          options: ['TR', 'INPR', 'AC', 'AR'],
          correctIndex: 2,
          explanation: 'The Accumulator (AC) holds one ALU operand and stores the ALU result.'
        },
        {
          id: 'u4-c3-q3',
          question: 'In indirect addressing (I = 1), the 12-bit address field inside the instruction points to:',
          options: ['The literal data value', 'A CPU register', 'A memory cell containing the Effective Address', 'An I/O port'],
          correctIndex: 2,
          explanation: 'Indirect mode performs one extra memory read to obtain the Effective Address.'
        }
      ]
    },
    {
      id: 'u4-c4',
      unitId: 'unit-4',
      chapterNumber: '4.4',
      title: 'Instruction Formats (3, 2, 1 & 0-Address)',
      syllabusTopic: 'Instruction formats',
      estimatedMinutes: 25,
      diagramType: 'instruction-formats',
      diagramCaption: 'Bit-field layouts and assembly sequences for Three-Address, Two-Address, One-Address (Accumulator), and Zero-Address (Stack) instructions.',
      introduction: {
        meaning:
          'An instruction format defines the layout of bits inside a machine instruction—specifically the Opcode field, Mode bits, and zero, one, two, or three Address fields.',
        importance:
          'Determines program code density, hardware complexity, and how many instructions are needed to evaluate arithmetic expressions.',
        whereUsed:
          'RISC (3-address load/store), CISC x86 (2-address), microcontrollers (1-address accumulator), and JVM/PostScript (0-address stack).',
        problemSolved:
          'Balances instruction bit-width (memory footprint) against programmer/compiler convenience and speed.'
      },
      fundamentalConcept: {
        overview:
          'The number of explicit address fields in an instruction depends on the CPU’s internal register organization: General Register Organization uses 3- or 2-address formats, Single Accumulator uses 1-address format, and Stack Organization uses 0-address format.',
        terms: [
          { term: 'Opcode', meaning: 'Operation code bits specifying what action to perform (ADD, SUB, LOAD, JMP).' },
          { term: 'Three-Address Instruction', meaning: 'Specifies two source operands and one destination: `ADD R1, A, B` (R1 ← M[A] + M[B]).' },
          { term: 'Two-Address Instruction', meaning: 'One operand acts as both source and destination: `ADD R1, B` (R1 ← R1 + M[B]).' },
          { term: 'One-Address Instruction', meaning: 'Uses an implied Accumulator (AC): `ADD B` (AC ← AC + M[B]).' },
          { term: 'Zero-Address Instruction', meaning: 'Uses an implied Stack (TOS): `ADD` pops top two items, adds them, and pushes sum.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Evaluating X = (A + B) × (C + D) Across All Four Formats',
          table: {
            caption: 'Comparison of Instruction Formats for X = (A + B) × (C + D)',
            headers: ['Format', 'Assembly Program', 'Instruction Count'],
            rows: [
              ['3-Address', 'ADD R1, A, B; ADD R2, C, D; MUL X, R1, R2', '3 instructions (longest per instruction)'],
              ['2-Address', 'MOV R1, A; ADD R1, B; MOV R2, C; ADD R2, D; MUL R1, R2; MOV X, R1', '6 instructions'],
              ['1-Address (AC)', 'LOAD A; ADD B; STORE T; LOAD C; ADD D; MUL T; STORE X', '7 instructions'],
              ['0-Address (Stack)', 'PUSH A; PUSH B; ADD; PUSH C; PUSH D; ADD; MUL; POP X', '8 instructions (shortest per instruction)']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u4-c4-ex1',
          title: 'Designing Bit Fields for a 32-Bit Instruction Word',
          problemStatement: 'A processor has 32-bit instructions, supports 45 distinct opcodes, has 64 general-purpose registers, and uses a 2-address format (1 register + 1 memory address). Calculate the maximum directly addressable memory words.',
          given: ['Instruction width = 32 bits', 'Opcodes = 45', 'Registers = 64', 'Format = Opcode + Reg + MemAddr'],
          required: 'Bits per field and maximum addressable memory words',
          formulaLatex: 'b_{\\text{op}} = \\lceil \\log_2(N_{\\text{op}}) \\rceil, \\quad b_{\\text{reg}} = \\lceil \\log_2(N_{\\text{reg}}) \\rceil, \\quad b_{\\text{addr}} = 32 - b_{\\text{op}} - b_{\\text{reg}}',
          substitutionLatex: 'b_{\\text{op}} = \\lceil \\log_2(45) \\rceil = 6, \\quad b_{\\text{reg}} = \\lceil \\log_2(64) \\rceil = 6',
          calculationSteps: [
            '45 opcodes require 6 bits (since 2⁵ = 32 < 45 ≤ 2⁶ = 64).',
            '64 registers require 6 bits (2⁶ = 64).',
            'Remaining bits for memory address = 32 − 6 − 6 = 20 bits.',
            'Maximum addressable memory words = 2²⁰ = 1M words.'
          ],
          finalAnswer: 'Opcode = 6 bits, Register = 6 bits, Address = 20 bits → 1M addressable words',
          interpretation: 'Notice the trade-off: adding more opcodes or registers directly shrinks the available address space.'
        }
      ],
      formulas: [
        {
          id: 'f-u4-4',
          unitId: 'unit-4',
          chapterId: 'u4-c4',
          chapterTitle: 'Instruction Formats (3, 2, 1 & 0-Address)',
          name: 'Instruction Bit-Budget & Opcode Capacity',
          latex: 'W_{\\text{instr}} = b_{\\text{mode}} + b_{\\text{op}} + \\sum b_{\\text{addr}}, \\qquad N_{\\text{op}} \\le 2^{b_{\\text{op}}}',
          symbols: [
            { symbol: 'W_instr', meaning: 'Total instruction word size in bits' },
            { symbol: 'b_op', meaning: 'Opcode field width in bits' },
            { symbol: 'b_addr', meaning: 'Bits per operand/register address field' }
          ],
          units: 'Bits',
          conditions: 'Fixed-length instruction format.',
          miniExample: 'In Mano’s 16-bit format: 1-bit I + 3-bit Opcode + 12-bit Address = 16 bits.'
        }
      ],
      applications: [
        { area: 'ARM / RISC-V vs. JVM Bytecode', detail: 'ARM/RISC-V use clean 3-address register-to-register instructions; Java Virtual Machine (JVM) uses compact 0-address stack instructions.' }
      ],
      summary: [
        'Instruction formats classify by explicit address fields: 3-address, 2-address, 1-address (implied AC), and 0-address (implied Stack).',
        'Fewer address fields mean shorter instructions individually, but require more instructions per expression.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: '0-Address (Stack)', definition: 'Operands popped from and pushed onto Top of Stack (Reverse Polish Notation).' },
          { term: '1-Address (Accumulator)', definition: 'One explicit operand; Accumulator AC is implicit source/destination.' }
        ],
        corePoints: [
          '3-Addr: shortest program, longest instruction.',
          '0-Addr: longest program, shortest instruction (no address bits in arithmetic ops).'
        ],
        examReminders: [
          'When evaluating a Stack (0-address) program for subtraction A − B, remember `PUSH A; PUSH B; SUB` computes A − B (second-from-top minus top).'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c4-q1',
          question: 'Which CPU organization uses Zero-Address arithmetic instructions?',
          options: ['Single Accumulator', 'General Register', 'Stack Organization', 'Vector Array'],
          correctIndex: 2,
          explanation: 'Stack-organized CPUs implicitly pop the top two stack elements for binary operations like ADD.'
        },
        {
          id: 'u4-c4-q2',
          question: 'What is the minimum number of bits required in an Opcode field to support 100 distinct instructions?',
          options: ['6 bits', '7 bits', '8 bits', '10 bits'],
          correctIndex: 1,
          explanation: '2⁶ = 64 < 100 ≤ 2⁷ = 128, so 7 bits are required.'
        },
        {
          id: 'u4-c4-q3',
          question: 'In a 1-address instruction `ADD X`, where is the second operand located and where is the result stored?',
          options: ['Register R1', 'Top of Stack', 'Accumulator (AC)', 'Program Counter'],
          correctIndex: 2,
          explanation: '1-address instructions implicitly use the Accumulator (AC): AC ← AC + M[X].'
        }
      ]
    },
    {
      id: 'u4-c5',
      unitId: 'unit-4',
      chapterNumber: '4.5',
      title: 'Input/Output Organization & Interrupts',
      syllabusTopic: 'Input/output Organization: Block diagram of I/O organization, Interrupts',
      estimatedMinutes: 25,
      diagramType: 'io-interrupts',
      diagramCaption: 'I/O Interface connecting peripherals to System Bus, and Interrupt Request/Acknowledge servicing timeline.',
      introduction: {
        meaning:
          'I/O Organization connects slow, electromechanical external peripherals (keyboards, disks, sensors) to the fast electronic CPU via standardized I/O Interface modules and Interrupt mechanisms.',
        importance:
          'Without an I/O Interface and Interrupts, the CPU would waste 99% of its clock cycles polling slow devices in busy-wait loops.',
        whereUsed:
          'USB/PCIe controllers, keyboard/mouse IRQ lines, microcontroller NVIC interrupt controllers.',
        problemSolved:
          'Resolves speed, voltage, data-format, and timing mismatches between peripherals and the CPU, while Interrupts let devices notify the CPU only when ready.'
      },
      fundamentalConcept: {
        overview:
          'Every I/O Interface contains an Address Decoder, Control/Status Register, and Data Buffer Register. Instead of CPU polling (Programmed I/O), Interrupt-Driven I/O lets the CPU execute useful work until a peripheral asserts an Interrupt Request (INTR).',
        terms: [
          { term: 'I/O Interface', meaning: 'Hardware adapter performing address decoding, command translation, status reporting, and data buffering between bus and peripheral.' },
          { term: 'Programmed I/O (Polling)', meaning: 'CPU repeatedly checks the peripheral Ready/Busy status flag in a loop until data is ready.' },
          { term: 'Interrupt (INTR)', meaning: 'Hardware signal from a peripheral requesting immediate CPU attention.' },
          { term: 'ISR (Interrupt Service Routine)', meaning: 'Dedicated handler subroutine executed by the CPU when an interrupt is acknowledged.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Interrupt Handling Sequence (Step-by-Step)',
          steps: [
            'Peripheral asserts the INTR line; CPU finishes executing the *current* instruction.',
            'CPU checks if interrupts are enabled (IE = 1), saves its return address (PC) and Processor Status Word (PSW) onto the Stack, and disables further lower-priority interrupts.',
            'CPU sends Interrupt Acknowledge (INTA) and jumps to the ISR address (fixed or Vectored Interrupt).',
            'ISR transfers data / clears the interrupt flag, restores saved registers & PC (via IRET / RTI), and resumes the interrupted program seamlessly.'
          ]
        },
        {
          heading: '2. Handling Multiple Interrupts (Priority Schemes)',
          bullets: [
            'Polling (Software): ISR checks each device status flag sequentially in priority order—low hardware cost, slower response.',
            'Daisy Chaining (Hardware): Devices share one INTR line while INTA chains serially through devices in priority order (closest to CPU wins).',
            'Parallel Priority Interrupt: Uses a Priority Encoder + Mask Register to resolve simultaneous requests in 1 cycle.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u4-c5-ex1',
          title: 'Comparing Polling Overhead vs. Interrupt-Driven I/O',
          problemStatement: 'A 100 MHz CPU polls a keyboard at 1000 times per second, where each poll takes 400 clock cycles. What percentage of CPU time is spent just polling if no keys are pressed?',
          given: ['CPU clock = 100 MHz = 10⁸ cycles/sec', 'Polling rate = 1000 polls/sec', 'Cost per poll = 400 cycles'],
          required: 'Percentage of CPU time wasted on polling',
          formulaLatex: '\\%\\text{Overhead} = \\frac{\\text{Polls/sec} \\times \\text{Cycles/poll}}{f_{\\text{CPU}}} \\times 100\\%',
          substitutionLatex: '\\%\\text{Overhead} = \\frac{1000 \\times 400}{10^8} \\times 100\\%',
          calculationSteps: [
            'Total cycles spent polling per second = 1000 × 400 = 400,000 cycles/sec.',
            'Fraction of CPU = 400,000 / 100,000,000 = 0.004 = 0.4%.'
          ],
          finalAnswer: '0.4% CPU wasted (0% wasted when idle with Interrupt-Driven I/O)',
          interpretation: 'For high-rate devices (e.g., 100,000 checks/sec), polling overhead can jump to 40%+, whereas interrupts consume 0% until an event actually happens.'
        }
      ],
      formulas: [
        {
          id: 'f-u4-5',
          unitId: 'unit-4',
          chapterId: 'u4-c5',
          chapterTitle: 'Input/Output Organization & Interrupts',
          name: 'Interrupt Latency & Polling Overhead',
          latex: '\\text{Polling Overhead} = \\frac{R_{\\text{poll}} \\times C_{\\text{poll}}}{f_{\\text{CPU}}}, \\qquad T_{\\text{latency}} = T_{\\text{finish\\_instr}} + T_{\\text{save\\_context}}',
          symbols: [
            { symbol: 'R_poll', meaning: 'Number of status checks per second' },
            { symbol: 'C_poll', meaning: 'Clock cycles required per poll' }
          ],
          units: 'Dimensionless fraction / Seconds',
          conditions: 'Applies to non-blocking periodic polling vs hardware interrupts.',
          miniExample: 'At 50,000 polls/s × 400 cycles on a 100 MHz CPU, polling consumes 20% of CPU.'
        }
      ],
      applications: [
        { area: 'Operating System Hardware Drivers', detail: 'Network cards, SSDs, and keyboards use Vectored Interrupts (MSI/IRQ) to wake OS kernel drivers immediately.' }
      ],
      summary: [
        'I/O Interfaces bridge speed, format, and voltage gaps between CPU bus and peripherals.',
        'Interrupt-Driven I/O eliminates busy-wait polling by saving PC/PSW on the stack and executing an ISR when INTR arrives.',
        'Multiple devices are prioritized via Software Polling, Hardware Daisy-Chaining, or Parallel Priority Encoders.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Vectored Interrupt', definition: 'Interrupting device supplies an address/vector code directly identifying its ISR.' },
          { term: 'Daisy Chain', definition: 'Serial INTA priority wiring where the device electrically closest to CPU wins.' }
        ],
        corePoints: [
          'Why I/O Interface? Speed mismatch, data format conversion, signal level matching, device addressing.',
          'CPU always finishes the current instruction before servicing a maskable interrupt.'
        ],
        examReminders: [
          'Explain why PC MUST be saved on the stack before jumping to an ISR (so nested interrupts don’t overwrite the return address).'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c5-q1',
          question: 'When an interrupt occurs, what happens to the Program Counter (PC) before jumping to the ISR?',
          options: ['It is cleared to 0', 'It is saved onto the Stack (or link register)', 'It is sent to the peripheral', 'It is copied into MAR permanently'],
          correctIndex: 1,
          explanation: 'Saving PC allows the CPU to return to the exact next instruction after the ISR finishes.'
        },
        {
          id: 'u4-c5-q2',
          question: 'In a hardware Daisy-Chain priority scheme, which device has the highest priority?',
          options: ['The slowest device', 'The device farthest from the CPU', 'The device electrically closest to the CPU along the INTA line', 'The device with the largest buffer'],
          correctIndex: 2,
          explanation: 'INTA reaches the nearest requesting device first, which intercepts it and blocks downstream devices.'
        },
        {
          id: 'u4-c5-q3',
          question: 'Which I/O technique wastes CPU cycles repeatedly testing a status flag in a loop?',
          options: ['Direct Memory Access', 'Vectored Interrupts', 'Programmed I/O (Polling)', 'Handshaking'],
          correctIndex: 2,
          explanation: 'Programmed I/O busy-waits on the peripheral’s ready flag.'
        }
      ]
    },
    {
      id: 'u4-c6',
      unitId: 'unit-4',
      chapterNumber: '4.6',
      title: 'Direct Memory Access (DMA)',
      syllabusTopic: 'Direct memory access',
      estimatedMinutes: 25,
      diagramType: 'dma-controller',
      diagramCaption: 'DMA Controller acquiring System Bus via BR (Bus Request) and BG (Bus Grant) to transfer blocks directly between I/O and RAM.',
      introduction: {
        meaning:
          'Direct Memory Access (DMA) is a hardware technique allowing high-speed peripherals (disks, network cards, GPUs) to transfer blocks of data directly to and from Main Memory without passing every byte through the CPU.',
        importance:
          'Even with interrupts, interrupting the CPU for every single byte of a 1 GB file transfer would cripple performance. DMA offloads the entire block copy to a dedicated DMA Controller.',
        whereUsed:
          'NVMe SSD transfers, Ethernet packet buffers, audio/video streaming, and GPU memory copies.',
        problemSolved:
          'Eliminates per-word CPU intervention during bulk data transfers by letting the DMA Controller temporarily act as Bus Master.'
      },
      fundamentalConcept: {
        overview:
          'The CPU programs three registers inside the DMA Controller—Starting Address, Word Count, and Control/Direction—then returns to other tasks. The DMA Controller negotiates bus ownership using BR (Bus Request) and BG (Bus Grant) and interrupts the CPU only ONCE when the entire block completes.',
        terms: [
          { term: 'DMA Controller (DMAC)', meaning: 'Specialized bus-master hardware containing Address Register, Word Count Register, and Control Register.' },
          { term: 'Bus Request (BR) & Bus Grant (BG)', meaning: 'Handshake signals between DMAC and CPU: DMAC asserts BR; CPU tri-states its bus drivers and asserts BG.' },
          { term: 'Burst Mode (Block Transfer)', meaning: 'DMAC holds the bus until the entire block of N words finishes transferring.' },
          { term: 'Cycle Stealing', meaning: 'DMAC transfers one word at a time by "stealing" a single memory bus cycle while CPU pauses briefly.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete DMA Transfer Lifecycle',
          steps: [
            'Initialization: CPU writes Memory Starting Address, Word Count (N), and Read/Write direction to DMAC registers, then starts DMA.',
            'Bus Arbitration: When peripheral is ready, DMAC asserts Bus Request (BR) to CPU.',
            'Bus Handover: CPU finishes current bus cycle, puts its Address/Data/Control lines into High-Impedance (Tri-state), and asserts Bus Grant (BG).',
            'Direct Transfer: DMAC drives Address Bus & Memory Read/Write directly between Peripheral and RAM, incrementing Address and decrementing Word Count after each word.',
            'Completion: When Word Count reaches 0, DMAC deasserts BR and sends an Interrupt (INTR) to notify CPU that the entire transfer is complete.'
          ]
        },
        {
          heading: '2. Burst Mode vs. Cycle Stealing',
          table: {
            caption: 'Comparison of DMA Transfer Modes',
            headers: ['Mode', 'How Bus is Held', 'Throughput', 'Impact on CPU'],
            rows: [
              ['Burst (Block) Mode', 'DMAC keeps bus for all N words continuously', 'Maximum transfer rate', 'CPU blocked for entire block duration'],
              ['Cycle Stealing', 'DMAC takes 1 memory cycle per word, then yields bus', 'Slightly lower', 'CPU continues running with minimal slowdown']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u4-c6-ex1',
          title: 'Cycle-Stealing DMA Bandwidth & CPU Slowdown',
          problemStatement: 'A peripheral transfers 4 MB/s using 32-bit (4-Byte) Cycle-Stealing DMA into a memory with a 100 ns cycle time. Find how many DMA memory cycles are stolen per second and the percentage of memory bus time used by DMA.',
          given: ['Transfer rate = 4 MB/s = 4 × 10⁶ Bytes/s', 'Word size = 4 Bytes', 'Memory cycle time = 100 ns = 10⁻⁷ s'],
          required: 'Stolen cycles/sec and % of bus time',
          formulaLatex: '\\text{Cycles/sec} = \\frac{\\text{Bytes/sec}}{\\text{Bytes/word}}, \\qquad \\%\\text{Bus Time} = (\\text{Cycles/sec} \\times t_{\\text{cycle}}) \\times 100\\%',
          substitutionLatex: '\\text{Cycles/sec} = \\frac{4 \\times 10^6}{4} = 10^6, \\quad \\%\\text{Bus Time} = 10^6 \\times 10^{-7} \\times 100\\%',
          calculationSteps: [
            'Words transferred per second = 4,000,000 / 4 = 1,000,000 words/sec = 10⁶ stolen cycles/sec.',
            'Total bus time consumed per second = 10⁶ × 100 ns = 0.1 seconds = 10%.'
          ],
          finalAnswer: '1,000,000 stolen cycles/sec; 10% memory bus utilization',
          interpretation: 'The CPU still keeps 90% of the memory bandwidth while 4 MB/s streams directly into RAM.'
        }
      ],
      formulas: [
        {
          id: 'f-u4-6',
          unitId: 'unit-4',
          chapterId: 'u4-c6',
          chapterTitle: 'Direct Memory Access (DMA)',
          name: 'DMA Cycle-Stealing Bus Overhead',
          latex: '\\text{DMA Bus Fraction} = \\frac{R_{\\text{transfer}}}{W_{\\text{word}}} \\times t_{\\text{mem\\_cycle}}',
          symbols: [
            { symbol: 'R_transfer', meaning: 'Peripheral data rate (Bytes/sec)' },
            { symbol: 'W_word', meaning: 'Bytes transferred per DMA cycle' },
            { symbol: 't_mem_cycle', meaning: 'Duration of one memory read/write cycle (seconds)' }
          ],
          units: 'Dimensionless fraction (or %)',
          conditions: 'Valid when peripheral rate does not saturate memory bandwidth.',
          miniExample: '8 MB/s at 4B/word and 50 ns cycle = 2×10⁶ × 50×10⁻⁹ = 10%.'
        }
      ],
      applications: [
        { area: 'High-Speed Storage & Networking', detail: 'NVMe SSDs and 100 Gbps NICs use scatter-gather DMA engines to move packets straight into OS buffers.' }
      ],
      summary: [
        'DMA transfers bulk data directly between I/O and RAM without CPU word-by-word involvement.',
        'DMAC uses Address, Word Count, and Control registers plus BR/BG bus arbitration signals.',
        'Two main modes: Burst mode (whole block at once) and Cycle Stealing (1 word per stolen bus cycle).'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'DMA', definition: 'Direct Memory Access—peripheral-to-RAM data transfer bypassing the CPU registers.' },
          { term: 'Cycle Stealing', definition: 'DMAC temporarily borrows single memory cycles so CPU isn’t stalled for long bursts.' }
        ],
        corePoints: [
          'CPU sets up Start Address + Word Count → DMAC takes bus via BR/BG → DMAC interrupts CPU once at Word Count = 0.',
          'CPU enters High-Z (tri-state) on bus lines when asserting Bus Grant (BG).'
        ],
        examReminders: [
          'Be sure to draw the Address Register, Word Count Register, Control Register, BR, BG, and Interrupt line in your DMA block diagram.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c6-q1',
          question: 'When the CPU grants the system bus to the DMA controller (BG = 1), what state do the CPU’s address/data bus pins enter?',
          options: ['Logic 0', 'Logic 1', 'High-Impedance (Tri-state)', 'Short-circuit'],
          correctIndex: 2,
          explanation: 'High-Impedance disconnects the CPU electrically so the DMA controller can drive the bus without contention.'
        },
        {
          id: 'u4-c6-q2',
          question: 'Which DMA mode transfers one word at a time between CPU memory cycles without locking out the CPU for a long period?',
          options: ['Burst Mode', 'Cycle Stealing', 'Programmed Polling', 'Strobe Mode'],
          correctIndex: 1,
          explanation: 'Cycle Stealing takes one bus cycle per word and immediately releases the bus back to the CPU.'
        },
        {
          id: 'u4-c6-q3',
          question: 'How many interrupts does a DMA controller normally send to the CPU during a 4096-byte block transfer?',
          options: ['4096 interrupts', '512 interrupts', '1 interrupt (at the end when Word Count = 0)', '0 interrupts'],
          correctIndex: 2,
          explanation: 'The entire purpose of DMA is to send a single completion interrupt once all 4096 bytes have been moved.'
        }
      ]
    },
    {
      id: 'u4-c7',
      unitId: 'unit-4',
      chapterNumber: '4.7',
      title: 'Asynchronous Data Transfer: Strobe Control & Handshaking',
      syllabusTopic: 'Asynchronous data transfer: strobe control and hand shaking',
      estimatedMinutes: 25,
      diagramType: 'async-strobe-handshake',
      diagramCaption: 'Timing diagrams comparing Source/Destination-Initiated Strobe Control against Two-Wire Request/Acknowledge Handshaking.',
      introduction: {
        meaning:
          'Asynchronous data transfer coordinates data exchange between two independent units (like CPU and an external peripheral) that do NOT share a common clock.',
        importance:
          'When sender and receiver run on different clocks—or variable device speeds—timing pulses (Strobes) or closed-loop confirmations (Handshaking) prevent reading invalid or overwritten data.',
        whereUsed:
          'Parallel printers, asynchronous bus protocols, cross-clock-domain SoC bridges, and GPIB/IEEE-488.',
        problemSolved:
          'Prevents data loss caused by clock skew or unknown peripheral response delays.'
      },
      fundamentalConcept: {
        overview:
          'Strobe Control uses a single unidirectional timing pulse—simple, but blind to whether the other side actually caught the data. Handshaking upgrades this to a two-wire closed loop (Data Valid + Data Accepted) where both sides confirm every step.',
        terms: [
          { term: 'Strobe Control', meaning: 'Single-control-line asynchronous transfer initiated by either Source (places data then pulses Strobe) or Destination (pulses Strobe requesting data).' },
          { term: 'Handshaking', meaning: 'Two-wire asynchronous protocol adding an Acknowledge/Data-Accepted reply line back from receiver to sender.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Strobe Control Modes & Limitation',
          bullets: [
            'Source-Initiated Strobe: Source puts data on Data Bus → waits briefly → asserts Strobe → turns off Strobe → removes data.',
            'Destination-Initiated Strobe: Destination asserts Strobe → Source puts data on bus → Destination latches data and turns off Strobe.',
            'Disadvantage of Strobe: No confirmation! Source does not know if Destination actually read the data; Destination does not know if Source placed valid data before timeout.'
          ]
        },
        {
          heading: '2. Source-Initiated Two-Wire Handshaking (4-Step Closed Loop)',
          steps: [
            'Source places data on Data Bus and asserts `Data Valid = 1`.',
            'Destination reads data from bus and asserts `Data Accepted = 1`.',
            'Source sees `Data Accepted = 1`, removes data from bus, and sets `Data Valid = 0`.',
            'Destination sees `Data Valid = 0` and resets `Data Accepted = 0`, ready for the next transfer.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u4-c7-ex1',
          title: 'Tracing Destination-Initiated Handshaking',
          problemStatement: 'Write the 4-phase signal sequence for Destination-Initiated Handshaking using `Ready for Data` (from Destination) and `Data Valid` (from Source).',
          given: ['Control line 1: Ready for Data (Destination → Source)', 'Control line 2: Data Valid (Source → Destination)'],
          required: 'Complete 4-step handshaking state transitions',
          formulaLatex: '(0,0) \\xrightarrow{\\text{Dest ready}} (1,0) \\xrightarrow{\\text{Src sends}} (1,1) \\xrightarrow{\\text{Dest latches}} (0,1) \\xrightarrow{\\text{Src ends}} (0,0)',
          substitutionLatex: '\\text{State pair } (\\text{Ready for Data}, \\text{Data Valid})',
          calculationSteps: [
            'Phase 1: Destination is ready → sets `Ready for Data = 1`.',
            'Phase 2: Source places data on bus and sets `Data Valid = 1`.',
            'Phase 3: Destination latches data and drops `Ready for Data = 0`.',
            'Phase 4: Source removes data and drops `Data Valid = 0`.'
          ],
          finalAnswer: '(0,0) → (1,0) → (1,1) → (0,1) → (0,0)',
          interpretation: 'Notice that every transition is strictly causal—either side can be infinitely slow without dropping a single byte!'
        }
      ],
      formulas: [
        {
          id: 'f-u4-7',
          unitId: 'unit-4',
          chapterId: 'u4-c7',
          chapterTitle: 'Asynchronous Data Transfer: Strobe Control & Handshaking',
          name: 'Asynchronous Cycle Time (4-Phase Handshake)',
          latex: 'T_{\\text{handshake}} = 2(t_{\\text{prop}} + t_{\\text{src\\_react}} + t_{\\text{dest\\_react}})',
          symbols: [
            { symbol: 't_prop', meaning: 'One-way bus propagation delay' },
            { symbol: 't_src_react, t_dest_react', meaning: 'Internal logic response delays of source and destination' }
          ],
          units: 'Seconds (ns)',
          conditions: 'Reflects the 4-edge round-trip acknowledgement cycle.',
          miniExample: 'If each half-transition takes 25 ns, one full handshaked word transfer takes 4 × 25 = 100 ns (10 Mwords/s).'
        }
      ],
      applications: [
        { area: 'Clock-Domain Crossing (CDC)', detail: 'Handshaking safely passes data between two subsystems running on unrelated clock frequencies inside modern SoCs.' }
      ],
      summary: [
        'Asynchronous transfer links modules without a shared clock.',
        'Strobe uses 1 unidirectional pulse (open-loop, risky if speeds vary).',
        'Handshaking uses 2 wires (`Data Valid` / `Data Accepted` or `Ready for Data` / `Data Valid`) for guaranteed, speed-independent delivery.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Strobe Control', definition: 'Single timing-pulse asynchronous transfer without feedback.' },
          { term: 'Handshaking', definition: 'Two-wire Request + Acknowledge protocol guaranteeing valid data capture.' }
        ],
        corePoints: [
          'Strobe = 1 control line; Handshaking = 2 control lines.',
          'Source-initiated handshake uses Data Valid + Data Accepted.',
          'Destination-initiated handshake uses Ready for Data + Data Valid.'
        ],
        examReminders: [
          'Draw the step-by-step sequence-of-events diagram alongside the timing waveform for full 5-mark credit.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u4-c7-q1',
          question: 'Why is Two-Wire Handshaking more reliable than Strobe Control?',
          options: ['It uses higher voltage', 'It provides an explicit acknowledgement confirming data was captured', 'It eliminates the Data Bus', 'It requires a shared 1 GHz clock'],
          correctIndex: 1,
          explanation: 'Handshaking adds a return acknowledge line so neither side overwrites or drops data.'
        },
        {
          id: 'u4-c7-q2',
          question: 'In Source-Initiated Handshaking, which signal does the Source assert after placing data on the bus?',
          options: ['Ready for Data', 'Bus Grant', 'Data Valid', 'Interrupt'],
          correctIndex: 2,
          explanation: 'The source asserts Data Valid, and the destination replies with Data Accepted.'
        },
        {
          id: 'u4-c7-q3',
          question: 'In a Strobe-controlled transfer, how many control lines carry timing information between Source and Destination?',
          options: ['1', '2', '4', '8'],
          correctIndex: 0,
          explanation: 'Strobe control relies on a single unidirectional Strobe line.'
        }
      ]
    }
  ]
};

export const UNIT_4_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-u4-1',
    unitId: 'unit-4',
    chapterId: 'u4-c2',
    topicName: 'Computer Registers & Operational Concepts',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'State the functions of MAR, MDR, PC, and IR in a digital computer.',
    answerSections: [
      {
        bullets: [
          'MAR (Memory Address Register): Holds the address of the memory location to be accessed.',
          'MDR (Memory Data Register): Holds data read from or being written to memory.',
          'PC (Program Counter): Holds the memory address of the next instruction to fetch.',
          'IR (Instruction Register): Holds the instruction currently being decoded and executed.'
        ]
      }
    ]
  },
  {
    id: 'eq-u4-2',
    unitId: 'unit-4',
    chapterId: 'u4-c6',
    topicName: 'Direct Memory Access',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Differentiate between Burst Mode and Cycle Stealing in DMA.',
    answerSections: [
      {
        bullets: [
          'Burst Mode: The DMA controller retains control of the system bus continuously until an entire block of N words is transferred.',
          'Cycle Stealing: The DMA controller steals a single memory cycle to transfer one word and immediately returns the bus to the CPU.'
        ]
      }
    ]
  },
  {
    id: 'eq-u4-3',
    unitId: 'unit-4',
    chapterId: 'u4-c7',
    topicName: 'Asynchronous Data Transfer',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'What is the main limitation of Strobe Control, and how does Handshaking overcome it?',
    answerSections: [
      {
        paragraphs: [
          'Strobe Control uses a single unidirectional timing pulse with no confirmation from the receiver, so the sender cannot verify that data was captured (or the receiver cannot verify data is valid). Handshaking adds a second return line (Acknowledge / Data Accepted) creating a closed-loop confirmation.'
        ]
      }
    ]
  },
  {
    id: 'eq-u4-4',
    unitId: 'unit-4',
    chapterId: 'u4-c4',
    topicName: 'Instruction Formats',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Evaluate the arithmetic statement Y = (A − B) / (C + D × E) using Zero-Address (Stack) and One-Address (Accumulator) instructions.',
    answerSections: [
      {
        heading: '1. Zero-Address (Stack) Program',
        bullets: [
          'PUSH A; PUSH B; SUB; PUSH C; PUSH D; PUSH E; MUL; ADD; DIV; POP Y (10 instructions).'
        ]
      },
      {
        heading: '2. One-Address (Accumulator) Program',
        bullets: [
          'LOAD D; MUL E; ADD C; STORE T; LOAD A; SUB B; DIV T; STORE Y (8 instructions).'
        ]
      }
    ]
  },
  {
    id: 'eq-u4-5',
    unitId: 'unit-4',
    chapterId: 'u4-c7',
    topicName: 'Strobe Control & Handshaking',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Explain Source-Initiated and Destination-Initiated Two-Wire Handshaking with sequence steps and timing behavior.',
    answerSections: [
      {
        heading: 'Source-Initiated Handshake (Data Valid & Data Accepted)',
        bullets: [
          '1. Source puts data on bus and sets Data Valid = 1.',
          '2. Destination reads data and sets Data Accepted = 1.',
          '3. Source removes data and clears Data Valid = 0.',
          '4. Destination clears Data Accepted = 0.'
        ]
      },
      {
        heading: 'Destination-Initiated Handshake (Ready for Data & Data Valid)',
        bullets: [
          '1. Destination sets Ready for Data = 1.',
          '2. Source places data on bus and sets Data Valid = 1.',
          '3. Destination captures data and clears Ready for Data = 0.',
          '4. Source clears Data Valid = 0.'
        ]
      }
    ]
  },
  {
    id: 'eq-u4-6',
    unitId: 'unit-4',
    chapterId: 'u4-c6',
    topicName: 'I/O Organization & DMA',
    marks: 'long-answer',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Draw and explain the block diagram of I/O organization and a DMA Controller. Explain how DMA transfers a block of data between a peripheral and Main Memory, detailing BR, BG, and interrupt completion.',
    answerSections: [
      {
        heading: '1. I/O Interface Architecture',
        paragraphs: [
          'An I/O Interface sits between the CPU system bus (Address, Data, Control) and peripheral device, containing an Address Decoder, Control/Status Registers, and Data Buffer Registers to resolve speed and signal mismatches.'
        ]
      },
      {
        heading: '2. DMA Controller Architecture & Transfer Steps',
        bullets: [
          'Internal Registers: Address Register, Word Count Register, Control Register.',
          'Initialization: CPU loads starting RAM address, word count, and mode into DMAC.',
          'Arbitration: DMAC asserts Bus Request (BR); CPU tri-states its bus pins and asserts Bus Grant (BG).',
          'Execution: DMAC drives Address Bus & Memory Read/Write directly, incrementing Address and decrementing Word Count per word.',
          'Completion: When Word Count = 0, DMAC releases BR and raises an Interrupt (INTR) to inform CPU.'
        ]
      }
    ]
  }
];

export const UNIT_4_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-u4-1',
    unitId: 'unit-4',
    chapterId: 'u4-c2',
    format: 'mcq',
    prompt: 'Which register holds the data word immediately fetched from or written to main memory?',
    options: ['PC', 'IR', 'MAR', 'MDR'],
    correctAnswer: 'MDR',
    explanation: 'The Memory Data Register (MDR) buffers all data words entering or leaving main memory.'
  },
  {
    id: 'qz-u4-2',
    unitId: 'unit-4',
    chapterId: 'u4-c4',
    format: 'fill-blank',
    prompt: 'A One-Address instruction format implicitly uses the ____ register as one operand and destination.',
    correctAnswer: 'accumulator',
    explanation: 'One-address CPUs implicitly operate on the Accumulator (AC).'
  },
  {
    id: 'qz-u4-3',
    unitId: 'unit-4',
    chapterId: 'u4-c6',
    format: 'true-false',
    prompt: 'True or False: During a DMA transfer, every single byte must pass through the CPU’s Accumulator register.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'DMA transfers data directly between the I/O peripheral and RAM over the system bus, bypassing CPU registers.'
  },
  {
    id: 'qz-u4-4',
    unitId: 'unit-4',
    chapterId: 'u4-c7',
    format: 'mcq',
    prompt: 'Which asynchronous transfer method uses a single control wire without any acknowledgement signal?',
    options: ['Handshaking', 'Strobe Control', 'DMA Burst', 'Daisy Chaining'],
    correctAnswer: 'Strobe Control',
    explanation: 'Strobe control uses one unidirectional strobe line without return feedback.'
  }
];
