import React, { useState } from 'react';
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
} from 'lucide-react';

export const PracticeView: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java' | 'typescript'>('cpp');
  const [code, setCode] = useState(`/**
 * Problem: Binary Tree Maximum Path Sum (LeetCode #124)
 * Definition for a binary tree node.
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
        
        // Max sum from left and right subtrees
        int leftGain = max(maxGain(root->left), 0);
        int rightGain = max(maxGain(root->right), 0);
        
        // Price of the new path
        int currentPathSum = root->val + leftGain + rightGain;
        maxSum = max(maxSum, currentPathSum);
        
        // Return maximum contribution
        return root->val + max(leftGain, rightGain);
    }

public:
    int maxPathSum(TreeNode* root) {
        maxSum = INT_MIN;
        maxGain(root);
        return maxSum;
    }
};`);

  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'submissions'>('problem');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{ status: 'passed' | 'failed'; time: string; memory: string; output: string } | null>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: 'passed',
        time: '32 ms (Faster than 89.4%)',
        memory: '27.4 MB (Better than 92.1%)',
        output: 'Testcase 1: Passed [Output: 6, Expected: 6]\nTestcase 2: Passed [Output: 42, Expected: 42]\nTestcase 3: Passed [Output: -3, Expected: -3]\n\nAll 3 Mock Testcases Passed Successfully! ✨',
      });
    }, 600);
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code2 size={24} color="#4F46E5" />
            <span>Coding Practice Arena</span>
          </h1>
          <p style={{ fontSize: 13.5, color: '#64748B' }}>
            Daily Adaptive Queue • 2 Tree Problems Scheduled for Google Campus Assessment
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
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
              padding: '8px 18px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13.5,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Problem Description & Code Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, minHeight: 520 }}>
        {/* Left: Problem Details */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#FEF2F2', color: '#DC2626', padding: '3px 10px', borderRadius: 6 }}>
              Hard Difficulty
            </span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
              Tag: Trees • Dynamic Programming
            </span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
            124. Binary Tree Maximum Path Sum
          </h2>

          <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
            {['problem', 'hints', 'submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: activeTab === tab ? '#4F46E5' : '#64748B',
                  background: activeTab === tab ? '#EEF2FF' : 'transparent',
                  padding: '6px 12px',
                  borderRadius: 8,
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'problem' && (
            <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.
              </p>
              <p>
                The <strong>path sum</strong> of a path is the sum of the node's values in the path. Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any non-empty path</em>.
              </p>

              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 4 }}>Example 1:</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#0F172A' }}>
                  Input: root = [1,2,3]<br />
                  Output: 6 (Explanation: The optimal path is 2 -&gt; 1 -&gt; 3 with sum 2 + 1 + 3 = 6)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hints' && (
            <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FFFBEB', padding: 12, borderRadius: 10, border: '1px solid #FDE68A' }}>
                <Lightbulb size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Think of post-order traversal: compute the max contribution of left and right subtrees recursively.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#EEF2FF', padding: 12, borderRadius: 10, border: '1px solid #C7D2FE' }}>
                <Sparkles size={18} color="#4F46E5" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Remember to clamp negative subtree gains to 0 using <code>max(gain, 0)</code>!</span>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div style={{ fontSize: 13, color: '#64748B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>Accepted ✓</span>
                <span>32 ms • C++</span>
                <span>10m ago</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Editor & Execution Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              background: '#0F172A',
              borderRadius: 16,
              padding: 16,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileCode size={14} color="#818CF8" />
                <span>solution.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : 'ts'}</span>
              </div>
              <span>UTF-8 • Monokai Theme</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1,
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#E2E8F0',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 13,
                lineHeight: 1.5,
                outline: 'none',
                resize: 'none',
                minHeight: 280,
              }}
            />
          </div>

          {/* Testcase / Execution Output Console */}
          {runResult && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #A7F3D0',
                borderRadius: 14,
                padding: 16,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                animation: 'slideUp 200ms ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 800, fontSize: 14 }}>
                  <CheckCircle2 size={16} />
                  <span>Evaluation: {runResult.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Runtime: <strong>{runResult.time}</strong> • Memory: <strong>{runResult.memory}</strong>
                </div>
              </div>
              <pre style={{ fontFamily: 'monospace', fontSize: 12, color: '#334155', background: '#F8FAFC', padding: 10, borderRadius: 8, margin: 0 }}>
                {runResult.output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeView;
