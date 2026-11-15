import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchAcademy, SearchResult } from '../data';
import { AppRoute } from '../types/academic';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function SearchModal({ open, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = useMemo(() => searchAcademy(query), [query]);

  if (!open) return null;

  const handleSelect = (item: SearchResult) => {
    if (item.type === 'unit') {
      onNavigate({ page: 'unit', unitId: item.unitId });
    } else if (item.type === 'formula') {
      onNavigate({ page: 'formulas', unitId: item.unitId });
    } else if (item.type === 'question') {
      onNavigate({ page: 'exam-prep', unitId: item.unitId });
    } else if (item.chapterId) {
      onNavigate({ page: 'chapter', chapterId: item.chapterId });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 pt-16 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DCE3DC] dark:border-[#253830]">
          <Search className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search units, chapters, definitions, formulas, exam questions..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {!query.trim() ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Try searching for <strong className="text-slate-700 dark:text-slate-200">Hamming</strong>,{' '}
              <strong className="text-slate-700 dark:text-slate-200">K-Map</strong>,{' '}
              <strong className="text-slate-700 dark:text-slate-200">JK Master Slave</strong>,{' '}
              <strong className="text-slate-700 dark:text-slate-200">DMA</strong>, or{' '}
              <strong className="text-slate-700 dark:text-slate-200">Cache Mapping</strong>.
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No results found for "{query}".
            </div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                    {r.unitNumber} {r.chapterTitle ? `· ${r.chapterTitle}` : ''}
                  </span>
                  <span className="capitalize">{r.type}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{r.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{r.snippet}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
