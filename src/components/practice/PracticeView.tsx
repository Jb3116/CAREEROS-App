import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Clock,
  Terminal,
  ChevronRight,
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
} from 'lucide-react';

interface ProblemItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  company: string;
  accuracy: string;
  solved: boolean;
  matchScore: number;
}

export const PracticeView: React.FC = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'coding' | 'aptitude' | 'analytics'>('coding');
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java' | 'typescript' | 'go'>('cpp');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [activeProblemId, setActiveProblemId] = useState('p1');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{ status: 'passed' | 'failed'; time: string; memory: string; output: string } | null>(null);

  // Aptitude state
  const [aptitudeAnswer, setAptitudeAnswer] = useState<number | null>(null);
  const [showAptitudeExplanation, setShowAptitudeExplanation] = useState(false);

  const problems: ProblemItem[] = [
    {
      id: 'p1',
      title: '124. Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      topics: ['Binary Trees', 'Recursion', 'Dynamic Programming'],
      company: 'Google / Goldman Sachs',
      accuracy: '42.8%',
      solved: true,
      matchScore: 94,
    },
    {
      id: 'p2',
      title: '236. Lowest Common Ancestor of a Binary Tree',
      difficulty: 'Medium',
      topics: ['Binary Trees', 'DFS Traversal'],
      company: 'Amazon / Microsoft',
      accuracy: '61.4%',
      solved: false,
      matchScore: 91,
    },
    {
      id: 'p3',
      title: '743. Network Delay Time (Dijkstra Shortest Path)',
      difficulty: 'Medium',
      topics: ['Graphs', 'Shortest Paths', 'Heaps'],
      company: 'Uber / Google',
      accuracy: '54.2%',
      solved: false,
      matchScore: 88,
    },
    {
      id: 'p4',
      title: '322. Coin Change (Unbounded Knapsack DP)',
      difficulty: 'Medium',
      topics: ['Dynamic Programming', 'Memoization'],
      company: 'Razorpay / Zepto',
      accuracy: '48.9%',
      solved: true,
      matchScore: 86,
    },
    {
      id: 'p5',
      title: '208. Implement Trie (Prefix Tree)',
      difficulty: 'Medium',
      topics: ['Tries', 'Design', 'String Hashing'],
      company: 'Goldman Sachs / Microsoft',
      accuracy: '65.1%',
      solved: false,
      matchScore: 84,
    },
  ];

  const [code, setCode] = useState(`/**
 * Problem: 124. Binary Tree Maximum Path Sum
 * Definition for a binary tree node:
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 * };
 */

class Solution {
private:
    int maxSum = INT_MIN;
    
    int maxGain(TreeNode* root) {
        if (!root) return 0;
        
        // Compute maximum path sum recursively, ignoring negative paths
        int leftGain = max(maxGain(root->left), 0);
        int rightGain = max(maxGain(root->right), 0);
        
        // Price of the new path passing through current node
        int currentPathSum = root->val + leftGain + rightGain;
        maxSum = max(maxSum, currentPathSum);
        
        // Return maximum contribution for parent recursion
        return root->val + max(leftGain, rightGain);
    }

public:
    int maxPathSum(TreeNode* root) {
        maxSum = INT_MIN;
        maxGain(root);
        return maxSum;
    }
};`);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: 'passed',
        time: '28 ms (Faster than 91.2% of submissions)',
        memory: '27.4 MB (Better than 94.6% memory allocation)',
        output: 'Testcase 1: Passed [Input: root = [1,2,3], Expected: 6, Output: 6]\nTestcase 2: Passed [Input: root = [-10,9,20,null,null,15,7], Expected: 42, Output: 42]\nTestcase 3: Passed [Input: root = [-3], Expected: -3, Output: -3]\n\nAll Proctored Testcases Executed Successfully! ✨',
      });
    }, 550);
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
      {/* ---------------- Top Practice Header Banner ---------------- */}
      <section className="practice-header-card" aria-label="Practice Dashboard Summary">
        <div className="practice-header-top">
          <div className="practice-header-title-group">
            <h1>
              <Code2 size={26} color="#818CF8" />
              <span>Coding & Aptitude Practice Dashboard</span>
            </h1>
            <p>
              Adaptive sprint queue calibrated for <strong>Google & Goldman Sachs Campus Placements</strong> (Aug 2026)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="practice-streak-pill">
              <Flame size={16} fill="#FB923C" />
              <span>🔥 5 Day Streak Active</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="practice-stats-row">
          <div className="practice-stat-box">
            <span className="practice-stat-val" style={{ color: '#818CF8' }}>
              3 / 4 Sprints
            </span>
            <span className="practice-stat-lbl">Today's Target Completed (75%)</span>
          </div>
          <div className="practice-stat-box">
            <span className="practice-stat-val" style={{ color: '#34D399' }}>
              350+ Problems
            </span>
            <span className="practice-stat-lbl">Total Mastered (180 DSA • 120 Aptitude)</span>
          </div>
          <div className="practice-stat-box">
            <span className="practice-stat-val" style={{ color: '#FBBF24' }}>
              14 mins / med
            </span>
            <span className="practice-stat-lbl">Avg Solving Speed (Top 8% Cohort)</span>
          </div>
          <div className="practice-stat-box">
            <span className="practice-stat-val" style={{ color: '#F472B6' }}>
              2 Tree Problems
            </span>
            <span className="practice-stat-lbl">Next Best Action Priority</span>
          </div>
        </div>
      </section>

      {/* ---------------- Mode Switcher Tabs ---------------- */}
      <div className="practice-mode-tabs">
        {[
          { id: 'coding', label: '💻 Coding Arena (DSA Sprints)', icon: Code2 },
          { id: 'aptitude', label: '⚡ Quantitative & Logical Aptitude', icon: Zap },
          { id: 'analytics', label: '📊 Practice Performance Radar', icon: BarChart2 },
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

      {/* ---------------- MODE 1: CODING ARENA ---------------- */}
      {activeMode === 'coding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Filter & Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 420 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search problems, topics, companies (e.g. Trees, Google, DP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 16px 0 38px',
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#1E293B',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Problems' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficultyFilter(diff.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    border: '1px solid #CBD5E1',
                    background: difficultyFilter === diff.id ? '#4F46E5' : '#FFFFFF',
                    color: difficultyFilter === diff.id ? '#FFFFFF' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coding Split Workspace */}
          <div className="practice-workspace-grid">
            {/* Left: Problem Details & Queue */}
            <div className="practice-problem-pane">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 6,
                    background: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                  }}
                >
                  Hard Difficulty
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    background: '#ECFDF5',
                    color: '#059669',
                    padding: '3px 10px',
                    borderRadius: 999,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  94% Google Target Match
                </span>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', lineHeight: 1.3 }}>
                124. Binary Tree Maximum Path Sum
              </h2>

              <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p>
                  A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.
                </p>
                <p>
                  The <strong>path sum</strong> of a path is the sum of the node's values in the path. Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any non-empty path</em>.
                </p>

                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5, color: '#0F172A', marginBottom: 4 }}>Example 1:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#4F46E5' }}>
                    Input: root = [1,2,3]<br />
                    Output: 6 (Explanation: The optimal path is 2 -&gt; 1 -&gt; 3 with sum 2 + 1 + 3 = 6)
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5, color: '#0F172A', marginBottom: 4 }}>Constraints:</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#64748B' }}>
                    <li>The number of nodes in the tree is in the range [1, 3 * 10^4].</li>
                    <li>-1000 &lt;= Node.val &lt;= 1000</li>
                  </ul>
                </div>
              </div>

              {/* Recommended Problem Queue */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, marginTop: 'auto' }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                  Upcoming in Daily Adaptive Queue:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {problems.slice(1, 4).map((prob) => (
                    <div
                      key={prob.id}
                      style={{
                        padding: '8px 12px',
                        background: '#F8FAFC',
                        borderRadius: 8,
                        border: '1px solid #E2E8F0',
                        fontSize: 12.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#1E293B' }}>{prob.title}</span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{prob.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Code Workspace & Console */}
            <div className="practice-editor-pane">
              <div className="practice-editor-box">
                {/* Editor Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileCode size={16} color="#818CF8" />
                    <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 700 }}>
                      solution.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'go' ? 'go' : 'ts'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as any)}
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
                    >
                      <option value="cpp">C++ (GCC 14)</option>
                      <option value="python">Python 3.12</option>
                      <option value="java">Java 21</option>
                      <option value="typescript">TypeScript 5.4</option>
                      <option value="go">Go 1.22</option>
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
                        padding: '7px 18px',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: 13,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(79, 70, 229, 0.35)',
                      }}
                    >
                      <Play size={14} fill="#FFFFFF" />
                      <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="practice-editor-textarea"
                  spellCheck={false}
                />
              </div>

              {/* Execution Console Results */}
              {runResult && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #A7F3D0',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
                    animation: 'fadeIn 150ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 900, fontSize: 13.5 }}>
                      <CheckCircle2 size={16} />
                      <span>Evaluation: {runResult.status.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                      Runtime: <strong>{runResult.time}</strong> • Memory: <strong>{runResult.memory}</strong>
                    </div>
                  </div>
                  <pre style={{ fontFamily: 'monospace', fontSize: 12, color: '#334155', background: '#F8FAFC', padding: 12, borderRadius: 10, margin: 0, border: '1px solid #E2E8F0' }}>
                    {runResult.output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODE 2: QUANTITATIVE & LOGICAL APTITUDE ---------------- */}
      {activeMode === 'aptitude' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="practice-aptitude-grid">
            {/* Speed Test Card */}
            <div className="practice-aptitude-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '3px 10px', borderRadius: 6 }}>
                  PROBABILITY & COMBINATORICS
                </span>
                <span style={{ fontSize: 12, color: '#EA580C', fontWeight: 700 }}>
                  ⏱️ 45s Recommended
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                In how many different ways can the letters of the word "ENGINEER" be arranged such that all the vowels always come together?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { text: 'A) 720 ways', id: 0 },
                  { text: 'B) 180 ways', id: 1 },
                  { text: 'C) 360 ways', id: 2 },
                  { text: 'D) 1,080 ways', id: 3 },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setAptitudeAnswer(opt.id);
                      setShowAptitudeExplanation(true);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: aptitudeAnswer === opt.id ? (opt.id === 1 ? '#ECFDF5' : '#FEF2F2') : '#F8FAFC',
                      border: aptitudeAnswer === opt.id ? (opt.id === 1 ? '1.5px solid #10B981' : '1.5px solid #EF4444') : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: aptitudeAnswer === opt.id ? (opt.id === 1 ? '#065F46' : '#991B1B') : '#1E293B',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>

              {showAptitudeExplanation && (
                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                  <strong>Correct Answer: B (180 ways)</strong><br />
                  Vowels = E, I, E, E (4 vowels). Consonants = N, G, N, R (4 consonants).<br />
                  Treating vowels as 1 block: (5 items with 2 N's) = 5! / 2! = 60.<br />
                  Arranging vowels inside block (4 vowels with 3 E's) = 4! / 3! = 4.<br />
                  Total Ways = 60 * 4 = <strong>180 ways</strong>.
                </div>
              )}
            </div>

            {/* Logical Reasoning Card */}
            <div className="practice-aptitude-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#7C3AED', background: '#F3E8FF', padding: '3px 10px', borderRadius: 6 }}>
                  SYLLOGISMS & LOGICAL DEDUCTION
                </span>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                  Question 2 of 10
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                Statements: All Trees are Graphs. Some Graphs are Networks. No Network is a Cycle.<br />
                Conclusions: I. Some Graphs are not Cycles. II. All Trees being Networks is a possibility.
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'A) Only Conclusion I follows',
                  'B) Only Conclusion II follows',
                  'C) Both Conclusions I and II follow (Correct)',
                  'D) Neither follows',
                ].map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: '#1E293B',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODE 3: PERFORMANCE ANALYTICS ---------------- */}
      {activeMode === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <div className="practice-aptitude-card">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Topic Mastery Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
              {[
                { topic: 'Trees & Graphs', pct: 82, color: '#4F46E5' },
                { topic: 'Dynamic Programming', pct: 68, color: '#F59E0B' },
                { topic: 'Quantitative Probability', pct: 85, color: '#10B981' },
                { topic: 'System Design & OS', pct: 74, color: '#8B5CF6' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    <span>{item.topic}</span>
                    <span style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', height: 8, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="practice-aptitude-card">
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Target Drive Readiness Comparison</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Google SWE Benchmark</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>91% Match</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Goldman Sachs SWE Intern</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>94% Match</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Amazon SDE 1 Campus Drive</span>
                <span style={{ fontWeight: 800, color: '#4F46E5' }}>88% Match</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeView;
