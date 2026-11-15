import { Check, Image as ImageIcon, Moon, SlidersHorizontal, Sun, Type, X } from 'lucide-react';
import { STUDY_BACKDROPS } from '../data/backdrops';
import { ReadingComfort, StudyBackdropId, StudyPreferences } from '../types/academic';

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  preferences: StudyPreferences;
  onSetBackdrop: (id: StudyBackdropId) => void;
  onSetReadingComfort: (comfort: ReadingComfort) => void;
}

export function PreferencesModal({
  open,
  onClose,
  theme,
  onSetTheme,
  preferences,
  onSetBackdrop,
  onSetReadingComfort
}: PreferencesModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Study Environment Preferences"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#13201B] text-[#1F2933] dark:text-[#EEF2EE] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7]/95 dark:bg-[#13201B]/95 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#1B4332] dark:text-[#52B788]" />
            <div>
              <h2 className="text-lg font-bold">Study Environment &amp; Appearance</h2>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
                Customize your peaceful workspace. Preferences save automatically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#52796F] hover:bg-[#E8EFE9] dark:hover:bg-[#1D3028] cursor-pointer"
            aria-label="Close preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-7">
          {/* 1. Light & Dark Mode */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-[#1F2933] dark:text-[#EEF2EE]">
              Color Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onSetTheme('light')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#1B4332] bg-[#E8EFE9]/70 dark:bg-[#1B4332]/30'
                    : 'border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512]/70 hover:border-[#52796F]'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#FBFBF7] border border-[#DCE3DC] flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4 text-[#B78A28]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Warm Ivory (Light)</p>
                  <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
                    Crisp paper contrast for daytime study
                  </p>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-[#1B4332]" />}
              </button>

              <button
                onClick={() => onSetTheme('dark')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#52B788] bg-[#1D3329]'
                    : 'border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512]/70 hover:border-[#52796F]'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#0D1512] border border-[#253830] flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4 text-[#52B788]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Deep Woodland (Dark)</p>
                  <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
                    Low-glare forest slate for night study
                  </p>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-[#52B788]" />}
              </button>
            </div>
          </section>

          {/* 2. Reading Comfort */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
              <h3 className="text-sm font-bold text-[#1F2933] dark:text-[#EEF2EE]">
                Lesson Reading Comfort
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onSetReadingComfort('standard')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  preferences.readingComfort === 'standard'
                    ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/70 dark:bg-[#1D3329]'
                    : 'border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512]/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Standard Density</span>
                  {preferences.readingComfort === 'standard' && (
                    <Check className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
                  )}
                </div>
                <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-1">
                  Compact textbook layout for quick scanning.
                </p>
              </button>

              <button
                onClick={() => onSetReadingComfort('relaxed')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  preferences.readingComfort === 'relaxed'
                    ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/70 dark:bg-[#1D3329]'
                    : 'border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512]/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Relaxed Reading</span>
                  {preferences.readingComfort === 'relaxed' && (
                    <Check className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
                  )}
                </div>
                <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-1">
                  Slightly larger font and extra line spacing for long sessions.
                </p>
              </button>
            </div>
          </section>

          {/* 3. Selective Nature Study Backdrop */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
              <div>
                <h3 className="text-sm font-bold text-[#1F2933] dark:text-[#EEF2EE]">
                  Welcome &amp; Dashboard Nature Backdrop
                </h3>
                <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
                  Shown softly on your Welcome hero, Login page, and Dashboard banner — never behind lesson reading text or formulas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STUDY_BACKDROPS.map((option) => {
                const selected = preferences.backdrop === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onSetBackdrop(option.id)}
                    className={`rounded-xl border overflow-hidden text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#1B4332] dark:border-[#52B788] ring-1 ring-[#1B4332] dark:ring-[#52B788] bg-[#E8EFE9]/50 dark:bg-[#1D3329]'
                        : 'border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512]/70 hover:border-[#52796F]'
                    }`}
                  >
                    <div className="h-24 w-full relative overflow-hidden bg-gradient-to-br from-[#E8EFE9] to-[#DCE3DC] dark:from-[#182822] dark:to-[#0D1512]">
                      {option.imageUrl ? (
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-[#52796F] dark:text-[#A4B8AC]">
                          Solid Minimal Surface
                        </div>
                      )}
                      {selected && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-[#1F2933] dark:text-[#EEF2EE]">
                        {option.label}
                      </p>
                      <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5 leading-snug">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-[#DCE3DC] dark:border-[#253830] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
