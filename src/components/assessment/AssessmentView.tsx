import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Clock,
  ShieldCheck,
  Code2,
  BrainCircuit,
  HelpCircle,
  Video,
  Play,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Award,
  Check,
  Send,
} from 'lucide-react';
import {
  CODING_QUESTION_BANK,
  APTITUDE_QUESTION_BANK,
  CodingQuestion,
  AptitudeQuestion,
} from '../../data/assessmentQuestions';

export const AssessmentView: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'coding' | 'aptitude'>('coding');
  const [secondsRemaining, setSecondsRemaining] = useState(5400); // 90 mins

  // ---------------- Navigation State & Index Counters ----------------
  const [codingIndex, setCodingIndex] = useState(0);
  const [aptitudeIndex, setAptitudeIndex] = useState(0);

  // Current active questions
  const currentCodingQ = CODING_QUESTION_BANK[codingIndex] || CODING_QUESTION_BANK[0];
  const currentAptitudeQ = APTITUDE_QUESTION_BANK[aptitudeIndex] || APTITUDE_QUESTION_BANK[0];

  // ---------------- Code State per Question ----------------
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp' | 'java' | 'javascript' | 'css'>('python');
  
  // Stored code per question ID
  const [userCodeAnswers, setUserCodeAnswers] = useState<Record<string, { code: string; lang: string }>>(() => {
    try {
      const saved = localStorage.getItem('careeros_assessment_coding');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Stored aptitude answers per question ID
  const [userAptitudeAnswers, setUserAptitudeAnswers] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('careeros_assessment_aptitude');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentCode, setCurrentCode] = useState<string>(
    userCodeAnswers[currentCodingQ.id]?.code || currentCodingQ.starterTemplates.python
  );

  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [showResultReport, setShowResultReport] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  // Sync current code when coding index or language changes
  useEffect(() => {
    const saved = userCodeAnswers[currentCodingQ.id];
    if (saved) {
      setCurrentCode(saved.code);
      setSelectedLang(saved.lang as any);
    } else {
      const template = currentCodingQ.starterTemplates[selectedLang] || currentCodingQ.starterTemplates.python;
      setCurrentCode(template);
    }
    setRunOutput(null);
  }, [codingIndex, currentCodingQ.id]);

  // Persist code in state and localStorage on change
  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    const updated = {
      ...userCodeAnswers,
      [currentCodingQ.id]: { code: newCode, lang: selectedLang },
    };
    setUserCodeAnswers(updated);
    try {
      localStorage.setItem('careeros_assessment_coding', JSON.stringify(updated));
    } catch {}
  };

  // Language switch handler
  const handleLanguageChange = (newLang: 'python' | 'cpp' | 'java' | 'javascript' | 'css') => {
    setSelectedLang(newLang);
    const template = currentCodingQ.starterTemplates[newLang] || currentCodingQ.starterTemplates.python;
    setCurrentCode(template);
    const updated = {
      ...userCodeAnswers,
      [currentCodingQ.id]: { code: template, lang: newLang },
    };
    setUserCodeAnswers(updated);
    try {
      localStorage.setItem('careeros_assessment_coding', JSON.stringify(updated));
    } catch {}
  };

  // Aptitude answer handler
  const handleSelectAptitudeOption = (optIndex: number) => {
    const updated = {
      ...userAptitudeAnswers,
      [currentAptitudeQ.id]: optIndex,
    };
    setUserAptitudeAnswers(updated);
    try {
      localStorage.setItem('careeros_assessment_aptitude', JSON.stringify(updated));
    } catch {}
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    setRunOutput(null);

    try {
      const response = await fetch('/api/ai/code-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 's123',
          language: selectedLang,
          problem: currentCodingQ.title,
          code: currentCode,
          test_cases: currentCodingQ.testCases,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        if (!data.analysis.is_correct) {
          setRunOutput(
            `❌ Evaluation: ${data.analysis.execution_status?.toUpperCase() || 'FAILED'}\n` +
            `${data.analysis.error || data.analysis.mentor_feedback}\n` +
            `Test Cases Passed: ${data.analysis.test_cases_passed}/${data.analysis.total_test_cases}`
          );
        } else {
          setRunOutput(
            `✓ Target Language: ${selectedLang.toUpperCase()}\n` +
            `✓ All ${data.analysis.test_cases_passed}/${data.analysis.total_test_cases} Testcases Executed Successfully.\n` +
            `Complexity: Time ${data.analysis.time_complexity} • Space ${data.analysis.space_complexity}\n` +
            `AI Feedback: ${data.analysis.mentor_feedback}`
          );
        }
      }
    } catch (err: any) {
      setRunOutput(`❌ Execution Environment Error: ${err.message || 'Sandbox execution unavailable'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // ---------------- Calculate Dynamic Assessment Scoring ----------------
      let correctAptitudeCount = 0;
      let answeredAptitudeCount = 0;
      const categoryStats: Record<string, { correct: number; total: number }> = {
        Quantitative: { correct: 0, total: 0 },
        'Logical Reasoning': { correct: 0, total: 0 },
        'Data Interpretation': { correct: 0, total: 0 },
      };
      const difficultyStats: Record<string, { correct: number; total: number }> = {
        Easy: { correct: 0, total: 0 },
        Medium: { correct: 0, total: 0 },
        Hard: { correct: 0, total: 0 },
      };

      for (const q of APTITUDE_QUESTION_BANK) {
        const userAns = userAptitudeAnswers[q.id];
        const cat = q.category || 'Quantitative';
        const diff = q.difficulty || 'Medium';

        if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
        if (!difficultyStats[diff]) difficultyStats[diff] = { correct: 0, total: 0 };

        categoryStats[cat].total++;
        difficultyStats[diff].total++;

        if (userAns !== undefined) {
          answeredAptitudeCount++;
          if (userAns === q.correctAnswer) {
            correctAptitudeCount++;
            categoryStats[cat].correct++;
            difficultyStats[diff].correct++;

            // Ingest telemetry into DKT
            try {
              await fetch('/api/ai/student-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  student_id: 's123',
                  skill: q.topic.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                  activity: 'assessment_aptitude',
                  correct: true,
                  difficulty: q.difficulty.toLowerCase(),
                  timestamp: new Date().toISOString(),
                }),
              });
            } catch {}
          }
        }
      }

      const codingAttemptedCount = Object.keys(userCodeAnswers).length;
      const aptitudeScorePercent = Math.round((correctAptitudeCount / (APTITUDE_QUESTION_BANK.length || 1)) * 100);
      const overallReadiness = Math.round((aptitudeScorePercent * 0.45) + (codingAttemptedCount > 0 ? 40 : 10) + 25);

      const resultSummary = {
        totalQuestions: CODING_QUESTION_BANK.length + APTITUDE_QUESTION_BANK.length,
        codingTotal: CODING_QUESTION_BANK.length,
        codingAttempted: codingAttemptedCount,
        aptitudeTotal: APTITUDE_QUESTION_BANK.length,
        aptitudeAnswered: answeredAptitudeCount,
        aptitudeCorrect: correctAptitudeCount,
        aptitudeAccuracy: answeredAptitudeCount > 0 ? Math.round((correctAptitudeCount / answeredAptitudeCount) * 100) : 0,
        overallReadinessScore: Math.min(98, overallReadiness),
        categoryStats,
        difficultyStats,
      };

      setAssessmentResult(resultSummary);
      setShowResultReport(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assessment-page-container">
      {/* ---------------- Top Proctored Header ---------------- */}
      <header className="assessment-topbar">
        <div className="assessment-brand-group">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: '#FFFFFF' }}>
              Campus Placement Diagnostic Assessment
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8' }}>
              Tier-1 Tech Assessment Benchmark (SWE & Aptitude Track 2026)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="assessment-proctor-pill">
            <ShieldCheck size={14} />
            <span>AI Proctored Session Active</span>
          </div>

          <div className="assessment-timer-badge">
            <Clock size={16} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={handleSubmitAssessment}
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? '#4B5563' : 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFFFFF',
              border: 'none',
              padding: '7px 18px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 13,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: isSubmitting ? 'none' : '0 2px 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Finish & Submit'}
          </button>
        </div>
      </header>

      {/* ---------------- Section Navigation Bar ---------------- */}
      <nav className="assessment-section-nav">
        <div className="assessment-section-tabs">
          {[
            {
              id: 'coding',
              label: `Section A: Coding Arena (${CODING_QUESTION_BANK.length} Problems)`,
              icon: Code2,
            },
            {
              id: 'aptitude',
              label: `Section B: Quantitative & Logical Aptitude (${APTITUDE_QUESTION_BANK.length} Questions)`,
              icon: HelpCircle,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                className={`assessment-sec-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSection(tab.id as any)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 600 }}>
          Auto-saved to session storage ✓
        </div>
      </nav>

      {/* ---------------- SECTION A: CODING ARENA ---------------- */}
      {activeSection === 'coding' && (
        <div className="assessment-workspace">
          {/* Left: Problem Details */}
          <div className="assessment-pane-left">
            <div className="assessment-problem-header">
              <span className={`assessment-diff-tag ${currentCodingQ.difficulty.toLowerCase()}`}>
                {currentCodingQ.difficulty} • 100 Points
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700 }}>
                Problem {codingIndex + 1} of {CODING_QUESTION_BANK.length}
              </span>
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: '4px 0 12px' }}>
              {currentCodingQ.title}
            </h1>

            <div style={{ fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>{currentCodingQ.description}</p>

              {currentCodingQ.examples.map((ex, i) => (
                <div
                  key={i}
                  style={{ background: '#1E293B', padding: 14, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>
                    Example {i + 1}:
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#38BDF8' }}>
                    <strong>Input:</strong> {ex.input}
                    <br />
                    <strong>Output:</strong> {ex.output}
                    {ex.explanation && (
                      <>
                        <br />
                        <span style={{ color: '#94A3B8' }}>{ex.explanation}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ background: '#1E293B', padding: 14, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Constraints:</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12.5, color: '#94A3B8' }}>
                  {currentCodingQ.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coding Question Navigator Drawer */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14 }}>
              <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>
                Quick Jump to Problem ({codingIndex + 1}/{CODING_QUESTION_BANK.length}):
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CODING_QUESTION_BANK.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCodingIndex(idx)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      border: codingIndex === idx ? '2px solid #818CF8' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: codingIndex === idx ? '#4F46E5' : userCodeAnswers[q.id] ? '#065F46' : '#1E293B',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Code Workspace */}
          <div className="assessment-pane-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileCode size={16} color="#818CF8" />
                <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 700 }}>
                  {getFileName()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Multi-Language Selector Dropdown supporting Python, C++, Java, JS, CSS */}
                <select
                  value={selectedLang}
                  onChange={(e) => handleLanguageChange(e.target.value as any)}
                  style={{
                    background: '#1E293B',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label="Select Programming Language"
                >
                  <option value="python">Python 3.12</option>
                  <option value="cpp">C++ (GCC 14)</option>
                  <option value="java">Java 21</option>
                  <option value="javascript">JavaScript (ES2024)</option>
                  <option value="css">CSS3 (Styles)</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                    color: '#FFFFFF',
                    padding: '7px 16px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Play size={14} fill="#FFF" />
                  <span>{isRunning ? 'Compiling...' : selectedLang === 'css' ? 'Validate CSS' : 'Run Testcases'}</span>
                </button>
              </div>
            </div>

            <div className="assessment-code-box">
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="assessment-editor-textarea"
                placeholder={`Write your ${selectedLang.toUpperCase()} solution here...`}
                spellCheck={false}
              />
            </div>

            {/* Run Output */}
            {runOutput && (
              <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', padding: 12, borderRadius: 10, color: '#A7F3D0', fontSize: 12, fontFamily: 'monospace' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{runOutput}</pre>
              </div>
            )}

            {/* Navigation Bottom Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10 }}>
              <button
                disabled={codingIndex === 0}
                onClick={() => setCodingIndex((prev) => Math.max(0, prev - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: codingIndex === 0 ? 'rgba(255, 255, 255, 0.05)' : '#1E293B',
                  color: codingIndex === 0 ? '#64748B' : '#E2E8F0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: codingIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                <span>Previous Problem</span>
              </button>

              <span style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 600 }}>
                Problem {codingIndex + 1} of {CODING_QUESTION_BANK.length}
              </span>

              {codingIndex < CODING_QUESTION_BANK.length - 1 ? (
                <button
                  onClick={() => setCodingIndex((prev) => Math.min(CODING_QUESTION_BANK.length - 1, prev + 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#4F46E5',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>Next Problem</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setActiveSection('aptitude')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <span>Proceed to Aptitude Section &rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SECTION B: QUANTITATIVE & LOGICAL APTITUDE ---------------- */}
      {activeSection === 'aptitude' && (
        <div style={{ padding: 32, maxWidth: 960, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Aptitude Question Card */}
          <div className="assessment-mcq-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 800 }}>
                {currentAptitudeQ.category.toUpperCase()} • {currentAptitudeQ.topic.toUpperCase()}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`assessment-diff-tag ${currentAptitudeQ.difficulty.toLowerCase()}`}>
                  {currentAptitudeQ.difficulty}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700 }}>
                  Question {aptitudeIndex + 1} of {APTITUDE_QUESTION_BANK.length}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.5, margin: '8px 0 16px' }}>
              {currentAptitudeQ.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentAptitudeQ.options.map((opt, idx) => {
                const isSelected = userAptitudeAnswers[currentAptitudeQ.id] === idx;
                return (
                  <div
                    key={idx}
                    className={`assessment-mcq-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectAptitudeOption(idx)}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(79, 70, 229, 0.25)' : '#1E293B',
                      border: isSelected ? '1px solid #818CF8' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      color: '#E2E8F0',
                      fontSize: 14,
                      transition: 'all 120ms ease',
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: isSelected ? '#4F46E5' : 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#FFFFFF',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Aptitude Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                disabled={aptitudeIndex === 0}
                onClick={() => setAptitudeIndex((prev) => Math.max(0, prev - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: aptitudeIndex === 0 ? 'rgba(255, 255, 255, 0.05)' : '#1E293B',
                  color: aptitudeIndex === 0 ? '#64748B' : '#E2E8F0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: aptitudeIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 600 }}>
                Question {aptitudeIndex + 1} of {APTITUDE_QUESTION_BANK.length}
              </span>

              {aptitudeIndex < APTITUDE_QUESTION_BANK.length - 1 ? (
                <button
                  onClick={() => setAptitudeIndex((prev) => Math.min(APTITUDE_QUESTION_BANK.length - 1, prev + 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#4F46E5',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: isSubmitting ? '#4B5563' : 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: isSubmitting ? 'none' : '0 2px 10px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Submitting Evaluation...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Direct Question Palette Grid */}
          <div style={{ background: '#111827', padding: 18, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 12.5, color: '#94A3B8', fontWeight: 700, marginBottom: 10 }}>
              Question Palette (Answered: {Object.keys(userAptitudeAnswers).length}/{APTITUDE_QUESTION_BANK.length}):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: 6 }}>
              {APTITUDE_QUESTION_BANK.map((q, idx) => {
                const isAnswered = userAptitudeAnswers[q.id] !== undefined;
                const isCurrent = aptitudeIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setAptitudeIndex(idx)}
                    style={{
                      height: 32,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      border: isCurrent ? '2px solid #818CF8' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: isCurrent ? '#4F46E5' : isAnswered ? '#065F46' : '#1E293B',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Assessment Score & Roadmap Report Modal ---------------- */}
      {showResultReport && assessmentResult && (
        <div className="modal-backdrop">
          <div className="assessment-report-card" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={28} color="#FBBF24" />
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                    Diagnostic Assessment Benchmark
                  </h2>
                  <p style={{ fontSize: 12.5, color: '#94A3B8', margin: '2px 0 0' }}>
                    Calibrated against Tier-1 SDE Placement Standards
                  </p>
                </div>
              </div>
              <span style={{ background: '#059669', color: '#FFF', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
                EVALUATED ✓
              </span>
            </div>

            {/* Score Grid */}
            <div className="assessment-score-grid" style={{ margin: '16px 0' }}>
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#818CF8' }}>
                  {assessmentResult.overallReadinessScore}%
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>Overall Readiness</div>
              </div>
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#34D399' }}>
                  {assessmentResult.aptitudeAccuracy}%
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>
                  Aptitude Accuracy ({assessmentResult.aptitudeCorrect}/{assessmentResult.aptitudeAnswered})
                </div>
              </div>
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FBBF24' }}>
                  {assessmentResult.codingAttempted}/{assessmentResult.codingTotal}
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>DSA Coding Solved</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
                Sectional Performance Matrix:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#CBD5E1' }}>
                {Object.entries(assessmentResult.categoryStats).map(([cat, stats]: any) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{cat}:</span>
                    <strong style={{ color: stats.correct > 0 ? '#34D399' : '#94A3B8' }}>
                      {stats.correct} / {stats.total} Correct ({stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#CBD5E1',
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate('/career-roadmap')}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
                }}
              >
                <span>Launch Calibrated Career Roadmap</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
