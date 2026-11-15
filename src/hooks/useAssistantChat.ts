import { useCallback, useEffect, useState } from 'react';
import { getChapterById } from '../data';
import {
  MistakeRecord,
  StudyHistoryItem,
  TutorDifficulty,
  TutorMode,
  UnitId
} from '../types/academic';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  identifiedUnitId?: string;
  identifiedUnitLabel?: string;
  identifiedKeywords?: string[];
  recommendedChapterId?: string;
  recommendedChapterTitle?: string;
  textbooks?: string[];
  sourceDisclosure?: string;
}

export function useAssistantChat(
  onRecordStudyEvent: (entry: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => void
) {
  const [unitId, setUnitId] = useState<UnitId | 'all'>('all');
  const [chapterId, setChapterId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<TutorDifficulty>('intermediate');
  const [mode, setMode] = useState<TutorMode>('explain');
  const [selectedMistake, setSelectedMistake] = useState<MistakeRecord | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{ checked: boolean; configured: boolean }>({
    checked: false,
    configured: true
  });

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        setAiStatus({ checked: true, configured: Boolean(d?.aiConfigured) });
      })
      .catch(() => {
        setAiStatus({ checked: true, configured: false });
      });
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setErrorMsg(null);
    setSelectedMistake(null);
  }, []);

  const sendMessage = useCallback(
    async (
      textToSend: string,
      opts?: {
        overrideMode?: TutorMode;
        overrideDifficulty?: TutorDifficulty;
        overrideUnitId?: UnitId | 'all';
        overrideChapterId?: string;
        mistakeOverride?: MistakeRecord | null;
      }
    ) => {
      const trimmed = textToSend.trim();
      if (!trimmed || loading) return;

      const activeMode = opts?.overrideMode || mode;
      const activeDiff = opts?.overrideDifficulty || difficulty;
      const activeUnit = opts?.overrideUnitId ?? unitId;
      const activeChapterId = opts?.overrideChapterId ?? chapterId;
      const activeMistake =
        opts?.mistakeOverride !== undefined ? opts.mistakeOverride : selectedMistake;
      const ch = activeChapterId ? getChapterById(activeChapterId) : undefined;

      const userMsg: TutorMessage = {
        id: `${Date.now()}-u`,
        role: 'user',
        content: trimmed
      };

      const nextHistory = [...messages, userMsg];
      setMessages(nextHistory);
      setErrorMsg(null);
      setLoading(true);

      try {
        const res = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
            difficulty: activeDiff,
            mode: activeMode,
            unitId: activeUnit === 'all' ? undefined : activeUnit,
            chapterTitle: ch ? `${ch.chapterNumber} ${ch.title}` : undefined,
            chapterSyllabusTopic: ch?.syllabusTopic,
            mistakeContext: activeMistake
              ? `Question: ${activeMistake.prompt}\nStudent Answer: ${activeMistake.userAnswer}\nCorrect Answer: ${activeMistake.correctAnswer}`
              : undefined
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || `Server error (${res.status})`);
        }

        const assistantMsg: TutorMessage = {
          id: `${Date.now()}-a`,
          role: 'assistant',
          content: data.reply,
          identifiedUnitId: data.identifiedUnitId,
          identifiedUnitLabel: data.identifiedUnitLabel,
          identifiedKeywords: data.identifiedKeywords,
          recommendedChapterId: data.recommendedChapterId,
          recommendedChapterTitle: data.recommendedChapterTitle,
          textbooks: data.textbooks,
          sourceDisclosure: data.sourceDisclosure
        };

        setMessages((prev) => [...prev, assistantMsg]);
        onRecordStudyEvent({
          area: 'tutor',
          title: ch ? `${ch.chapterNumber} ${ch.title}` : data.identifiedUnitLabel || 'AI Doubt Assistant',
          unitId: activeUnit === 'all' ? undefined : activeUnit,
          chapterId: ch?.id,
          detail: `Doubt solved: ${trimmed.slice(0, 60)}`
        });
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Could not reach the AI Doubt Assistant endpoint.'
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, mode, difficulty, unitId, chapterId, selectedMistake, messages, onRecordStudyEvent]
  );

  return {
    unitId,
    setUnitId,
    chapterId,
    setChapterId,
    difficulty,
    setDifficulty,
    mode,
    setMode,
    selectedMistake,
    setSelectedMistake,
    messages,
    loading,
    errorMsg,
    aiStatus,
    clearConversation,
    sendMessage
  };
}
