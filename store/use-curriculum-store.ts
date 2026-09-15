'use client';

import { useState, useEffect } from 'react';
import { BoardId, AcademicYear, ClassGrade, SubjectId, Chapter, CurriculumFilter } from '../services/curriculum/types';
import { CurriculumService } from '../services/curriculum/curriculum-service';

export interface CurriculumState {
  boardId: BoardId;
  academicYear: AcademicYear;
  classGrade: ClassGrade;
  subjectId: SubjectId;
  selectedChapterId: string | null;
  selectedChapter: Chapter | null;
  searchQuery: string;
  recentChapterIds: string[];
}

const DEFAULT_STATE: CurriculumState = {
  boardId: 'cbse',
  academicYear: '2026-27',
  classGrade: '9',
  subjectId: 'science',
  selectedChapterId: 'cbse-9-science-motion',
  selectedChapter: null,
  searchQuery: '',
  recentChapterIds: ['cbse-9-science-motion', 'cbse-10-science-chemical-reactions', 'cbse-10-science-electricity']
};

export function useCurriculumStore() {
  const [state, setState] = useState<CurriculumState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edugen_curriculum_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_STATE, ...parsed };
        }
      } catch (_) {}
    }
    return DEFAULT_STATE;
  });

  // Keep selectedChapter synced with selectedChapterId
  useEffect(() => {
    if (state.selectedChapterId) {
      const ch = CurriculumService.getChapterById(state.selectedChapterId);
      if (ch && (!state.selectedChapter || state.selectedChapter.id !== ch.id)) {
        setState(prev => ({ ...prev, selectedChapter: ch }));
      }
    } else {
      // Default to first available chapter if none selected
      const available = CurriculumService.getChapters({
        boardId: state.boardId,
        academicYear: state.academicYear,
        classGrade: state.classGrade,
        subjectId: state.subjectId
      });
      if (available.length > 0) {
        setState(prev => ({
          ...prev,
          selectedChapterId: available[0].id,
          selectedChapter: available[0]
        }));
      }
    }
  }, [state.boardId, state.academicYear, state.classGrade, state.subjectId, state.selectedChapterId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edugen_curriculum_state', JSON.stringify({
        boardId: state.boardId,
        academicYear: state.academicYear,
        classGrade: state.classGrade,
        subjectId: state.subjectId,
        selectedChapterId: state.selectedChapterId,
        recentChapterIds: state.recentChapterIds
      }));
    }
  }, [state.boardId, state.academicYear, state.classGrade, state.subjectId, state.selectedChapterId, state.recentChapterIds]);

  const setBoard = (boardId: BoardId) => {
    const subjects = CurriculumService.getSubjectsForBoardAndClass(boardId, state.classGrade);
    const validSubject = subjects.some(s => s.id === state.subjectId) ? state.subjectId : subjects[0].id;
    
    const chapters = CurriculumService.getChapters({
      boardId,
      academicYear: state.academicYear,
      classGrade: state.classGrade,
      subjectId: validSubject
    });

    setState(prev => ({
      ...prev,
      boardId,
      subjectId: validSubject,
      selectedChapterId: chapters[0]?.id || null,
      selectedChapter: chapters[0] || null
    }));
  };

  const setAcademicYear = (academicYear: AcademicYear) => {
    setState(prev => ({ ...prev, academicYear }));
  };

  const setClassGrade = (classGrade: ClassGrade) => {
    const subjects = CurriculumService.getSubjectsForBoardAndClass(state.boardId, classGrade);
    const validSubject = subjects.some(s => s.id === state.subjectId) ? state.subjectId : subjects[0].id;

    const chapters = CurriculumService.getChapters({
      boardId: state.boardId,
      academicYear: state.academicYear,
      classGrade,
      subjectId: validSubject
    });

    setState(prev => ({
      ...prev,
      classGrade,
      subjectId: validSubject,
      selectedChapterId: chapters[0]?.id || null,
      selectedChapter: chapters[0] || null
    }));
  };

  const setSubject = (subjectId: SubjectId) => {
    const chapters = CurriculumService.getChapters({
      boardId: state.boardId,
      academicYear: state.academicYear,
      classGrade: state.classGrade,
      subjectId
    });

    setState(prev => ({
      ...prev,
      subjectId,
      selectedChapterId: chapters[0]?.id || null,
      selectedChapter: chapters[0] || null
    }));
  };

  const selectChapter = (chapterId: string) => {
    const ch = CurriculumService.getChapterById(chapterId);
    if (ch) {
      setState(prev => ({
        ...prev,
        boardId: ch.boardId,
        academicYear: ch.academicYear,
        classGrade: ch.classGrade,
        subjectId: ch.subjectId,
        selectedChapterId: ch.id,
        selectedChapter: ch,
        recentChapterIds: [ch.id, ...prev.recentChapterIds.filter(id => id !== ch.id)].slice(0, 8)
      }));
    }
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  return {
    ...state,
    setBoard,
    setAcademicYear,
    setClassGrade,
    setSubject,
    selectChapter,
    setSearchQuery
  };
}
