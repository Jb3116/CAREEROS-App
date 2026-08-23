import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Search,
  CheckCircle2,
  Play,
  ExternalLink,
  Flame,
  FileText,
  Clock,
  Sparkles,
  Download,
  Check,
  X,
  Layers,
  Zap,
  Bookmark,
  Award,
} from 'lucide-react';

interface LearningModule {
  id: string;
  category: 'dsa' | 'core' | 'sys' | 'apt';
  title: string;
  desc: string;
  progress: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  completedLessons: number;
  topics: string[];
  instructor?: string;
}

interface RevisionFlashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  keyRule: string;
}

export const LearningPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonModal, setActiveLessonModal] = useState<LearningModule | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'handbooks' | 'flashcards'>('modules');
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  const [modules, setModules] = useState<LearningModule[]>([
    {
      id: 'm1',
      category: 'dsa',
      title: 'Tree & Graph Algorithms for Placements',
      desc: 'Master Binary Trees, Lowest Common Ancestor, Topological Sort, Dijkstra, and Disjoint Set Union with top interview questions.',
      progress: 75,
      duration: '8.5 Hours',
      difficulty: 'Advanced',
      lessonsCount: 12,
      completedLessons: 9,
      topics: ['Binary Search Tree Validations', 'Graph BFS/DFS Traversal', 'Shortest Paths (Dijkstra)', 'Kruskal & Prim MST'],
      instructor: 'Ex-Google SDE II',
    },
    {
      id: 'm2',
      category: 'dsa',
      title: 'Dynamic Programming & Memoization',
      desc: 'Intuitive step-by-step framework for 1D, 2D, and Knapsack problems frequently asked in Google, Amazon, and Uber rounds.',
      progress: 60,
      duration: '10 Hours',
      difficulty: 'Advanced',
      lessonsCount: 15,
      completedLessons: 9,
      topics: ['0/1 Knapsack & Unbounded', 'Longest Common Subsequence', 'Matrix Chain Multiplication', 'DP on Trees'],
      instructor: 'Competitive Programming Master',
    },
    {
      id: 'm3',
      category: 'core',
      title: 'Operating Systems & Concurrency Deep Dive',
      desc: 'Process synchronization, Mutex vs Semaphore, Deadlocks, Paging, Virtual Memory, and Thread Pools for core technical rounds.',
      progress: 90,
      duration: '6 Hours',
      difficulty: 'Intermediate',
      lessonsCount: 10,
      completedLessons: 9,
      topics: ['Process Scheduling Algorithms', 'Semaphores & Dining Philosophers', 'Page Replacement Policies', 'Deadlock Detection & Avoidance'],
      instructor: 'Systems Architect',
    },
    {
      id: 'm4',
      category: 'core',
      title: 'Database Management Systems & Indexing',
      desc: 'Relational algebra, B+ Trees indexing, ACID properties, Transaction isolation levels, and High-Performance SQL queries.',
      progress: 85,
      duration: '5.5 Hours',
      difficulty: 'Intermediate',
      lessonsCount: 8,
      completedLessons: 7,
      topics: ['B-Tree & B+ Tree Indexing Internals', 'Normalization (1NF to BCNF)', 'ACID Transactions & 2PL', 'Query Plan Analysis'],
      instructor: 'Database Lead',
    },
    {
      id: 'm5',
      category: 'sys',
      title: 'System Design Fundamentals for SDE 1',
      desc: 'Scalability concepts, Consistent Hashing, Caching strategies with Redis, CDN routing, and Rate Limiter architectures.',
      progress: 40,
      duration: '7 Hours',
      difficulty: 'Advanced',
      lessonsCount: 9,
      completedLessons: 4,
      topics: ['Horizontal vs Vertical Scaling', 'Redis & Memcached Cache Invalidation', 'Message Queues (Kafka / RabbitMQ)', 'API Gateway & Rate Limiting'],
      instructor: 'Staff Software Engineer',
    },
    {
      id: 'm6',
      category: 'apt',
      title: 'Quantitative Aptitude & Logical Reasoning',
      desc: 'High-speed shortcuts for Permutations & Combinations, Probability, Time & Work, and Data Interpretation for Round 1 screenings.',
      progress: 80,
      duration: '4.5 Hours',
      difficulty: 'Beginner',
      lessonsCount: 8,
      completedLessons: 6,
      topics: ['Time, Speed and Distance Shortcuts', 'Pipes and Cisterns', 'Probability & Bayes Theorem', 'Syllogisms & Analytical Puzzles'],
      instructor: 'Aptitude Lead',
    },
  ]);

  const flashcards: RevisionFlashcard[] = [
    {
      id: 'f1',
      category: 'Operating Systems',
      question: 'What is the difference between a Process and a Thread?',
      answer: 'A Process is an executing instance of a program with its own isolated address space. A Thread is a lightweight unit of execution that shares the address space, open file descriptors, and global variables of its parent process.',
      keyRule: 'Processes = Isolated memory; Threads = Shared memory & separate call stacks.',
    },
    {
      id: 'f2',
      category: 'Databases',
      question: 'Why do relational databases use B+ Trees instead of Binary Search Trees for indexing?',
      answer: 'B+ Trees have high fanout, meaning they store multiple keys per node, keeping the tree height shallow (3-4 levels for billions of records). This minimizes disk I/O operations. Also, all data is in the leaf nodes, which are linked for fast range queries.',
      keyRule: 'High Fanout = Low Disk I/O; Linked Leaf Nodes = Optimal Range Scans.',
    },
    {
      id: 'f3',
      category: 'Algorithms',
      question: 'When should you use Dijkstra vs Bellman-Ford for shortest paths?',
      answer: 'Use Dijkstra when all edge weights are non-negative (O((V + E) log V)). Use Bellman-Ford when negative edge weights exist or to detect negative cycles (O(V * E)).',
      keyRule: 'Non-negative edges &rarr; Dijkstra; Negative weights / cycles &rarr; Bellman-Ford.',
    },
    {
      id: 'f4',
      category: 'System Design',
      question: 'What is the difference between Cache-Aside and Write-Through caching?',
      answer: 'In Cache-Aside, the application first reads from the cache; on a miss, it loads from DB and updates cache. In Write-Through, the application writes directly to the cache, which synchronously updates the database.',
      keyRule: 'Cache-Aside = Lazy loading on miss; Write-Through = Synchronous DB update by cache.',
    },
  ];

  const filteredModules = modules.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleModuleCompletion = (id: string) => {
    setModules(
      modules.map((m) =>
        m.id === id
          ? {
              ...m,
              progress: m.progress === 100 ? 50 : 100,
              completedLessons: m.progress === 100 ? Math.floor(m.lessonsCount / 2) : m.lessonsCount,
            }
          : m
      )
    );
  };

  const toggleCard = (id: string) => {
    setRevealedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="learning-page-container">
      {/* ---------------- Top Header ---------------- */}
      <header className="learning-header" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div>
            <h1 className="learning-header-title">
              <BookOpen size={24} color="#4F46E5" />
              <span>Learning Hub & Placement Handbooks</span>
            </h1>
            <p className="learning-header-subtitle">
              Curated masterclasses, algorithms roadmaps, CS core notes, and placement cheat sheets.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFF7ED',
              border: '1px solid #FFEDD5',
              color: '#EA580C',
              fontSize: 13,
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 999,
            }}
          >
            <Flame size={16} fill="#EA580C" />
            <span>5 Day Streak Active</span>
          </div>
        </div>
      </header>

      {/* ---------------- Main Content ---------------- */}
      <main className="learning-content" role="main">
        {/* Weekly Goal Progress Banner */}
        <section className="learning-hero-banner" aria-label="Learning Progress Overview">
          <div className="learning-banner-text">
            <h2>Weekly Placement Prep Milestone 🎯</h2>
            <p>You have completed 4 out of 6 recommended core modules for this week's Google assessment track.</p>
          </div>

          <div className="learning-banner-stats">
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">72%</span>
              <span className="learning-banner-pill-label">Week Target Met</span>
            </div>
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">12.5 hrs</span>
              <span className="learning-banner-pill-label">Time Dedicated</span>
            </div>
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">44</span>
              <span className="learning-banner-pill-label">Problems Solved</span>
            </div>
          </div>
        </section>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
          {[
            { id: 'modules', label: '📖 Course Roadmaps', icon: BookOpen },
            { id: 'handbooks', label: '⚡ Cheat Sheets & Handbooks', icon: FileText },
            { id: 'flashcards', label: '💡 Placement Flashcards', icon: Zap },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 800,
                  border: isActive ? '1.5px solid #4F46E5' : '1px solid #CBD5E1',
                  background: isActive ? '#EEF2FF' : '#FFFFFF',
                  color: isActive ? '#4F46E5' : '#475569',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MODULES */}
        {activeTab === 'modules' && (
          <>
            {/* Filter Bar & Search */}
            <div className="learning-filter-bar">
              <div className="learning-search-wrap">
                <Search className="learning-search-icon" size={16} />
                <input
                  type="text"
                  className="learning-search-input"
                  placeholder="Search concepts (e.g. Dynamic Programming, Raft, SQL)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="learning-cat-pills">
                {[
                  { id: 'all', label: 'All Subjects (6)' },
                  { id: 'dsa', label: 'DSA & Algorithms (2)' },
                  { id: 'core', label: 'CS Core (2)' },
                  { id: 'sys', label: 'System Design (1)' },
                  { id: 'apt', label: 'Aptitude & Puzzles (1)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`learning-cat-btn ${selectedCategory === tab.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <section className="learning-modules-grid" aria-label="Learning Courses">
              {filteredModules.map((mod) => (
                <div
                  key={mod.id}
                  className="learning-module-card"
                  onClick={() => setActiveLessonModal(mod)}
                >
                  <div className="learning-module-top">
                    <span className={`learning-module-badge ${mod.category}`}>
                      {mod.category === 'dsa' && 'DSA & Algorithms'}
                      {mod.category === 'core' && 'Core CS Subject'}
                      {mod.category === 'sys' && 'System Design'}
                      {mod.category === 'apt' && 'Aptitude & Logic'}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
                      {mod.difficulty}
                    </span>
                  </div>

                  <h2 className="learning-module-title">{mod.title}</h2>
                  <p className="learning-module-desc">{mod.desc}</p>

                  <div className="learning-progress-row">
                    <div className="learning-progress-label">
                      <span>Progress ({mod.completedLessons}/{mod.lessonsCount} Topics)</span>
                      <span>{mod.progress}%</span>
                    </div>
                    <div className="learning-progress-bar">
                      <div className="learning-progress-fill" style={{ width: `${mod.progress}%` }} />
                    </div>
                  </div>

                  <div className="learning-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} />
                      <span>{mod.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4F46E5', fontWeight: 700 }}>
                      <span>Open Syllabus</span>
                      <Play size={12} fill="#4F46E5" />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* TAB 2: HANDBOOKS */}
        {activeTab === 'handbooks' && (
          <section className="learning-cheatsheet-section" style={{ marginTop: 0 }}>
            <h2 className="learning-section-heading">⚡ Verified Placement Quick Cheat Sheets & Handbooks</h2>
            <div className="learning-cheatsheet-grid">
              <div className="learning-cheatsheet-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>DSA Patterns Handbook (2026 Edition)</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>14 Core LeetCode Patterns with C++ & Python templates</div>
                  </div>
                </div>
                <button
                  style={{ color: '#4F46E5', background: '#EEF2FF', border: '1px solid #C7D2FE', padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onClick={() => alert('📄 Downloading DSA Patterns Handbook (PDF)...')}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="learning-cheatsheet-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>SQL Top 50 Placement Interview Queries</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>Window functions, recursive CTEs & index optimization</div>
                  </div>
                </div>
                <button
                  style={{ color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onClick={() => alert('📄 Downloading SQL 50 Handbook (PDF)...')}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="learning-cheatsheet-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>OS & System Design Mindmap for SDE 1</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>Concurrency, Deadlocks, Mutex, Semaphores & Redis</div>
                  </div>
                </div>
                <button
                  style={{ color: '#7C3AED', background: '#F3E8FF', border: '1px solid #DDD6FE', padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onClick={() => alert('📄 Downloading OS Mindmap (PDF)...')}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="learning-section-heading">💡 Rapid Revision Flashcards (Placement Day Refresher)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
              {flashcards.map((f) => {
                const isRevealed = revealedCards[f.id];
                return (
                  <div
                    key={f.id}
                    onClick={() => toggleCard(f.id)}
                    style={{
                      background: '#FFFFFF',
                      border: isRevealed ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                      borderRadius: 16,
                      padding: 20,
                      boxShadow: 'var(--shadow-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 6 }}>
                        {f.category}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
                        {isRevealed ? 'Click to hide' : 'Click to flip 🔄'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                      {f.question}
                    </h3>

                    {isRevealed ? (
                      <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', animation: 'fadeIn 200ms ease' }}>
                        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, marginBottom: 8 }}>
                          {f.answer}
                        </p>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                          🔑 Rule: {f.keyRule}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: '#F8FAFC', padding: '16px 12px', borderRadius: 10, border: '1px dashed #CBD5E1', textAlign: 'center', color: '#64748B', fontSize: 12.5, fontWeight: 600 }}>
                        Tap to reveal answer & interview rule
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ---------------- Lesson Details Modal ---------------- */}
      {activeLessonModal && (
        <div className="modal-backdrop" onClick={() => setActiveLessonModal(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#4F46E5" />
                <h2 className="modal-title">{activeLessonModal.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveLessonModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                {activeLessonModal.desc}
              </p>

              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#0F172A' }}>
                  Curated Topics & Key Takeaways:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activeLessonModal.topics.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: '10px 14px',
                        borderRadius: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1E293B' }}>{t}</span>
                      </div>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t + ' placement interview')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 12,
                          color: '#4F46E5',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span>Watch Lecture</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => {
                    toggleModuleCompletion(activeLessonModal.id);
                    setActiveLessonModal(null);
                  }}
                  style={{
                    background: activeLessonModal.progress === 100 ? '#059669' : '#4F46E5',
                    color: '#FFF',
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 13.5,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {activeLessonModal.progress === 100 ? 'Completed ✓ (Click to reset)' : 'Mark Module as Mastered'}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: '#F1F5F9',
                    color: '#334155',
                    padding: '10px 18px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 13.5,
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer',
                  }}
                >
                  Practice in Arena →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPage;
