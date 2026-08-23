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
  Sparkles,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Award,
} from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'coding' | 'core' | 'aptitude' | 'interview'>('coding');
  const [secondsRemaining, setSecondsRemaining] = useState(5394); // 1 hr 29m 54s
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java' | 'typescript'>('cpp');
  
  // MCQ Answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({
    q1: 1, // B+ Trees
    q2: 2, // Mutex vs Semaphore
  });

  // Code state
  const [code, setCode] = useState(`/**
 * Problem: Binary Tree Maximum Path Sum
 * Language: C++ (GCC 14)
 */
class Solution {
private:
    int maxSum = INT_MIN;
    int maxGain(TreeNode* root) {
        if (!root) return 0;
        int leftGain = max(maxGain(root->left), 0);
        int rightGain = max(maxGain(root->right), 0);
        maxSum = max(maxSum, root->val + leftGain + rightGain);
        return root->val + max(leftGain, rightGain);
    }
public:
    int maxPathSum(TreeNode* root) {
        maxSum = INT_MIN;
        maxGain(root);
        return maxSum;
    }
};`);

  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [showResultReport, setShowResultReport] = useState(false);

  // Timer interval
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

  const handleRunCode = () => {
    setIsRunning(true);
    setRunOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setRunOutput('✓ Testcase 1 Passed [root = [1,2,3], Expected: 6, Got: 6]\n✓ Testcase 2 Passed [root = [-10,9,20,null,null,15,7], Expected: 42, Got: 42]\n\nAll Proctored Testcases Executed Successfully in 28ms.');
    }, 600);
  };

  const handleSubmitAssessment = () => {
    setShowResultReport(true);
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
              Tier-1 Tech Assessment Benchmark (SWE Track 2026)
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
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFFFFF',
              border: 'none',
              padding: '7px 18px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            Finish & Submit
          </button>
        </div>
      </header>

      {/* ---------------- Section Navigation Bar ---------------- */}
      <nav className="assessment-section-nav">
        <div className="assessment-section-tabs">
          {[
            { id: 'coding', label: 'Section A: Coding Arena (2 Problems)', icon: Code2 },
            { id: 'core', label: 'Section B: CS Core MCQs (10 Questions)', icon: BrainCircuit },
            { id: 'aptitude', label: 'Section C: Quantitative Aptitude (10 Questions)', icon: HelpCircle },
            { id: 'interview', label: 'Section D: STAR Behavioral Simulation', icon: Video },
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
          Auto-saved 20s ago ✓
        </div>
      </nav>

      {/* ---------------- Main Section Workspace ---------------- */}
      {activeSection === 'coding' && (
        <div className="assessment-workspace">
          {/* Left: Problem Details */}
          <div className="assessment-pane-left">
            <div className="assessment-problem-header">
              <span className="assessment-diff-tag hard">Hard • 100 Points</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>Problem 1 of 2</span>
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
              124. Binary Tree Maximum Path Sum
            </h1>

            <div style={{ fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.
              </p>
              <p>
                Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any non-empty path</em>.
              </p>

              <div style={{ background: '#1E293B', padding: 14, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Example 1:</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#38BDF8' }}>
                  Input: root = [1,2,3]<br />
                  Output: 6 (Optimal path is 2 -&gt; 1 -&gt; 3)
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: 14, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Constraints:</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12.5, color: '#94A3B8' }}>
                  <li>The number of nodes in the tree is in the range [1, 3 * 10^4].</li>
                  <li>-1000 &lt;= Node.val &lt;= 1000</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Code Workspace */}
          <div className="assessment-pane-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                style={{
                  background: '#1E293B',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <option value="cpp">C++ (GCC 14)</option>
                <option value="python">Python 3.12</option>
                <option value="java">Java 21</option>
                <option value="typescript">TypeScript 5.4</option>
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
                <span>{isRunning ? 'Compiling...' : 'Run Testcases'}</span>
              </button>
            </div>

            <div className="assessment-code-box">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="assessment-editor-textarea"
                spellCheck={false}
              />
            </div>

            {/* Run Output */}
            {runOutput && (
              <div style={{ background: '#064E3B', border: '1px solid #059669', padding: 12, borderRadius: 10, color: '#A7F3D0', fontSize: 12, fontFamily: 'monospace' }}>
                <pre style={{ margin: 0 }}>{runOutput}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section B: CS Core MCQs */}
      {activeSection === 'core' && (
        <div style={{ padding: 32, maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="assessment-mcq-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 800 }}>DATABASE SYSTEMS • QUESTION 1 OF 10</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>+4 / -1 Mark</span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
              Why do enterprise database storage engines use B+ Trees instead of Binary Search Trees for disk indexing?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'B+ Trees guarantee O(1) constant time lookups for all keys.',
                'B+ Trees have high fanout, keeping tree depth shallow and minimizing costly disk I/O operations with linked leaves.',
                'Binary search trees require no memory overhead compared to B+ Trees.',
                'B+ Trees avoid log-structured append operations.',
              ].map((opt, idx) => (
                <div
                  key={idx}
                  className={`assessment-mcq-option ${mcqAnswers.q1 === idx ? 'selected' : ''}`}
                  onClick={() => setMcqAnswers({ ...mcqAnswers, q1: idx })}
                >
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: mcqAnswers.q1 === idx ? '#4F46E5' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="assessment-mcq-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 800 }}>OPERATING SYSTEMS • QUESTION 2 OF 10</span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>+4 / -1 Mark</span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
              What is the fundamental architectural difference between a Mutex and a Binary Semaphore?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'A Mutex allows multiple threads to hold ownership simultaneously.',
                'A Mutex has ownership semantics where only the locking thread can unlock it, whereas a Semaphore can be signaled by any thread.',
                'A Semaphore is implemented strictly in user-space without kernel system calls.',
                'There is no difference between them.',
              ].map((opt, idx) => (
                <div
                  key={idx}
                  className={`assessment-mcq-option ${mcqAnswers.q2 === idx ? 'selected' : ''}`}
                  onClick={() => setMcqAnswers({ ...mcqAnswers, q2: idx })}
                >
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: mcqAnswers.q2 === idx ? '#4F46E5' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section C & D fallback */}
      {(activeSection === 'aptitude' || activeSection === 'interview') && (
        <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Sparkles size={36} color="#818CF8" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
            {activeSection === 'aptitude' ? 'Section C: Quantitative Aptitude Speed Test' : 'Section D: STAR Method Behavioral Video Prompt'}
          </h2>
          <p style={{ maxWidth: 500, fontSize: 14, color: '#94A3B8' }}>
            {activeSection === 'aptitude'
              ? 'Speed shortcuts for Permutations, Probability, Time & Work. 10 questions calibrated.'
              : 'Answer technical leadership scenarios using the STAR framework with real-time video speech grading.'}
          </p>
          <button
            onClick={() => setActiveSection('coding')}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Return to Coding Arena &rarr;
          </button>
        </div>
      )}

      {/* ---------------- Assessment Score & Roadmap Report Modal ---------------- */}
      {showResultReport && (
        <div className="modal-backdrop">
          <div className="assessment-report-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={28} color="#FBBF24" />
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
                    Diagnostic Assessment Benchmark
                  </h2>
                  <p style={{ fontSize: 12.5, color: '#94A3B8' }}>
                    Calibrated against Tier-1 SDE Placement Standards
                  </p>
                </div>
              </div>
              <span style={{ background: '#059669', color: '#FFF', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>
                VERIFIED ✓
              </span>
            </div>

            {/* Score Grid */}
            <div className="assessment-score-grid">
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#818CF8' }}>78%</div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>Overall Readiness</div>
              </div>
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#34D399' }}>82%</div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>DSA Coding</div>
              </div>
              <div className="assessment-score-pill">
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FBBF24' }}>80%</div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>Aptitude & Logic</div>
              </div>
            </div>

            {/* Gap Analysis */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: 16, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#F87171', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} />
                <span>Detected Skill Gaps for Priority Calibration:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Binary Search Tree LCA & Path Sum optimizations (Priority 1)</li>
                <li>DBMS B+ Tree Indexing & 2-Phase Locking internals (Priority 2)</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
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

export default AssessmentView;
