import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Check,
  X,
  Volume2,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Target,
  FileText,
  Mic,
  MessageSquare,
  Activity,
  Layers,
  ChevronRight,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import { StreakCalendar } from '../components/common/StreakCalendar';
import {
  LANGUAGES_DATA,
  LanguageProfile,
  LanguageProgressState,
  loadLanguageProgress,
  saveLanguageProgress,
  checkGermanA2Readiness,
  Lesson,
  Exercise,
  getAllLessonsForLanguage,
  isLessonLocked,
  evaluateExerciseAnswer,
} from '../data/languagesCurriculum';
import { emitAppEvent } from '../utils/appEvents';

export const CommunicationPage: React.FC = () => {
  const navigate = useNavigate();

  // ---------------- Multi-Language State (Isolated Progression) ----------------
  const [selectedLangId, setSelectedLangId] = useState<string>('german');
  const activeLanguage: LanguageProfile = LANGUAGES_DATA[selectedLangId] || LANGUAGES_DATA.german;

  const [langProgress, setLangProgress] = useState<Record<string, LanguageProgressState>>(() => {
    const initial: Record<string, LanguageProgressState> = {};
    Object.keys(LANGUAGES_DATA).forEach((lId) => {
      initial[lId] = loadLanguageProgress(lId);
    });
    return initial;
  });

  const activeLangState = langProgress[selectedLangId] || loadLanguageProgress(selectedLangId);
  const allLessons = useMemo(() => getAllLessonsForLanguage(selectedLangId), [selectedLangId]);

  // Active Lesson Drill State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [exerciseFeedback, setExerciseFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(false);

  // Matching Exercise temporary selection
  const [matchingSelectedTerm, setMatchingSelectedTerm] = useState<string | null>(null);
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>({});

  // German A2 Readiness Evaluation
  const isGermanA2Ready = useMemo(() => {
    return checkGermanA2Readiness(langProgress.german || loadLanguageProgress('german'));
  }, [langProgress]);

  // Audio Pronunciation via Web Speech API TTS
  const playAudioPronunciation = (text: string, langCode: string = 'de-DE') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Launch Lesson Drill
  const handleStartLessonDrill = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentExIdx(0);
    setUserAnswer(null);
    setIsAnswerSubmitted(false);
    setExerciseFeedback(null);
    setCorrectCount(0);
    setIsLessonFinished(false);
    setMatchingSelectedTerm(null);
    setMatchingPairs({});
  };

  const currentExercise: Exercise | null =
    activeLesson && activeLesson.exercises[currentExIdx] ? activeLesson.exercises[currentExIdx] : null;

  // Initialize Exercise State
  useEffect(() => {
    if (!currentExercise) return;
    setUserAnswer(null);
    setIsAnswerSubmitted(false);
    setExerciseFeedback(null);
    setMatchingSelectedTerm(null);
    setMatchingPairs({});

    if (currentExercise.type === 'word_ordering') {
      setUserAnswer([]);
    } else if (currentExercise.type === 'matching') {
      setUserAnswer({});
    } else if (currentExercise.type === 'translation' || currentExercise.type === 'fill_in_the_blank' || currentExercise.type === 'listening') {
      setUserAnswer('');
    }
  }, [currentExIdx, activeLesson]);

  // Submit and Evaluate Exercise Answer
  const handleSubmitAnswer = () => {
    if (!currentExercise) return;

    let finalAnswer = userAnswer;
    if (currentExercise.type === 'matching') {
      finalAnswer = matchingPairs;
    }

    const evaluation = evaluateExerciseAnswer(currentExercise, finalAnswer);
    setExerciseFeedback(evaluation);
    setIsAnswerSubmitted(true);

    if (evaluation.isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  // Advance or Finish Lesson
  const handleNextExercise = () => {
    if (!activeLesson) return;

    if (currentExIdx + 1 < activeLesson.exercises.length) {
      setCurrentExIdx((prev) => prev + 1);
    } else {
      // Finished all exercises in this lesson
      setIsLessonFinished(true);

      const totalExercises = activeLesson.exercises.length;
      const passed = Math.round((correctCount / totalExercises) * 100) >= activeLesson.passingScorePercent;

      if (passed) {
        // Unlock next lesson and update state
        const updatedCompletedLessonIds = Array.from(
          new Set([...activeLangState.completedLessonIds, activeLesson.id])
        );
        const progressPercent = Math.round((updatedCompletedLessonIds.length / allLessons.length) * 100);

        // Dynamically increment skill matrix based on exercise skills
        const updatedSkillMatrix = {
          speaking: Math.min(100, activeLangState.skillMatrix.speaking + 15),
          listening: Math.min(100, activeLangState.skillMatrix.listening + 15),
          reading: Math.min(100, activeLangState.skillMatrix.reading + 15),
          writing: Math.min(100, activeLangState.skillMatrix.writing + 15),
        };

        const newProgress: LanguageProgressState = {
          ...activeLangState,
          courseProgressPercent: progressPercent,
          streak: activeLangState.streak + 1,
          lastPracticed: new Date().toISOString(),
          completedLessonIds: updatedCompletedLessonIds,
          skillMatrix: updatedSkillMatrix,
          totalQuestionsAnswered: activeLangState.totalQuestionsAnswered + totalExercises,
          correctAnswersCount: activeLangState.correctAnswersCount + correctCount,
        };

        saveLanguageProgress(selectedLangId, newProgress);
        setLangProgress((prev) => ({ ...prev, [selectedLangId]: newProgress }));

        // Emit application event to update Today's Plan automatically!
        emitAppEvent('lessonCompleted', {
          languageId: selectedLangId,
          unitId: activeLesson.id,
        });
      }
    }
  };

  // Word Ordering: Add or Remove Chip
  const handleToggleWordChip = (word: string, fromSelected: boolean) => {
    if (isAnswerSubmitted) return;
    const currentList: string[] = Array.isArray(userAnswer) ? [...userAnswer] : [];

    if (fromSelected) {
      const idx = currentList.lastIndexOf(word);
      if (idx !== -1) currentList.splice(idx, 1);
    } else {
      currentList.push(word);
    }
    setUserAnswer(currentList);
  };

  // Matching: Pair Selection
  const handleSelectMatchingTerm = (term: string) => {
    if (isAnswerSubmitted) return;
    setMatchingSelectedTerm(term);
  };

  const handleSelectMatchingDefinition = (definition: string) => {
    if (isAnswerSubmitted || !matchingSelectedTerm) return;
    const updated = { ...matchingPairs, [matchingSelectedTerm]: definition };
    setMatchingPairs(updated);
    setUserAnswer(updated);
    setMatchingSelectedTerm(null);
  };

  const getLessonCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return <BookOpen size={20} />;
      case 'grammar':
        return <FileText size={20} />;
      case 'speaking':
        return <Mic size={20} />;
      case 'workplace':
        return <Globe size={20} />;
      case 'checkpoint':
        return <Award size={22} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 60 }}>
      {/* Top Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            &larr; Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Global Language Learning Hub
              </h1>
              <span style={{ fontSize: 12, color: '#64748B' }}>
                Real Multi-Type Exercise Engine • Prerequisite Locking • 4-Skill Matrix
              </span>
            </div>
          </div>
        </div>

        {/* Global Streak & Calendar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StreakCalendar compact onOpenPractice={() => {}} />
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ maxWidth: 1200, margin: '24px auto 0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Language Selector Bar with Isolated Progress Badges */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginRight: 4 }}>
              Language Track:
            </span>
            {Object.values(LANGUAGES_DATA).map((lang) => {
              const isSelected = lang.id === selectedLangId;
              const st = langProgress[lang.id] || loadLanguageProgress(lang.id);
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLangId(lang.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: isSelected ? '2px solid #4F46E5' : '1px solid #CBD5E1',
                    background: isSelected ? '#EEF2FF' : '#F8FAFC',
                    color: isSelected ? '#4F46E5' : '#1E293B',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: isSelected ? '#4F46E5' : '#E2E8F0',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      padding: '1px 7px',
                      borderRadius: 999,
                    }}
                  >
                    {st.courseProgressPercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Language Isolated Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7ED', border: '1px solid #FED7AA', padding: '5px 12px', borderRadius: 8 }}>
              <Flame size={16} fill="#EA580C" color="#EA580C" />
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#C2410C' }}>
                {activeLangState.streak} Day {activeLanguage.name} Streak
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '5px 12px', borderRadius: 8 }}>
              <Award size={16} color="#4F46E5" />
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#4F46E5' }}>
                CEFR: {activeLanguage.initialCefrLevel}
              </span>
            </div>
          </div>
        </div>

        {/* ================= 4-SKILL BREAKDOWN MATRIX ================= */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            padding: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#4F46E5" />
              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {activeLanguage.name} 4-Skill Proficiency Matrix
              </h3>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#4F46E5' }}>
              Overall Course Progress: {activeLangState.courseProgressPercent}% ({activeLangState.completedLessonIds.length}/{allLessons.length} Lessons Passed)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: '🗣️ Speaking', score: activeLangState.skillMatrix.speaking },
              { label: '👂 Listening', score: activeLangState.skillMatrix.listening },
              { label: '📖 Reading', score: activeLangState.skillMatrix.reading },
              { label: '✍️ Writing', score: activeLangState.skillMatrix.writing },
            ].map((sk, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                  <span>{sk.label}</span>
                  <span style={{ color: '#0F172A' }}>{sk.score}%</span>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${sk.score}%`,
                      background: sk.score >= 70 ? '#10B981' : '#4F46E5',
                      borderRadius: 999,
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= GERMAN A2 READINESS BANNER ================= */}
        {selectedLangId === 'german' && isGermanA2Ready && activeLanguage.examReadiness && (
          <div
            style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              borderRadius: 16,
              border: '2px solid #F59E0B',
              padding: '20px 24px',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 16.5, fontWeight: 900, color: '#78350F', margin: 0 }}>
                      🇩🇪 Official German A2 Certification Readiness Unlocked!
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 800, background: '#D97706', color: '#FFFFFF', padding: '2px 8px', borderRadius: 999 }}>
                      Verified CEFR A2
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#92400E' }}>
                    You have passed all prerequisite German curriculum lessons with verified accuracy.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {activeLanguage.examReadiness.officialLinks.map((lnk, idx) => (
                  <a
                    key={idx}
                    href={lnk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#78350F',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    <span>{lnk.name}</span>
                    <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', borderRadius: 10, padding: '12px 16px', fontSize: 12.5, color: '#78350F', lineHeight: 1.45 }}>
              <strong>Accredited Exam Formats:</strong> {activeLanguage.examReadiness.formatSummary}
            </div>
          </div>
        )}

        {/* ================= VERTICAL CURRICULUM TREE WITH PREREQUISITE LOCKING ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {activeLanguage.units.map((unit) => (
            <div
              key={unit.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                padding: '24px 28px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11.5, fontWeight: 900, color: '#4F46E5', textTransform: 'uppercase', background: '#EEF2FF', padding: '3px 10px', borderRadius: 999 }}>
                  CEFR Level {unit.cefrLevel}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '6px 0 2px 0' }}>
                  {unit.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                  {unit.description}
                </p>
              </div>

              {/* Lessons within unit */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {unit.lessons.map((lesson, lIdx) => {
                  const isCompleted = activeLangState.completedLessonIds.includes(lesson.id);
                  const isLocked = isLessonLocked(lesson, activeLangState.completedLessonIds);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (!isLocked) handleStartLessonDrill(lesson);
                      }}
                      style={{
                        background: isCompleted ? '#F0FDF4' : !isLocked ? '#EEF2FF' : '#F8FAFC',
                        border: isCompleted
                          ? '2px solid #10B981'
                          : !isLocked
                          ? '2px solid #4F46E5'
                          : '1px solid #E2E8F0',
                        borderRadius: 14,
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: isCompleted
                              ? 'linear-gradient(135deg, #10B981, #059669)'
                              : !isLocked
                              ? 'linear-gradient(135deg, #4F46E5, #4338CA)'
                              : '#E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isLocked ? '#94A3B8' : '#FFFFFF',
                            flexShrink: 0,
                          }}
                        >
                          {isLocked ? <Lock size={18} /> : getLessonCategoryIcon(lesson.category)}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: '#4F46E5', textTransform: 'uppercase' }}>
                              Lesson {lesson.lessonNumber} &bull; {lesson.category.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 11, color: '#64748B' }}>
                              {lesson.exercises.length} Interactive Exercises
                            </span>
                          </div>
                          <h4 style={{ fontSize: 15, fontWeight: 900, color: isLocked ? '#64748B' : '#0F172A', margin: '0 0 2px 0' }}>
                            {lesson.title}
                          </h4>
                          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {isCompleted ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              padding: '5px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            <Check size={14} strokeWidth={3} /> Passed
                          </span>
                        ) : !isLocked ? (
                          <button
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: 8,
                              fontSize: 12.5,
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            <span>Start Lesson</span>
                            <ArrowRight size={13} />
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Lock size={13} /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ================= MULTI-TYPE INTERACTIVE EXERCISE MODAL ================= */}
        {activeLesson && currentExercise && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: 20,
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                maxWidth: 620,
                width: '100%',
                padding: 28,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Modal Top Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{activeLanguage.flag}</span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {activeLesson.title}
                    </h3>
                    <span style={{ fontSize: 11.5, color: '#64748B' }}>
                      Exercise {currentExIdx + 1} of {activeLesson.exercises.length} &bull; Type: {currentExercise.type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveLesson(null)}
                  style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {!isLessonFinished ? (
                <div>
                  {/* Prompt & Instruction */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', marginBottom: 2 }}>
                      {currentExercise.instruction}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', lineHeight: 1.4 }}>
                      {currentExercise.prompt}
                    </div>
                  </div>

                  {/* ---------------- 1. MULTIPLE CHOICE RENDERER ---------------- */}
                  {currentExercise.type === 'multiple_choice' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {currentExercise.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        const isCorrect = optIdx === currentExercise.correctIndex;
                        let bg = '#F8FAFC';
                        let border = '1px solid #CBD5E1';

                        if (isAnswerSubmitted) {
                          if (isCorrect) {
                            bg = '#ECFDF5';
                            border = '2px solid #10B981';
                          } else if (isSelected && !isCorrect) {
                            bg = '#FEF2F2';
                            border = '2px solid #EF4444';
                          }
                        } else if (isSelected) {
                          bg = '#EEF2FF';
                          border = '2px solid #4F46E5';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswerSubmitted}
                            onClick={() => setUserAnswer(optIdx)}
                            style={{
                              padding: '12px 16px',
                              borderRadius: 10,
                              background: bg,
                              border,
                              textAlign: 'left',
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: '#1E293B',
                              cursor: isAnswerSubmitted ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>{opt}</span>
                            {currentExercise.audioText && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playAudioPronunciation(opt, currentExercise.audioLang || 'de-DE');
                                }}
                                style={{ background: 'transparent', border: 'none', color: '#4F46E5', cursor: 'pointer', padding: 4 }}
                                title="Listen"
                              >
                                <Volume2 size={16} />
                              </button>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ---------------- 2. TRANSLATION RENDERER ---------------- */}
                  {currentExercise.type === 'translation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ background: '#F1F5F9', padding: '12px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#334155' }}>
                        Source: "{currentExercise.sourcePhrase}"
                      </div>
                      <input
                        type="text"
                        disabled={isAnswerSubmitted}
                        value={userAnswer || ''}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your translation in the target language..."
                        style={{
                          padding: '12px 14px',
                          borderRadius: 8,
                          border: isAnswerSubmitted
                            ? exerciseFeedback?.isCorrect
                              ? '2px solid #10B981'
                              : '2px solid #EF4444'
                            : '1.5px solid #CBD5E1',
                          fontSize: 14,
                          fontWeight: 600,
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* ---------------- 3. FILL IN THE BLANK RENDERER ---------------- */}
                  {currentExercise.type === 'fill_in_the_blank' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ background: '#F1F5F9', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.5 }}>
                        {currentExercise.sentenceWithBlank.replace('[blank]', '_______')}
                      </div>

                      {currentExercise.options && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {currentExercise.options.map((opt, i) => (
                            <button
                              key={i}
                              disabled={isAnswerSubmitted}
                              onClick={() => setUserAnswer(opt)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: userAnswer === opt ? '2px solid #4F46E5' : '1px solid #CBD5E1',
                                background: userAnswer === opt ? '#EEF2FF' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: 'pointer',
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      <input
                        type="text"
                        disabled={isAnswerSubmitted}
                        value={userAnswer || ''}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter missing word..."
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1.5px solid #CBD5E1',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  )}

                  {/* ---------------- 4. WORD ORDERING RENDERER ---------------- */}
                  {currentExercise.type === 'word_ordering' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {/* Selected Words Tray */}
                      <div
                        style={{
                          minHeight: 50,
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: '2px dashed #4F46E5',
                          background: '#EEF2FF',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        {Array.isArray(userAnswer) && userAnswer.length > 0 ? (
                          userAnswer.map((w, idx) => (
                            <button
                              key={idx}
                              disabled={isAnswerSubmitted}
                              onClick={() => handleToggleWordChip(w, true)}
                              style={{
                                background: '#4F46E5',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {w} &times;
                            </button>
                          ))
                        ) : (
                          <span style={{ fontSize: 13, color: '#6366F1' }}>
                            Click chips below in grammatical order to form the sentence...
                          </span>
                        )}
                      </div>

                      {/* Scrambled Word Pool */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {currentExercise.words.map((w, idx) => {
                          const countInPool = currentExercise.words.filter((x) => x === w).length;
                          const countInSelected = Array.isArray(userAnswer) ? userAnswer.filter((x) => x === w).length : 0;
                          const isFullyUsed = countInSelected >= countInPool;

                          return (
                            <button
                              key={idx}
                              disabled={isAnswerSubmitted || isFullyUsed}
                              onClick={() => handleToggleWordChip(w, false)}
                              style={{
                                background: isFullyUsed ? '#E2E8F0' : '#FFFFFF',
                                color: isFullyUsed ? '#94A3B8' : '#0F172A',
                                border: '1px solid #CBD5E1',
                                padding: '8px 14px',
                                borderRadius: 8,
                                fontSize: 13.5,
                                fontWeight: 700,
                                cursor: isFullyUsed ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {w}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ---------------- 5. MATCHING RENDERER ---------------- */}
                  {currentExercise.type === 'matching' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>GERMAN TERMS</span>
                        {currentExercise.pairs.map((p, idx) => {
                          const isSelected = matchingSelectedTerm === p.term;
                          const isPaired = Boolean(matchingPairs[p.term]);
                          return (
                            <button
                              key={idx}
                              disabled={isAnswerSubmitted}
                              onClick={() => handleSelectMatchingTerm(p.term)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: isSelected ? '2px solid #4F46E5' : isPaired ? '1.5px solid #10B981' : '1px solid #CBD5E1',
                                background: isSelected ? '#EEF2FF' : isPaired ? '#ECFDF5' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 13,
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              {p.term} {isPaired ? `→ ${matchingPairs[p.term]}` : ''}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>ENGLISH DEFINITIONS</span>
                        {currentExercise.pairs.map((p, idx) => {
                          return (
                            <button
                              key={idx}
                              disabled={isAnswerSubmitted}
                              onClick={() => handleSelectMatchingDefinition(p.match)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 13,
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              {p.match}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ---------------- 6. LISTENING RENDERER ---------------- */}
                  {currentExercise.type === 'listening' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => playAudioPronunciation(currentExercise.audioText, currentExercise.audioLang || 'de-DE')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '14px 20px',
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        <Headphones size={18} />
                        <span>Click to Listen Audio</span>
                      </button>

                      <input
                        type="text"
                        disabled={isAnswerSubmitted}
                        value={userAnswer || ''}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type what you heard..."
                        style={{
                          padding: '12px 14px',
                          borderRadius: 8,
                          border: '1.5px solid #CBD5E1',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  )}

                  {/* Feedback Report */}
                  {isAnswerSubmitted && exerciseFeedback && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: 12,
                        borderRadius: 8,
                        background: exerciseFeedback.isCorrect ? '#ECFDF5' : '#FEF2F2',
                        border: exerciseFeedback.isCorrect ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        fontSize: 13,
                        color: '#1E293B',
                      }}
                    >
                      {exerciseFeedback.feedback}
                    </div>
                  )}

                  {/* Action Controls */}
                  <div style={{ marginTop: 20 }}>
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '12px 0',
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextExercise}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '12px 0',
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Continue &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Lesson Finish Summary */
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 999,
                      background: correctCount >= Math.ceil(activeLesson.exercises.length * 0.7) ? '#ECFDF5' : '#FEF2F2',
                      border: correctCount >= Math.ceil(activeLesson.exercises.length * 0.7) ? '2px solid #10B981' : '2px solid #EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                    }}
                  >
                    <Award size={36} color={correctCount >= Math.ceil(activeLesson.exercises.length * 0.7) ? '#059669' : '#DC2626'} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
                    {correctCount >= Math.ceil(activeLesson.exercises.length * 0.7) ? 'Lesson Passed! 🎉' : 'Lesson Incomplete'}
                  </h3>
                  <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 16px 0' }}>
                    Score: {correctCount}/{activeLesson.exercises.length} ({Math.round((correctCount / activeLesson.exercises.length) * 100)}%)
                    {correctCount >= Math.ceil(activeLesson.exercises.length * 0.7)
                      ? ' — Prerequisite unlocked for the next lesson!'
                      : ' — Please review the exercises and retry to unlock the next milestone.'}
                  </p>
                  <button
                    onClick={() => setActiveLesson(null)}
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 28px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Back to Curriculum
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunicationPage;
