import { Unit, ExamQuestion, QuizQuestion } from '../types/academic';

export const UNIT_5: Unit = {
  id: 'unit-5',
  number: 'Unit V',
  title: 'The Memory System',
  syllabusExactText:
    'The Memory System: Basic concepts, Semiconductor RAM memories, Read-Only memories, Speed, Size and Cost, Primary memory, Auxiliary memory, Associative memory, Cache memories, Virtual Memories, Memory management requirements.',
  description:
    'Memory hierarchy (speed/size/cost), SRAM vs DRAM cells, ROM technologies, primary vs auxiliary storage, Associative (CAM) memory, Cache mapping & hit ratio, Virtual Memory paging, and Memory Management Unit (MMU) requirements.',
  chapters: [
    {
      id: 'u5-c1',
      unitId: 'unit-5',
      chapterNumber: '5.1',
      title: 'Basic Memory Concepts & Speed–Size–Cost Hierarchy',
      syllabusTopic: 'Basic concepts, Speed, Size and Cost',
      estimatedMinutes: 20,
      diagramType: 'memory-hierarchy',
      diagramCaption: 'Memory Hierarchy pyramid illustrating inverse trade-offs between Access Speed, Capacity (Size), and Cost per Bit.',
      introduction: {
        meaning:
          'A computer’s memory system stores programs and data across layered storage tiers engineered to balance speed, capacity, and cost.',
        importance:
          'No single memory technology is simultaneously ultra-fast (nanosecond), massive (terabyte), non-volatile, and cheap. Hierarchy gives programmers the illusion of fast, huge, affordable memory.',
        whereUsed:
          'Every computing device—CPU registers, L1/L2/L3 caches, DDR5 DRAM, and NVMe SSDs.',
        problemSolved:
          'Overcomes the speed–size–cost dilemma using the Locality of Reference principle.'
      },
      fundamentalConcept: {
        overview:
          'As you move down the Memory Hierarchy (Registers → Cache → Main RAM → Auxiliary SSD/HDD): access time increases, capacity increases, and cost per bit decreases.',
        terms: [
          { term: 'Access Time (t_A)', meaning: 'Time elapsed between issuing a Read/Write request and receiving/storing the data.' },
          { term: 'Memory Cycle Time (t_C)', meaning: 'Minimum time between two consecutive independent memory operations (t_C ≥ t_A).' },
          { term: 'Random Access vs. Sequential Access', meaning: 'Random access reaches any address in constant time (RAM); sequential access must scan through preceding records (magnetic tape).' },
          { term: 'Volatile vs. Non-Volatile', meaning: 'Volatile loses data when power turns off (SRAM/DRAM); Non-volatile retains data without power (ROM/Flash/HDD).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Memory Hierarchy Comparison Table',
          table: {
            caption: 'Speed, Size, Cost & Volatility Across Memory Tiers',
            headers: ['Tier', 'Technology', 'Typical Size', 'Typical Access Time', 'Cost / Bit', 'Volatility'],
            rows: [
              ['CPU Registers', 'Flip-Flops', '< 1 KB', '0.2 – 0.5 ns', 'Highest', 'Volatile'],
              ['Cache (L1/L2/L3)', 'SRAM', '64 KB – 64 MB', '1 – 15 ns', 'Very High', 'Volatile'],
              ['Main Memory', 'DRAM', '8 GB – 128 GB', '40 – 80 ns', 'Moderate', 'Volatile'],
              ['Auxiliary Storage', 'SSD (Flash) / HDD', '512 GB – 20 TB', '0.05 ms – 10 ms', 'Lowest', 'Non-Volatile']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u5-c1-ex1',
          title: 'Memory Bandwidth & Average Access Time Calculation',
          problemStatement: 'A 2-level memory system has a fast L1 cache (access time 2 ns, hit rate 90%) and main DRAM (access time 60 ns). Compute the Effective Access Time (EAT) assuming sequential lookup.',
          given: ['t_cache = 2 ns', 'Hit ratio h = 0.90', 'Miss ratio (1 − h) = 0.10', 't_main = 60 ns'],
          required: 'Effective Access Time (EAT)',
          formulaLatex: 't_{\\text{avg}} = h \\cdot t_{\\text{cache}} + (1 - h)(t_{\\text{cache}} + t_{\\text{main}})',
          substitutionLatex: 't_{\\text{avg}} = 0.90(2) + 0.10(2 + 60)',
          calculationSteps: [
            'Hit contribution: 0.90 × 2 ns = 1.8 ns.',
            'Miss contribution: 0.10 × 62 ns = 6.2 ns.',
            'Total Effective Access Time = 1.8 + 6.2 = 8.0 ns.'
          ],
          finalAnswer: 'Effective Access Time = 8.0 ns',
          interpretation: 'Even though DRAM takes 60 ns, a 90% hit rate keeps average memory latency down at 8 ns!'
        }
      ],
      formulas: [
        {
          id: 'f-u5-1',
          unitId: 'unit-5',
          chapterId: 'u5-c1',
          chapterTitle: 'Basic Memory Concepts & Speed–Size–Cost Hierarchy',
          name: 'Effective Average Access Time',
          latex: 'T_{\\text{avg}} = h \\cdot T_1 + (1 - h)(T_1 + T_2)',
          symbols: [
            { symbol: 'h', meaning: 'Hit ratio in the faster level (0 ≤ h ≤ 1)' },
            { symbol: 'T_1, T_2', meaning: 'Access times of level 1 (cache) and level 2 (main memory)' }
          ],
          units: 'Seconds (ns)',
          conditions: 'Sequential lookup model (cache checked before main memory).',
          miniExample: 'With h = 0.95, T₁ = 1 ns, T₂ = 50 ns: T_avg = 0.95(1) + 0.05(51) = 3.5 ns.'
        }
      ],
      applications: [
        { area: 'Multi-Core CPUs', detail: 'L1 (private per core), L2, and shared L3 caches bridge the 100× speed gap between GHz processors and DRAM.' }
      ],
      summary: [
        'Memory hierarchy trades speed, size, and cost: faster memory is smaller and pricier per bit.',
        'Access time = latency of one request; Cycle time = minimum time between back-to-back requests.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Access Time', definition: 'Delay from address presentation to valid data availability.' },
          { term: 'Memory Hierarchy', definition: 'Layered pyramid: Registers > Cache > Main RAM > Auxiliary Storage.' }
        ],
        corePoints: [
          'Moving DOWN pyramid: Speed ↓, Size ↑, Cost/bit ↓.',
          'Volatility: RAM (SRAM/DRAM) is volatile; ROM/Flash/HDD is non-volatile.'
        ],
        examReminders: [
          'Clarify whether a problem assumes simultaneous cache+RAM lookup or sequential (check cache first, then RAM) when computing average access time.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c1-q1',
          question: 'Moving from L1 Cache down to Auxiliary Storage in the memory hierarchy causes:',
          options: ['Cost per bit to increase', 'Access time to decrease', 'Storage capacity to increase and cost/bit to decrease', 'Volatility to increase'],
          correctIndex: 2,
          explanation: 'Lower tiers provide massive capacity at far lower cost per bit, at the expense of slower access time.'
        },
        {
          id: 'u5-c1-q2',
          question: 'Which memory tier sits immediately below CPU Registers in speed?',
          options: ['Magnetic Disk', 'Cache Memory (SRAM)', 'Optical Disc', 'Main DRAM'],
          correctIndex: 1,
          explanation: 'SRAM Cache is the fastest off-register memory tier.'
        },
        {
          id: 'u5-c1-q3',
          question: 'If cache hit rate h = 0.8, T_cache = 5 ns, and T_main = 50 ns (sequential access), what is T_avg?',
          options: ['14 ns', '15 ns', '55 ns', '10 ns'],
          correctIndex: 1,
          explanation: 'T_avg = 0.8(5) + 0.2(5 + 50) = 4 + 11 = 15 ns.'
        }
      ]
    },
    {
      id: 'u5-c2',
      unitId: 'unit-5',
      chapterNumber: '5.2',
      title: 'Semiconductor RAM Memories (SRAM & DRAM)',
      syllabusTopic: 'Semiconductor RAM memories',
      estimatedMinutes: 25,
      diagramType: 'semiconductor-ram',
      diagramCaption: '6-Transistor Static RAM (6T SRAM) flip-flop cell vs. 1-Transistor 1-Capacitor Dynamic RAM (1T1C DRAM) cell.',
      introduction: {
        meaning:
          'Semiconductor Random Access Memory (RAM) provides fast, read/write main and cache memory built from integrated transistor arrays where any location takes identical time to access.',
        importance:
          'Knowing the internal difference between Static RAM (flip-flop latch) and Dynamic RAM (capacitor charge) explains why CPUs use SRAM for cache and DRAM for gigabyte main memory.',
        whereUsed:
          'CPU L1/L2/L3 Caches (SRAM) and DDR4/DDR5 system DIMMs (DRAM).',
        problemSolved:
          'Balances ultra-fast switching (SRAM) against ultra-high density (DRAM).'
      },
      fundamentalConcept: {
        overview:
          'An SRAM cell stores 1 bit in a cross-coupled inverter latch (6 transistors)—never needs refreshing as long as power is on. A DRAM cell stores 1 bit as electrical charge on a microscopic capacitor (1 transistor + 1 capacitor)—charge leaks away in milliseconds, requiring periodic Refresh cycles.',
        terms: [
          { term: 'SRAM (Static RAM)', meaning: 'Uses 6-transistor flip-flop latches; very fast, no refresh needed, low density, used in Cache.' },
          { term: 'DRAM (Dynamic RAM)', meaning: 'Uses 1 transistor + 1 capacitor per bit; high density, lower cost, requires periodic refresh and destructive-read rewrite.' },
          { term: 'Refresh Cycle', meaning: 'Periodic read-and-rewrite operation every few milliseconds to replenish leaking DRAM capacitor charges.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. SRAM vs. DRAM Detailed Comparison',
          table: {
            caption: 'Technical Comparison of Static RAM and Dynamic RAM',
            headers: ['Property', 'SRAM (Static RAM)', 'DRAM (Dynamic RAM)'],
            rows: [
              ['Storage Element', 'Cross-coupled latch (6 transistors)', '1 MOSFET + 1 Capacitor (1T1C)'],
              ['Refresh Required?', 'No (retains as long as powered)', 'Yes (every 2–64 ms due to leakage)'],
              ['Access Speed', 'Very Fast (1–10 ns)', 'Slower (40–80 ns)'],
              ['Density & Capacity', 'Low density (MBs)', 'Very High density (GBs)'],
              ['Cost per Bit', 'Expensive', 'Inexpensive'],
              ['Primary Role', 'CPU Cache Memory', 'Computer Main Memory']
            ]
          }
        },
        {
          heading: '2. Internal 2D Memory Chip Organization',
          bullets: [
            'Memory cells are arranged in a 2D array of Rows (Word Lines) and Columns (Bit Lines) rather than a long 1D strip to minimize decoder size.',
            'Example: A 1K × 1 chip uses a 32×32 matrix with a 5-to-32 Row Decoder and 5-to-32 Column Sense/MUX instead of a 10-to-1024 decoder!',
            'Modern SDRAM/DDR chips overlap row and column operations synchronously with the memory clock.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u5-c2-ex1',
          title: 'Designing a 4K × 8 RAM System Using 1K × 4 Chips',
          problemStatement: 'How many 1K × 4 RAM chips are needed to build a 4K × 8 memory system, and how are the 12 address lines connected?',
          given: ['Target memory: 4K × 8 (4096 words, 8 bits/word)', 'Available chip: 1K × 4 (1024 words, 4 bits/word)'],
          required: 'Total chips, chip arrangement, and address decoding',
          formulaLatex: 'N_{\\text{chips}} = \\left(\\frac{4\\text{K}}{1\\text{K}}\\right) \\times \\left(\\frac{8}{4}\\right)',
          substitutionLatex: 'N_{\\text{chips}} = 4 \\text{ rows (banks)} \\times 2 \\text{ columns (width)}',
          calculationSteps: [
            'Word depth expansion: 4K / 1K = 4 rows of chips.',
            'Word width expansion: 8 bits / 4 bits = 2 chips per row (side-by-side: high nibble D₇–D₄ and low nibble D₃–D₀).',
            'Total chips = 4 × 2 = 8 chips.',
            'Address lines: 1K = 2¹⁰ → lower 10 bits (A₉–A₀) connect in parallel to every chip; upper 2 bits (A₁₁–A₁₀) feed a 2-to-4 Decoder driving Chip Select (CS) of each row.'
          ],
          finalAnswer: '8 chips (4×2 grid); A₉–A₀ to all chips, A₁₁–A₁₀ to a 2-to-4 Decoder',
          interpretation: 'Width expansion doubles data bus pins; depth expansion uses upper address bits + a decoder.'
        }
      ],
      formulas: [
        {
          id: 'f-u5-2',
          unitId: 'unit-5',
          chapterId: 'u5-c2',
          chapterTitle: 'Semiconductor RAM Memories (SRAM & DRAM)',
          name: 'Memory Chip Count for Expansion',
          latex: 'N_{\\text{chips}} = \\frac{W_{\\text{target}}}{W_{\\text{chip}}} \\times \\frac{B_{\\text{target}}}{B_{\\text{chip}}}',
          symbols: [
            { symbol: 'W', meaning: 'Number of addressable words' },
            { symbol: 'B', meaning: 'Word bit-width' }
          ],
          units: 'Number of IC chips',
          conditions: 'Assumes target dimensions are integer multiples of chip dimensions.',
          miniExample: 'Building 8K × 8 from 2K × 8 chips takes (8K/2K) × (8/8) = 4 chips.'
        }
      ],
      applications: [
        { area: 'DDR5 System Memory', detail: 'High-density 1T1C DRAM arrays store gigabytes of active OS and AI/ML model weights.' }
      ],
      summary: [
        'SRAM uses 6-transistor latches (fast, no refresh, cache); DRAM uses 1T1C capacitors (dense, needs periodic refresh, main RAM).',
        '2D row/column arrays drastically reduce decoder complexity inside memory chips.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'SRAM', definition: 'Static RAM—latch-based, fastest RAM, no refresh.' },
          { term: 'DRAM', definition: 'Dynamic RAM—capacitor-based, needs periodic refresh, dense.' }
        ],
        corePoints: [
          'SRAM = 6 transistors; DRAM = 1 transistor + 1 capacitor.',
          'DRAM refresh restores leaking capacitor charge.'
        ],
        examReminders: [
          'When sketching RAM expansion, clearly show lower address bits wired in parallel to all chips and upper bits entering a Decoder to drive CS pins.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c2-q1',
          question: 'Why does DRAM require periodic refresh cycles whereas SRAM does not?',
          options: ['DRAM uses magnetic cores', 'DRAM stores bits as charge on tiny capacitors that leak over time', 'SRAM is non-volatile', 'DRAM has 6 transistors per cell'],
          correctIndex: 1,
          explanation: 'Capacitor charge leaks through the access transistor and substrate, requiring periodic refresh.'
        },
        {
          id: 'u5-c2-q2',
          question: 'How many 2K × 4 RAM chips are required to construct an 8K × 8 memory module?',
          options: ['4', '6', '8', '16'],
          correctIndex: 2,
          explanation: '(8K / 2K) × (8 / 4) = 4 × 2 = 8 chips.'
        },
        {
          id: 'u5-c2-q3',
          question: 'Which RAM type is used to build CPU L1 and L2 caches?',
          options: ['DRAM', 'SRAM', 'ROM', 'SDRAM'],
          correctIndex: 1,
          explanation: 'SRAM’s low access latency makes it essential for CPU caches.'
        }
      ]
    },
    {
      id: 'u5-c3',
      unitId: 'unit-5',
      chapterNumber: '5.3',
      title: 'Read-Only Memories (ROM, PROM, EPROM, EEPROM, Flash)',
      syllabusTopic: 'Read-Only memories',
      estimatedMinutes: 20,
      diagramType: 'rom-architecture',
      diagramCaption: 'ROM internal architecture (Fixed AND Decoder + Programmable OR Matrix) and comparison of non-volatile ROM family.',
      introduction: {
        meaning:
          'Read-Only Memory (ROM) is non-volatile semiconductor memory that retains stored firmware and permanent lookup tables even when electrical power is removed.',
        importance:
          'When a computer powers on, RAM is empty—the CPU needs non-volatile ROM/Flash to hold the BIOS/UEFI bootloader that initializes hardware and loads the OS.',
        whereUsed:
          'BIOS/UEFI firmware, microcontroller program flash, USB drives, and combinational lookup tables.',
        problemSolved:
          'Provides permanent, non-volatile boot code and uncorruptible data storage.'
      },
      fundamentalConcept: {
        overview:
          'Structurally, a 2ᵏ × n ROM consists of a fixed k-to-2ᵏ decoder (AND array producing all minterms) followed by n OR gates programmed with diodes/transistors at intersections where a 1 is stored.',
        terms: [
          { term: 'Mask ROM', meaning: 'Content permanently hardwired at the semiconductor factory during fabrication.' },
          { term: 'PROM', meaning: 'Programmable ROM—user programs once by blowing internal fuses.' },
          { term: 'EPROM', meaning: 'Erasable PROM—erased completely via UV light through a quartz window.' },
          { term: 'EEPROM & Flash', meaning: 'Electrically Erasable PROM (byte-level) and Flash Memory (high-density block-level electrical erase).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Evolution of Non-Volatile ROM Technologies',
          table: {
            caption: 'Comparison of ROM Variants',
            headers: ['Type', 'Programmability', 'Erasure Method', 'Key Trait'],
            rows: [
              ['Mask ROM', 'Factory mask only', 'Not erasable', 'Cheapest in massive production runs'],
              ['PROM', 'One-time (OTP) by user', 'Not erasable (fusible links)', 'Permanent custom firmware'],
              ['EPROM', 'Electrical programmer', 'UV light (15–20 mins)', 'Quartz window package; full-chip erase'],
              ['EEPROM', 'In-circuit electrical', 'Electrical (byte-by-byte)', 'Flexible small-config storage'],
              ['Flash Memory', 'In-circuit electrical', 'Electrical (block/sector)', 'Very high density; used in SSDs & USBs']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u5-c3-ex1',
          title: 'Implementing Combinational Functions Using a ROM',
          problemStatement: 'Determine the ROM size required to implement a 4-bit squaring circuit (takes 4-bit input X and outputs X²).',
          given: ['Input width k = 4 bits (0 to 15)', 'Max output = 15² = 225 (fits in 8 bits, since 2⁸ − 1 = 255)'],
          required: 'ROM dimensions (2ᵏ × n) and total bits',
          formulaLatex: '\\text{ROM Size} = 2^k \\times n \\text{ bits}',
          substitutionLatex: 'k = 4 \\implies 2^4 = 16 \\text{ words}, \\quad n = 8 \\text{ output bits}',
          calculationSteps: [
            '4 input bits give 2⁴ = 16 addressable locations (addresses 0 to 15).',
            'Largest square 15² = 225 = (11100001)₂ requires 8 output bits.',
            'ROM size = 16 × 8 bits = 128 bits.'
          ],
          finalAnswer: '16 × 8 ROM (128 bits)',
          interpretation: 'ROM directly acts as a hardware Look-Up Table for arbitrary multi-output combinational functions.'
        }
      ],
      formulas: [
        {
          id: 'f-u5-3',
          unitId: 'unit-5',
          chapterId: 'u5-c3',
          chapterTitle: 'Read-Only Memories (ROM, PROM, EPROM, EEPROM, Flash)',
          name: 'ROM Storage Capacity for Combinational LUT',
          latex: 'C_{\\text{ROM}} = 2^k \\times n \\text{ bits}',
          symbols: [
            { symbol: 'k', meaning: 'Number of address (input) lines' },
            { symbol: 'n', meaning: 'Number of data (output) lines' }
          ],
          units: 'Bits',
          conditions: 'Every address maps directly to one n-bit truth table output row.',
          miniExample: 'A 3-input, 2-output Full Adder takes a 2³ × 2 = 8 × 2 ROM (16 bits).'
        }
      ],
      applications: [
        { area: 'System Bootloader (BIOS/UEFI)', detail: 'Stored in NOR Flash/EEPROM so the motherboard immediately knows how to initialize DRAM and SSDs at power-up.' }
      ],
      summary: [
        'ROM is non-volatile memory retaining data without power.',
        'Variants progress from factory Mask ROM → OTP PROM → UV-erased EPROM → byte-erased EEPROM → block-erased Flash.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'ROM', definition: 'Non-volatile memory storing permanent firmware and lookup tables.' },
          { term: 'Flash Memory', definition: 'High-density electrically erasable memory erased in blocks/pages.' }
        ],
        corePoints: [
          'ROM = Fixed AND decoder + Programmable OR plane.',
          'EPROM = UV light erase; EEPROM = byte electrical erase; Flash = block electrical erase.'
        ],
        examReminders: [
          'In PLA/PAL/ROM comparisons: ROM has a FIXED AND plane and PROGRAMMABLE OR plane.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c3-q1',
          question: 'Which type of ROM requires exposure to ultraviolet (UV) light through a quartz window for erasure?',
          options: ['PROM', 'EPROM', 'EEPROM', 'Mask ROM'],
          correctIndex: 1,
          explanation: 'EPROM uses floating-gate charges discharged by UV light.'
        },
        {
          id: 'u5-c3-q2',
          question: 'Which non-volatile memory technology erases data in large blocks/sectors and powers modern SSDs and USB drives?',
          options: ['Mask ROM', 'Flash Memory', 'SRAM', 'DRAM'],
          correctIndex: 1,
          explanation: 'NAND Flash achieves massive density by erasing in multi-kilobyte blocks.'
        },
        {
          id: 'u5-c3-q3',
          question: 'What size ROM is needed to store a truth table with 5 inputs and 4 outputs?',
          options: ['32 × 4', '16 × 4', '5 × 4', '64 × 4'],
          correctIndex: 0,
          explanation: '5 inputs give 2⁵ = 32 rows, each 4 bits wide → 32 × 4 ROM.'
        }
      ]
    },
    {
      id: 'u5-c4',
      unitId: 'unit-5',
      chapterNumber: '5.4',
      title: 'Primary Memory vs. Auxiliary Memory',
      syllabusTopic: 'Primary memory, Auxiliary memory',
      estimatedMinutes: 20,
      diagramType: 'primary-auxiliary',
      diagramCaption: 'Comparison of CPU-directly-addressed Primary Memory against I/O-accessed Auxiliary Storage devices (Magnetic Disk, Optical, SSD).',
      introduction: {
        meaning:
          'Primary Memory (Main Memory) is directly addressable by the CPU for active programs, while Auxiliary (Secondary) Memory provides high-capacity, non-volatile long-term storage accessed through I/O channels.',
        importance:
          'Clarifies why computers need both gigabytes of fast volatile DRAM and terabytes of permanent SSD/HDD storage.',
        whereUsed:
          'System RAM vs. Hard Disk Drives (HDD), Solid State Drives (SSD), Optical DVDs, and Magnetic Tape backups.',
        problemSolved:
          'Bridges the gap between volatile high-speed working memory and permanent archival storage.'
      },
      fundamentalConcept: {
        overview:
          'The CPU cannot execute instructions directly off an HDD or SSD—auxiliary files must first be transferred into Primary Memory (RAM) via DMA/I/O controllers.',
        terms: [
          { term: 'Primary Memory', meaning: 'CPU-accessible RAM/ROM directly wired to MAR/MDR on the system bus.' },
          { term: 'Auxiliary Memory', meaning: 'Bulk non-volatile peripheral storage (HDD, SSD, Optical, Tape) accessed via I/O blocks/sectors.' },
          { term: 'Seek Time & Rotational Latency', meaning: 'Mechanical delays in magnetic HDDs to position the read/write head over the target track and sector.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Primary Memory vs. Auxiliary Memory Comparison',
          table: {
            caption: 'Key Architectural Differences',
            headers: ['Parameter', 'Primary Memory', 'Auxiliary Memory'],
            rows: [
              ['CPU Direct Access?', 'Yes (via Memory Bus)', 'No (accessed via I/O & DMA controllers)'],
              ['Volatility', 'Mostly Volatile (DRAM)', 'Non-Volatile (Permanent)'],
              ['Access Speed', 'Nanoseconds (40–80 ns)', 'Microseconds (SSD) to Milliseconds (HDD)'],
              ['Capacity & Cost/Bit', 'GBs; higher cost/bit', 'TBs; very low cost/bit'],
              ['Examples', 'DRAM, Boot ROM', 'Magnetic Disks (HDD), NAND Flash SSD, Optical, Tape']
            ]
          }
        },
        {
          heading: '2. Magnetic Disk Performance Components (HDD)',
          bullets: [
            'Seek Time (t_s): Time to move the actuator arm radially to the target concentric track.',
            'Rotational Latency (t_r): Average half-rotation wait (1 / (2 × RPM/60)) for the target sector to spin under the head.',
            'Transfer Time (t_t): Time to stream the sector bytes off the spinning platter.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u5-c4-ex1',
          title: 'Calculating Magnetic Disk Access Time',
          problemStatement: 'A magnetic disk spins at 7200 RPM, has an average seek time of 8 ms, and transfers a 4 KB sector at 100 MB/s. Find the average disk access time.',
          given: ['Seek time t_s = 8 ms', 'RPM = 7200 rev/min = 120 rev/sec', 'Sector = 4 KB, Transfer rate = 100 MB/s'],
          required: 'Total average sector access time',
          formulaLatex: 't_r = \\frac{1}{2 \\times (\\text{RPM}/60)}, \\qquad T_{\\text{disk}} = t_s + t_r + t_t',
          substitutionLatex: 't_r = \\frac{1}{2 \\times 120} = 4.17\\text{ ms}, \\quad t_t = \\frac{4096}{10^8} \\approx 0.04\\text{ ms}',
          calculationSteps: [
            'Rotational speed = 7200 / 60 = 120 revolutions/sec → 1 full rotation = 8.33 ms.',
            'Average rotational latency t_r = 8.33 / 2 = 4.17 ms.',
            'Transfer time t_t = 4 KB / 100 MB/s ≈ 0.04 ms.',
            'Total Access Time = 8.0 + 4.17 + 0.04 = 12.21 ms.'
          ],
          finalAnswer: '12.21 ms',
          interpretation: 'Notice that mechanical seek and rotation dominate (>99% of delay), explaining why SSDs with zero moving parts are orders of magnitude faster.'
        }
      ],
      formulas: [
        {
          id: 'f-u5-4',
          unitId: 'unit-5',
          chapterId: 'u5-c4',
          chapterTitle: 'Primary Memory vs. Auxiliary Memory',
          name: 'Average Magnetic Disk Access Time',
          latex: 'T_{\\text{disk}} = t_{\\text{seek}} + \\frac{60}{2 \\cdot \\text{RPM}} + \\frac{\\text{Bytes}}{R_{\\text{transfer}}}',
          symbols: [
            { symbol: 't_seek', meaning: 'Average arm seek time (s)' },
            { symbol: 'RPM', meaning: 'Platter revolutions per minute' },
            { symbol: 'R_transfer', meaning: 'Sustained data transfer rate (Bytes/s)' }
          ],
          units: 'Milliseconds (ms)',
          conditions: 'Applies to rotating magnetic hard disk drives.',
          miniExample: 'At 6000 RPM (100 rps), 1 rotation = 10 ms → average rotational latency = 5 ms.'
        }
      ],
      applications: [
        { area: 'Archival & Cloud Tiers', detail: 'Hot data sits in Primary DRAM, active OS/datasets on NVMe SSDs, and cold backups on high-capacity HDDs or Tape.' }
      ],
      summary: [
        'Primary memory is directly CPU-addressable (nanoseconds, volatile RAM); Auxiliary memory is I/O-accessed (milliseconds/microseconds, non-volatile bulk storage).',
        'HDD access time = Seek Time + Rotational Latency + Transfer Time.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Primary Memory', definition: 'Fast, directly CPU-addressed RAM/ROM.' },
          { term: 'Auxiliary Memory', definition: 'Non-volatile secondary storage (SSD, HDD, Optical, Magnetic Tape).' }
        ],
        corePoints: [
          'Average rotational latency = half of one full disk revolution time.',
          'Programs must be loaded from Auxiliary memory into Primary RAM before execution.'
        ],
        examReminders: [
          'Do not forget to divide RPM by 60 to convert minutes to seconds, and multiply by 1/2 for AVERAGE rotational latency.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c4-q1',
          question: 'Which memory can the CPU fetch instructions from directly without going through an I/O controller?',
          options: ['Hard Disk Drive', 'Magnetic Tape', 'Primary Memory (RAM/ROM)', 'Optical DVD'],
          correctIndex: 2,
          explanation: 'Only Primary Memory sits directly on the CPU memory bus.'
        },
        {
          id: 'u5-c4-q2',
          question: 'What is the average rotational latency of a disk spinning at 6000 RPM?',
          options: ['10 ms', '5 ms', '2.5 ms', '20 ms'],
          correctIndex: 1,
          explanation: '6000 RPM = 100 rev/s → 10 ms per revolution → half revolution = 5 ms.'
        },
        {
          id: 'u5-c4-q3',
          question: 'Which auxiliary storage medium relies purely on sequential access?',
          options: ['SSD', 'Magnetic Tape', 'DRAM', 'DVD-RW'],
          correctIndex: 1,
          explanation: 'Magnetic tape must wind sequentially past earlier records to reach a target file.'
        }
      ]
    },
    {
      id: 'u5-c5',
      unitId: 'unit-5',
      chapterNumber: '5.5',
      title: 'Associative Memory (Content-Addressable Memory)',
      syllabusTopic: 'Associative memory',
      estimatedMinutes: 25,
      diagramType: 'associative-cam',
      diagramCaption: 'Associative Memory (CAM) block diagram featuring Argument Register (A), Key Register (K), Match Register (M), and parallel XNOR match logic.',
      introduction: {
        meaning:
          'Associative Memory—also called Content-Addressable Memory (CAM)—is accessed by searching its stored *data content* simultaneously across all words in parallel, rather than by specifying a numeric address.',
        importance:
          'Enables single-cycle O(1) parallel searches in Fully Associative Caches, TLBs (Translation Lookaside Buffers), and network router forwarding tables.',
        whereUsed:
          'CPU TLBs, Fully Associative Cache Tag arrays, and Gigabit Ethernet switch MAC lookup tables.',
        problemSolved:
          'Eliminates slow O(N) sequential or O(log N) binary searching when locating a matching tag or key.'
      },
      fundamentalConcept: {
        overview:
          'Instead of sending an address to a decoder, the CPU places a search pattern in the Argument Register (A) and a bitmask in the Key Register (K). Every word in CAM compares its masked bits against A in parallel using XNOR equality gates, setting its bit in the Match Register (M) if all unmasked bits match.',
        terms: [
          { term: 'Argument Register (A)', meaning: 'Holds the n-bit search word to be matched against memory.' },
          { term: 'Key Register (K)', meaning: 'n-bit mask selecting which bit positions participate in the match (Kⱼ=1 compares bit j; Kⱼ=0 ignores bit j).' },
          { term: 'Match Register (M)', meaning: 'm-bit register (one bit per word) where Mᵢ = 1 if word i matches.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Hardware Match Logic for Cell (i, j)',
          bullets: [
            'Bit equality between Argument bit Aⱼ and stored cell bit Fᵢⱼ is: xᵢⱼ = AⱼFᵢⱼ + Aⱼ\'Fᵢⱼ\' (XNOR).',
            'Incorporating Key mask bit Kⱼ (if Kⱼ = 0, force match = 1 regardless of data): Matchⱼ = xᵢⱼ + Kⱼ\'.',
            'Word i matches completely iff every bit 1..n matches: Mᵢ = Π (xᵢⱼ + Kⱼ\') over j = 1..n (an n-input AND gate per word).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u5-c5-ex1',
          title: 'Tracing Masked Associative Search in CAM',
          problemStatement: 'An Associative Memory stores Word 0 = 10110, Word 1 = 11010, Word 2 = 10011. With Argument A = 10111 and Key K = 11100 (match first 3 bits only), determine the Match Register M.',
          given: ['A = 10111', 'K = 11100 (only bits 4, 3, 2 must match)', 'Words: W₀=10110, W₁=11010, W₂=10011'],
          required: 'Match Register M₂M₁M₀',
          formulaLatex: 'M_i = \\prod_{j=1}^{n} \\left( (A_j \\odot F_{ij}) + K_j\' \\right)',
          substitutionLatex: '\\text{Compare prefix } 101\\text{xx against } W_0, W_1, W_2',
          calculationSteps: [
            'Mask K = 11100 requires matching the left 3 bits (101) and ignores the right 2 bits.',
            'Word 0 (10110): prefix 101 == 101 → M₀ = 1.',
            'Word 1 (11010): prefix 110 != 101 → M₁ = 0.',
            'Word 2 (10011): prefix 100 != 101 → M₂ = 0.'
          ],
          finalAnswer: 'M₀ = 1, M₁ = 0, M₂ = 0 (Word 0 matches)',
          interpretation: 'Notice how K = 11100 acts like a subnet prefix mask in IP routing tables!'
        }
      ],
      formulas: [
        {
          id: 'f-u5-5',
          unitId: 'unit-5',
          chapterId: 'u5-c5',
          chapterTitle: 'Associative Memory (Content-Addressable Memory)',
          name: 'CAM Word Match Logic Equation',
          latex: 'M_i = \\prod_{j=1}^{n} \\left( A_j F_{ij} + A_j\' F_{ij}\' + K_j\' \\right)',
          symbols: [
            { symbol: 'M_i', meaning: 'Match flag for word i' },
            { symbol: 'A_j, K_j', meaning: 'j-th bit of Argument and Key registers' },
            { symbol: 'F_{ij}', meaning: 'Stored bit at word i, column j' }
          ],
          units: 'Boolean logic',
          conditions: 'Executed in parallel across all m words simultaneously in 1 clock cycle.',
          miniExample: 'If Kⱼ = 0, Kⱼ\' = 1 forces that bit factor to 1 (don’t-care bit).'
        }
      ],
      applications: [
        { area: 'TLB & Network Switches', detail: 'Virtual-to-physical page lookups in a TLB and Ethernet MAC table lookups require single-cycle CAM search.' }
      ],
      summary: [
        'Associative Memory (CAM) searches by content rather than address in O(1) parallel time.',
        'Uses Argument Register (A), Key Mask Register (K), and Match Register (M) with per-cell XNOR comparators.',
        'Higher hardware cost per bit limits CAM to specialized structures like TLBs and cache tags.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Associative Memory (CAM)', definition: 'Memory accessed simultaneously by stored data content instead of numeric address.' },
          { term: 'Key Register (K)', definition: 'Bitmask selecting which bits of Argument A must match (1=compare, 0=ignore).' }
        ],
        corePoints: [
          'Mᵢ = 1 when all bits with Kⱼ=1 satisfy Aⱼ = Fᵢⱼ.',
          'Each CAM bit cell contains flip-flop storage + XNOR/AND match logic (more expensive than RAM).'
        ],
        examReminders: [
          'Always draw Argument Register A, Key Register K, Memory Array, and Match Register M cleanly when asked for CAM hardware.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c5-q1',
          question: 'What happens to bit position j during an Associative Memory search when Key Register bit Kⱼ = 0?',
          options: ['The entire search fails', 'Bit j is masked out (ignored / treated as match)', 'Bit j is inverted', 'Memory resets'],
          correctIndex: 1,
          explanation: 'Since Kⱼ\' = 1, the match term (xᵢⱼ + Kⱼ\') evaluates to 1 regardless of Aⱼ or Fᵢⱼ.'
        },
        {
          id: 'u5-c5-q2',
          question: 'Why is Associative Memory much more expensive per bit than standard DRAM?',
          options: ['It uses magnetic platters', 'Every individual bit cell includes comparison logic gates alongside storage', 'It requires UV light', 'It has no address bus'],
          correctIndex: 1,
          explanation: 'Embedding XNOR/match logic into every single memory cell increases transistor count and power.'
        },
        {
          id: 'u5-c5-q3',
          question: 'Which CPU structure relies on Associative Memory for fast virtual-to-physical page translation?',
          options: ['ALU', 'TLB (Translation Lookaside Buffer)', 'Program Counter', 'DMA Word Counter'],
          correctIndex: 1,
          explanation: 'The TLB searches virtual page numbers in parallel using CAM.'
        }
      ]
    },
    {
      id: 'u5-c6',
      unitId: 'unit-5',
      chapterNumber: '5.6',
      title: 'Cache Memories & Mapping Techniques',
      syllabusTopic: 'Cache memories',
      estimatedMinutes: 30,
      diagramType: 'cache-mapping',
      diagramCaption: 'Address partitioning (Tag · Index/Set · Block Offset) for Direct, Associative, and Set-Associative Cache Mapping.',
      introduction: {
        meaning:
          'Cache Memory is a small, ultra-fast SRAM buffer placed between the CPU and Main DRAM to store copies of frequently accessed memory blocks.',
        importance:
          'Because modern CPUs execute billions of instructions per second while DRAM takes ~50–80 ns, without Cache Memory the CPU would stall ~95% of the time waiting on DRAM.',
        whereUsed:
          'L1, L2, and L3 caches inside every x86, ARM, and RISC-V processor.',
        problemSolved:
          'Exploits Temporal and Spatial Locality of Reference to deliver DRAM-sized capacity at SRAM-like speeds.'
      },
      fundamentalConcept: {
        overview:
          'Programs exhibit Locality of Reference: recently used items tend to be reused soon (Temporal Locality), and nearby addresses tend to be accessed next (Spatial Locality). Cache mapping defines where a Main Memory block can live inside the Cache.',
        terms: [
          { term: 'Cache Hit & Hit Ratio (h)', meaning: 'Found in cache = Hit; not found = Miss. Hit Ratio h = Hits / Total Memory Accesses.' },
          { term: 'Direct Mapping', meaning: 'Each main memory block maps to exactly ONE fixed cache line: Line = Block mod (NumLines).' },
          { term: 'Associative Mapping', meaning: 'Any main memory block can be placed into ANY cache line (requires CAM tag search).' },
          { term: 'k-Way Set-Associative Mapping', meaning: 'Cache is divided into Sets of k lines; a block maps to a specific Set via modulo, and can occupy any of the k lines inside that set.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Address Partitioning Across All Three Mapping Functions',
          table: {
            caption: 'Physical Address Bit Split (for 2^W word space, Block Size = 2^b words, Cache Lines = 2^L)',
            headers: ['Mapping Scheme', 'Tag Bits', 'Index / Set Bits', 'Word Offset Bits'],
            rows: [
              ['Direct Mapping', 'W − L − b', 'L (Line index)', 'b'],
              ['Fully Associative', 'W − b', '0 (searches all lines)', 'b'],
              ['k-Way Set-Associative (S = 2^s sets, S = Lines/k)', 'W − s − b', 's (Set index)', 'b']
            ]
          }
        },
        {
          heading: '2. Write Policies & Replacement Policies',
          bullets: [
            'Write-Through: Updates both Cache and Main Memory simultaneously (simple consistency, higher bus traffic).',
            'Write-Back: Updates Cache only and sets a Dirty Bit; Main Memory is updated only when that dirty line is evicted.',
            'Replacement Policies (for Associative/Set-Associative): LRU (Least Recently Used), FIFO, or Random.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u5-c6-ex1',
          title: 'Computing Tag, Index & Offset Bits for Direct & 4-Way Set-Associative Cache',
          problemStatement: 'A computer has a 32-bit byte-addressable physical address space (4 GB), a 64 KB cache, and a cache block (line) size of 64 Bytes. Find the Tag, Index/Set, and Offset bit widths for (a) Direct Mapping and (b) 4-Way Set-Associative Mapping.',
          given: ['Address width W = 32 bits', 'Cache size = 64 KB = 2¹⁶ Bytes', 'Block size = 64 B = 2⁶ Bytes'],
          required: 'Tag, Index/Set, and Offset bit counts for Direct and 4-Way Set-Associative',
          formulaLatex: '\\text{Lines} = \\frac{\\text{Cache Size}}{\\text{Block Size}}, \\quad \\text{Sets} = \\frac{\\text{Lines}}{k}, \\quad W = \\text{Tag} + \\text{Index} + \\text{Offset}',
          substitutionLatex: '\\text{Lines} = \\frac{2^{16}}{2^6} = 2^{10} = 1024, \\quad \\text{Sets}_{4\\text{-way}} = \\frac{1024}{4} = 256 = 2^8',
          calculationSteps: [
            'Block Offset = log₂(64) = 6 bits (both cases).',
            'Case (a) Direct Mapping: 1024 lines → Line Index = log₂(1024) = 10 bits; Tag = 32 − 10 − 6 = 16 bits.',
            'Case (b) 4-Way Set-Associative: 1024 / 4 = 256 sets → Set Index = log₂(256) = 8 bits; Tag = 32 − 8 − 6 = 18 bits.'
          ],
          finalAnswer: '(a) Direct: 16 Tag, 10 Index, 6 Offset; (b) 4-Way: 18 Tag, 8 Set, 6 Offset',
          interpretation: 'Notice that higher associativity shifts bits out of Index and into Tag, reducing conflict misses while requiring k parallel tag comparators.'
        }
      ],
      formulas: [
        {
          id: 'f-u5-6',
          unitId: 'unit-5',
          chapterId: 'u5-c6',
          chapterTitle: 'Cache Memories & Mapping Techniques',
          name: 'Direct & Set-Associative Cache Bit Allocation',
          latex: 'b = \\log_2(\\text{Block Size}), \\quad s = \\log_2\\left(\\frac{\\text{Cache Size}}{k \\cdot \\text{Block Size}}\\right), \\quad \\text{Tag} = W - s - b',
          symbols: [
            { symbol: 'W', meaning: 'Total physical address bits' },
            { symbol: 'k', meaning: 'Associativity (k=1 for Direct Mapping)' },
            { symbol: 'b, s', meaning: 'Block offset bits and Set index bits' }
          ],
          units: 'Bits',
          conditions: 'Assumes powers of 2 for sizes.',
          miniExample: 'Direct Mapping is simply 1-Way Set-Associative (k = 1).'
        }
      ],
      applications: [
        { area: 'CPU Performance Tuning', detail: 'Loop tiling and row-major array traversal maximize Spatial Locality, boosting L1 cache hit rates above 98%.' }
      ],
      summary: [
        'Cache bridges CPU and DRAM speed using Temporal and Spatial Locality.',
        'Three mapping methods: Direct (fast/cheap, conflict misses), Fully Associative (flexible, expensive CAM), and Set-Associative (best trade-off).',
        'Write policies: Write-Through vs Write-Back (with Dirty bit).'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Locality of Reference', definition: 'Temporal (reuse soon) + Spatial (access nearby addresses).' },
          { term: 'Write-Back', definition: 'Updates cache only; writes back to RAM only upon dirty eviction.' }
        ],
        corePoints: [
          'Address = [Tag | Index/Set | Offset].',
          'Direct mapping = 1-way; Fully associative = 1 set containing all lines.'
        ],
        examReminders: [
          'Verify your bit widths add up to the exact physical address length W: Tag + Index + Offset = W!'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c6-q1',
          question: 'Which cache mapping scheme allows a main memory block to be placed into ANY line of the cache?',
          options: ['Direct Mapping', 'Fully Associative Mapping', '2-Way Set-Associative', 'Write-Through'],
          correctIndex: 1,
          explanation: 'Fully Associative Mapping has zero index bits and searches all cache tags in parallel.'
        },
        {
          id: 'u5-c6-q2',
          question: 'For a 16-bit address space, 128-line Direct-Mapped cache with 16-word blocks, how many Tag bits are there?',
          options: ['4', '5', '7', '9'],
          correctIndex: 1,
          explanation: 'Offset = log₂(16) = 4 bits; Index = log₂(128) = 7 bits; Tag = 16 − 7 − 4 = 5 bits.'
        },
        {
          id: 'u5-c6-q3',
          question: 'In a Write-Back cache, which flag bit marks a cache line that has been modified in cache but not yet written to Main Memory?',
          options: ['Valid Bit', 'Dirty Bit', 'Parity Bit', 'Mask Bit'],
          correctIndex: 1,
          explanation: 'The Dirty (Modified) bit tells the controller to flush the block to RAM before replacing it.'
        }
      ]
    },
    {
      id: 'u5-c7',
      unitId: 'unit-5',
      chapterNumber: '5.7',
      title: 'Virtual Memories & Memory Management Requirements',
      syllabusTopic: 'Virtual Memories, Memory management requirements',
      estimatedMinutes: 30,
      diagramType: 'virtual-memory-paging',
      diagramCaption: 'Paging Virtual-to-Physical Address Translation via Page Table + TLB and five core Memory Management requirements.',
      introduction: {
        meaning:
          'Virtual Memory gives every running program the illusion of having its own massive, private, contiguous address space—exceeding physical RAM—by automatically swapping fixed-size Pages between RAM and Auxiliary storage.',
        importance:
          'Modern operating systems (Windows, Linux, macOS) rely on Virtual Memory and the Memory Management Unit (MMU) to run dozens of apps simultaneously without overwriting each other’s memory.',
        whereUsed:
          'All modern OS kernels, hardware MMUs, TLBs, and process isolation sandboxes.',
        problemSolved:
          'Solves physical RAM exhaustion, external fragmentation, program relocation, and inter-process memory corruption.'
      },
      fundamentalConcept: {
        overview:
          'Programs generate Virtual Addresses split into a Virtual Page Number (VPN) and a Page Offset. The MMU translates VPN into a Physical Page Frame Number (PFN) using a Page Table (cached in a fast Associative TLB), leaving the Page Offset unchanged.',
        terms: [
          { term: 'Page & Page Frame', meaning: 'Fixed-size blocks (commonly 4 KB): Virtual space is divided into Pages; Physical RAM is divided into Page Frames of the exact same size.' },
          { term: 'Page Fault', meaning: 'An exception triggered when a referenced page is not currently in Physical RAM (Present/Valid bit = 0), causing the OS to load it from disk.' },
          { term: 'TLB (Translation Lookaside Buffer)', meaning: 'A small Associative Cache inside the MMU storing recent VPN → PFN translations to avoid slow RAM Page Table lookups.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Five Core Memory Management Requirements (Syllabus Focus)',
          table: {
            caption: 'Five Essential Requirements of Memory Management',
            headers: ['Requirement', 'Meaning & Why Needed'],
            rows: [
              ['1. Relocation', 'Programs must run correctly regardless of which physical RAM frames they are loaded into; virtual addresses decouple code from fixed physical addresses.'],
              ['2. Protection', 'Prevent one process from reading or corrupting another process’s memory or OS kernel space (enforced via R/W/X permission bits in Page Table).'],
              ['3. Sharing', 'Allow multiple processes to safely share read-only code libraries or shared data buffers by mapping their virtual pages to the same physical frames.'],
              ['4. Logical Organization', 'Programs are structured in modules/segments (code, stack, heap) with different read/write/execute permissions rather than a flat raw array.'],
              ['5. Physical Organization', 'Automatic two-level management (Main RAM + Auxiliary Disk) handled transparently by OS/MMU without manual programmer overlays.']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u5-c7-ex1',
          title: 'Virtual-to-Physical Address Translation with Paging',
          problemStatement: 'A system uses 32-bit virtual addresses, 4 KB (2¹²) page size, and 1 GB (2³⁰) of physical RAM. Find (a) Virtual Page Number bits, (b) Page Offset bits, (c) Physical Frame Number bits, and (d) total entries in a flat Page Table.',
          given: ['Virtual address = 32 bits', 'Page size = 4 KB = 2¹² B', 'Physical RAM = 1 GB = 2³⁰ B'],
          required: 'VPN bits, Offset bits, PFN bits, Page Table entries',
          formulaLatex: '\\text{Offset} = \\log_2(\\text{Page Size}), \\quad \\text{VPN} = V - \\text{Offset}, \\quad \\text{PFN} = P - \\text{Offset}',
          substitutionLatex: '\\text{Offset} = 12, \\quad \\text{VPN} = 32 - 12 = 20, \\quad \\text{PFN} = 30 - 12 = 18',
          calculationSteps: [
            'Page size = 4 KB = 2¹² Bytes → Page Offset = 12 bits (identical in both virtual and physical addresses).',
            'VPN bits = 32 − 12 = 20 bits → 2²⁰ (1M) virtual pages → 1M entries in the flat Page Table.',
            'Physical RAM = 1 GB = 2³⁰ Bytes → 30-bit physical address → Physical Frame Number = 30 − 12 = 18 bits (2¹⁸ = 256K frames).'
          ],
          finalAnswer: 'VPN = 20 bits, Offset = 12 bits, PFN = 18 bits; 2²⁰ Page Table entries',
          interpretation: 'The 12-bit offset passes straight through untranslated, while the MMU maps the 20-bit VPN to an 18-bit PFN.'
        }
      ],
      formulas: [
        {
          id: 'f-u5-7',
          unitId: 'unit-5',
          chapterId: 'u5-c7',
          chapterTitle: 'Virtual Memories & Memory Management Requirements',
          name: 'Paging Address Split & TLB Effective Access Time',
          latex: 'V = \\text{VPN} + \\text{Offset}, \\qquad T_{\\text{VM}} = h_{\\text{TLB}}(t_{\\text{TLB}} + t_{\\text{mem}}) + (1 - h_{\\text{TLB}})(t_{\\text{TLB}} + 2t_{\\text{mem}})',
          symbols: [
            { symbol: 'VPN', meaning: 'Virtual Page Number bits' },
            { symbol: 'h_TLB', meaning: 'TLB hit ratio' },
            { symbol: 't_TLB, t_mem', meaning: 'TLB lookup time and Main RAM access time' }
          ],
          units: 'Bits / Seconds',
          conditions: 'Assumes single-level Page Table in Main RAM on a TLB miss (no page fault).',
          miniExample: 'TLB hit requires only 1 main memory access; TLB miss requires 2 (1 for Page Table + 1 for data).'
        }
      ],
      applications: [
        { area: 'Process Isolation & Security', detail: 'Every browser tab and application receives an isolated virtual address map enforced in hardware by the MMU.' }
      ],
      summary: [
        'Virtual Memory allows programs larger than physical RAM to execute seamlessly via Paging (Pages in Virtual space ↔ Frames in Physical RAM).',
        'A Page Fault occurs when the Valid/Present bit is 0, invoking the OS to fetch the page from disk.',
        'Five Memory Management Requirements: Relocation, Protection, Sharing, Logical Organization, and Physical Organization.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Page Fault', definition: 'Trap raised when accessed virtual page is not currently loaded in physical RAM.' },
          { term: 'TLB', definition: 'Associative cache inside MMU accelerating VPN → PFN translation.' }
        ],
        corePoints: [
          'Page Offset bits NEVER change during virtual-to-physical translation.',
          '5 MM Requirements: Relocation, Protection, Sharing, Logical Org, Physical Org.'
        ],
        examReminders: [
          'Explicitly list all 5 Memory Management Requirements whenever answering a 5-mark or 10-mark Virtual Memory question.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u5-c7-q1',
          question: 'During Virtual-to-Physical address translation in a paged system, which part of the address remains unchanged?',
          options: ['Virtual Page Number', 'Tag Bits', 'Page Offset', 'Valid Bit'],
          correctIndex: 2,
          explanation: 'Because virtual Pages and physical Frames have identical sizes, the Page Offset passes through unchanged.'
        },
        {
          id: 'u5-c7-q2',
          question: 'What triggers a Page Fault?',
          options: ['A cache write hit', 'Accessing a virtual page whose Present/Valid bit in the Page Table is 0', 'A TLB hit', 'A DMA burst completion'],
          correctIndex: 1,
          explanation: 'Present bit = 0 signals the page currently resides on auxiliary storage (swap/disk) rather than RAM.'
        },
        {
          id: 'u5-c7-q3',
          question: 'Which of the following is NOT one of the five standard Memory Management requirements?',
          options: ['Relocation', 'Protection', 'Sharing', 'Clock Frequency Multiplication'],
          correctIndex: 3,
          explanation: 'The five requirements are Relocation, Protection, Sharing, Logical Organization, and Physical Organization.'
        }
      ]
    }
  ]
};

export const UNIT_5_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-u5-1',
    unitId: 'unit-5',
    chapterId: 'u5-c2',
    topicName: 'Semiconductor RAM Memories',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Compare SRAM and DRAM on any four technical parameters.',
    answerSections: [
      {
        bullets: [
          'Cell Structure: SRAM uses 6 transistors (flip-flop latch); DRAM uses 1 transistor + 1 capacitor.',
          'Refresh: SRAM needs no refresh; DRAM requires periodic refresh every few milliseconds.',
          'Speed: SRAM is much faster (1–10 ns) than DRAM (40–80 ns).',
          'Use Case: SRAM is used for CPU Cache; DRAM is used for Main Memory.'
        ]
      }
    ]
  },
  {
    id: 'eq-u5-2',
    unitId: 'unit-5',
    chapterId: 'u5-c5',
    topicName: 'Associative Memory',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'What is Associative Memory (CAM) and what is the purpose of its Key Register?',
    answerSections: [
      {
        paragraphs: [
          'Associative Memory (Content-Addressable Memory) locates stored words by comparing data content across all locations simultaneously in parallel rather than by address. The Key Register acts as a bitmask specifying which bit positions in the Argument Register participate in the comparison (1 = match required, 0 = masked/ignored).'
        ]
      }
    ]
  },
  {
    id: 'eq-u5-3',
    unitId: 'unit-5',
    chapterId: 'u5-c6',
    topicName: 'Cache Memories',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Define Locality of Reference and explain its two forms.',
    answerSections: [
      {
        bullets: [
          'Temporal Locality: Recently accessed instructions or data are likely to be accessed again soon (e.g., loop counters).',
          'Spatial Locality: Memory locations physically adjacent to a recently accessed address are likely to be accessed next (e.g., sequential arrays and instructions).'
        ]
      }
    ]
  },
  {
    id: 'eq-u5-4',
    unitId: 'unit-5',
    chapterId: 'u5-c5',
    topicName: 'Associative Memory Match Logic',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Explain the organization of Associative Memory and derive the Boolean match logic for word i and bit cell (i, j).',
    answerSections: [
      {
        heading: '1. Hardware Organization',
        paragraphs: [
          'Consists of an m-word × n-bit Memory Array, n-bit Argument Register (A), n-bit Key Register (K), and m-bit Match Register (M).'
        ]
      },
      {
        heading: '2. Match Logic Derivation',
        latex: [
          'x_{ij} = A_j F_{ij} + A_j\' F_{ij}\'',
          'M_i = \\prod_{j=1}^{n} (x_{ij} + K_j\')'
        ]
      }
    ]
  },
  {
    id: 'eq-u5-5',
    unitId: 'unit-5',
    chapterId: 'u5-c7',
    topicName: 'Memory Management Requirements',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'List and explain the five Memory Management Requirements in a virtual memory system.',
    answerSections: [
      {
        bullets: [
          'Relocation: Swapped processes must execute regardless of which physical frames they occupy.',
          'Protection: Isolate processes so unauthorized reads/writes cannot corrupt OS or other programs.',
          'Sharing: Permit controlled access to shared libraries or buffers by mapping multiple virtual pages to common physical frames.',
          'Logical Organization: Support modular segments (code, data, stack) with distinct access rights.',
          'Physical Organization: Automate two-level RAM–Disk data movement transparently.'
        ]
      }
    ]
  },
  {
    id: 'eq-u5-6',
    unitId: 'unit-5',
    chapterId: 'u5-c6',
    topicName: 'Cache Mapping & Virtual Memory',
    marks: 'long-answer',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Explain Direct, Associative, and Set-Associative Cache Mapping techniques with address bit breakdowns. A system has 32-bit physical addresses, a 128 KB cache, and 64-byte blocks. Calculate Tag, Index/Set, and Offset bits for Direct Mapping and 4-Way Set-Associative Mapping.',
    answerSections: [
      {
        heading: '1. Mapping Techniques',
        bullets: [
          'Direct Mapping: Block j maps to line j mod L. Address = [Tag | Line Index | Offset].',
          'Fully Associative: Block maps anywhere. Address = [Tag | Offset].',
          'Set-Associative (k-way): Block maps to Set = j mod S, placed in any of k lines in that set.'
        ]
      },
      {
        heading: '2. Numerical Calculation (W = 32, Cache = 128 KB, Block = 64 B)',
        bullets: [
          'Block Offset = log₂(64) = 6 bits.',
          'Total Cache Lines = 128 KB / 64 B = 2¹⁷ / 2⁶ = 2¹¹ = 2048 lines.',
          'Direct Mapping: Index = 11 bits; Tag = 32 − 11 − 6 = 15 bits.',
          '4-Way Set-Associative: Sets = 2048 / 4 = 512 = 2⁹ → Set Index = 9 bits; Tag = 32 − 9 − 6 = 17 bits.'
        ]
      }
    ]
  }
];

export const UNIT_5_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-u5-1',
    unitId: 'unit-5',
    chapterId: 'u5-c1',
    format: 'mcq',
    prompt: 'Which tier of the Memory Hierarchy has the lowest cost per bit and largest capacity?',
    options: ['CPU Registers', 'L1 Cache', 'Main DRAM', 'Auxiliary Storage (SSD/HDD)'],
    correctAnswer: 'Auxiliary Storage (SSD/HDD)',
    explanation: 'Auxiliary storage sits at the base of the memory pyramid with terabyte capacities and minimal cost/bit.'
  },
  {
    id: 'qz-u5-2',
    unitId: 'unit-5',
    chapterId: 'u5-c2',
    format: 'true-false',
    prompt: 'True or False: Static RAM (SRAM) cells require continuous periodic refresh cycles to avoid losing data.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Only capacitor-based DRAM requires periodic refreshing; SRAM uses flip-flop latches.'
  },
  {
    id: 'qz-u5-3',
    unitId: 'unit-5',
    chapterId: 'u5-c5',
    format: 'fill-blank',
    prompt: 'Associative Memory is also known as ____-Addressable Memory (CAM).',
    correctAnswer: 'content',
    explanation: 'Content-Addressable Memory retrieves words by matching stored contents rather than numeric addresses.'
  },
  {
    id: 'qz-u5-4',
    unitId: 'unit-5',
    chapterId: 'u5-c6',
    format: 'numerical',
    prompt: 'A 24-bit address cache uses 16-byte blocks and 256 lines in Direct Mapping. How many Tag bits are in the address?',
    correctAnswer: '12',
    tolerance: 0,
    explanation: 'Offset = log₂(16) = 4 bits; Index = log₂(256) = 8 bits; Tag = 24 − 8 − 4 = 12 bits.'
  },
  {
    id: 'qz-u5-5',
    unitId: 'unit-5',
    chapterId: 'u5-c7',
    format: 'mcq',
    prompt: 'What hardware cache inside the MMU speeds up Virtual Page Number to Physical Frame Number translations?',
    options: ['L3 Cache', 'DMA Controller', 'TLB (Translation Lookaside Buffer)', 'Program Counter'],
    correctAnswer: 'TLB (Translation Lookaside Buffer)',
    explanation: 'The TLB caches recent page-table translations in fast associative hardware.'
  }
];
