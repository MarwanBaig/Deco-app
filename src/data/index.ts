import { UNIT_1, UNIT_1_EXAM_QUESTIONS, UNIT_1_QUIZZES } from './unit1';
import { UNIT_2, UNIT_2_EXAM_QUESTIONS, UNIT_2_QUIZZES } from './unit2';
import { UNIT_3, UNIT_3_EXAM_QUESTIONS, UNIT_3_QUIZZES } from './unit3';
import { UNIT_4, UNIT_4_EXAM_QUESTIONS, UNIT_4_QUIZZES } from './unit4';
import { UNIT_5, UNIT_5_EXAM_QUESTIONS, UNIT_5_QUIZZES } from './unit5';
import { LESSON_ENRICHMENT, UNIT_LEARNING_OBJECTIVES } from './lessonEnrichment';
import { EXTRA_ASSESSMENT_QUIZZES } from './extraAssessments';
import {
  Chapter,
  ExamQuestion,
  FormulaItem,
  LessonEnrichment,
  QuizQuestion,
  Unit,
  UnitId
} from '../types/academic';

const RAW_UNITS: Unit[] = [UNIT_1, UNIT_2, UNIT_3, UNIT_4, UNIT_5];

export const ALL_UNITS: Unit[] = RAW_UNITS.map((u) => ({
  ...u,
  learningObjectives: UNIT_LEARNING_OBJECTIVES[u.id]?.objectives,
  unitOutcome: UNIT_LEARNING_OBJECTIVES[u.id]?.outcome
}));

export const ALL_CHAPTERS: Chapter[] = ALL_UNITS.flatMap((u) => u.chapters);

export const ALL_FORMULAS: FormulaItem[] = ALL_CHAPTERS.flatMap((c) => c.formulas);

export const ALL_EXAM_QUESTIONS: ExamQuestion[] = [
  ...UNIT_1_EXAM_QUESTIONS,
  ...UNIT_2_EXAM_QUESTIONS,
  ...UNIT_3_EXAM_QUESTIONS,
  ...UNIT_4_EXAM_QUESTIONS,
  ...UNIT_5_EXAM_QUESTIONS
].map((q) => ({
  ...q,
  isImportant: q.isImportant ?? (q.marks === 'long-answer' || q.marks === '5-mark')
}));

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...UNIT_1_QUIZZES,
  ...UNIT_2_QUIZZES,
  ...UNIT_3_QUIZZES,
  ...UNIT_4_QUIZZES,
  ...UNIT_5_QUIZZES,
  ...EXTRA_ASSESSMENT_QUIZZES
];

export function getUnitById(unitId: UnitId): Unit | undefined {
  return ALL_UNITS.find((u) => u.id === unitId);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === chapterId);
}

export function getLessonEnrichment(chapterId: string): LessonEnrichment {
  return (
    LESSON_ENRICHMENT[chapterId] || {
      learningObjectives: [],
      commonMistakes: [],
      notebookNotes: []
    }
  );
}

export function getExamQuestionsForChapter(chapterId: string): ExamQuestion[] {
  return ALL_EXAM_QUESTIONS.filter((q) => q.chapterId === chapterId);
}

export function getAdjacentChapters(chapterId: string): { prev: Chapter | null; next: Chapter | null } {
  const idx = ALL_CHAPTERS.findIndex((c) => c.id === chapterId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? ALL_CHAPTERS[idx - 1] : null,
    next: idx < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[idx + 1] : null
  };
}

export interface SearchResult {
  type: 'unit' | 'chapter' | 'formula' | 'question' | 'definition';
  id: string;
  unitId: UnitId;
  unitNumber: string;
  chapterId?: string;
  chapterTitle?: string;
  title: string;
  snippet: string;
}

export function searchAcademy(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const unit of ALL_UNITS) {
    if (
      unit.title.toLowerCase().includes(q) ||
      unit.description.toLowerCase().includes(q) ||
      unit.syllabusExactText.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'unit',
        id: unit.id,
        unitId: unit.id,
        unitNumber: unit.number,
        title: `${unit.number}: ${unit.title}`,
        snippet: unit.description
      });
    }
  }

  for (const ch of ALL_CHAPTERS) {
    const unit = getUnitById(ch.unitId)!;
    const detailText = [
      ch.title,
      ch.syllabusTopic,
      ch.introduction.meaning,
      ch.introduction.importance,
      ch.fundamentalConcept.overview,
      ...ch.summary,
      ...ch.quickRevision.corePoints
    ]
      .join(' ')
      .toLowerCase();

    if (detailText.includes(q)) {
      results.push({
        type: 'chapter',
        id: ch.id,
        unitId: ch.unitId,
        unitNumber: unit.number,
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: `${ch.chapterNumber} ${ch.title}`,
        snippet: ch.introduction.meaning
      });
    }

    for (const term of ch.fundamentalConcept.terms) {
      if (term.term.toLowerCase().includes(q) || term.meaning.toLowerCase().includes(q)) {
        results.push({
          type: 'definition',
          id: `${ch.id}-${term.term}`,
          unitId: ch.unitId,
          unitNumber: unit.number,
          chapterId: ch.id,
          chapterTitle: ch.title,
          title: `Definition: ${term.term}`,
          snippet: term.meaning
        });
      }
    }
  }

  for (const f of ALL_FORMULAS) {
    const unit = getUnitById(f.unitId)!;
    if (
      f.name.toLowerCase().includes(q) ||
      f.chapterTitle.toLowerCase().includes(q) ||
      f.miniExample.toLowerCase().includes(q) ||
      f.symbols.some((s) => s.meaning.toLowerCase().includes(q))
    ) {
      results.push({
        type: 'formula',
        id: f.id,
        unitId: f.unitId,
        unitNumber: unit.number,
        chapterId: f.chapterId,
        chapterTitle: f.chapterTitle,
        title: `Formula: ${f.name}`,
        snippet: f.miniExample
      });
    }
  }

  for (const eq of ALL_EXAM_QUESTIONS) {
    const unit = getUnitById(eq.unitId)!;
    const ch = getChapterById(eq.chapterId);
    if (eq.question.toLowerCase().includes(q) || eq.topicName.toLowerCase().includes(q)) {
      results.push({
        type: 'question',
        id: eq.id,
        unitId: eq.unitId,
        unitNumber: unit.number,
        chapterId: eq.chapterId,
        chapterTitle: ch?.title,
        title: `Exam (${eq.marks}): ${eq.topicName}`,
        snippet: eq.question
      });
    }
  }

  return results.slice(0, 40);
}
