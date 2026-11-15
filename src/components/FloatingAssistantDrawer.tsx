import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bot,
  Check,
  Copy,
  Maximize2,
  RotateCcw,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { ALL_UNITS } from '../data';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { AppRoute, UnitId } from '../types/academic';

type AssistantChatController = ReturnType<typeof useAssistantChat>;

interface FloatingAssistantDrawerProps {
  chat: AssistantChatController;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const QUICK_STARTER_PROMPTS = [
  'Explain this concept in simple language',
  'Help me solve a numerical problem',
  'Explain this truth table',
  'Teach me this topic step by step',
  'Give me practice questions from this unit'
];

export function FloatingAssistantDrawer({
  chat,
  currentRoute,
  onNavigate
}: FloatingAssistantDrawerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, chat.messages.length, chat.loading]);

  // Hide the floating widget on full assistant page or auth view
  if (currentRoute.page === 'tutor' || currentRoute.page === 'auth') {
    return null;
  }

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chat.loading) return;
    const text = input;
    setInput('');
    void chat.sendMessage(text);
  };

  return (
    <>
      {/* Persistent Bottom-Right Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 no-print inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold shadow-lg border border-white/10 transition-colors cursor-pointer"
          aria-label="Open Doubt Assistant"
        >
          <Bot className="w-4 h-4 text-[#8CE0B0]" />
          <span>Doubt Assistant</span>
        </button>
      )}

      {/* Slide-Over Quick Doubt Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 no-print"
          role="dialog"
          aria-modal="true"
          aria-label="DECO Doubt Assistant Drawer"
        >
          <div className="flex-1" onClick={() => setOpen(false)} />

          <div className="w-full max-w-md h-full bg-[#FBFBF7] dark:bg-[#13201B] border-l border-[#DCE3DC] dark:border-[#253830] flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="px-4 py-3.5 border-b border-[#DCE3DC] dark:border-[#253830] flex items-center justify-between gap-2 bg-white dark:bg-[#0D1512]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1F2933] dark:text-[#EEF2EE] truncate">
                    DECO Doubt Assistant
                  </p>
                  <p className="text-[11px] text-[#52796F] dark:text-[#A4B8AC] truncate">
                    Patient engineering tutor · U24EC304
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setOpen(false);
                    onNavigate({ page: 'tutor' });
                  }}
                  title="Open full workspace"
                  className="p-2 rounded-lg text-[#52796F] hover:bg-[#E8EFE9] dark:hover:bg-[#1D3028] cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={chat.clearConversation}
                  title="Clear chat"
                  className="p-2 rounded-lg text-[#52796F] hover:bg-[#E8EFE9] dark:hover:bg-[#1D3028] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  title="Close drawer"
                  className="p-2 rounded-lg text-[#52796F] hover:bg-[#E8EFE9] dark:hover:bg-[#1D3028] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Unit Focus Bar */}
            <div className="px-4 py-2 border-b border-[#DCE3DC] dark:border-[#253830] flex items-center gap-2 bg-[#F2F5F1] dark:bg-[#182822]">
              <select
                value={chat.unitId}
                onChange={(e) => {
                  chat.setUnitId(e.target.value as UnitId | 'all');
                  chat.setChapterId('');
                }}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512] text-xs font-medium text-[#1F2933] dark:text-[#EEF2EE]"
              >
                <option value="all">Auto-Detect Unit (1–5)</option>
                {ALL_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.number}: {u.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setOpen(false);
                  onNavigate({ page: 'tutor' });
                }}
                className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline whitespace-nowrap cursor-pointer"
              >
                Full View →
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {chat.messages.length === 0 ? (
                <div className="space-y-4 py-2">
                  <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512] p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask anything — basic or advanced</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
                      Stuck on a Boolean identity, K-Map, flip-flop timing, or cache problem? Pick a starter prompt or type your doubt below.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#52796F] dark:text-[#A4B8AC]">
                      Suggested Questions
                    </p>
                    {QUICK_STARTER_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="w-full text-left px-3 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512] hover:border-[#1B4332] dark:hover:border-[#52B788] text-xs font-medium text-[#1F2933] dark:text-[#EEF2EE] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl p-3.5 text-xs sm:text-sm space-y-2 ${
                        msg.role === 'user'
                          ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                          : 'bg-white dark:bg-[#0D1512] border border-[#DCE3DC] dark:border-[#253830] text-[#1F2933] dark:text-[#EEF2EE]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                      {msg.role === 'assistant' && (
                        <div className="pt-2 border-t border-[#DCE3DC]/70 dark:border-[#253830] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <button
                            onClick={() => void handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 text-[#52796F] dark:text-[#A4B8AC] hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {msg.recommendedChapterId && (
                            <button
                              onClick={() => {
                                setOpen(false);
                                onNavigate({
                                  page: 'chapter',
                                  chapterId: msg.recommendedChapterId!
                                });
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{msg.recommendedChapterTitle || 'Open Lesson'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {chat.loading && (
                <div className="text-xs text-[#52796F] dark:text-[#A4B8AC] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF] animate-pulse" />
                  <span>Working through your explanation step by step...</span>
                </div>
              )}

              {chat.errorMsg && (
                <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{chat.errorMsg}</span>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512] flex items-end gap-2"
            >
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !chat.loading) {
                      const text = input;
                      setInput('');
                      void chat.sendMessage(text);
                    }
                  }
                }}
                placeholder="Ask your DECO doubt..."
                className="flex-1 resize-none px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#13201B] text-xs sm:text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
              />
              <button
                type="submit"
                disabled={chat.loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send doubt"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
