import { Unit, ExamQuestion, QuizQuestion } from '../types/academic';

export const UNIT_1: Unit = {
  id: 'unit-1',
  number: 'Unit I',
  title: 'Number Systems & Boolean Algebra',
  syllabusExactText:
    'Number Systems: Number systems, Complements of Numbers, Codes- Weighted and Non-weighted codes and its Properties, Parity check code and Hamming code. Boolean algebra: Basic Theorems and Properties, Switching Functions- Canonical and Standard Form, Algebraic Simplification, Fundamentals of Digital Logic Gates.',
  description:
    'Positional number systems, r’s and (r−1)’s complements, weighted/non-weighted binary codes, parity & Hamming error-correcting codes, Boolean axioms, canonical SOP/POS forms, algebraic simplification, and fundamental/universal logic gates.',
  chapters: [
    {
      id: 'u1-c1',
      unitId: 'unit-1',
      chapterNumber: '1.1',
      title: 'Number Systems & Base Conversions',
      syllabusTopic: 'Number systems',
      estimatedMinutes: 25,
      diagramType: 'number-systems-radix',
      diagramCaption: 'Positional weight structure and base-conversion pathways across Decimal, Binary, Octal, and Hexadecimal.',
      introduction: {
        meaning:
          'A positional number system represents quantities using a fixed set of symbols (digits) and a base (radix r) where each position carries a weight equal to a power of r.',
        importance:
          'Digital hardware operates exclusively on two voltage states (0 and 1, binary), while engineers use octal and hexadecimal as compact human-readable shorthands for long binary strings.',
        whereUsed:
          'CPU registers, memory addressing (hexadecimal), microprocessor machine code, network MAC/IPv6 addresses, and digital signal representation.',
        problemSolved:
          'Provides an unambiguous, hardware-compatible mathematical notation for storing, transmitting, and computing with numbers inside electronic circuits.'
      },
      fundamentalConcept: {
        overview:
          'Every positional number has an integer part and a fractional part separated by a radix point. Moving one digit left multiplies positional weight by r; moving one digit right divides positional weight by r.',
        terms: [
          { term: 'Radix (Base, r)', meaning: 'Total count of unique digits available in a number system (e.g., r = 2 for binary: {0,1}; r = 16 for hex: {0–9, A–F}).' },
          { term: 'MSB (Most Significant Bit)', meaning: 'The leftmost bit carrying the largest positional weight in a binary number.' },
          { term: 'LSB (Least Significant Bit)', meaning: 'The rightmost bit carrying the smallest positional weight (2⁰ = 1 for integers).' },
          { term: 'Nibble & Byte', meaning: 'A group of 4 bits is a nibble (one hex digit); a group of 8 bits is a byte.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Four Standard Digital Number Systems',
          table: {
            caption: 'Comparison of Common Positional Number Systems',
            headers: ['System', 'Radix (r)', 'Valid Digits', 'Example', 'Primary Role in DECO'],
            rows: [
              ['Decimal', '10', '0, 1, 2, 3, 4, 5, 6, 7, 8, 9', '(245.75)₁₀', 'Human arithmetic & I/O'],
              ['Binary', '2', '0, 1', '(1101.101)₂', 'Native voltage-level logic inside gates'],
              ['Octal', '8', '0, 1, 2, 3, 4, 5, 6, 7', '(372.4)₈', 'Compact 3-bit binary grouping'],
              ['Hexadecimal', '16', '0–9, A(10), B(11), C(12), D(13), E(14), F(15)', '(2A.F)₁₆', 'Compact 4-bit memory & instruction addresses']
            ]
          }
        },
        {
          heading: '2. Decimal to Any Base r Conversion',
          steps: [
            'Integer part: Repeatedly divide the integer quotient by base r and record remainders until quotient reaches 0. Read remainders from bottom (MSB) to top (LSB).',
            'Fractional part: Repeatedly multiply the fractional part by base r. Record the integer carry at each step and continue with the remaining fraction. Read carries from top to bottom.'
          ]
        },
        {
          heading: '3. Direct Binary ↔ Octal and Binary ↔ Hexadecimal Shortcuts',
          bullets: [
            'Binary to Octal: Group bits in threes from the binary point outward (pad leading/trailing zeros as needed); replace each 3-bit group with its octal digit (0–7).',
            'Binary to Hexadecimal: Group bits in fours from the binary point outward; replace each 4-bit group with its hex symbol (0–F).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c1-ex1',
          title: 'Mixed Decimal to Binary Conversion',
          problemStatement: 'Convert the decimal number (41.6875)₁₀ to its exact binary equivalent.',
          given: ['Decimal integer part = 41', 'Decimal fractional part = 0.6875', 'Target radix r = 2'],
          required: 'Binary representation (N)₂',
          formulaLatex: 'N_r = \\sum_{i=0}^{n-1} d_i r^i + \\sum_{j=1}^{m} d_{-j} r^{-j}',
          substitutionLatex: '41_{10} \\div 2 \\text{ (successive division)}, \\quad 0.6875 \\times 2 \\text{ (successive multiplication)}',
          calculationSteps: [
            'Integer part: 41 ÷ 2 = 20 R 1; 20 ÷ 2 = 10 R 0; 10 ÷ 2 = 5 R 0; 5 ÷ 2 = 2 R 1; 2 ÷ 2 = 1 R 0; 1 ÷ 2 = 0 R 1.',
            'Reading remainders bottom-to-top gives (41)₁₀ = (101001)₂.',
            'Fractional part: 0.6875 × 2 = 1.375 (carry 1); 0.375 × 2 = 0.75 (carry 0); 0.75 × 2 = 1.50 (carry 1); 0.50 × 2 = 1.00 (carry 1).',
            'Reading carries top-to-bottom gives (0.6875)₁₀ = (0.1011)₂.'
          ],
          finalAnswer: '(41.6875)₁₀ = (101001.1011)₂',
          interpretation: 'Verification: 32 + 8 + 1 + 0.5 + 0.125 + 0.0625 = 41.6875.'
        },
        {
          id: 'u1-c1-ex2',
          title: 'Binary to Octal and Hexadecimal Conversion',
          problemStatement: 'Convert (110110101.10111)₂ directly to Octal and Hexadecimal.',
          given: ['Binary string = 110110101.10111'],
          required: 'Octal (N)₈ and Hexadecimal (N)₁₆ equivalents',
          formulaLatex: '8 = 2^3 \\; (3\\text{-bit groups}), \\quad 16 = 2^4 \\; (4\\text{-bit groups})',
          substitutionLatex: '\\text{Octal: } (110\\;110\\;101\\,.\\,101\\;110)_2, \\quad \\text{Hex: } (0001\\;1011\\;0101\\,.\\,1011\\;1000)_2',
          calculationSteps: [
            'Octal integer groups: 110 = 6, 110 = 6, 101 = 5 → 665.',
            'Octal fraction groups (pad trailing 0): 101 = 5, 110 = 6 → .56.',
            'Hex integer groups (pad three leading 0s): 0001 = 1, 1011 = B(11), 0101 = 5 → 1B5.',
            'Hex fraction groups (pad three trailing 0s): 1011 = B(11), 1000 = 8 → .B8.'
          ],
          finalAnswer: '(665.56)₈ and (1B5.B8)₁₆',
          interpretation: 'Grouping avoids intermediate decimal conversion and guarantees zero rounding error.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-1',
          unitId: 'unit-1',
          chapterId: 'u1-c1',
          chapterTitle: 'Number Systems & Base Conversions',
          name: 'Positional Polynomial Expansion',
          latex: '(N)_r = \\sum_{i=-(m)}^{n-1} d_i \\cdot r^i',
          symbols: [
            { symbol: 'r', meaning: 'Radix (base) of the number system' },
            { symbol: 'd_i', meaning: 'Digit at position i, where 0 ≤ d_i < r' },
            { symbol: 'n, m', meaning: 'Number of integer digits and fractional digits respectively' }
          ],
          units: 'Dimensionless numerical value',
          conditions: 'Valid for all positional radix systems (r ≥ 2).',
          miniExample: '(101.1)₂ = 1·2² + 0·2¹ + 1·2⁰ + 1·2⁻¹ = 5.5₁₀'
        }
      ],
      applications: [
        { area: 'Memory Addressing', detail: '32-bit and 64-bit CPU memory addresses are displayed as 8 or 16 hexadecimal digits (e.g., 0x7FFF00A4).' },
        { area: 'Embedded Firmware', detail: 'Bitmasks and hardware register configurations use hex constants for compact, error-free coding.' }
      ],
      summary: [
        'Base r systems use r unique symbols with positional weights rⁱ.',
        'Convert Decimal → Base r via repeated division (integer) and repeated multiplication (fraction).',
        'Use 3-bit grouping for Binary ↔ Octal and 4-bit grouping for Binary ↔ Hexadecimal.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Radix (Base)', definition: 'Number of distinct symbols in a positional system (Binary=2, Octal=8, Decimal=10, Hex=16).' },
          { term: 'MSB / LSB', definition: 'Leftmost (highest weight) and rightmost (lowest weight) bits.' }
        ],
        corePoints: [
          'Integer decimal → base r: divide by r, read remainders bottom-up.',
          'Fraction decimal → base r: multiply by r, read integer carries top-down.',
          '1 Hex digit = 4 bits; 1 Octal digit = 3 bits.'
        ],
        examReminders: [
          'Always pad zeros toward the outer ends—left of integer MSB and right of fractional LSB—when grouping for Octal/Hex.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c1-q1',
          question: 'What is the hexadecimal equivalent of the binary number (11101101)₂?',
          options: ['ED₁₆', 'DE₁₆', 'EC₁₆', 'FD₁₆'],
          correctIndex: 0,
          explanation: 'Split into 4-bit nibbles: 1110 = 14 (E) and 1101 = 13 (D), giving ED₁₆.'
        },
        {
          id: 'u1-c1-q2',
          question: 'When converting a decimal fraction to binary, we repeatedly:',
          options: ['Divide the fraction by 2', 'Multiply the fraction by 2 and record integer carries', 'Divide by 8', 'Subtract powers of 16'],
          correctIndex: 1,
          explanation: 'Fractional parts are converted by repeated multiplication by the target base 2, recording the integer part top-to-bottom.'
        },
        {
          id: 'u1-c1-q3',
          question: 'How many binary bits are represented by a single octal digit?',
          options: ['2 bits', '3 bits', '4 bits', '8 bits'],
          correctIndex: 1,
          explanation: 'Since 8 = 2³, each octal digit maps uniquely to exactly 3 binary bits.'
        }
      ]
    },
    {
      id: 'u1-c2',
      unitId: 'unit-1',
      chapterNumber: '1.2',
      title: 'Complements of Numbers & Signed Arithmetic',
      syllabusTopic: 'Complements of Numbers',
      estimatedMinutes: 25,
      diagramType: 'complements-arithmetic',
      diagramCaption: 'Hardware subtraction using 2’s complement addition and end-carry handling.',
      introduction: {
        meaning:
          'Complements are transformed representations of numbers that simplify subtraction and signed-number arithmetic inside digital hardware.',
        importance:
          'By representing negative numbers using complements, a CPU can perform both addition and subtraction using a single adder circuit rather than needing separate subtractor hardware.',
        whereUsed:
          'Arithmetic Logic Units (ALUs), two’s complement integer storage in C/Java/Python, and digital signal processors.',
        problemSolved:
          'Eliminates borrow propagation complexity and resolves the "double-zero" (+0 and −0) ambiguity using 2’s complement.'
      },
      fundamentalConcept: {
        overview:
          'For any base-r system with n integer digits, there are two complement forms: the Diminished Radix Complement ((r − 1)’s complement) and the Radix Complement (r’s complement).',
        terms: [
          { term: '(r − 1)’s Complement', meaning: 'Obtained by subtracting each digit from (r − 1). In binary, this is the 1’s complement (invert every bit).' },
          { term: 'r’s Complement', meaning: 'Obtained by adding 1 to the (r − 1)’s complement, or subtracting N from rⁿ. In binary, this is the 2’s complement.' },
          { term: 'End-Around Carry', meaning: 'In 1’s complement subtraction, an overflow carry out of the MSB is added back to the LSB.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Rules for Computing Binary 1’s and 2’s Complements',
          bullets: [
            '1’s Complement: Flip every 0 to 1 and every 1 to 0 (bitwise NOT).',
            '2’s Complement (Method 1): Take the 1’s complement and add 1 to the LSB.',
            '2’s Complement (Method 2 — Fast Shortcut): Copy bits from right to left up to and including the first 1, then invert all remaining bits to the left.'
          ]
        },
        {
          heading: '2. Subtraction M − N Using r’s Complement (n-digit operands)',
          steps: [
            'Compute the r’s complement of the subtrahend N: N\' = rⁿ − N.',
            'Add M + N\' using standard addition.',
            'If an end-carry is generated (sum ≥ rⁿ): discard the end-carry; the remaining n digits give the positive result +(M − N).',
            'If no end-carry is generated (M < N): the result is negative. Take the r’s complement of the sum and attach a minus sign: −(rⁿ − sum).'
          ]
        },
        {
          heading: '3. Signed Binary Number Range (n bits)',
          table: {
            caption: 'Comparison of n-Bit Signed Representations',
            headers: ['Representation', 'Zero Representation', 'Range for n Bits', '8-Bit Range'],
            rows: [
              ['Signed-Magnitude', '+0 and −0 (two zeros)', '−(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1)', '−127 to +127'],
              ['1’s Complement', '+0 and −0 (two zeros)', '−(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1)', '−127 to +127'],
              ['2’s Complement', 'Unique 0 (0000...0)', '−2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1)', '−128 to +127']
            ]
          }
        }
      ],
      workedExamples: [
        {
          id: 'u1-c2-ex1',
          title: 'Binary Subtraction Using 2’s Complement (Both Cases)',
          problemStatement: 'Perform (1010100)₂ − (1000011)₂ and (1000011)₂ − (1010100)₂ using 2’s complement arithmetic (n = 7 bits).',
          given: ['X = 1010100₂ (84₁₀)', 'Y = 1000011₂ (67₁₀)', 'Bit-width n = 7'],
          required: 'X − Y and Y − X using 2’s complement addition',
          formulaLatex: 'M - N = M + (2^n - N)',
          substitutionLatex: '\\text{2\'s comp}(Y) = 0111100 + 1 = 0111101, \\quad \\text{2\'s comp}(X) = 0101011 + 1 = 0101100',
          calculationSteps: [
            'Case 1 (X − Y): Add 1010100 + 0111101 = 1 0010001 (carry out = 1).',
            'Since end-carry = 1, discard it → result is +0010001₂ (+17₁₀).',
            'Case 2 (Y − X): Add 1000011 + 0101100 = 1101111 (carry out = 0).',
            'Since end-carry = 0, result is negative: −(2’s complement of 1101111) = −(0010001)₂ (−17₁₀).'
          ],
          finalAnswer: 'X − Y = +0010001₂ (+17₁₀); Y − X = −0010001₂ (−17₁₀)',
          interpretation: 'Notice that the exact same adder hardware handles both M ≥ N and M < N.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-2',
          unitId: 'unit-1',
          chapterId: 'u1-c2',
          chapterTitle: 'Complements of Numbers & Signed Arithmetic',
          name: 'Diminished Radix ((r−1)’s) & Radix (r’s) Complement',
          latex: 'C_{r-1}(N) = (r^n - r^{-m}) - N, \\qquad C_r(N) = r^n - N = C_{r-1}(N) + r^{-m}',
          symbols: [
            { symbol: 'r', meaning: 'Number base (2 for binary, 10 for decimal)' },
            { symbol: 'n', meaning: 'Number of integer digits' },
            { symbol: 'm', meaning: 'Number of fractional digits (0 for integers)' }
          ],
          units: 'Same base r representation',
          conditions: 'N ≠ 0; for N = 0, r’s complement is 0.',
          miniExample: 'For 4-bit N = 0101₂ (5): 1’s comp = 1010₂, 2’s comp = 1011₂ (−5 in signed 4-bit).'
        }
      ],
      applications: [
        { area: 'CPU Arithmetic Logic Unit', detail: 'Every modern x86/ARM processor stores signed integers in 2’s complement and uses XOR + Carry-In = 1 on an adder to perform subtraction.' },
        { area: 'Decimal Calculators', detail: 'Financial and BCD hardware historically used 9’s and 10’s complement for exact base-10 subtraction.' }
      ],
      summary: [
        '(r − 1)’s complement is found by subtracting each digit from r − 1; r’s complement adds 1 to the LSB.',
        'In 2’s complement subtraction, an end-carry indicates a positive result (discard carry); no end-carry means take the 2’s complement and prefix a minus sign.',
        '2’s complement uniquely represents zero and gives a symmetric-nearly range of −2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1).'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: '1’s Complement', definition: 'Bitwise inversion of a binary number.' },
          { term: '2’s Complement', definition: '1’s complement + 1; standard signed integer encoding in computers.' }
        ],
        corePoints: [
          '10’s complement of decimal N = 9’s complement + 1.',
          '2’s complement shortcut: keep bits from LSB up to first 1, flip all bits to the left.',
          'End-carry in r’s complement → discard carry, answer is positive.'
        ],
        examReminders: [
          'Never forget to pad both operands to the exact same bit-width n before taking the complement.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c2-q1',
          question: 'What is the 8-bit 2’s complement representation of −18₁₀?',
          options: ['11101110', '11101101', '00010010', '10010010'],
          correctIndex: 0,
          explanation: '+18 in 8 bits is 00010010. Flipping bits gives 11101101 (1’s comp); adding 1 gives 11101110.'
        },
        {
          id: 'u1-c2-q2',
          question: 'In 8-bit 2’s complement arithmetic, what is the decimal range of representable signed integers?',
          options: ['−127 to +127', '−128 to +127', '−255 to +255', '0 to 255'],
          correctIndex: 1,
          explanation: 'With n = 8 bits, 2’s complement covers −2⁷ to +(2⁷ − 1), which is −128 to +127.'
        },
        {
          id: 'u1-c2-q3',
          question: 'When subtracting M − N using 2’s complement, if NO end-carry is generated:',
          options: ['The result is positive', 'Overflow always occurred', 'The result is negative in 2’s complement form', 'Add 1 to the LSB'],
          correctIndex: 2,
          explanation: 'Absence of an end-carry indicates M < N, so the negative result is obtained by taking the 2’s complement of the sum with a minus sign.'
        }
      ]
    },
    {
      id: 'u1-c3',
      unitId: 'unit-1',
      chapterNumber: '1.3',
      title: 'Weighted & Non-Weighted Codes and Their Properties',
      syllabusTopic: 'Codes- Weighted and Non-weighted codes and its Properties',
      estimatedMinutes: 25,
      diagramType: 'codes-bcd-gray',
      diagramCaption: 'Comparison of 4-bit BCD (8421), 2421, Excess-3, and unit-distance Gray code transitions.',
      introduction: {
        meaning:
          'Binary codes assign specific bit patterns to represent decimal digits, characters, or sensor positions with specialized arithmetic or error-resilient properties.',
        importance:
          'Pure binary is not always optimal: digital clocks need decimal digit alignment (BCD), arithmetic circuits benefit from self-complementing codes (Excess-3, 2421), and rotary encoders require single-bit transitions (Gray code).',
        whereUsed:
          '7-segment displays, financial calculators, shaft/rotary optical encoders, and K-map variable ordering.',
        problemSolved:
          'Prevents false intermediate glitch states during multi-bit mechanical transitions (Gray code) and simplifies 9’s complement decimal logic (self-complementing codes).'
      },
      fundamentalConcept: {
        overview:
          'Codes are classified into Weighted codes (each bit position has a fixed numerical multiplier wᵢ whose weighted sum equals the decimal digit) and Non-Weighted codes (no fixed positional weights).',
        terms: [
          { term: 'Weighted Code', meaning: 'A code where decimal value D = Σ bᵢ·wᵢ (e.g., 8421 BCD, 2421, 5421).' },
          { term: 'Non-Weighted Code', meaning: 'A code without fixed positional weights (e.g., Excess-3, Gray code).' },
          { term: 'Self-Complementing Code', meaning: 'A code in which the 9’s complement of a decimal digit is obtained simply by taking the 1’s complement (bitwise inversion) of its 4-bit code.' },
          { term: 'Unit-Distance (Cyclic) Code', meaning: 'Adjacent codewords differ in exactly 1 bit position (Hamming distance = 1).' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete 4-Bit Code Mapping Table (Digits 0–9)',
          table: {
            caption: 'Weighted vs Non-Weighted Binary Codes for Decimal Digits',
            headers: ['Decimal', 'BCD (8421)', '2421 (Self-Comp.)', 'Excess-3 (Non-Weighted)', '4-Bit Gray Code'],
            rows: [
              ['0', '0000', '0000', '0011', '0000'],
              ['1', '0001', '0001', '0100', '0001'],
              ['2', '0010', '0010', '0101', '0011'],
              ['3', '0011', '0011', '0110', '0010'],
              ['4', '0100', '0100', '0111', '0110'],
              ['5', '0101', '1011', '1000', '0111'],
              ['6', '0110', '1100', '1001', '0101'],
              ['7', '0111', '1101', '1010', '0100'],
              ['8', '1000', '1110', '1011', '1100'],
              ['9', '1001', '1111', '1100', '1101']
            ]
          }
        },
        {
          heading: '2. Key Code Properties & Conversions',
          bullets: [
            'BCD (8421): Represents each decimal digit separately in 4 bits. Codes 1010–1111 (10–15) are invalid/unused states. In BCD addition, if a 4-bit sum > 9 or generates a carry, add 0110 (6) to correct.',
            'Excess-3 (XS-3): Non-weighted and self-complementing. Obtained by adding 3 (0011) to each BCD digit.',
            'Gray Code: Non-weighted, unit-distance, and reflective. Eliminates ambiguity when mechanical switches or sensors transition between adjacent states (e.g., 0111 → 1000 in binary changes 4 bits at once; in Gray it changes only 1 bit).'
          ]
        },
        {
          heading: '3. Binary ↔ Gray Code Conversion Rules',
          steps: [
            'Binary (Bₙ₋₁...B₀) to Gray (Gₙ₋₁...G₀): Copy MSB directly (Gₙ₋₁ = Bₙ₋₁). For every other bit, Gᵢ = Bᵢ₊₁ ⊕ Bᵢ (XOR adjacent binary bits).',
            'Gray to Binary: Copy MSB directly (Bₙ₋₁ = Gₙ₋₁). For every lower bit, Bᵢ = Bᵢ₊₁ ⊕ Gᵢ (XOR previous binary bit with current Gray bit).'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c3-ex1',
          title: 'Binary to Gray & Gray to Binary Conversion',
          problemStatement: 'Convert binary (10110)₂ into Gray code, then verify by converting the Gray code back to Binary.',
          given: ['Binary input B₄B₃B₂B₁B₀ = 10110'],
          required: 'Equivalent Gray code G₄G₃G₂G₁G₀ and reverse verification',
          formulaLatex: 'G_4 = B_4, \\quad G_i = B_{i+1} \\oplus B_i \\; (i < 4)',
          substitutionLatex: 'G_4 = 1, \\; G_3 = 1\\oplus0, \\; G_2 = 0\\oplus1, \\; G_1 = 1\\oplus1, \\; G_0 = 1\\oplus0',
          calculationSteps: [
            'Binary → Gray: G₄ = 1; G₃ = 1 ⊕ 0 = 1; G₂ = 0 ⊕ 1 = 1; G₁ = 1 ⊕ 1 = 0; G₀ = 1 ⊕ 0 = 1 → (11101)Gray.',
            'Gray → Binary: B₄ = G₄ = 1; B₃ = B₄ ⊕ G₃ = 1 ⊕ 1 = 0; B₂ = B₃ ⊕ G₂ = 0 ⊕ 1 = 1; B₁ = B₂ ⊕ G₁ = 1 ⊕ 0 = 1; B₀ = B₁ ⊕ G₀ = 1 ⊕ 1 = 0.'
          ],
          finalAnswer: 'Gray Code = 11101; Verified Binary = 10110₂',
          interpretation: 'XOR cascades cleanly in both directions using just n − 1 two-input XOR gates.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-3',
          unitId: 'unit-1',
          chapterId: 'u1-c3',
          chapterTitle: 'Weighted & Non-Weighted Codes and Their Properties',
          name: 'Self-Complementing Weight Condition & Binary–Gray XOR',
          latex: '\\sum_{i=1}^{4} w_i = 9 \\quad \\text{(for 4-bit self-complementing weighted code)}, \\qquad G_i = B_{i+1} \\oplus B_i',
          symbols: [
            { symbol: 'w_i', meaning: 'Positional weights of a 4-bit weighted code (e.g., 2+4+2+1 = 9)' },
            { symbol: 'B_i, G_i', meaning: 'i-th binary bit and Gray code bit' }
          ],
          units: 'Dimensionless bit values {0, 1}',
          conditions: 'Sum of weights = 9 is necessary for a positive 4-bit weighted code to be self-complementing.',
          miniExample: 'In 2421 code, 3 is 0011; bitwise NOT is 1100, which equals 6 (9 − 3).'
        }
      ],
      applications: [
        { area: 'Rotary Optical Encoders', detail: 'Gray code tracks angular shaft position so a boundary misalignment can only misread by ±1 step instead of jumping halfway around the wheel.' },
        { area: 'Digital Displays', detail: 'BCD 8421 drives 7-segment display decoders directly per decimal digit.' }
      ],
      summary: [
        'Weighted codes (8421, 2421) assign fixed positional weights; non-weighted codes (Excess-3, Gray) do not.',
        'Excess-3 and 2421 are self-complementing (1’s complement of code gives 9’s complement of digit).',
        'Gray code changes only 1 bit between consecutive numbers, preventing transition glitches.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'BCD (8421)', definition: 'Each decimal digit encoded in 4 binary bits (0000–1001).' },
          { term: 'Self-Complementing', definition: 'Bitwise inversion produces the 9’s complement of the decimal digit (Excess-3, 2421).' },
          { term: 'Gray Code', definition: 'Unit-distance, non-weighted, reflective code.' }
        ],
        corePoints: [
          'BCD invalid states: 1010, 1011, 1100, 1101, 1110, 1111 (6 invalid states).',
          'Excess-3 = BCD + 0011.',
          'Binary → Gray uses XOR of adjacent binary bits.'
        ],
        examReminders: [
          'Do not confuse BCD of 15 (0001 0101, 8 bits) with pure binary of 15 (1111, 4 bits).'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c3-q1',
          question: 'Which pair consists exclusively of self-complementing codes?',
          options: ['8421 and Gray', 'Excess-3 and 2421', '8421 and Excess-3', 'Gray and 5421'],
          correctIndex: 1,
          explanation: 'Both Excess-3 (non-weighted) and 2421 (weighted, 2+4+2+1=9) satisfy the self-complementing property.'
        },
        {
          id: 'u1-c3-q2',
          question: 'What is the Excess-3 code for the decimal number 49?',
          options: ['0111 1100', '0100 1001', '0110 1011', '1000 1101'],
          correctIndex: 0,
          explanation: 'Add 3 to each digit: 4 + 3 = 7 (0111) and 9 + 3 = 12 (1100), yielding 0111 1100.'
        },
        {
          id: 'u1-c3-q3',
          question: 'Why is Gray code preferred in rotary encoders and K-map axes?',
          options: ['It uses fewer bits than binary', 'It is weighted for fast addition', 'Adjacent codewords differ by only 1 bit', 'It detects two-bit errors'],
          correctIndex: 2,
          explanation: 'Unit-distance transitions (1-bit change per step) eliminate intermediate race errors.'
        }
      ]
    },
    {
      id: 'u1-c4',
      unitId: 'unit-1',
      chapterNumber: '1.4',
      title: 'Parity Check Code & Hamming Error-Correcting Code',
      syllabusTopic: 'Parity check code and Hamming code',
      estimatedMinutes: 30,
      diagramType: 'hamming-parity',
      diagramCaption: '7-bit Hamming (7,4) codeword bit positions (P1, P2, D3, P4, D5, D6, D7) and parity-check coverage.',
      introduction: {
        meaning:
          'Error-detecting and error-correcting codes append redundant check bits to data bits so receivers can detect—and in Hamming codes, pinpoint and repair—corrupted bits.',
        importance:
          'Electrical noise, cosmic radiation, and crosstalk can flip bits during RAM storage or serial communication.',
        whereUsed:
          'ECC server memory (DRAM), satellite/space telemetry, UART serial links, and storage controllers.',
        problemSolved:
          'Parity detects single-bit errors cheaply; Hamming code goes further by identifying the exact bit position of any single-bit error and flipping it back automatically.'
      },
      fundamentalConcept: {
        overview:
          'Adding 1 parity bit can tell us *if* an odd number of bits flipped, but not *which* bit flipped. Richard Hamming solved this by placing multiple parity bits at powers-of-two positions (1, 2, 4, 8...) whose binary syndrome directly spells out the corrupted bit position.',
        terms: [
          { term: 'Even Parity', meaning: 'Total count of 1s in the transmitted codeword (data + parity bit) is even.' },
          { term: 'Odd Parity', meaning: 'Total count of 1s in the transmitted codeword is odd.' },
          { term: 'Hamming Distance (d)', meaning: 'Number of bit positions in which two codewords differ. Minimum distance d_min ≥ 3 is required to correct 1-bit errors.' },
          { term: 'Syndrome Word (C)', meaning: 'Binary word formed by re-checking parity bits at the receiver; C = 0 means no error, C ≠ 0 gives the 1-indexed location of the flipped bit.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Parity Check Code (Single-Bit Error Detection)',
          bullets: [
            'For k data bits, 1 parity bit P is appended to form an (k + 1)-bit word.',
            'Even parity bit: P = d₁ ⊕ d₂ ⊕ ... ⊕ dₖ (XOR of all data bits).',
            'Odd parity bit: P = (d₁ ⊕ d₂ ⊕ ... ⊕ dₖ)\'.',
            'Limitation: Parity detects any odd number of bit errors (1, 3, 5...) but fails to detect even numbers of errors (2, 4...) and cannot correct errors.'
          ]
        },
        {
          heading: '2. Constructing a Hamming Code for m Data Bits',
          steps: [
            'Determine required parity bits p using the Hamming inequality: 2ᵖ ≥ m + p + 1. For m = 4 data bits, p = 3 because 2³ = 8 ≥ 4 + 3 + 1 = 8 → (7, 4) Hamming code.',
            'Assign bit positions 1 through n = m + p: positions that are powers of 2 (1, 2, 4, 8...) hold parity bits P₁, P₂, P₄...; remaining positions (3, 5, 6, 7...) hold data bits D₃, D₅, D₆, D₇.',
            'Determine parity coverage (binary representation of position): P₁ (position 1 = 001) checks all positions with LSB = 1 → {1, 3, 5, 7}; P₂ (position 2 = 010) checks positions with bit-2 = 1 → {2, 3, 6, 7}; P₄ (position 4 = 100) checks positions with bit-4 = 1 → {4, 5, 6, 7}.',
            'Set each Pᵢ for even (or odd) parity over its checked set.',
            'At the receiver, compute check bits C₄C₂C₁ using the same parity rule. If C₄C₂C₁ = 000, no error; otherwise its decimal value indicates the exact corrupted bit to invert.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c4-ex1',
          title: 'Encoding & Error Correction with (7,4) Even-Parity Hamming Code',
          problemStatement: 'Encode the 4-bit message 1011 (D₇D₆D₅D₃ = 1011) into a 7-bit even-parity Hamming code. Then demonstrate error correction if bit 5 is corrupted during transmission.',
          given: ['Data bits: D₇=1, D₆=0, D₅=1, D₃=1', 'Even parity convention'],
          required: '7-bit Hamming codeword and syndrome recovery when bit 5 flips',
          formulaLatex: '2^p \\ge m + p + 1 \\implies p = 3, \\; n = 7',
          substitutionLatex: 'P_1 = D_3 \\oplus D_5 \\oplus D_7, \\quad P_2 = D_3 \\oplus D_6 \\oplus D_7, \\quad P_4 = D_5 \\oplus D_6 \\oplus D_7',
          calculationSteps: [
            'P₁ checks {1, 3, 5, 7}: D₃ ⊕ D₅ ⊕ D₇ = 1 ⊕ 1 ⊕ 1 = 1 → P₁ = 1.',
            'P₂ checks {2, 3, 6, 7}: D₃ ⊕ D₆ ⊕ D₇ = 1 ⊕ 0 ⊕ 1 = 0 → P₂ = 0.',
            'P₄ checks {4, 5, 6, 7}: D₅ ⊕ D₆ ⊕ D₇ = 1 ⊕ 0 ⊕ 1 = 0 → P₄ = 0.',
            'Transmitted codeword (bit 7 down to bit 1): D₇ D₆ D₅ P₄ D₃ P₂ P₁ = 1 0 1 0 1 0 1.',
            'Suppose bit 5 flips (1 → 0), so received word is 1 0 0 0 1 0 1.',
            'Receiver computes syndrome: C₁ = P₁⊕D₃⊕D₅⊕D₇ = 1⊕1⊕0⊕1 = 1; C₂ = P₂⊕D₃⊕D₆⊕D₇ = 0⊕1⊕0⊕1 = 0; C₄ = P₄⊕D₅⊕D₆⊕D₇ = 0⊕0⊕0⊕1 = 1.',
            'Syndrome C₄C₂C₁ = (101)₂ = 5₁₀ → flips bit 5 back from 0 to 1, restoring 1010101.'
          ],
          finalAnswer: 'Encoded word: 1010101; Syndrome (101)₂ = 5 corrects bit 5',
          interpretation: 'Notice how positioning parity bits at powers of 2 makes the syndrome directly equal the binary address of the faulty bit.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-4',
          unitId: 'unit-1',
          chapterId: 'u1-c4',
          chapterTitle: 'Parity Check Code & Hamming Error-Correcting Code',
          name: 'Hamming Parity-Bit Inequality & Distance Bounds',
          latex: '2^p \\ge m + p + 1, \\qquad d_{\\min} \\ge 2t + 1 \\text{ (to correct } t \\text{ errors)}',
          symbols: [
            { symbol: 'm', meaning: 'Number of original data bits' },
            { symbol: 'p', meaning: 'Number of redundant parity bits' },
            { symbol: 'd_min', meaning: 'Minimum Hamming distance between valid codewords' }
          ],
          units: 'Number of bits',
          conditions: 'Single-error correction (t = 1) requires d_min ≥ 3.',
          miniExample: 'For m = 8 data bits, 2⁴ = 16 ≥ 8 + 4 + 1 = 13, so p = 4 parity bits are needed (Hamming (12,8)).'
        }
      ],
      applications: [
        { area: 'ECC Server RAM', detail: 'SECDED (Single-Error Correct, Double-Error Detect) Hamming variants protect data center memory from soft bit-flips.' },
        { area: 'Serial Communication', detail: 'UART/RS-232 frames include a hardware parity bit to catch line noise.' }
      ],
      summary: [
        'Parity check adds 1 bit to detect single-bit (odd count) errors, but cannot locate or correct them.',
        'Hamming code places p parity bits at positions 2⁰, 2¹, 2²... satisfying 2ᵖ ≥ m + p + 1.',
        'The receiver’s syndrome C₄C₂C₁ directly identifies the single corrupted bit position.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Parity Bit', definition: 'Extra bit making total 1s even (even parity) or odd (odd parity).' },
          { term: 'Hamming Code', definition: 'Linear single-error-correcting code using overlapping parity bits at powers of 2.' }
        ],
        corePoints: [
          'Hamming (7,4): 4 data bits + 3 parity bits at positions 1, 2, 4.',
          'P₁ checks 1,3,5,7; P₂ checks 2,3,6,7; P₄ checks 4,5,6,7.',
          'Syndrome = 000 → no error; Syndrome ≠ 0 → decimal value is faulty bit index.'
        ],
        examReminders: [
          'Double-check whether the exam problem specifies EVEN parity or ODD parity before calculating P₁, P₂, P₄.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c4-q1',
          question: 'How many Hamming parity bits are required for 7 data bits (m = 7)?',
          options: ['3', '4', '5', '2'],
          correctIndex: 1,
          explanation: 'Check 2ᵖ ≥ 7 + p + 1: for p = 3, 8 ≥ 11 is false; for p = 4, 16 ≥ 12 is true. Thus p = 4.'
        },
        {
          id: 'u1-c4-q2',
          question: 'In a (7,4) even-parity Hamming code, if the syndrome C₄C₂C₁ = 110, which bit position is in error?',
          options: ['Bit 3', 'Bit 5', 'Bit 6', 'No error'],
          correctIndex: 2,
          explanation: 'Binary 110 equals decimal 6, so bit position 6 is corrupted.'
        },
        {
          id: 'u1-c4-q3',
          question: 'A simple 1-bit parity check code can:',
          options: ['Correct 1-bit errors', 'Detect 2-bit errors reliably', 'Detect any odd number of bit errors', 'Correct 2-bit errors'],
          correctIndex: 2,
          explanation: 'A single parity bit flips state only when an odd number of bits (1, 3, 5...) change.'
        }
      ]
    },
    {
      id: 'u1-c5',
      unitId: 'unit-1',
      chapterNumber: '1.5',
      title: 'Boolean Algebra: Basic Theorems & Properties',
      syllabusTopic: 'Boolean algebra: Basic Theorems and Properties',
      estimatedMinutes: 25,
      diagramType: 'boolean-theorems',
      diagramCaption: 'Duality principle and De Morgan’s theorem equivalences transforming AND/OR networks.',
      introduction: {
        meaning:
          'Boolean algebra is the mathematical system of two-valued logic ({0, 1}) governed by axioms and theorems formulated by George Boole and applied to switching circuits by Claude Shannon.',
        importance:
          'Every digital circuit is mathematically a Boolean expression. Mastering Boolean theorems lets engineers transform complex expressions into minimal gate networks.',
        whereUsed:
          'RTL synthesis, combinational logic optimization, compiler condition simplification, and programmable logic.',
        problemSolved:
          'Replaces trial-and-error circuit wiring with exact algebraic rules for reducing gate count, propagation delay, and power.'
      },
      fundamentalConcept: {
        overview:
          "Unlike ordinary real algebra, Boolean variables take only values 0 (FALSE/LOW) or 1 (TRUE/HIGH), and the '+' operator denotes logical OR while '·' denotes logical AND. Notice that A + A = A (idempotence) and A + BC = (A + B)(A + C) (distributivity of OR over AND)—both impossible in ordinary algebra!",
        terms: [
          { term: 'Literal', meaning: 'A single variable in either complemented (A\') or uncomplemented (A) form.' },
          { term: 'Principle of Duality', meaning: 'Every valid Boolean identity remains valid if all AND (·) and OR (+) operators are swapped AND all 0s and 1s are swapped (do NOT complement variables).' },
          { term: 'Complement (NOT)', meaning: 'Unary operation reversing truth value: 0\' = 1 and 1\' = 0.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete Table of Boolean Postulates & Theorems',
          table: {
            caption: 'Fundamental Boolean Laws and Their Duals',
            headers: ['Law Name', 'OR / Primary Form', 'AND / Dual Form'],
            rows: [
              ['Identity Law', 'A + 0 = A', 'A · 1 = A'],
              ['Null (Dominance) Law', 'A + 1 = 1', 'A · 0 = 0'],
              ['Idempotent Law', 'A + A = A', 'A · A = A'],
              ['Complement Law', 'A + A\' = 1', 'A · A\' = 0'],
              ['Involution Law', '(A\')\' = A', '(A\')\' = A'],
              ['Commutative Law', 'A + B = B + A', 'A · B = B · A'],
              ['Associative Law', '(A + B) + C = A + (B + C)', '(A · B) · C = A · (B · C)'],
              ['Distributive Law', 'A(B + C) = AB + AC', 'A + BC = (A + B)(A + C)'],
              ['Absorption Law', 'A + AB = A', 'A(A + B) = A'],
              ['Redundancy / Simplification', 'A + A\'B = A + B', 'A(A\' + B) = AB'],
              ['De Morgan’s Theorem', '(A + B)\' = A\' · B\'', '(A · B)\' = A\' + B\''],
              ['Consensus Theorem', 'AB + A\'C + BC = AB + A\'C', '(A + B)(A\' + C)(B + C) = (A + B)(A\' + C)']
            ]
          }
        },
        {
          heading: '2. Proving Consensus Theorem (AB + A\'C + BC = AB + A\'C)',
          steps: [
            'Start with LHS: AB + A\'C + BC.',
            'Multiply BC by (A + A\') since A + A\' = 1: AB + A\'C + (A + A\')BC.',
            'Distribute: AB + A\'C + ABC + A\'BC.',
            'Group common terms: AB(1 + C) + A\'C(1 + B).',
            'Since 1 + C = 1 and 1 + B = 1, the expression simplifies to AB + A\'C.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c5-ex1',
          title: 'Applying De Morgan’s Theorem & Duality',
          problemStatement: 'Find the complement F\' and the dual F_D of the Boolean function F = A(B\'C\' + BC).',
          given: ['F = A(B\'C\' + BC)'],
          required: 'Complement F\' and Dual F_D',
          formulaLatex: '(X + Y)\' = X\'Y\', \\quad (XY)\' = X\' + Y\'',
          substitutionLatex: 'F\' = [A(B\'C\' + BC)]\'',
          calculationSteps: [
            'To find Complement F\': Apply De Morgan step-by-step → F\' = A\' + (B\'C\' + BC)\'.',
            'Apply De Morgan to inner sum → F\' = A\' + (B\'C\')\' · (BC)\'.',
            'Apply De Morgan to products → F\' = A\' + (B + C)(B\' + C\').',
            'Expand (B + C)(B\' + C\') = BB\' + BC\' + CB\' + CC\' = BC\' + B\'C.',
            'So F\' = A\' + BC\' + B\'C.',
            'To find Dual F_D: Swap (· ↔ +) and (0 ↔ 1) without complementing literals → F_D = A + (B\' + C\')(B + C).'
          ],
          finalAnswer: 'F\' = A\' + BC\' + B\'C; Dual F_D = A + (B\' + C\')(B + C)',
          interpretation: 'Notice the sharp distinction: Complement flips operators AND literals; Dual flips only operators (and 0/1 constants).'
        }
      ],
      formulas: [
        {
          id: 'f-u1-5',
          unitId: 'unit-1',
          chapterId: 'u1-c5',
          chapterTitle: 'Boolean Algebra: Basic Theorems & Properties',
          name: 'De Morgan’s Theorems & Consensus Identity',
          latex: '(A + B)\' = A\'B\', \\quad (AB)\' = A\' + B\', \\quad AB + A\'C + BC = AB + A\'C',
          symbols: [
            { symbol: 'A, B, C', meaning: 'Boolean variables taking values in {0, 1}' },
            { symbol: 'X\'', meaning: 'Logical complement (NOT) of X' }
          ],
          units: 'Boolean logic values {0, 1}',
          conditions: 'Valid for all n-variable switching expressions; generalizes to any number of literals.',
          miniExample: '(X + Y\'Z)\' = X\' · (Y\'Z)\' = X\'(Y + Z\').'
        }
      ],
      applications: [
        { area: 'Bubble Pushing in Schematics', detail: 'De Morgan’s theorem lets engineers convert AND-OR circuits into all-NAND or all-NOR implementations.' },
        { area: 'Static Hazard Removal', detail: 'Adding back the consensus term BC eliminates 1-hazards in asynchronous combinational circuits.' }
      ],
      summary: [
        'Distributive law A + BC = (A + B)(A + C) and Absorption A + AB = A are unique to Boolean algebra.',
        'De Morgan’s laws break the complement bar and change the operator (+ ↔ ·).',
        'Consensus theorem eliminates the redundant term BC in AB + A\'C + BC.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Duality', definition: 'Swap + ↔ · and 0 ↔ 1; keep variables unchanged.' },
          { term: 'De Morgan’s Law', definition: 'Break the bar, change the sign: (A+B)\' = A\'B\' and (AB)\' = A\'+B\'.' }
        ],
        corePoints: [
          'A + A\'B = A + B',
          'A + AB = A',
          'AB + A\'C + BC = AB + A\'C'
        ],
        examReminders: [
          'Do not confuse Complement (take NOT of every variable too) with Dual (never flip variable primes).'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c5-q1',
          question: 'Which expression is the dual of F = A + B\'C?',
          options: ['A\'(B + C\')', 'A(B\' + C)', 'A\' + BC\'', 'A(B + C)'],
          correctIndex: 1,
          explanation: 'Duality swaps + with · while keeping all literals unchanged: A + B\'C becomes A(B\' + C).'
        },
        {
          id: 'u1-c5-q2',
          question: 'Using Boolean algebra, A + A\'B simplifies to:',
          options: ['A', 'B', 'A + B', 'AB'],
          correctIndex: 2,
          explanation: 'By distribution, A + A\'B = (A + A\')(A + B) = 1 · (A + B) = A + B.'
        },
        {
          id: 'u1-c5-q3',
          question: 'According to De Morgan’s Theorem, (X · Y · Z)\' equals:',
          options: ['X\' · Y\' · Z\'', 'X\' + Y\' + Z\'', 'X + Y + Z', '(X + Y + Z)\''],
          correctIndex: 1,
          explanation: 'The complement of a product equals the sum of the complements: X\' + Y\' + Z\'.'
        }
      ]
    },
    {
      id: 'u1-c6',
      unitId: 'unit-1',
      chapterNumber: '1.6',
      title: 'Switching Functions: Canonical & Standard Forms',
      syllabusTopic: 'Switching Functions- Canonical and Standard Form',
      estimatedMinutes: 25,
      diagramType: 'canonical-sop-pos',
      diagramCaption: 'Truth table correspondence between minterms (Σm), maxterms (ΠM), and standard two-level SOP/POS forms.',
      introduction: {
        meaning:
          'Switching functions can be written in standardized algebraic formats—Canonical Forms (using every variable in each term) and Standard Forms (simplified two-level SOP or POS).',
        importance:
          'Canonical notation (Σm and ΠM) gives every truth table a unique, compact numerical specification so K-maps, PLAs, and CAD tools can parse any logic function unambiguously.',
        whereUsed:
          'Truth-table-to-circuit conversion, Programmable Logic Arrays (PLAs), and K-map entry.',
        problemSolved:
          'Bridges the gap between a behavioral truth table and an algebraic gate equation.'
      },
      fundamentalConcept: {
        overview:
          'Any n-variable truth table has 2ⁿ rows. Each row corresponds to one Minterm (a product term that is 1 only on that row) and one Maxterm (a sum term that is 0 only on that row).',
        terms: [
          { term: 'Minterm (mᵢ)', meaning: 'An AND product term containing all n variables (unprimed if bit=1, primed if bit=0). E.g., for 3 variables, row 5 (101) is m₅ = AB\'C.' },
          { term: 'Maxterm (Mᵢ)', meaning: 'An OR sum term containing all n variables (unprimed if bit=0, primed if bit=1). E.g., row 5 (101) is M₅ = A\' + B + C\'.' },
          { term: 'Canonical SOP / POS', meaning: 'Sum of Minterms (Σm) or Product of Maxterms (ΠM), where every term has all n variables.' },
          { term: 'Standard SOP / POS', meaning: 'Sum of Products or Product of Sums where terms may have fewer than n variables (e.g., F = AB + C\').' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. 3-Variable Minterm and Maxterm Reference Table',
          table: {
            caption: 'Minterms and Maxterms for Variables A, B, C',
            headers: ['Row (Decimal)', 'A B C', 'Minterm (mᵢ)', 'Maxterm (Mᵢ)'],
            rows: [
              ['0', '0 0 0', 'A\'B\'C\' (m₀)', 'A + B + C (M₀)'],
              ['1', '0 0 1', 'A\'B\'C (m₁)', 'A + B + C\' (M₁)'],
              ['2', '0 1 0', 'A\'BC\' (m₂)', 'A + B\' + C (M₂)'],
              ['3', '0 1 1', 'A\'BC (m₃)', 'A + B\' + C\' (M₃)'],
              ['4', '1 0 0', 'AB\'C\' (m₄)', 'A\' + B + C (M₄)'],
              ['5', '1 0 1', 'AB\'C (m₅)', 'A\' + B + C\' (M₅)'],
              ['6', '1 1 0', 'ABC\' (m₆)', 'A\' + B\' + C (M₆)'],
              ['7', '1 1 1', 'ABC (m₇)', 'A\' + B\' + C\' (M₇)']
            ]
          }
        },
        {
          heading: '2. Converting Between Forms',
          steps: [
            'Truth Table → Canonical SOP: Sum all minterms mᵢ where output F = 1.',
            'Truth Table → Canonical POS: Multiply all maxterms Mᵢ where output F = 0.',
            'Canonical SOP ↔ Canonical POS: Complementary indices! If F(A,B,C) = Σm(1, 3, 5, 7), then F = ΠM(0, 2, 4, 6).',
            'Standard SOP → Canonical SOP: Multiply any incomplete product term by (X + X\') for each missing variable X, then expand and drop duplicate terms.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c6-ex1',
          title: 'Expanding Standard SOP to Canonical SOP & Canonical POS',
          problemStatement: 'Express F(A, B, C) = A + B\'C in Canonical SOP (Σm) and Canonical POS (ΠM) forms.',
          given: ['F(A, B, C) = A + B\'C', 'n = 3 variables (indices 0 to 7)'],
          required: 'Canonical SOP and Canonical POS of F',
          formulaLatex: 'X + X\' = 1, \\quad \\Sigma m(S) = \\Pi M(\\{0..2^n-1\\} \\setminus S)',
          substitutionLatex: 'A = A(B + B\')(C + C\'), \\quad B\'C = (A + A\')B\'C',
          calculationSteps: [
            'Expand A: A(B + B\')(C + C\') = ABC + ABC\' + AB\'C + AB\'C\' = m₇ + m₆ + m₅ + m₄.',
            'Expand B\'C: (A + A\')B\'C = AB\'C + A\'B\'C = m₅ + m₁.',
            'Combine unique minterms: F = m₁ + m₄ + m₅ + m₆ + m₇ = Σm(1, 4, 5, 6, 7).',
            'Missing indices out of {0..7} are {0, 2, 3}, giving Canonical POS: F = ΠM(0, 2, 3) = (A + B + C)(A + B\' + C)(A + B\' + C\').'
          ],
          finalAnswer: 'Canonical SOP: Σm(1, 4, 5, 6, 7); Canonical POS: ΠM(0, 2, 3)',
          interpretation: 'Notice mᵢ\' = Mᵢ, which is why the 0-rows of the truth table directly form the ΠM index list.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-6',
          unitId: 'unit-1',
          chapterId: 'u1-c6',
          chapterTitle: 'Switching Functions: Canonical & Standard Forms',
          name: 'Minterm–Maxterm Complement & SOP–POS Equivalence',
          latex: '(m_i)\' = M_i, \\qquad F = \\sum_{i \\in S_1} m_i = \\prod_{j \\notin S_1} M_j',
          symbols: [
            { symbol: 'm_i, M_i', meaning: 'i-th minterm and maxterm' },
            { symbol: 'S_1', meaning: 'Set of row indices where F = 1' }
          ],
          units: 'Boolean logic',
          conditions: 'Applies to any completely specified n-variable Boolean function.',
          miniExample: 'For 2 variables: Σm(1, 2) = ΠM(0, 3).'
        }
      ],
      applications: [
        { area: 'Decoder + OR Realization', detail: 'Canonical SOP maps directly to an n-to-2ⁿ decoder feeding an OR gate.' },
        { area: 'PLA & PAL Hardware', detail: 'Standard SOP expressions map directly onto programmable AND-plane + OR-plane arrays.' }
      ],
      summary: [
        'Minterms (1 where bit=1) form Canonical SOP (Σm); Maxterms (0 where bit=1) form Canonical POS (ΠM).',
        'Canonical forms contain every variable in every term; Standard forms allow reduced terms.',
        'The complement of a Σm list gives the ΠM list using remaining indices.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Minterm', definition: 'Product term containing all variables; 1 → unprimed, 0 → primed.' },
          { term: 'Maxterm', definition: 'Sum term containing all variables; 0 → unprimed, 1 → primed.' }
        ],
        corePoints: [
          'SOP uses 1-rows (Σm); POS uses 0-rows (ΠM).',
          'Standard form = two-level AND-OR or OR-AND without forcing all variables in every term.',
          '(mᵢ)\' = Mᵢ always.'
        ],
        examReminders: [
          'Remember the Maxterm rule is opposite to Minterm: 0 is unprimed (A), 1 is primed (A\').'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c6-q1',
          question: 'For a 3-variable function F(A, B, C), which maxterm corresponds to index M₆ (binary 110)?',
          options: ['A + B + C\'', 'A\' + B\' + C', 'A\'B\'C', 'ABC\''],
          correctIndex: 1,
          explanation: 'In maxterms, 1 is primed and 0 is unprimed. Binary 110 → A\' + B\' + C.'
        },
        {
          id: 'u1-c6-q2',
          question: 'If F(A, B, C) = Σm(0, 2, 5, 7), what is F in Canonical POS?',
          options: ['ΠM(0, 2, 5, 7)', 'ΠM(1, 3, 4, 6)', 'Σm(1, 3, 4, 6)', 'ΠM(1, 2, 4, 6)'],
          correctIndex: 1,
          explanation: 'The maxterm indices are the complement of {0, 2, 5, 7} in {0..7}, which is {1, 3, 4, 6}.'
        },
        {
          id: 'u1-c6-q3',
          question: 'Which expression is in Standard SOP (not Canonical SOP) for F(A, B, C)?',
          options: ['A\'BC + AB\'C', 'AB + C\'', '(A + B)(B\' + C)', 'A(B + C)'],
          correctIndex: 1,
          explanation: 'AB + C\' is a sum of products where terms have fewer than 3 variables, making it Standard SOP.'
        }
      ]
    },
    {
      id: 'u1-c7',
      unitId: 'unit-1',
      chapterNumber: '1.7',
      title: 'Algebraic Simplification of Switching Functions',
      syllabusTopic: 'Algebraic Simplification',
      estimatedMinutes: 25,
      diagramType: 'algebraic-simplification',
      diagramCaption: 'Gate-count reduction from an unsimplified Boolean network to its algebraically minimized equivalent.',
      introduction: {
        meaning:
          'Algebraic simplification systematically applies Boolean laws and theorems to minimize the number of literals and terms in a switching expression.',
        importance:
          'Fewer literals and product terms directly translate to fewer logic gates, smaller silicon area, lower power dissipation, and faster propagation speed.',
        whereUsed:
          'Pre-K-map expression reduction, multi-level logic refactoring, and HDL synthesis.',
        problemSolved:
          'Removes redundant literals, duplicate paths, and unnecessary inversions without changing the circuit’s truth table.'
      },
      fundamentalConcept: {
        overview:
          'The core strategy is to factor common sub-expressions to expose patterns like (X + X\') = 1, Absorption (X + XY = X), Redundancy (X + X\'Y = X + Y), and Consensus (XY + X\'Z + YZ = XY + X\'Z).',
        terms: [
          { term: 'Literal Count', meaning: 'Total appearances of variables (primed or unprimed) in an expression; primary measure of gate-input cost.' },
          { term: 'Minimal Form', meaning: 'An expression with the fewest terms and fewest total literals implementing a given truth table.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Five-Step Algebraic Minimization Playbook',
          steps: [
            'Expand parentheses if needed to expose common minterm/product factors, or factor directly when common literals are visible.',
            'Apply De Morgan’s laws to push all complements inward onto single literals.',
            'Look for pairs differing by one variable: XY + XY\' = X(Y + Y\') = X.',
            'Apply Absorption (X + XY = X) and Redundancy (X + X\'Y = X + Y).',
            'Check for Consensus terms (XY + X\'Z + YZ) and remove the redundant YZ term.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c7-ex1',
          title: 'Multi-Step Algebraic Simplification',
          problemStatement: 'Simplify F = A\'B\'C\' + A\'BC\' + AB\'C\' + AB\'C + ABC\' to minimal SOP form.',
          given: ['F = A\'B\'C\' + A\'BC\' + AB\'C\' + AB\'C + ABC\' (15 literals, 5 terms)'],
          required: 'Minimal algebraic SOP expression',
          formulaLatex: 'X(Y + Y\') = X, \\quad X + X\'Y = X + Y',
          substitutionLatex: 'F = A\'C\'(B\' + B) + AB\'(C\' + C) + ABC\'',
          calculationSteps: [
            'Group first two terms: A\'B\'C\' + A\'BC\' = A\'C\'(B\' + B) = A\'C\'.',
            'Group third and fourth terms: AB\'C\' + AB\'C = AB\'(C\' + C) = AB\'.',
            'Now F = A\'C\' + AB\' + ABC\'.',
            'Factor A from the last two terms: F = A\'C\' + A(B\' + BC\').',
            'Apply redundancy (B\' + BC\' = B\' + C\'): F = A\'C\' + A(B\' + C\') = A\'C\' + AB\' + AC\'.',
            'Combine A\'C\' + AC\' = C\'(A\' + A) = C\'.',
            'Final expression: F = C\' + AB\'.'
          ],
          finalAnswer: 'F = C\' + AB\' (reduced from 15 literals to 3 literals)',
          interpretation: 'Five 3-input AND gates + one 5-input OR gate collapsed into a single 2-input AND gate + 1 NOT + 1 OR gate.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-7',
          unitId: 'unit-1',
          chapterId: 'u1-c7',
          chapterTitle: 'Algebraic Simplification of Switching Functions',
          name: 'Uniting (Combining) & Redundancy Rules',
          latex: 'XY + XY\' = X, \\qquad X + X\'Y = X + Y, \\qquad (X+Y)(X+Y\') = X',
          symbols: [
            { symbol: 'X, Y', meaning: 'Single literals or arbitrary sub-expressions' }
          ],
          units: 'Boolean logic',
          conditions: 'Applicable whenever two terms match except for one complemented literal.',
          miniExample: 'AB\'C + ABC = AC(B\' + B) = AC.'
        }
      ],
      applications: [
        { area: 'Low-Power VLSI', detail: 'Reducing literal count lowers transistor switching capacitance and static leakage.' },
        { area: 'Combinational Control Logic', detail: 'Simplifies instruction-decode equations in microcontrollers.' }
      ],
      summary: [
        'Algebraic simplification reduces gate count and literal count while preserving truth-table behavior.',
        'Key workhorses: Uniting (XY + XY\' = X), Absorption (X + XY = X), Redundancy (X + X\'Y = X + Y), and Consensus.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'Literal', definition: 'Each occurrence of a variable (e.g., A or A\') in a Boolean expression.' }
        ],
        corePoints: [
          'Always push outer inversion bars inward using De Morgan first.',
          'Factor common terms to reveal (X + X\') = 1.',
          'Check if a term can be duplicated (X + X = X) to combine with two different neighbors.'
        ],
        examReminders: [
          'State the exact Boolean law beside each step in 5-mark and 10-mark derivations to earn full step marks.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c7-q1',
          question: 'Simplify F = AB + A(B + C) + B(B + C):',
          options: ['B + AC', 'A + BC', 'AB + C', 'A + B + C'],
          correctIndex: 0,
          explanation: 'AB + AB + AC + B + BC = AB + AC + B(1 + C) = AB + B + AC = B(A + 1) + AC = B + AC.'
        },
        {
          id: 'u1-c7-q2',
          question: 'What is the literal count of F = A\'B + BC\' + A\'C?',
          options: ['3', '5', '6', '9'],
          correctIndex: 2,
          explanation: 'Each term has 2 literals (A\', B; B, C\'; A\', C), giving 2 + 2 + 2 = 6 literals.'
        },
        {
          id: 'u1-c7-q3',
          question: 'Using the uniting theorem, (A + B)(A + B\') simplifies to:',
          options: ['B', 'A', 'A + B', 'AB'],
          correctIndex: 1,
          explanation: '(A + B)(A + B\') = A + BB\' = A + 0 = A.'
        }
      ]
    },
    {
      id: 'u1-c8',
      unitId: 'unit-1',
      chapterNumber: '1.8',
      title: 'Fundamentals of Digital Logic Gates & Universal Gates',
      syllabusTopic: 'Fundamentals of Digital Logic Gates',
      estimatedMinutes: 30,
      diagramType: 'logic-gates-symbols',
      diagramCaption: 'IEEE/ANSI symbols, Boolean equations, and truth tables for Basic, Derived, and Universal logic gates.',
      introduction: {
        meaning:
          'Digital logic gates are physical electronic circuits (built from CMOS/TTL transistors) that implement elementary Boolean operations on binary voltage levels.',
        importance:
          'Logic gates are the atomic building blocks of every processor, memory cell, ALU, multiplexer, and flip-flop.',
        whereUsed:
          'All digital ICs (74xx series, FPGAs, ASICs, microprocessors).',
        problemSolved:
          'Translates abstract Boolean algebra into physical voltage switching circuits, and Universal Gates (NAND/NOR) let manufacturers fabricate entire chips from a single gate type.'
      },
      fundamentalConcept: {
        overview:
          'Gates fall into three classes: Basic Gates (AND, OR, NOT), Universal Gates (NAND, NOR), and Special/Arithmetic Gates (XOR, XNOR). A gate is called Universal if any Boolean function (AND, OR, NOT) can be constructed using only copies of that gate.',
        terms: [
          { term: 'Universal Gate', meaning: 'A single gate type (NAND or NOR) capable of implementing NOT, AND, and OR—and hence any digital circuit.' },
          { term: 'XOR (Exclusive-OR)', meaning: 'Outputs 1 when inputs are unequal (odd number of 1s): A ⊕ B = A\'B + AB\'.' },
          { term: 'XNOR (Equivalence)', meaning: 'Outputs 1 when inputs are equal: A ⊙ B = AB + A\'B\'.' },
          { term: 'Fan-in & Fan-out', meaning: 'Fan-in is the number of inputs a gate accepts; Fan-out is the maximum number of downstream gate inputs its output can reliably drive.' }
        ]
      },
      detailedExplanation: [
        {
          heading: '1. Complete Logic Gate Truth Table (2-Input)',
          table: {
            caption: 'Outputs of All Standard 2-Input Gates for Inputs (A, B)',
            headers: ['A', 'B', 'AND (AB)', 'OR (A+B)', 'NAND ((AB)\')', 'NOR ((A+B)\')', 'XOR (A⊕B)', 'XNOR (A⊙B)'],
            rows: [
              ['0', '0', '0', '0', '1', '1', '0', '1'],
              ['0', '1', '0', '1', '1', '0', '1', '0'],
              ['1', '0', '0', '1', '1', '0', '1', '0'],
              ['1', '1', '1', '1', '0', '0', '0', '1']
            ]
          }
        },
        {
          heading: '2. Realizing Basic Gates Using Only NAND or Only NOR',
          bullets: [
            'NAND as NOT: Tie both inputs together → (A · A)\' = A\'.',
            'NAND as AND: Follow a NAND gate with a NAND-inverter → ((AB)\')\' = AB.',
            'NAND as OR: Invert inputs first with NAND-inverters, then feed into a NAND gate → (A\' · B\')\' = A + B.',
            'NOR as NOT: Tie both inputs together → (A + A)\' = A\'.',
            'NOR as OR: Follow a NOR gate with a NOR-inverter → ((A + B)\')\' = A + B.',
            'NOR as AND: Invert inputs first with NOR-inverters, then feed into a NOR gate → (A\' + B\')\' = AB.'
          ]
        }
      ],
      workedExamples: [
        {
          id: 'u1-c8-ex1',
          title: 'Two-Level SOP Implementation Using Only NAND Gates',
          problemStatement: 'Implement F = AB + CD using only 2-input NAND gates and determine the total number of NAND gates required.',
          given: ['Two-level SOP function F = AB + CD'],
          required: 'All-NAND realization and gate count',
          formulaLatex: 'F = AB + CD = ((AB + CD)\')\' = ((AB)\' \\cdot (CD)\')\'',
          substitutionLatex: 'G_1 = (AB)\', \\quad G_2 = (CD)\', \\quad F = (G_1 \\cdot G_2)\'',
          calculationSteps: [
            'First level: Replace the two AND gates (AB and CD) with two NAND gates producing (AB)\' and (CD)\'.',
            'Second level: Replace the final OR gate with a NAND gate taking (AB)\' and (CD)\'.',
            'By De Morgan: ((AB)\' · (CD)\')\' = ((AB)\')\' + ((CD)\')\' = AB + CD.'
          ],
          finalAnswer: 'Requires 3 two-input NAND gates (two in Level 1, one in Level 2)',
          interpretation: 'Every two-level AND–OR (SOP) circuit converts 1-to-1 into a two-level NAND–NAND circuit without adding inverters for multi-literal terms.'
        }
      ],
      formulas: [
        {
          id: 'f-u1-8',
          unitId: 'unit-1',
          chapterId: 'u1-c8',
          chapterTitle: 'Fundamentals of Digital Logic Gates & Universal Gates',
          name: 'XOR / XNOR & SOP-to-NAND Equivalence',
          latex: 'A \\oplus B = A\'B + AB\', \\qquad A \\odot B = AB + A\'B\', \\qquad AB + CD = \\overline{\\overline{AB} \\cdot \\overline{CD}}',
          symbols: [
            { symbol: '\\oplus', meaning: 'Exclusive-OR (mod-2 addition)' },
            { symbol: '\\odot', meaning: 'Exclusive-NOR (equality / coincidence)' }
          ],
          units: 'Boolean logic',
          conditions: 'For n-input XOR, output is 1 iff an odd number of inputs are 1.',
          miniExample: 'XOR using minimum NAND gates requires 4 two-input NAND gates.'
        }
      ],
      applications: [
        { area: 'CMOS IC Fabrication', detail: 'In CMOS technology, NAND and NOR gates use fewer transistors (4 transistors) than AND or OR (6 transistors), making NAND-NAND and NOR-NOR standard cell designs.' },
        { area: 'Parity & Comparator Circuits', detail: 'XOR gates form the core of parity generators, binary adders, and digital comparators.' }
      ],
      summary: [
        'Basic gates: AND, OR, NOT; Universal gates: NAND, NOR; Arithmetic gates: XOR, XNOR.',
        'Any two-level SOP circuit converts directly to a two-level NAND–NAND network; any two-level POS converts to NOR–NOR.',
        'Minimum 2-input NAND count for XOR is 4 gates.'
      ],
      quickRevision: {
        keyDefinitions: [
          { term: 'NAND / NOR', definition: 'Universal gates that can build every Boolean function.' },
          { term: 'XOR', definition: 'Outputs 1 when inputs differ; used in adders and parity checkers.' }
        ],
        corePoints: [
          'SOP (AND–OR) → NAND–NAND.',
          'POS (OR–AND) → NOR–NOR.',
          'XOR with minimum NANDs = 4 gates; XNOR with minimum NORs = 4 gates.'
        ],
        examReminders: [
          'Watch out for single-literal terms in SOP (e.g., F = A + BC): in NAND–NAND, single literal A needs a NAND-inverter (A\') feeding the final NAND.'
        ]
      },
      checkUnderstanding: [
        {
          id: 'u1-c8-q1',
          question: 'How many 2-input NAND gates are minimally required to implement an XOR gate (A ⊕ B)?',
          options: ['2', '3', '4', '5'],
          correctIndex: 2,
          explanation: 'The classic symmetric NAND realization uses exactly 4 two-input NAND gates: G1=(AB)\', G2=(A·G1)\', G3=(B·G1)\', F=(G2·G3)\'.'
        },
        {
          id: 'u1-c8-q2',
          question: 'Which two gates are known as Universal Gates?',
          options: ['AND and OR', 'XOR and XNOR', 'NAND and NOR', 'NOT and AND'],
          correctIndex: 2,
          explanation: 'Both NAND and NOR are functionally complete (universal) on their own.'
        },
        {
          id: 'u1-c8-q3',
          question: 'A 2-input gate outputs 1 if and only if both inputs are identical (00 or 11). Which gate is this?',
          options: ['XOR', 'XNOR', 'NAND', 'NOR'],
          correctIndex: 1,
          explanation: 'XNOR (Equivalence gate) outputs 1 when A = B (00 or 11).'
        }
      ]
    }
  ]
};

export const UNIT_1_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-u1-1',
    unitId: 'unit-1',
    chapterId: 'u1-c2',
    topicName: 'Complements of Numbers',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Distinguish between 1’s complement and 2’s complement representation of signed binary numbers.',
    answerSections: [
      {
        heading: 'Key Differences',
        bullets: [
          'Formation: 1’s complement is obtained by inverting every bit (0↔1); 2’s complement is obtained by adding 1 to the LSB of the 1’s complement.',
          'Representation of Zero: 1’s complement has two representations for zero (+0 = 0000... and −0 = 1111...); 2’s complement has a single unique zero (0000...).',
          'Range for n bits: 1’s complement covers −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1), whereas 2’s complement covers −2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1).',
          'Subtraction: 1’s complement requires end-around carry addition; 2’s complement simply discards the end-carry.'
        ]
      }
    ]
  },
  {
    id: 'eq-u1-2',
    unitId: 'unit-1',
    chapterId: 'u1-c3',
    topicName: 'Weighted & Non-Weighted Codes',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'What is a self-complementing code? Give two examples.',
    answerSections: [
      {
        heading: 'Definition & Examples',
        paragraphs: [
          'A binary code is said to be self-complementing if the 9’s complement of any decimal digit can be obtained directly by taking the 1’s complement (bitwise inversion) of its 4-bit codeword.'
        ],
        bullets: [
          'Example 1 (Weighted): 2421 code (sum of weights 2 + 4 + 2 + 1 = 9).',
          'Example 2 (Non-Weighted): Excess-3 (XS-3) code (e.g., 2 is 0101; bitwise inverse 1010 is 7, which is 9 − 2).'
        ]
      }
    ]
  },
  {
    id: 'eq-u1-3',
    unitId: 'unit-1',
    chapterId: 'u1-c6',
    topicName: 'Canonical & Standard Forms',
    marks: '2-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Differentiate between Canonical SOP form and Standard SOP form with an example.',
    answerSections: [
      {
        bullets: [
          'Canonical SOP: Every product term (minterm) must contain all input variables in primed or unprimed form. Example for F(A,B,C): F = A\'BC + AB\'C + ABC.',
          'Standard SOP: Product terms may contain one, two, or more variables (not necessarily all variables). Example for F(A,B,C): F = AB + C\'.'
        ]
      }
    ]
  },
  {
    id: 'eq-u1-4',
    unitId: 'unit-1',
    chapterId: 'u1-c4',
    topicName: 'Hamming Code',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'A 7-bit even-parity Hamming code received is 1011011 (from MSB bit 7 to LSB bit 1). Detect if an error occurred and find the corrected 4-bit data.',
    answerSections: [
      {
        heading: '1. Bit Assignment (Bit 7 down to Bit 1)',
        paragraphs: ['Position mapping: D₇=1, D₆=0, D₅=1, P₄=1, D₃=0, P₂=1, P₁=1.']
      },
      {
        heading: '2. Syndrome Calculation (Even Parity)',
        latex: [
          'C_1 = P_1 \\oplus D_3 \\oplus D_5 \\oplus D_7 = 1 \\oplus 0 \\oplus 1 \\oplus 1 = 1',
          'C_2 = P_2 \\oplus D_3 \\oplus D_6 \\oplus D_7 = 1 \\oplus 0 \\oplus 0 \\oplus 1 = 0',
          'C_4 = P_4 \\oplus D_5 \\oplus D_6 \\oplus D_7 = 1 \\oplus 1 \\oplus 0 \\oplus 1 = 1'
        ]
      },
      {
        heading: '3. Error Location & Correction',
        paragraphs: [
          'Syndrome C₄C₂C₁ = (101)₂ = 5₁₀. Therefore, bit 5 (D₅) is corrupted.',
          'Inverting bit 5 from 1 to 0 gives the corrected codeword 1001011.',
          'Extracted 4-bit original data (D₇D₆D₅D₃) = 1000.'
        ]
      }
    ]
  },
  {
    id: 'eq-u1-5',
    unitId: 'unit-1',
    chapterId: 'u1-c8',
    topicName: 'Digital Logic Gates',
    marks: '5-mark',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'Prove why NAND and NOR are called Universal Gates by showing how NOT, AND, and OR are realized using each.',
    answerSections: [
      {
        heading: '1. Realization Using Only NAND Gates',
        bullets: [
          'NOT Gate: Tie inputs together → Y = (A · A)\' = A\'.',
          'AND Gate: Invert NAND output using a second NAND → Y = ((AB)\')\' = AB.',
          'OR Gate: Invert A and B using two NAND-inverters and feed to a third NAND → Y = (A\' · B\')\' = A + B.'
        ]
      },
      {
        heading: '2. Realization Using Only NOR Gates',
        bullets: [
          'NOT Gate: Tie inputs together → Y = (A + A)\' = A\'.',
          'OR Gate: Invert NOR output using a second NOR → Y = ((A + B)\')\' = A + B.',
          'AND Gate: Invert A and B using two NOR-inverters and feed to a third NOR → Y = (A\' + B\')\' = AB.'
        ]
      }
    ]
  },
  {
    id: 'eq-u1-6',
    unitId: 'unit-1',
    chapterId: 'u1-c5',
    topicName: 'Boolean Algebra & Algebraic Simplification',
    marks: 'long-answer',
    sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)',
    question: 'State and prove De Morgan’s Theorems and Consensus Theorem. Using Boolean algebra, simplify: (a) F₁ = (A + B)(A\' + C)(B + C), and (b) F₂ = A\'B\'C\' + A\'BC\' + AB\'C\' + AB\'C + ABC\'.',
    answerSections: [
      {
        heading: '1. De Morgan’s Theorems (Statement & Truth-Table Proof)',
        latex: ['(A + B)\' = A\' \\cdot B\', \\qquad (A \\cdot B)\' = A\' + B\''],
        paragraphs: [
          'For all 4 combinations (00, 01, 10, 11), (A+B)\' produces (1, 0, 0, 0) which matches A\'B\', and (AB)\' produces (1, 1, 1, 0) which matches A\' + B\'.'
        ]
      },
      {
        heading: '2. Consensus Theorem (SOP & POS)',
        latex: ['AB + A\'C + BC = AB + A\'C + (A+A\')BC = AB(1+C) + A\'C(1+B) = AB + A\'C'],
        paragraphs: ['By duality, (A + B)(A\' + C)(B + C) = (A + B)(A\' + C).']
      },
      {
        heading: '3. Simplification of F₁ and F₂',
        bullets: [
          '(a) F₁ = (A + B)(A\' + C)(B + C): By the dual Consensus Theorem, (B + C) is the consensus factor, so F₁ = (A + B)(A\' + C) = AC + A\'B.',
          '(b) F₂ = A\'C\'(B\' + B) + AB\'(C\' + C) + ABC\' = A\'C\' + AB\' + ABC\' = A\'C\' + A(B\' + BC\') = A\'C\' + AB\' + AC\' = C\'(A\' + A) + AB\' = C\' + AB\'.'
        ]
      }
    ]
  }
];

export const UNIT_1_QUIZZES: QuizQuestion[] = [
  {
    id: 'qz-u1-1',
    unitId: 'unit-1',
    chapterId: 'u1-c1',
    format: 'mcq',
    prompt: 'What is the octal equivalent of the hexadecimal number (3F)₁₆?',
    options: ['77₈', '63₈', '75₈', '177₈'],
    correctAnswer: '77₈',
    explanation: '3F₁₆ = 0011 1111₂. Grouping in 3s from right: 111 111₂ = 77₈.'
  },
  {
    id: 'qz-u1-2',
    unitId: 'unit-1',
    chapterId: 'u1-c2',
    format: 'numerical',
    prompt: 'What is the decimal value of the 8-bit 2’s complement number 11111010?',
    correctAnswer: '-6',
    tolerance: 0,
    explanation: 'MSB is 1 (negative). 2’s complement of 11111010 is 00000101 + 1 = 00000110₂ = 6, so the value is −6.'
  },
  {
    id: 'qz-u1-3',
    unitId: 'unit-1',
    chapterId: 'u1-c3',
    format: 'true-false',
    prompt: 'True or False: Gray code is a weighted binary code used primarily for fast arithmetic addition.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Gray code is a non-weighted, unit-distance code used in encoders and K-maps, not arithmetic.'
  },
  {
    id: 'qz-u1-4',
    unitId: 'unit-1',
    chapterId: 'u1-c4',
    format: 'fill-blank',
    prompt: 'In Hamming code, parity bits are always placed at bit positions that are powers of ____.',
    correctAnswer: '2',
    explanation: 'Parity bits occupy positions 1, 2, 4, 8, 16... (2⁰, 2¹, 2², 2³...).'
  },
  {
    id: 'qz-u1-5',
    unitId: 'unit-1',
    chapterId: 'u1-c5',
    format: 'mcq',
    prompt: 'According to the Consensus Theorem, AB + A\'C + BC simplifies to:',
    options: ['AB + BC', 'A\'C + BC', 'AB + A\'C', 'A + B + C'],
    correctAnswer: 'AB + A\'C',
    explanation: 'BC is the consensus term of AB and A\'C and is algebraically redundant.'
  },
  {
    id: 'qz-u1-6',
    unitId: 'unit-1',
    chapterId: 'u1-c8',
    format: 'mcq',
    prompt: 'Which gate outputs 1 only when its two inputs are different?',
    options: ['XNOR', 'NAND', 'XOR', 'NOR'],
    correctAnswer: 'XOR',
    explanation: 'XOR (A ⊕ B) produces 1 for inputs (0,1) and (1,0), and 0 when A = B.'
  }
];
