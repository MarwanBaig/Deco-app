import { useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Download,
  Printer,
  Search
} from 'lucide-react';
import { ALL_CHAPTERS, ALL_UNITS, getUnitById } from '../data';
import { Chapter, UnitId, UserProgress } from '../types/academic';
import { MathBlock } from './MathBlock';
import { TopicDiagram } from './TopicDiagram';

interface NotesViewProps {
  initialChapterId?: string;
  progress: UserProgress;
  onToggleComplete: (chapterId: string, title: string, unitNumber: string) => void;
  onToggleFavourite: (chapterId: string) => void;
  onRecordNotesRead: (chapterId: string, title: string, unitNumber: string) => void;
}

export function NotesView({
  initialChapterId,
  progress,
  onToggleComplete,
  onToggleFavourite,
  onRecordNotesRead
}: NotesViewProps) {
  const [selectedUnit, setSelectedUnit] = useState<UnitId | 'all' | 'favourites'>('all');
  const [readingMode, setReadingMode] = useState<'detailed' | 'quick'>('detailed');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapterId, setActiveChapterId] = useState<string>(
    initialChapterId || ALL_CHAPTERS[0].id
  );

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_CHAPTERS.filter((ch) => {
      if (selectedUnit === 'favourites' && !progress.favouriteChapters.includes(ch.id)) {
        return false;
      }
      if (selectedUnit !== 'all' && selectedUnit !== 'favourites' && ch.unitId !== selectedUnit) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        ch.title,
        ch.syllabusTopic,
        ch.fundamentalConcept.overview,
        ...ch.summary,
        ...ch.quickRevision.corePoints,
        ...ch.quickRevision.keyDefinitions.map((d) => `${d.term} ${d.definition}`)
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedUnit, searchQuery, progress.favouriteChapters]);

  const activeChapter: Chapter | undefined =
    filteredChapters.find((c) => c.id === activeChapterId) || filteredChapters[0];
  const activeUnit = activeChapter ? getUnitById(activeChapter.unitId) : undefined;

  const selectChapter = (ch: Chapter) => {
    setActiveChapterId(ch.id);
    const u = getUnitById(ch.unitId);
    if (u) onRecordNotesRead(ch.id, ch.title, u.number);
  };

  const handleDownloadNotes = (ch: Chapter) => {
    const u = getUnitById(ch.unitId);
    const lines: string[] = [
      `# DECO ACADEMY — ${u?.number}: ${u?.title}`,
      `## Chapter ${ch.chapterNumber}: ${ch.title}`,
      `Syllabus Topic: ${ch.syllabusTopic}`,
      '',
      '### 1. Introduction & Fundamental Concept',
      ch.introduction.meaning,
      '',
      ch.fundamentalConcept.overview,
      '',
      '### 2. Key Terminology',
      ...ch.fundamentalConcept.terms.map((t) => `- **${t.term}**: ${t.meaning}`),
      '',
      '### 3. Quick Revision Points',
      ...ch.quickRevision.corePoints.map((p) => `- ${p}`),
      '',
      '### 4. Important Formulas',
      ...ch.formulas.map((f) => `- **${f.name}**: \`${f.latex}\` (${f.miniExample})`),
      '',
      '### 5. Worked Examples',
      ...ch.workedExamples.map(
        (ex) =>
          `- **${ex.title}**: ${ex.problemStatement}\n  Answer: ${ex.finalAnswer}`
      ),
      '',
      '### 6. Chapter Summary',
      ...ch.summary.map((s) => `- ${s}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DECO_${ch.chapterNumber}_${ch.title.replace(/[^a-zA-Z0-9]+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Study &amp; Revision Notes
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Switch seamlessly between full Detailed Learning Notes and exam-ready Quick Revision Notes.
          </p>
        </div>

        {/* Reading Format Toggle */}
        <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 self-start">
          <button
            onClick={() => setReadingMode('detailed')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              readingMode === 'detailed'
                ? 'bg-white dark:bg-[#11192B] text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Detailed Learning Notes
          </button>
          <button
            onClick={() => setReadingMode('quick')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              readingMode === 'quick'
                ? 'bg-white dark:bg-[#11192B] text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Quick Revision Notes
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 no-print">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within notes, definitions, or chapters..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11192B] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
              selectedUnit === 'all'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Units
          </button>
          {ALL_UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnit(u.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                selectedUnit === u.id
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {u.number}
            </button>
          ))}
          <button
            onClick={() => setSelectedUnit('favourites')}
            className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
              selectedUnit === 'favourites'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Favourites ({progress.favouriteChapters.length})
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chapter List */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] max-h-[600px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 no-print">
          {filteredChapters.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No matching notes found. Try clearing your filter or search term.
            </div>
          ) : (
            filteredChapters.map((ch) => {
              const isSelected = activeChapter?.id === ch.id;
              const isDone = progress.completedChapters.includes(ch.id);
              const isFav = progress.favouriteChapters.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChapter(ch)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Ch {ch.chapterNumber}</span>
                    <span className="flex items-center gap-1.5">
                      {isFav && <Bookmark className="w-3.5 h-3.5 text-amber-500" />}
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-snug">{ch.title}</p>
                </button>
              );
            })
          )}
        </aside>

        {/* Note Content Pane */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-6 print-area">
          {!activeChapter || !activeUnit ? (
            <p className="text-sm text-slate-500 py-8 text-center">Select a chapter to view notes.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {activeUnit.number}: {activeUnit.title} · Chapter {activeChapter.chapterNumber}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {activeChapter.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 no-print">
                  <button
                    onClick={() => onToggleFavourite(activeChapter.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                      progress.favouriteChapters.includes(activeChapter.id)
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{progress.favouriteChapters.includes(activeChapter.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => onToggleComplete(activeChapter.id, activeChapter.title, activeUnit.number)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      progress.completedChapters.includes(activeChapter.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{progress.completedChapters.includes(activeChapter.id) ? 'Completed' : 'Mark Done'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadNotes(activeChapter)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {readingMode === 'detailed' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                      1. Concept &amp; Fundamentals
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeChapter.introduction.meaning} {activeChapter.fundamentalConcept.overview}
                    </p>
                  </div>

                  {activeChapter.detailedExplanation.map((sec, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{sec.heading}</h3>
                      {sec.steps && (
                        <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                          {sec.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      )}
                      {sec.bullets && (
                        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                          {sec.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {sec.table && (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                {sec.table.headers.map((h) => (
                                  <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {sec.table.rows.map((r, ri) => (
                                <tr key={ri}>
                                  {r.map((c, ci) => (
                                    <td key={ci} className="px-3 py-2 text-slate-700 dark:text-slate-300">{c}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}

                  <TopicDiagram type={activeChapter.diagramType} caption={activeChapter.diagramCaption} />

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Formulas &amp; Worked Answer</h3>
                    {activeChapter.formulas.map((f) => (
                      <div key={f.id} className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">{f.name}</p>
                        <MathBlock latex={f.latex} />
                      </div>
                    ))}
                    {activeChapter.workedExamples.map((ex) => (
                      <div key={ex.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-1.5 text-sm">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{ex.title}</p>
                        <p className="text-slate-600 dark:text-slate-300">{ex.problemStatement}</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">Answer: {ex.finalAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Key Definitions
                    </h3>
                    <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                      {activeChapter.quickRevision.keyDefinitions.map((kd) => (
                        <div key={kd.term} className="p-3 flex flex-col sm:flex-row sm:gap-4 text-sm">
                          <dt className="sm:w-44 shrink-0 font-bold text-sky-600 dark:text-sky-400">{kd.term}</dt>
                          <dd className="text-slate-700 dark:text-slate-300">{kd.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Core Points to Remember
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      {activeChapter.quickRevision.corePoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Formula Snapshot
                    </h3>
                    {activeChapter.formulas.map((f) => (
                      <div key={f.id} className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{f.name}</p>
                        <MathBlock latex={f.latex} />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                    <h3 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-1.5">
                      Exam Preparation Tips
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {activeChapter.quickRevision.examReminders.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
