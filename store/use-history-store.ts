'use client';

import { useState, useEffect } from 'react';
import { GeneratedQuestionPaper } from '../services/question-paper/types';
import { GeneratedAnswerKey } from '../answer-key/types';
import { PPTDeck } from '../services/ppt/types';

export interface HistoryState {
  papers: GeneratedQuestionPaper[];
  answerKeys: GeneratedAnswerKey[];
  pptDecks: PPTDeck[];
}

export function useHistoryStore() {
  const [history, setHistory] = useState<HistoryState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edugen_history_data');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return { papers: [], answerKeys: [], pptDecks: [] };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edugen_history_data', JSON.stringify(history));
    }
  }, [history]);

  const savePaper = (paper: GeneratedQuestionPaper) => {
    setHistory(prev => ({
      ...prev,
      papers: [paper, ...prev.papers.filter(p => p.id !== paper.id)]
    }));
  };

  const saveAnswerKey = (answerKey: GeneratedAnswerKey) => {
    setHistory(prev => ({
      ...prev,
      answerKeys: [answerKey, ...prev.answerKeys.filter(k => k.id !== answerKey.id)]
    }));
  };

  const savePPTDeck = (deck: PPTDeck) => {
    setHistory(prev => ({
      ...prev,
      pptDecks: [deck, ...prev.pptDecks.filter(d => d.id !== deck.id)]
    }));
  };

  const deletePaper = (id: string) => {
    setHistory(prev => ({
      ...prev,
      papers: prev.papers.filter(p => p.id !== id)
    }));
  };

  const deleteAnswerKey = (id: string) => {
    setHistory(prev => ({
      ...prev,
      answerKeys: prev.answerKeys.filter(k => k.id !== id)
    }));
  };

  const deletePPTDeck = (id: string) => {
    setHistory(prev => ({
      ...prev,
      pptDecks: prev.pptDecks.filter(d => d.id !== id)
    }));
  };

  return {
    ...history,
    savePaper,
    saveAnswerKey,
    savePPTDeck,
    deletePaper,
    deleteAnswerKey,
    deletePPTDeck
  };
}
