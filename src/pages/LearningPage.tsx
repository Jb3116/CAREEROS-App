import React, { useState, useEffect, useCallback } from 'react';
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
  Globe,
  Star,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { useStudentProfile } from '../utils/userProfile';

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

export interface VerifiedCourseItem {
  id: string;
  title: string;
  platform: string;
  provider: string;
  description: string;
  url: string;
  type: 'free' | 'paid';
  category: string;
  duration: string;
  level: string;
  rating: number;
  skills: string[];
  instructor?: string;
  matchScore?: number;
}

export const LearningPage: React.FC = () => {
  const navigate = useNavigate();
  const studentProfile = useStudentProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonModal, setActiveLessonModal] = useState<LearningModule | null>(null);
  const [activeTab, setActiveTab] = useState<'web-courses' | 'modules' | 'handbooks' | 'flashcards'>('web-courses');
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  // ---------------- Real Web Course Search State ----------------
  const [webCourseQuery, setWebCourseQuery] = useState('');
  const [webCourseCategory, setWebCourseCategory] = useState<string>('all');
  const [webCourseFilterType, setWebCourseFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [webCourses, setWebCourses] = useState<VerifiedCourseItem[]>([]);
  const [freeCoursesCount, setFreeCoursesCount] = useState(0);
  const [paidCoursesCount, setPaidCoursesCount] = useState(0);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courseSearchError, setCourseSearchError] = useState<string | null>(null);

  // Fetch verified courses from server backend
  const fetchCourses = useCallback(async (query = '', category = 'all', filterType = 'all') => {
    setIsLoadingCourses(true);
    setCourseSearchError(null);
    try {
      const params = new URLSearchParams({
        query,
        category,
        type: filterType,
        student_id: 's123',
      });
      const res = await fetch(`/api/courses?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setWebCourses(data.courses || []);
        setFreeCoursesCount(data.free_count || 0);
        setPaidCoursesCount(data.paid_count || 0);
      }
    } catch (err: any) {
      setCourseSearchError(err.message || 'Unable to connect to course search server.');
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchCourses(webCourseQuery, webCourseCategory, webCourseFilterType);
  }, [webCourseCategory, webCourseFilterType, fetchCourses]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(webCourseQuery, webCourseCategory, webCourseFilterType);
  };

  const isZeroState = studentProfile.readinessScore === 0;

  const [modules, setModules] = useState<LearningModule[]>(() => [
    {
      id: 'm1',
      category: 'dsa',
      title: 'Tree & Graph Algorithms for Placements',
      desc: 'Master Binary Trees, Lowest Common Ancestor, Topological Sort, Dijkstra, and Disjoint Set Union with top interview questions.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.9)),
      duration: '8.5 Hours',
      difficulty: 'Advanced',
      lessonsCount: 12,
      completedLessons: isZeroState ? 0 : Math.round(12 * (studentProfile.readinessScore / 100)),
      topics: ['Binary Search Tree Validations', 'Graph BFS/DFS Traversal', 'Shortest Paths (Dijkstra)', 'Kruskal & Prim MST'],
      instructor: 'Ex-Google SDE II',
    },
    {
      id: 'm2',
      category: 'dsa',
      title: 'Dynamic Programming & Memoization',
      desc: 'Intuitive step-by-step framework for 1D, 2D, and Knapsack problems frequently asked in Google, Amazon, and Uber rounds.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.8)),
      duration: '10 Hours',
      difficulty: 'Advanced',
      lessonsCount: 15,
      completedLessons: isZeroState ? 0 : Math.round(15 * (studentProfile.readinessScore / 100)),
      topics: ['0/1 Knapsack & Unbounded', 'Longest Common Subsequence', 'Matrix Chain Multiplication', 'DP on Trees'],
      instructor: 'Competitive Programming Master',
    },
    {
      id: 'm3',
      category: 'core',
      title: 'Operating Systems & Concurrency Deep Dive',
      desc: 'Process synchronization, Mutex vs Semaphore, Deadlocks, Paging, Virtual Memory, and Thread Pools for core technical rounds.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.95)),
      duration: '6 Hours',
      difficulty: 'Intermediate',
      lessonsCount: 10,
      completedLessons: isZeroState ? 0 : Math.round(10 * (studentProfile.readinessScore / 100)),
      topics: ['Process Scheduling Algorithms', 'Semaphores & Dining Philosophers', 'Page Replacement Policies', 'Deadlock Detection & Avoidance'],
      instructor: 'Systems Architect',
    },
    {
      id: 'm4',
      category: 'core',
      title: 'Database Management Systems & Indexing',
      desc: 'Relational algebra, B+ Trees indexing, ACID properties, Transaction isolation levels, and High-Performance SQL queries.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.92)),
      duration: '5.5 Hours',
      difficulty: 'Intermediate',
      lessonsCount: 8,
      completedLessons: isZeroState ? 0 : Math.round(8 * (studentProfile.readinessScore / 100)),
      topics: ['B-Tree & B+ Tree Indexing Internals', 'Normalization (1NF to BCNF)', 'ACID Transactions & 2PL', 'Query Plan Analysis'],
      instructor: 'Database Lead',
    },
    {
      id: 'm5',
      category: 'sys',
      title: 'System Design Fundamentals for SDE 1',
      desc: 'Scalability concepts, Consistent Hashing, Caching strategies with Redis, CDN routing, and Rate Limiter architectures.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.6)),
      duration: '7 Hours',
      difficulty: 'Advanced',
      lessonsCount: 9,
      completedLessons: isZeroState ? 0 : Math.round(9 * (studentProfile.readinessScore / 100)),
      topics: ['Horizontal vs Vertical Scaling', 'Redis & Memcached Cache Invalidation', 'Message Queues (Kafka / RabbitMQ)', 'API Gateway & Rate Limiting'],
      instructor: 'Staff Software Engineer',
    },
    {
      id: 'm6',
      category: 'apt',
      title: 'Quantitative Aptitude & Logical Reasoning',
      desc: 'High-speed shortcuts for Permutations & Combinations, Probability, Time & Work, and Data Interpretation for Round 1 screenings.',
      progress: isZeroState ? 0 : Math.min(100, Math.round(studentProfile.readinessScore * 0.85)),
      duration: '4.5 Hours',
      difficulty: 'Beginner',
      lessonsCount: 8,
      completedLessons: isZeroState ? 0 : Math.round(8 * (studentProfile.readinessScore / 100)),
      topics: ['Time, Speed and Distance Shortcuts', 'Pipes and Cisterns', 'Probability & Bayes Theorem', 'Syllogisms & Analytical Puzzles'],
      instructor: 'Senior Quantitative Trainer',
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

  const solvedCount = (() => {
    try {
      const localEvents = localStorage.getItem('careeros_local_events');
      if (localEvents) {
        const parsed = JSON.parse(localEvents);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch {}
    return 0;
  })();

  const targetMetPct = studentProfile.readinessScore > 0 ? studentProfile.readinessScore : solvedCount > 0 ? Math.min(100, solvedCount * 10) : 0;
  const timeDedicated = solvedCount > 0 ? `${(solvedCount * 0.35).toFixed(1)} hrs` : '0.0 hrs';
  const completedModulesCount = modules.filter((m) => m.progress >= 80).length;

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
              Verified Web Courses, CS core notes, algorithm cheat sheets, and placement flashcards.
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
            <Flame size={16} fill={studentProfile.streakDays > 0 ? '#EA580C' : '#94A3B8'} color={studentProfile.streakDays > 0 ? '#EA580C' : '#94A3B8'} />
            <span>{studentProfile.streakDays > 0 ? `${studentProfile.streakDays} Day Streak Active` : '0 Day Streak'}</span>
          </div>
        </div>
      </header>

      {/* ---------------- Main Content ---------------- */}
      <main className="learning-content" role="main">
        {/* Weekly Goal Progress Banner */}
        <section className="learning-hero-banner" aria-label="Learning Progress Overview">
          <div className="learning-banner-text">
            <h2>Weekly Placement Prep Milestone 🎯</h2>
            <p>
              {isZeroState
                ? 'Welcome to your personalized learning track. Start with foundational modules or diagnostic assessments.'
                : `You have completed ${completedModulesCount} out of ${modules.length} recommended core modules for your target placement track.`}
            </p>
          </div>

          <div className="learning-banner-stats">
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">{targetMetPct}%</span>
              <span className="learning-banner-pill-label">Week Target Met</span>
            </div>
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">{timeDedicated}</span>
              <span className="learning-banner-pill-label">Time Dedicated</span>
            </div>
            <div className="learning-banner-pill">
              <span className="learning-banner-pill-value">{solvedCount}</span>
              <span className="learning-banner-pill-label">Problems Solved</span>
            </div>
          </div>
        </section>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, flexWrap: 'wrap' }}>
          {[
            { id: 'web-courses', label: '🌐 Real Web Course Search', icon: Globe },
            { id: 'modules', label: '📖 Internal Roadmaps', icon: BookOpen },
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

        {/* ================= TAB 0: REAL WEB COURSE SEARCH ================= */}
        {activeTab === 'web-courses' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Search Input Bar & Category Filter */}
            <div style={{ background: '#FFFFFF', padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                  <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="Search verified courses (e.g. Distributed Systems, MIT Algorithms, SQL, System Design)..."
                    value={webCourseQuery}
                    onChange={(e) => setWebCourseQuery(e.target.value)}
                    style={{
                      width: '100%',
                      height: 44,
                      padding: '0 16px 0 42px',
                      borderRadius: 10,
                      border: '1px solid #CBD5E1',
                      fontSize: 14,
                      color: '#0F172A',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0 24px',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Search size={16} />
                  <span>Search Courses</span>
                </button>
              </form>

              {/* Skill Gap Auto-Target Prompt Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={14} /> Recommended for your Skill Gaps:
                </span>
                {[
                  { label: 'Binary Trees & Graphs', q: 'tree' },
                  { label: 'Distributed Systems & Scaling', q: 'distributed' },
                  { label: 'Operating Systems & Concurrency', q: 'operating systems' },
                  { label: 'DBMS & SQL Indexing', q: 'database' },
                  { label: 'STAR Behavioral Fluency', q: 'behavioral' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      setWebCourseQuery(chip.q);
                      fetchCourses(chip.q, webCourseCategory, webCourseFilterType);
                    }}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>

              {/* Filter Row: Categories + FREE vs PAID Segregation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                {/* Category Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Topics' },
                    { id: 'dsa', label: 'DSA & Algorithms' },
                    { id: 'system_design', label: 'System Design' },
                    { id: 'os', label: 'Operating Systems' },
                    { id: 'dbms', label: 'DBMS & SQL' },
                    { id: 'ml', label: 'AI & Machine Learning' },
                    { id: 'interview', label: 'Interview Prep' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setWebCourseCategory(cat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        border: webCourseCategory === cat.id ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                        background: webCourseCategory === cat.id ? '#EEF2FF' : '#F8FAFC',
                        color: webCourseCategory === cat.id ? '#4F46E5' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Free vs Paid Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: 3, borderRadius: 10 }}>
                  <button
                    onClick={() => setWebCourseFilterType('all')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 800,
                      background: webCourseFilterType === 'all' ? '#FFFFFF' : 'transparent',
                      color: webCourseFilterType === 'all' ? '#0F172A' : '#64748B',
                      boxShadow: webCourseFilterType === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    All ({freeCoursesCount + paidCoursesCount})
                  </button>
                  <button
                    onClick={() => setWebCourseFilterType('free')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 800,
                      background: webCourseFilterType === 'free' ? '#10B981' : 'transparent',
                      color: webCourseFilterType === 'free' ? '#FFFFFF' : '#64748B',
                      boxShadow: webCourseFilterType === 'free' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🟢 Free Only ({freeCoursesCount})
                  </button>
                  <button
                    onClick={() => setWebCourseFilterType('paid')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 800,
                      background: webCourseFilterType === 'paid' ? '#8B5CF6' : 'transparent',
                      color: webCourseFilterType === 'paid' ? '#FFFFFF' : '#64748B',
                      boxShadow: webCourseFilterType === 'paid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🟣 Paid / Certs ({paidCoursesCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {courseSearchError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: 14, borderRadius: 12, color: '#DC2626', fontSize: 13 }}>
                ⚠️ {courseSearchError}
              </div>
            )}

            {/* Loading State */}
            {isLoadingCourses && (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748B', fontSize: 14 }}>
                <Sparkles size={24} color="#6366F1" style={{ animation: 'spin 1.5s linear infinite', marginBottom: 8 }} />
                <div>Fetching verified accredited web courses...</div>
              </div>
            )}

            {/* Course Cards Grid */}
            {!isLoadingCourses && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {webCourses.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: c.type === 'free' ? '#ECFDF5' : '#F5F3FF',
                            color: c.type === 'free' ? '#059669' : '#7C3AED',
                            border: c.type === 'free' ? '1px solid #A7F3D0' : '1px solid #DDD6FE',
                          }}
                        >
                          {c.type === 'free' ? '100% Free / Audit' : 'Paid Masterclass / Cert'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#D97706' }}>
                          <Star size={13} fill="#D97706" />
                          <span>{c.rating}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                        {c.title}
                      </h3>

                      {/* Platform & Provider */}
                      <div style={{ fontSize: 12, color: '#4F46E5', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <GraduationCap size={14} />
                        <span>{c.provider} • {c.platform}</span>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                        {c.description}
                      </p>

                      {/* Skills Covered Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                        {c.skills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              background: '#F8FAFC',
                              color: '#334155',
                              border: '1px solid #E2E8F0',
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer with Direct Verified External Link */}
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        <span>{c.duration}</span>
                      </div>

                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: c.type === 'free' ? '#059669' : '#4F46E5',
                          padding: '6px 14px',
                          borderRadius: 8,
                          textDecoration: 'none',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <span>Open Verified Course</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 1: MODULES ================= */}
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
                  { id: 'apt', label: 'Aptitude & Logic (1)' },
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

        {/* ================= TAB 2: HANDBOOKS ================= */}
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
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Top 50 Algorithms Cheat Sheet
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B' }}>PDF • Quick Revision (24 Pages)</span>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', margin: '12px 0' }}>
                  Asymptotic time/space complexities, standard recurrence relations, and key templates for BFS, DFS, and DP.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>Verified SDE Benchmark</span>
                  <a
                    href="https://github.com/donnemartin/system-design-primer"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View Handbook <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="learning-cheatsheet-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      System Design Architecture Handbook
                    </h3>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Guide • High-Level Architecture</span>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', margin: '12px 0' }}>
                  Step-by-step blueprints for TinyURL, Rate Limiter, Consistent Hashing, and Kafka stream processing.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>FAANG Interview Standard</span>
                  <a
                    href="https://github.com/donnemartin/system-design-primer"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View Handbook <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 3: FLASHCARDS ================= */}
        {activeTab === 'flashcards' && (
          <section style={{ marginTop: 0 }}>
            <h2 className="learning-section-heading">💡 Placement Rapid-Fire Flashcards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {flashcards.map((fc) => {
                const isRevealed = revealedCards[fc.id];
                return (
                  <div
                    key={fc.id}
                    onClick={() => setRevealedCards((prev) => ({ ...prev, [fc.id]: !prev[fc.id] }))}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E2E8F0',
                      padding: 18,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '3px 8px', borderRadius: 6 }}>
                        {fc.category}
                      </span>
                      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                        {isRevealed ? 'Click to hide' : 'Click to reveal'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
                      {fc.question}
                    </h3>

                    {isRevealed ? (
                      <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                        <p style={{ fontSize: 12.5, color: '#334155', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                          {fc.answer}
                        </p>
                        <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>
                          💡 {fc.keyRule}
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '20px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13, fontStyle: 'italic' }}>
                        Tap to reveal answer & key rule
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Lesson Syllabus Modal */}
      {activeLessonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setActiveLessonModal(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 540,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '4px 10px', borderRadius: 999 }}>
                {activeLessonModal.category.toUpperCase()} • {activeLessonModal.difficulty}
              </span>
              <button
                onClick={() => setActiveLessonModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>
              {activeLessonModal.title}
            </h2>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {activeLessonModal.desc}
            </p>

            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: 8 }}>
              Topic Modules:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {activeLessonModal.topics.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                  <CheckCircle size={14} color="#10B981" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveLessonModal(null)}
              style={{
                width: '100%',
                background: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 0',
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Close Syllabus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPage;
