export type UnitId = 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';

export interface TermDefinition {
  term: string;
  meaning: string;
}

export interface ComparisonTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface DetailedSubSection {
  heading: string;
  steps?: string[];
  bullets?: string[];
  paragraphs?: string[];
  table?: ComparisonTable;
}

export interface WorkedExample {
  id: string;
  title: string;
  problemStatement: string;
  given: string[];
  required: string;
  formulaLatex: string;
  substitutionLatex: string;
  calculationSteps: string[];
  finalAnswer: string;
  interpretation: string;
}

export interface FormulaItem {
  id: string;
  unitId: UnitId;
  chapterId: string;
  chapterTitle: string;
  name: string;
  latex: string;
  symbols: { symbol: string; meaning: string }[];
  units: string;
  conditions: string;
  miniExample: string;
}

export interface CheckQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuickRevisionNote {
  keyDefinitions: { term: string; definition: string }[];
  corePoints: string[];
  keyDifferences?: ComparisonTable;
  examReminders: string[];
}

export type DiagramType =
  | 'number-systems-radix'
  | 'complements-arithmetic'
  | 'codes-bcd-gray'
  | 'hamming-parity'
  | 'boolean-theorems'
  | 'canonical-sop-pos'
  | 'algebraic-simplification'
  | 'logic-gates-symbols'
  | 'kmap-4var'
  | 'quine-mccluskey'
  | 'half-full-adder'
  | 'subtractor-adder'
  | 'magnitude-comparator'
  | 'multiplexer-4to1'
  | 'demultiplexer-1to4'
  | 'encoder-decoder'
  | 'comb-vs-seq'
  | 'sr-latch-nor-nand'
  | 'sr-d-flipflop'
  | 'jk-master-slave-t'
  | 'excitation-tables'
  | 'flipflop-conversion'
  | 'computer-block-diagram'
  | 'bus-structures'
  | 'stored-program-registers'
  | 'instruction-formats'
  | 'io-interrupts'
  | 'dma-controller'
  | 'async-strobe-handshake'
  | 'memory-hierarchy'
  | 'semiconductor-ram'
  | 'rom-architecture'
  | 'primary-auxiliary'
  | 'associative-cam'
  | 'cache-mapping'
  | 'virtual-memory-paging';

export interface Chapter {
  id: string;
  unitId: UnitId;
  chapterNumber: string;
  title: string;
  syllabusTopic: string;
  estimatedMinutes: number;
  diagramType: DiagramType;
  diagramCaption: string;
  introduction: {
    meaning: string;
    importance: string;
    whereUsed: string;
    problemSolved: string;
  };
  fundamentalConcept: {
    overview: string;
    terms: TermDefinition[];
  };
  detailedExplanation: DetailedSubSection[];
  workedExamples: WorkedExample[];
  formulas: FormulaItem[];
  applications: { area: string; detail: string }[];
  summary: string[];
  quickRevision: QuickRevisionNote;
  checkUnderstanding: CheckQuestion[];
}

export interface Unit {
  id: UnitId;
  number: string;
  title: string;
  syllabusExactText: string;
  description: string;
  chapters: Chapter[];
}

export type ExamQuestionMark = '2-mark' | '5-mark' | 'long-answer';

export interface ExamQuestion {
  id: string;
  unitId: UnitId;
  chapterId: string;
  topicName: string;
  marks: ExamQuestionMark;
  sourceLabel: 'Generated Practice Question (U24EC304 Syllabus)';
  question: string;
  answerSections: {
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
    latex?: string[];
  }[];
}

export type QuizFormat = 'mcq' | 'true-false' | 'fill-blank' | 'numerical';

export interface QuizQuestion {
  id: string;
  unitId: UnitId;
  chapterId: string;
  format: QuizFormat;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  tolerance?: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  title: string;
  unitId: UnitId | 'mixed';
  score: number;
  total: number;
  percentage: number;
  timestamp: string;
}

export interface RecentActivityItem {
  chapterId: string;
  chapterTitle: string;
  unitNumber: string;
  action: 'studied' | 'completed' | 'notes';
  timestamp: string;
}

export interface UserProgress {
  completedChapters: string[];
  favouriteChapters: string[];
  checkedUnderstanding: Record<string, number[]>;
  quizAttempts: QuizAttempt[];
  recentActivity: RecentActivityItem[];
  lastVisitedChapterId: string | null;
}

export type AppRoute =
  | { page: 'dashboard' }
  | { page: 'unit'; unitId: UnitId }
  | { page: 'chapter'; chapterId: string }
  | { page: 'notes'; chapterId?: string }
  | { page: 'exam-prep'; unitId?: UnitId }
  | { page: 'lab'; simulator?: string }
  | { page: 'quizzes'; unitId?: UnitId | 'mixed' }
  | { page: 'formulas'; unitId?: UnitId };
