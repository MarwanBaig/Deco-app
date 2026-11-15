import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { ALL_FORMULAS, ALL_UNITS, getUnitById } from '../data';
import { AppRoute, UnitId } from '../types/academic';
import { MathBlock } from './MathBlock';

interface FormulaLibraryViewProps {
  initialUnitId?: UnitId;
  onNavigate: (route: AppRoute) => void;
}

export function FormulaLibraryView({ initialUnitId, onNavigate }: FormulaLibraryViewProps) {
  const [unitFilter, setUnitFilter] = useState<UnitId | 'all'>(initialUnitId || 'all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_FORMULAS.filter((f) => {
      if (unitFilter !== 'all' && f.unitId !== unitFilter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.chapterTitle.toLowerCase().includes(q) ||
        f.miniExample.toLowerCase().includes(q) ||
        f.symbols.some((s) => s.meaning.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q))
      );
    });
  }, [unitFilter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Formula &amp; Boolean Identity Library</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Complete unit-wise mathematical expressions, Boolean identities, symbol definitions, and usage examples.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas, Boolean laws, flip-flop equations, cache formulas..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-[#52B788]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setUnitFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
              unitFilter === 'all'
                ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
            }`}
          >
            All ({ALL_FORMULAS.length})
          </button>
          {ALL_UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => setUnitFilter(u.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                unitFilter === u.id
                  ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                  : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-8 text-center text-sm text-slate-500">
          No formulas match "{query}".
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((f) => {
            const u = getUnitById(f.unitId);
            return (
              <div
                key={f.id}
                className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      {u?.number} · {f.chapterTitle}
                    </span>
                    <button
                      onClick={() => onNavigate({ page: 'chapter', chapterId: f.chapterId })}
                      className="inline-flex items-center gap-1 hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer shrink-0"
                    >
                      <span>Chapter</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{f.name}</h2>

                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 p-3 border border-[#DCE3DC] dark:border-[#253830]">
                    <MathBlock latex={f.latex} />
                  </div>

                  <div className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Symbols:</p>
                    <ul className="space-y-0.5 pl-1">
                      {f.symbols.map((s) => (
                        <li key={s.symbol}>
                          <code className="font-mono text-[#0F766E] dark:text-[#2DD4BF]">{s.symbol}</code> — {s.meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <p><span className="font-semibold text-slate-800 dark:text-slate-200">Units / Domain:</span> {f.units}</p>
                  <p><span className="font-semibold text-slate-800 dark:text-slate-200">Condition:</span> {f.conditions}</p>
                  <p><span className="font-semibold text-slate-800 dark:text-slate-200">Usage Example:</span> {f.miniExample}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
