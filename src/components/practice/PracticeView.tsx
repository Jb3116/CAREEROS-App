import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  FileCode,
  Zap,
  Flame,
  Search,
  Check,
  Award,
  TrendingUp,
  BrainCircuit,
  Filter,
  BarChart2,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  HelpCircle,
  RefreshCw,
  Trophy,
  ExternalLink,
  Video,
  PlayCircle,
} from 'lucide-react';
import { PRACTICE_CODING_QUESTION_BANK, PRACTICE_APTITUDE_QUESTION_BANK } from '../../data/practiceQuestions';
import { type CodingQuestion, type AptitudeQuestion } from '../../data/assessmentQuestions';
import { getContextualYouTubeVideos, YouTubeVideoItem } from '../../data/youtubeResources';
import { StreakCalendar } from '../common/StreakCalendar';
import { emitAppEvent } from '../../utils/appEvents';
import { useStudentProfile } from '../../utils/userProfile';
import { evaluateCodingSubmissionReward, getDifficultyPoints } from '../../utils/rewardCalculator';

interface ProblemItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  company: string;
  accuracy: string;
  solved: boolean;
  matchScore: number;
  question: CodingQuestion;
}

export const PracticeView: React.FC = () => {
  const navigate = useNavigate();
  const studentProfile = useStudentProfile();
  const [activeMode, setActiveMode] = useState<'coding' | 'aptitude' | 'analytics'>('coding');

  // ---------------- 1. Coding Practice State ----------------
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp' | 'java' | 'javascript' | 'css'>('python');
  const [activeProblemId, setActiveProblemId] = useState<string>(PRACTICE_CODING_QUESTION_BANK[0]?.id || 'prac-code-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);
  const [executionResult, setExecutionResult] = useState<{
    status: 'passed' | 'failed' | 'syntax_error' | 'runtime_error' | 'incomplete' | 'error';
    overallState: 'pass' | 'fail' | 'error';
    passedCount: number;
    totalCount: number;
    time: string;
    memory: string;
    stdout: string;
    stderr: string;
    error: string | null;
    testResults: Array<{
      testCase: number;
      isHidden: boolean;
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      error?: string;
    }>;
    mentorFeedback: string;
    learningHint: string;
    primarySkill?: string;
    reward?: any;
  } | null>(null);

  // Filtered Question Bank strictly swapped by Difficulty Filter
  const activeQuestionBank: CodingQuestion[] = useMemo(() => {
    let pool = PRACTICE_CODING_QUESTION_BANK;
    if (difficultyFilter !== 'all') {
      pool = PRACTICE_CODING_QUESTION_BANK.filter((q) => q.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.constraints.some((c) => c.toLowerCase().includes(q))
      );
    }
    return pool.length > 0 ? pool : PRACTICE_CODING_QUESTION_BANK;
  }, [difficultyFilter, searchQuery]);

  // Ensure active problem stays valid within the active question bank
  useEffect(() => {
    const isPresent = activeQuestionBank.some((q) => q.id === activeProblemId);
    if (!isPresent && activeQuestionBank.length > 0) {
      setActiveProblemId(activeQuestionBank[0].id);
    }
  }, [activeQuestionBank, activeProblemId]);

  const activeProblem = activeQuestionBank.find((q) => q.id === activeProblemId) || activeQuestionBank[0] || PRACTICE_CODING_QUESTION_BANK[0];
  const activeProblemIndex = Math.max(0, activeQuestionBank.findIndex((q) => q.id === activeProblem.id));

  const [code, setCode] = useState<string>(
    activeProblem.starterTemplates[selectedLang] || activeProblem.starterTemplates.python
  );

  // ---------------- 2. Aptitude Practice Scaling State ----------------
  const [aptitudeCategoryFilter, setAptitudeCategoryFilter] = useState<string>('all');
  const [aptitudeDifficultyFilter, setAptitudeDifficultyFilter] = useState<string>('all');
  const [aptitudeCountSetting, setAptitudeCountSetting] = useState<number>(10);
  const [aptitudeCurrentIndex, setAptitudeCurrentIndex] = useState<number>(0);
  const [userAptitudeAnswers, setUserAptitudeAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [isAptitudeSubmitted, setIsAptitudeSubmitted] = useState<boolean>(false);
  const [aptitudeSessionId, setAptitudeSessionId] = useState<number>(1);

  // Filter and sample aptitude questions based on controls
  const currentAptitudePool: AptitudeQuestion[] = useMemo(() => {
    let pool = PRACTICE_APTITUDE_QUESTION_BANK.filter((q: AptitudeQuestion) => {
      const matchCat = aptitudeCategoryFilter === 'all' || q.category === aptitudeCategoryFilter;
      const matchDiff = aptitudeDifficultyFilter === 'all' || q.difficulty === aptitudeDifficultyFilter;
      return matchCat && matchDiff;
    });

    if (pool.length === 0) pool = PRACTICE_APTITUDE_QUESTION_BANK;
    return pool.slice(0, aptitudeCountSetting);
  }, [aptitudeCategoryFilter, aptitudeDifficultyFilter, aptitudeCountSetting, aptitudeSessionId]);

  const activeAptitudeQuestion = currentAptitudePool[aptitudeCurrentIndex] || currentAptitudePool[0];

  const handleStartNewAptitudeSession = () => {
    setUserAptitudeAnswers({});
    setShowExplanation({});
    setIsAptitudeSubmitted(false);
    setAptitudeCurrentIndex(0);
    setAptitudeSessionId((prev) => prev + 1);
  };

  const handleSelectAptitudeOption = (qId: string, optIdx: number) => {
    if (isAptitudeSubmitted) return;
    setUserAptitudeAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const aptitudeScoreStats = useMemo(() => {
    let correct = 0;
    let answered = 0;
    currentAptitudePool.forEach((q) => {
      const userAns = userAptitudeAnswers[q.id];
      if (userAns !== undefined) {
        answered++;
        if (userAns === q.correctAnswer) correct++;
      }
    });
    const total = currentAptitudePool.length;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { correct, answered, total, accuracy };
  }, [currentAptitudePool, userAptitudeAnswers]);

  // Similar Problems algorithm (finds 3-4 problems with matching category or difficulty)
  const similarProblems: CodingQuestion[] = useMemo(() => {
    return PRACTICE_CODING_QUESTION_BANK.filter(
      (q: CodingQuestion) => q.id !== activeProblem.id && (q.category === activeProblem.category || q.difficulty === activeProblem.difficulty)
    ).slice(0, 4);
  }, [activeProblem]);

  // Contextual YouTube Video Tutorials matching problem category/topics
  const contextualVideos: YouTubeVideoItem[] = useMemo(() => {
    try {
      return getContextualYouTubeVideos(activeProblem);
    } catch (e) {
      console.warn('Error loading contextual YouTube videos:', e);
      return [];
    }
  }, [activeProblem]);

  // Trigger loading state transition when active problem changes
  useEffect(() => {
    setIsLoadingVideos(true);
    const timer = setTimeout(() => {
      setIsLoadingVideos(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [activeProblemId]);

  const problems: ProblemItem[] = activeQuestionBank.map((q, idx) => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    topics: [q.category, ...(q.constraints.slice(0, 1))],
    company: idx % 3 === 0 ? 'Google / Goldman Sachs' : idx % 3 === 1 ? 'Amazon / Microsoft' : 'Uber / Meta',
    accuracy: `${(50 + (idx * 3) % 40).toFixed(1)}%`,
    solved: idx === 0,
    matchScore: 95 - (idx * 2) % 20,
    question: q,
  }));

  // Sync starter code when active problem or language changes
  useEffect(() => {
    const template = activeProblem.starterTemplates[selectedLang] || activeProblem.starterTemplates.python;
    setCode(template);
    setExecutionResult(null);
    setActiveTestTab(0);
  }, [activeProblemId, selectedLang]);

  const handleLanguageChange = (newLang: 'python' | 'cpp' | 'java' | 'javascript' | 'css') => {
    setSelectedLang(newLang);
  };

  const getFileName = () => {
    switch (selectedLang) {
      case 'python':
        return 'solution.py';
      case 'cpp':
        return 'solution.cpp';
      case 'java':
        return 'Solution.java';
      case 'javascript':
        return 'solution.js';
      case 'css':
        return 'styles.css';
      default:
        return 'solution.txt';
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/ai/code-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 's123',
          language: selectedLang,
          problem: activeProblem.title,
          code,
          test_cases: activeProblem.testCases,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        const analysis = data.analysis;
        const isCorrect = Boolean(analysis.is_correct);
        const status = analysis.execution_status || (isCorrect ? 'passed' : 'failed');

        let overallState: 'pass' | 'fail' | 'error' = 'fail';
        if (isCorrect && status === 'passed') {
          overallState = 'pass';
          emitAppEvent('problemSolved', {
            id: activeProblem.id,
            skill: activeProblem.category || 'Algorithms',
          });
        } else if (status === 'syntax_error' || status === 'runtime_error' || status === 'incomplete' || status === 'error') {
          overallState = 'error';
        }

        const reward = evaluateCodingSubmissionReward({
          difficulty: activeProblem.difficulty,
          isCorrect,
          testCasesPassed: analysis.test_cases_passed || (isCorrect ? activeProblem.testCases.length : 0),
          totalTestCases: analysis.total_test_cases || activeProblem.testCases.length,
          executionStatus: status,
        });

        const formattedResults = (analysis.test_results || []).map((tr: any, i: number) => {
          const isHidden = Boolean(tr.isHidden || (activeProblem.testCases.length > 2 && i >= activeProblem.testCases.length - 1));
          const actualStr = String(tr.actual || '').trim();
          const expectedStr = String(tr.expected || '').trim();
          const passed = Boolean(tr.passed || actualStr === expectedStr);

          return {
            testCase: tr.testCase || i + 1,
            isHidden,
            input: isHidden ? '[Hidden Testcase Input]' : tr.input || activeProblem.testCases[i]?.input || 'N/A',
            expected: isHidden ? '[Hidden Expected Output]' : expectedStr || String(activeProblem.testCases[i]?.expected),
            actual: isHidden ? (passed ? 'Passed Validation' : 'Output Mismatch') : actualStr || (passed ? expectedStr : 'No output'),
            passed,
            error: tr.error,
          };
        });

        setExecutionResult({
          status,
          overallState,
          passedCount: analysis.test_cases_passed || (isCorrect ? activeProblem.testCases.length : 0),
          totalCount: analysis.total_test_cases || activeProblem.testCases.length,
          time: `${analysis.execution_time_ms || 2.4} ms (${analysis.time_complexity || 'O(N)'})`,
          memory: `${analysis.space_complexity || 'O(1)'} Space Complexity`,
          stdout: analysis.stdout || '',
          stderr: analysis.stderr || analysis.error || '',
          error: analysis.error || null,
          testResults: formattedResults,
          mentorFeedback: analysis.mentor_feedback || '',
          learningHint: analysis.learning_hint || '',
          primarySkill: analysis.primary_dkt_skill,
          reward,
        });
      }
    } catch (err: any) {
      setExecutionResult({
        status: 'error',
        overallState: 'error',
        passedCount: 0,
        totalCount: activeProblem.testCases.length,
        time: '0 ms',
        memory: '0 MB',
        stdout: '',
        stderr: err.message || 'Execution environment unavailable',
        error: err.message,
        testResults: [],
        mentorFeedback: 'Execution failed due to network or environment error.',
        learningHint: 'Check your syntax and try running the code again.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="practice-page-container">
      {/* ---------------- Top Duolingo-Style Streak Calendar Widget ---------------- */}
      <StreakCalendar streakDays={studentProfile.streakDays} onOpenPractice={() => setActiveMode('coding')} />

      {/* ---------------- Mode Switcher Tabs ---------------- */}
      <div className="practice-mode-tabs" style={{ marginTop: 16 }}>
        {[
          { id: 'coding', label: '💻 Coding Arena (DSA 2-Panel Workspace)', icon: Code2 },
          { id: 'aptitude', label: '⚡ Quantitative & Logical Aptitude (10-Q Mock)', icon: Zap },
          { id: 'analytics', label: '📊 DKT Performance Radar', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              className={`practice-mode-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => setActiveMode(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          MODE 1: CODING ARENA (2-PANEL REDESIGNED WORKSPACE)
          Left: Scrollable Problem Statement + Similar Problems Cards
          Right: Compact Code Workspace + Execution Stdout/Stderr Console
         ========================================================================= */}
      {activeMode === 'coding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Problem Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 440 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search DSA problems (e.g. Two Sum, Tree, Google, DP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 14px 0 36px',
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1E293B',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['all', 'easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: difficultyFilter === diff ? '1.5px solid #4F46E5' : '1px solid #CBD5E1',
                    background: difficultyFilter === diff ? '#EEF2FF' : '#FFFFFF',
                    color: difficultyFilter === diff ? '#4F46E5' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Panel Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(340px, 440px) 1fr',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {/* ---------------- LEFT COLUMN: SCROLLABLE PROBLEM & SIMILAR PROBLEMS ---------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Problem Description Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  padding: 20,
                  maxHeight: 'calc(100vh - 260px)',
                  overflowY: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: 999,
                        background:
                          activeProblem.difficulty === 'Easy'
                            ? '#ECFDF5'
                            : activeProblem.difficulty === 'Medium'
                            ? '#FFFBEB'
                            : '#FEF2F2',
                        color:
                          activeProblem.difficulty === 'Easy'
                            ? '#059669'
                            : activeProblem.difficulty === 'Medium'
                            ? '#D97706'
                            : '#DC2626',
                        border:
                          activeProblem.difficulty === 'Easy'
                            ? '1px solid #A7F3D0'
                            : activeProblem.difficulty === 'Medium'
                            ? '1px solid #FDE68A'
                            : '1px solid #FECACA',
                      }}
                    >
                      {activeProblem.difficulty}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>
                      {activeProblem.category}
                    </span>
                  </div>

                  {/* Problem Position & Prev/Next Switcher */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                      Problem {activeProblemIndex + 1} of {activeQuestionBank.length}
                    </span>
                    <button
                      onClick={() => {
                        const prevIdx = activeProblemIndex > 0 ? activeProblemIndex - 1 : activeQuestionBank.length - 1;
                        setActiveProblemId(activeQuestionBank[prevIdx].id);
                      }}
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid #CBD5E1',
                        background: '#F8FAFC',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      title="Previous Problem"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => {
                        const nextIdx = (activeProblemIndex + 1) % activeQuestionBank.length;
                        setActiveProblemId(activeQuestionBank[nextIdx].id);
                      }}
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid #CBD5E1',
                        background: '#F8FAFC',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      title="Next Problem"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>
                  {activeProblem.title}
                </h2>

                <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {activeProblem.description}
                </p>

                {/* Examples */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Examples:
                  </div>
                  {activeProblem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#F8FAFC',
                        borderRadius: 8,
                        padding: '10px 12px',
                        border: '1px solid #E2E8F0',
                        fontSize: 12.5,
                        fontFamily: 'monospace',
                      }}
                    >
                      <div style={{ color: '#0F172A', marginBottom: 4 }}>
                        <strong>Input:</strong> {ex.input}
                      </div>
                      <div style={{ color: '#059669', marginBottom: ex.explanation ? 4 : 0 }}>
                        <strong>Output:</strong> {ex.output}
                      </div>
                      {ex.explanation && (
                        <div style={{ color: '#64748B', fontFamily: 'inherit', fontSize: 12 }}>
                          <em>Explanation: {ex.explanation}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                    Constraints:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#64748B', lineHeight: 1.6 }}>
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* 3-5 SIMILAR PROBLEMS CARDS */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', marginBottom: 10 }}>
                    <Layers size={14} /> Similar Placement Problems ({similarProblems.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {similarProblems.map((sp) => (
                      <div
                        key={sp.id}
                        onClick={() => setActiveProblemId(sp.id)}
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 120ms ease',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{sp.title}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{sp.category}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: sp.difficulty === 'Easy' ? '#059669' : sp.difficulty === 'Medium' ? '#D97706' : '#DC2626',
                            }}
                          >
                            {sp.difficulty}
                          </span>
                          <ChevronRight size={14} color="#94A3B8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTEXTUAL YOUTUBE LEARNING RESOURCES */}
                {contextualVideos.length > 0 && (
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                        <Video size={15} color="#DC2626" /> Recommended YouTube Solutions:
                      </div>
                      <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600 }}>{activeProblem.category}</span>
                    </div>

                    {isLoadingVideos ? (
                      <div style={{ padding: '16px 0', textAlign: 'center', color: '#64748B', fontSize: 12 }}>
                        <Sparkles size={16} style={{ animation: 'spin 1.5s linear infinite', color: '#DC2626', marginBottom: 4 }} />
                        <div>Matching contextual tutorials for {activeProblem.category}...</div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {contextualVideos.map((video) => (
                        <div
                          key={video.id}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 10,
                            padding: '10px 12px',
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                          }}
                        >
                          {/* Thumbnail */}
                          <div
                            style={{
                              position: 'relative',
                              width: 80,
                              height: 48,
                              borderRadius: 6,
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: '#0F172A',
                            }}
                          >
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 2,
                                right: 3,
                                background: 'rgba(0,0,0,0.8)',
                                color: '#FFFFFF',
                                fontSize: 9.5,
                                fontWeight: 700,
                                padding: '1px 4px',
                                borderRadius: 3,
                              }}
                            >
                              {video.duration}
                            </div>
                          </div>

                          {/* Info & Watch Link */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                fontSize: 12.5,
                                fontWeight: 800,
                                color: '#0F172A',
                                margin: '0 0 2px 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={video.title}
                            >
                              {video.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                                {video.channel}
                              </span>
                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: '#DC2626',
                                  textDecoration: 'none',
                                  background: '#FEF2F2',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  border: '1px solid #FECACA',
                                }}
                              >
                                <span>Watch ↗</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

            {/* ---------------- RIGHT COLUMN: CODE WORKSPACE & CONSOLE RESULTS ---------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Code Editor Box */}
              <div className="practice-editor-box" style={{ margin: 0 }}>
                {/* Header Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileCode size={16} color="#818CF8" />
                    <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 700 }}>
                      {getFileName()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Compact Language Selector */}
                    <select
                      value={selectedLang}
                      onChange={(e) => handleLanguageChange(e.target.value as any)}
                      style={{
                        background: '#1E293B',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        padding: '5px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      aria-label="Select Programming Language"
                    >
                      <option value="python">Python 3.12</option>
                      <option value="javascript">JavaScript (ES2024)</option>
                      <option value="java">Java 21</option>
                      <option value="cpp">C++ (GCC 14)</option>
                      <option value="css">CSS3</option>
                    </select>

                    <button
                      onClick={() => setCode(activeProblem.starterTemplates[selectedLang] || activeProblem.starterTemplates.python)}
                      title="Reset starter template"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#94A3B8',
                        padding: '5px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <RotateCcw size={13} />
                    </button>

                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                        color: '#FFFFFF',
                        padding: '6px 16px',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: 12.5,
                        border: 'none',
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
                      }}
                    >
                      <Play size={13} fill="#FFFFFF" />
                      <span>{isRunning ? 'Executing...' : 'Run / Submit Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Editor Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="practice-editor-textarea"
                  style={{ minHeight: 340 }}
                  placeholder={`Write your ${selectedLang.toUpperCase()} solution here...`}
                  spellCheck={false}
                />
              </div>

              {/* Execution Console Results Directly Below Editor */}
              {executionResult && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border:
                      executionResult.overallState === 'pass'
                        ? '1.5px solid #10B981'
                        : executionResult.overallState === 'fail'
                        ? '1.5px solid #EF4444'
                        : '1.5px solid #F59E0B',
                    borderRadius: 14,
                    padding: 16,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                    animation: 'fadeIn 150ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {/* Status Banner */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color:
                          executionResult.overallState === 'pass'
                            ? '#059669'
                            : executionResult.overallState === 'fail'
                            ? '#DC2626'
                            : '#D97706',
                        fontWeight: 900,
                        fontSize: 14.5,
                      }}
                    >
                      {executionResult.overallState === 'pass' ? (
                        <CheckCircle2 size={18} color="#059669" />
                      ) : executionResult.overallState === 'fail' ? (
                        <XCircle size={18} color="#DC2626" />
                      ) : (
                        <AlertTriangle size={18} color="#D97706" />
                      )}
                      <span>
                        {executionResult.overallState === 'pass'
                          ? `Accepted • All ${executionResult.passedCount}/${executionResult.totalCount} Testcases Passed`
                          : executionResult.overallState === 'fail'
                          ? `Wrong Answer • ${executionResult.passedCount}/${executionResult.totalCount} Passed`
                          : `Compilation / Execution ${executionResult.status.toUpperCase()}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {executionResult.reward && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: executionResult.reward.isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.08)',
                            border: executionResult.reward.isPassed ? '1px solid #10B981' : '1px solid #FCA5A5',
                            color: executionResult.reward.isPassed ? '#059669' : '#DC2626',
                            borderRadius: 8,
                            padding: '4px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          <Trophy size={13} />
                          <span>
                            {executionResult.reward.isPassed
                              ? `+${executionResult.reward.pointsAwarded} XP (${executionResult.reward.difficulty})`
                              : '0 XP • Retry Allowed'}
                          </span>
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                        Runtime: <strong>{executionResult.time}</strong> • <strong>{executionResult.memory}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Standard Output / Stderr Console */}
                  {(executionResult.stdout || executionResult.stderr) && (
                    <div style={{ background: '#0F172A', borderRadius: 8, padding: 10, color: '#E2E8F0', fontFamily: 'monospace', fontSize: 12 }}>
                      <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Terminal size={12} /> Standard Output & Compiler Logs
                      </div>
                      {executionResult.stdout && <pre style={{ margin: 0, color: '#38BDF8', whiteSpace: 'pre-wrap' }}>{executionResult.stdout}</pre>}
                      {executionResult.stderr && <pre style={{ margin: '4px 0 0 0', color: '#F87171', whiteSpace: 'pre-wrap' }}>{executionResult.stderr}</pre>}
                    </div>
                  )}

                  {/* Test Cases Tab Switcher (Visible vs Hidden) */}
                  {executionResult.testResults.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        {executionResult.testResults.map((tr, idx) => {
                          const isSelected = activeTestTab === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setActiveTestTab(idx)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 10px',
                                borderRadius: 6,
                                fontSize: 11.5,
                                fontWeight: 700,
                                border: isSelected ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                                background: isSelected ? '#EEF2FF' : '#F8FAFC',
                                color: tr.passed ? '#059669' : '#DC2626',
                                cursor: 'pointer',
                              }}
                            >
                              {tr.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                              <span>
                                Case {idx + 1} {tr.isHidden && '(Hidden)'}
                              </span>
                              {tr.isHidden ? <EyeOff size={11} color="#94A3B8" /> : <Eye size={11} color="#94A3B8" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Test Case Details */}
                      {executionResult.testResults[activeTestTab] && (
                        <div
                          style={{
                            background: '#F8FAFC',
                            borderRadius: 8,
                            padding: 10,
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            fontSize: 12,
                            fontFamily: 'monospace',
                          }}
                        >
                          {executionResult.testResults[activeTestTab].isHidden ? (
                            <div style={{ color: '#475569' }}>
                              🔒 <strong>Hidden Testcase:</strong> Validates edge boundaries and asymptotic bounds without exposing test data.
                              <div style={{ marginTop: 4, color: executionResult.testResults[activeTestTab].passed ? '#059669' : '#DC2626', fontWeight: 800 }}>
                                Result: {executionResult.testResults[activeTestTab].passed ? '✓ PASSED' : '✗ FAILED'}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span style={{ color: '#64748B' }}>Input: </span>
                                <span style={{ color: '#0F172A', fontWeight: 700 }}>
                                  {executionResult.testResults[activeTestTab].input}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: '#64748B' }}>Expected Output: </span>
                                <span style={{ color: '#059669', fontWeight: 700 }}>
                                  {executionResult.testResults[activeTestTab].expected}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: '#64748B' }}>Actual Output: </span>
                                <span
                                  style={{
                                    color: executionResult.testResults[activeTestTab].passed ? '#059669' : '#DC2626',
                                    fontWeight: 700,
                                  }}
                                >
                                  {executionResult.testResults[activeTestTab].actual}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Socratic AI Mentor Code Reasoning */}
                  {executionResult.mentorFeedback && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(124, 58, 237, 0.06) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: 10,
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4F46E5', fontWeight: 800, fontSize: 12.5 }}>
                        <Sparkles size={14} />
                        <span>AI Mentor Feedback</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12.5, color: '#334155', lineHeight: 1.45 }}>
                        {executionResult.mentorFeedback}
                      </p>
                      {executionResult.learningHint && (
                        <div style={{ fontSize: 11.5, color: '#6366F1', fontWeight: 600, background: '#EEF2FF', padding: '4px 8px', borderRadius: 4 }}>
                          💡 <strong>Hint:</strong> {executionResult.learningHint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: APTITUDE PRACTICE SCALING (10-Q DYNAMIC SPRINT CONTROLS)
         ========================================================================= */}
      {activeMode === 'aptitude' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Controls Bar: Category, Difficulty, Question Count */}
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
              gap: 14,
            }}
          >
            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#475569' }}>Category:</span>
              <select
                value={aptitudeCategoryFilter}
                onChange={(e) => setAptitudeCategoryFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                }}
              >
                <option value="all">All Categories</option>
                <option value="Quantitative">Quantitative Aptitude</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Data Interpretation">Data Interpretation</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#475569' }}>Difficulty:</span>
              <select
                value={aptitudeDifficultyFilter}
                onChange={(e) => setAptitudeDifficultyFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                }}
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy (Round 1 Speed)</option>
                <option value="Medium">Medium (Benchmark)</option>
                <option value="Hard">Hard (Tier-1 Advanced)</option>
              </select>
            </div>

            {/* Question Count Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#475569' }}>Session Size:</span>
              {[5, 10, 15, 20].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => {
                    setAptitudeCountSetting(cnt);
                    handleStartNewAptitudeSession();
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    border: aptitudeCountSetting === cnt ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                    background: aptitudeCountSetting === cnt ? '#EEF2FF' : '#FFFFFF',
                    color: aptitudeCountSetting === cnt ? '#4F46E5' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>

            {/* Reset / New Session */}
            <button
              onClick={handleStartNewAptitudeSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>New Session</span>
            </button>
          </div>

          {/* Question Navigator Number Pills */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginRight: 4 }}>
              Questions ({currentAptitudePool.length}):
            </span>
            {currentAptitudePool.map((q, idx) => {
              const isAnswered = userAptitudeAnswers[q.id] !== undefined;
              const isCurrent = idx === aptitudeCurrentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setAptitudeCurrentIndex(idx)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: isCurrent
                      ? '2px solid #4F46E5'
                      : isAnswered
                      ? '1px solid #10B981'
                      : '1px solid #E2E8F0',
                    background: isCurrent
                      ? '#4F46E5'
                      : isAnswered
                      ? '#ECFDF5'
                      : '#F8FAFC',
                    color: isCurrent
                      ? '#FFFFFF'
                      : isAnswered
                      ? '#059669'
                      : '#64748B',
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Aptitude Question Card */}
          {activeAptitudeQuestion && (
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: '#D97706',
                      background: '#FFFBEB',
                      padding: '3px 9px',
                      borderRadius: 999,
                      border: '1px solid #FDE68A',
                    }}
                  >
                    {activeAptitudeQuestion.category}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: activeAptitudeQuestion.difficulty === 'Easy' ? '#059669' : '#DC2626',
                    }}
                  >
                    {activeAptitudeQuestion.difficulty}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>
                  Question {aptitudeCurrentIndex + 1} of {currentAptitudePool.length}
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.5, marginBottom: 18 }}>
                {activeAptitudeQuestion.question}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {activeAptitudeQuestion.options.map((opt, optIdx) => {
                  const isSelected = userAptitudeAnswers[activeAptitudeQuestion.id] === optIdx;
                  const isCorrect = isAptitudeSubmitted && optIdx === activeAptitudeQuestion.correctAnswer;
                  const isWrongSelected = isAptitudeSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAptitudeOption(activeAptitudeQuestion.id, optIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: isCorrect
                          ? '2px solid #10B981'
                          : isWrongSelected
                          ? '2px solid #EF4444'
                          : isSelected
                          ? '2px solid #4F46E5'
                          : '1px solid #E2E8F0',
                        background: isCorrect
                          ? '#ECFDF5'
                          : isWrongSelected
                          ? '#FEF2F2'
                          : isSelected
                          ? '#EEF2FF'
                          : '#F8FAFC',
                        cursor: isAptitudeSubmitted ? 'default' : 'pointer',
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: isCorrect
                          ? '#059669'
                          : isWrongSelected
                          ? '#DC2626'
                          : isSelected
                          ? '#4F46E5'
                          : '#1E293B',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            background: isSelected ? '#4F46E5' : '#E2E8F0',
                            color: isSelected ? '#FFFFFF' : '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSelected && <CheckCircle2 size={16} color="#4F46E5" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Navigation & Explanation Trigger */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 14, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    disabled={aptitudeCurrentIndex === 0}
                    onClick={() => setAptitudeCurrentIndex((prev) => Math.max(0, prev - 1))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: 700,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: aptitudeCurrentIndex === 0 ? '#94A3B8' : '#334155',
                      cursor: aptitudeCurrentIndex === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  {aptitudeCurrentIndex < currentAptitudePool.length - 1 ? (
                    <button
                      onClick={() => setAptitudeCurrentIndex((prev) => Math.min(currentAptitudePool.length - 1, prev + 1))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAptitudeSubmitted(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '8px 18px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Trophy size={14} /> Submit 10-Q Session
                    </button>
                  )}
                </div>

                <button
                  onClick={() =>
                    setShowExplanation((prev) => ({
                      ...prev,
                      [activeAptitudeQuestion.id]: !prev[activeAptitudeQuestion.id],
                    }))
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#B45309',
                    cursor: 'pointer',
                  }}
                >
                  <HelpCircle size={14} />
                  <span>{showExplanation[activeAptitudeQuestion.id] ? 'Hide Formula' : 'View Shortcut Formula'}</span>
                </button>
              </div>

              {/* Shortcut Formula Explanation Card */}
              {showExplanation[activeAptitudeQuestion.id] && (
                <div
                  style={{
                    marginTop: 14,
                    background: '#F8FAFC',
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    fontSize: 13,
                    color: '#334155',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                    💡 Step-by-Step Mathematical Explanation:
                  </div>
                  <div>{activeAptitudeQuestion.explanation}</div>
                </div>
              )}
            </div>
          )}

          {/* Session Scorecard Modal / Summary Card */}
          {isAptitudeSubmitted && (
            <div
              style={{
                background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                border: '1.5px solid #6366F1',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4F46E5', fontWeight: 800, fontSize: 13 }}>
                  <Trophy size={16} />
                  <span>Aptitude Practice Session Completed!</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0' }}>
                  Score: {aptitudeScoreStats.correct} / {aptitudeScoreStats.total} Correct ({aptitudeScoreStats.accuracy}% Accuracy)
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                  Great pace! You answered {aptitudeScoreStats.answered} questions. Review questions above or launch a fresh mock session.
                </p>
              </div>

              <button
                onClick={handleStartNewAptitudeSession}
                style={{
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <RefreshCw size={14} /> Start Fresh Sprint
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 3: PERFORMANCE RADAR
         ========================================================================= */}
      {activeMode === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              DKT Skill Mastery Breakdown
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px 0' }}>
              Real-time knowledge tracing calibrated against Google & Goldman Sachs campus hiring benchmarks.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { name: 'Trees & Graphs', score: 85, color: '#10B981' },
                { name: 'Dynamic Programming', score: 62, color: '#F59E0B' },
                { name: 'System Design', score: 70, color: '#6366F1' },
                { name: 'Operating Systems', score: 78, color: '#3B82F6' },
                { name: 'Quantitative Speed', score: 82, color: '#EC4899' },
                { name: 'Logical Reasoning', score: 88, color: '#8B5CF6' },
              ].map((s) => (
                <div key={s.name} style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeView;
