import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitFork,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Code2,
  BrainCircuit,
  Lock,
  Play,
  Calendar,
  Layers,
  Award,
  Target,
  RefreshCw,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  practiceLink?: string;
  isPriority?: boolean;
}

interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'upcoming';
  milestones: Milestone[];
}

export const RoadmapView: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed' | 'upcoming'>('all');
  const [activeModalMilestone, setActiveModalMilestone] = useState<Milestone | null>(null);

  const [phases, setPhases] = useState<RoadmapPhase[]>([
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Diagnostic Baseline & Core Foundations',
      subtitle: 'Complexity Analysis, Linear Data Structures & Algorithmic Patterns',
      status: 'completed',
      milestones: [
        {
          id: 'm1-1',
          title: 'Year-Aware Initial Diagnostic Assessment',
          description: 'Calibrated diagnostic benchmark covering Coding & Aptitude with cold-start estimation.',
          status: 'completed',
          difficulty: 'Intermediate',
          topics: ['Diagnostic Coding Test', 'Quantitative Aptitude Test', 'Baseline Score: 78%'],
        },
        {
          id: 'm1-2',
          title: 'Time & Space Complexity Analysis',
          description: 'Big-O notation, master theorem, asymptotic bounds, and recurrence relations.',
          status: 'completed',
          difficulty: 'Beginner',
          topics: ['Recurrence Relations', 'Space Complexity in Recursion', 'Iterative vs Recursive Tradeoffs'],
        },
        {
          id: 'm1-3',
          title: 'Arrays, Two Pointers & Sliding Window',
          description: 'Classic two-pointer techniques, fast/slow pointers, and fixed/dynamic sliding window algorithms.',
          status: 'completed',
          difficulty: 'Intermediate',
          topics: ['3Sum / 4Sum Patterns', 'Longest Substring Without Repeating Characters', 'Minimum Window Substring'],
        },
        {
          id: 'm1-4',
          title: 'Linked Lists, Stacks & Queues',
          description: 'Reversing lists, fast-slow cycle detection, monotonic stacks, and circular queues.',
          status: 'completed',
          difficulty: 'Intermediate',
          topics: ['LRU Cache Implementation', 'Next Greater Element', 'Reverse Nodes in k-Group'],
        },
      ],
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Hierarchical Structures & Non-Linear Algorithms',
      subtitle: 'Binary Trees, Graphs, Dynamic Programming & Shortest Paths',
      status: 'active',
      milestones: [
        {
          id: 'm2-1',
          title: 'Binary Trees, BST & LCA',
          description: 'Tree traversals (Inorder, Preorder, Postorder, Zigzag), Lowest Common Ancestor, and Path Sums.',
          status: 'in-progress',
          difficulty: 'Advanced',
          topics: ['Binary Tree Maximum Path Sum', 'Lowest Common Ancestor in BST', 'Construct Tree from Traversals'],
          isPriority: true,
        },
        {
          id: 'm2-2',
          title: 'Graphs, BFS/DFS & Topological Sorting',
          description: 'Connected components, Kahn algorithm for cycle detection, Bipartite graphs, and Dijkstra.',
          status: 'completed',
          difficulty: 'Advanced',
          topics: ['Course Schedule I & II', 'Word Ladder BFS', 'Dijkstra Single-Source Shortest Path'],
        },
        {
          id: 'm2-3',
          title: 'Dynamic Programming & Memoization',
          description: '1D/2D DP state transitions, 0/1 Knapsack, Longest Common Subsequence, and DP with bitmasks.',
          status: 'in-progress',
          difficulty: 'Advanced',
          topics: ['Coin Change & Unbounded Knapsack', 'Edit Distance', 'Partition Equal Subset Sum'],
        },
        {
          id: 'm2-4',
          title: 'Tries, Disjoint Set Union & Heaps',
          description: 'Prefix trees, DSU with union by rank and path compression, and Top-K frequent elements.',
          status: 'upcoming',
          difficulty: 'Advanced',
          topics: ['Implement Trie (Prefix Tree)', 'Redundant Connection (DSU)', 'Find Median from Data Stream (Heaps)'],
        },
      ],
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'CS Core Fundamentals & System Design Architecture',
      subtitle: 'Operating Systems, DBMS Indexing, Networks & SDE 1 Scalability',
      status: 'upcoming',
      milestones: [
        {
          id: 'm3-1',
          title: 'Operating Systems & Concurrency',
          description: 'Process synchronization, Mutex vs Semaphore, Thread Pools, Deadlock Avoidance, and Virtual Memory.',
          status: 'upcoming',
          difficulty: 'Intermediate',
          topics: ['Producer-Consumer Problem', 'Dining Philosophers', 'Banker Algorithm', 'Page Replacement (LRU)'],
        },
        {
          id: 'm3-2',
          title: 'Database Management Systems & Indexing',
          description: 'B+ Tree internals, ACID transactions, 2-Phase Locking, Index Optimization, and Sharding.',
          status: 'upcoming',
          difficulty: 'Intermediate',
          topics: ['B+ Tree vs B-Tree Storage', 'Database Normalization (BCNF)', 'Query Execution Plan Analysis'],
        },
        {
          id: 'm3-3',
          title: 'High-Level System Design & Scalability',
          description: 'Load balancers, Consistent Hashing, Redis Caching strategies, CDN caching, and Rate limiters.',
          status: 'upcoming',
          difficulty: 'Advanced',
          topics: ['Design URL Shortener (TinyURL)', 'Design Scalable Notification Service', 'Redis Cache Invalidation Patterns'],
        },
      ],
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Campus Hiring Drives & Mock Interview Sprints',
      subtitle: 'Company-Specific Mock Rounds, Behavioral STAR Framework & Placement Readiness',
      status: 'upcoming',
      milestones: [
        {
          id: 'm4-1',
          title: 'Google & Goldman Sachs Campus Mock Simulation',
          description: 'Full 90-minute timed coding assessment under proctored test conditions matching actual drive criteria.',
          status: 'upcoming',
          difficulty: 'Advanced',
          topics: ['2 Medium + 1 Hard DSA Problem', 'Automated Test Case Grading', 'Time & Complexity Benchmark'],
        },
        {
          id: 'm4-2',
          title: 'Behavioral & STAR Leadership Rounds',
          description: 'Structured leadership scenarios, conflict resolution, project storytelling, and culture fit evaluation.',
          status: 'upcoming',
          difficulty: 'Intermediate',
          topics: ['STAR Method Framework', 'Project Deep-Dive Walkthrough', 'Handling Difficult Engineering Scenarios'],
        },
      ],
    },
  ]);

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          milestones: phase.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            const newStatus: 'completed' | 'in-progress' =
              m.status === 'completed' ? 'in-progress' : 'completed';
            return { ...m, status: newStatus };
          }),
        };
      })
    );
  };

  const totalMilestones = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = phases.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.status === 'completed').length,
    0
  );
  const percentMastered = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="roadmap-page-container">
      {/* ---------------- Roadmap Header & Version Banner ---------------- */}
      <section className="roadmap-header-card" aria-label="Roadmap Summary">
        <div className="roadmap-header-top">
          <div className="roadmap-header-title-group">
            <h1>
              <GitFork size={26} color="#818CF8" />
              <span>Adaptive Career Roadmap</span>
            </h1>
            <p>
              Target: <strong>Software Development Engineer 1</strong> • Personalized for Google & Goldman Sachs Campus Drive (Aug 2026)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="roadmap-version-badge">
              <Sparkles size={14} color="#FBBF24" />
              <span>Roadmap v3.2 • AI Calibrated (10m ago)</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="roadmap-stats-row">
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#818CF8' }}>
              {percentMastered}%
            </span>
            <span className="roadmap-stat-lbl">Roadmap Completion ({completedMilestones}/{totalMilestones} Milestones)</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#34D399' }}>
              78% &rarr; 85%
            </span>
            <span className="roadmap-stat-lbl">Target Readiness Gain</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#FBBF24' }}>
              3 Days Left
            </span>
            <span className="roadmap-stat-lbl">Google Assessment Drive</span>
          </div>
          <div className="roadmap-stat-box">
            <span className="roadmap-stat-val" style={{ color: '#F472B6' }}>
              2 Tree Problems
            </span>
            <span className="roadmap-stat-lbl">Current High-Yield Action</span>
          </div>
        </div>
      </section>

      {/* ---------------- Controls & Status Filters ---------------- */}
      <div className="roadmap-controls-bar">
        <div className="roadmap-phase-filter-group">
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'in-progress', label: '⚡ Active Focus' },
            { id: 'completed', label: '✓ Completed' },
            { id: 'upcoming', label: '🔒 Upcoming' },
          ].map((btn) => (
            <button
              key={btn.id}
              className={`roadmap-filter-btn ${filterStatus === btn.id ? 'active' : ''}`}
              onClick={() => setFilterStatus(btn.id as any)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => alert('✨ Re-calibrating roadmap against latest verified assessment logs...')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 700,
            color: '#4F46E5',
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            padding: '8px 16px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} />
          <span>Sync AI Intelligence</span>
        </button>
      </div>

      {/* ---------------- Timeline Rail & Phases ---------------- */}
      <div className="roadmap-timeline-container">
        <div className="roadmap-rail-line" />

        {phases.map((phase) => {
          const visibleMilestones = phase.milestones.filter((m) => {
            if (filterStatus === 'all') return true;
            return m.status === filterStatus;
          });

          if (visibleMilestones.length === 0) return null;

          return (
            <div key={phase.id} className="roadmap-phase-block">
              {/* Phase Header */}
              <div className="roadmap-phase-header">
                <div className={`roadmap-phase-badge ${phase.status === 'completed' ? 'completed' : ''}`}>
                  {phase.status === 'completed' ? '✓' : phase.phaseNumber}
                </div>
                <div>
                  <h2 className="roadmap-phase-title-text">
                    Phase {phase.phaseNumber}: {phase.title}
                  </h2>
                  <p className="roadmap-phase-sub">{phase.subtitle}</p>
                </div>
              </div>

              {/* Milestones Grid */}
              <div className="roadmap-milestones-grid">
                {visibleMilestones.map((m) => (
                  <div
                    key={m.id}
                    className={`roadmap-milestone-card ${m.isPriority ? 'current-sprint' : ''}`}
                  >
                    <div className="roadmap-card-header-row">
                      <span className={`roadmap-status-pill ${m.status}`}>
                        {m.status === 'completed' && <CheckCircle2 size={12} />}
                        {m.status === 'in-progress' && <span>⚡</span>}
                        {m.status === 'upcoming' && <Lock size={12} />}
                        <span>
                          {m.status === 'completed' && 'Mastered'}
                          {m.status === 'in-progress' && 'In Progress'}
                          {m.status === 'upcoming' && 'Scheduled'}
                        </span>
                      </span>

                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                        {m.difficulty}
                      </span>
                    </div>

                    <h3 className="roadmap-card-title">{m.title}</h3>
                    <p className="roadmap-card-desc">{m.description}</p>

                    <div className="roadmap-skill-tags">
                      {m.topics.map((t, idx) => (
                        <span key={idx} className="roadmap-skill-tag">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="roadmap-card-actions">
                      <button
                        className="roadmap-btn-action"
                        onClick={() => setActiveModalMilestone(m)}
                      >
                        <span>View Syllabus</span>
                        <ChevronRight size={14} />
                      </button>

                      <button
                        className="roadmap-btn-toggle"
                        onClick={() => toggleMilestone(phase.id, m.id)}
                      >
                        {m.status === 'completed' ? 'Mark Incomplete' : 'Mark Done ✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Detailed Milestone Modal ---------------- */}
      {activeModalMilestone && (
        <div className="modal-backdrop" onClick={() => setActiveModalMilestone(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#4F46E5" />
                <h2 className="modal-title">{activeModalMilestone.title}</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveModalMilestone(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                {activeModalMilestone.description}
              </p>

              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>
                  Target Practice Concepts & Patterns:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activeModalMilestone.topics.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{t}</span>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t + ' leetcode dsa')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: '#4F46E5', fontWeight: 700 }}
                      >
                        Video Tutorial &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  className="ai-banner-btn"
                  onClick={() => {
                    setActiveModalMilestone(null);
                    navigate('/dashboard');
                  }}
                >
                  <span>Practice in Arena &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
