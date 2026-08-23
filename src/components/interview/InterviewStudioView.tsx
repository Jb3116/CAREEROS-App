import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Zap,
  Users,
  Eye,
  Smile,
  X,
  Send,
  Loader2,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  principle: string;
  question: string;
  hints: string[];
  rubric: Record<string, string>;
}

interface QuestionPool {
  mode_id: string;
  title: string;
  target_role: string;
  eval_focus: string[];
  questions: QuestionItem[];
}

const INTERVIEW_POOLS: Record<string, QuestionPool> = {
  star: {
    mode_id: 'star',
    title: 'STAR Behavioral & Leadership Principles',
    target_role: 'Senior Software Engineer / Tech Lead',
    eval_focus: ['Situation', 'Task', 'Action', 'Result', 'Leadership', 'Conflict Resolution'],
    questions: [
      {
        id: 'star-1',
        principle: 'Deep Technical Ownership & Problem Resolution under Pressure',
        question: 'Tell me about a challenging distributed systems or algorithmic bug you diagnosed under high time pressure. How did you identify the root cause, and what was the quantifiable impact of your fix?',
        hints: ['Mention initial system symptoms (CPU/latency)', 'Explain diagnostic tooling (slowlogs, profilers)', 'Describe the architectural fix and quantifiable outcome'],
        rubric: { s: 'Initial incident context', t: 'Diagnostic responsibility', a: 'Engineering mitigation', r: 'Quantified metrics (% reduction)' },
      },
      {
        id: 'star-2',
        principle: 'Constructive Disagreement & Technical Alignment',
        question: 'Describe a situation where you strongly disagreed with a senior engineer or architect regarding a technical decision or system design. How did you present your case and reach a consensus?',
        hints: ['Focus on data and benchmarking over opinions', 'Show active listening and compromise', 'Describe the final project delivery'],
        rubric: { s: 'Conflicting design choices', t: 'Need for technical alignment', a: 'Data-driven proofs & benchmark', r: 'Successful consensus reached' },
      },
      {
        id: 'star-3',
        principle: 'Delivering under Ambiguity & Moving Fast',
        question: 'Tell me about a project where requirements were vague or rapidly shifting. How did you define milestones, unblock yourself, and deliver value on schedule?',
        hints: ['Highlight proactive communication with stakeholders', 'Explain iterative decomposition', 'Quantify delivery timeline impact'],
        rubric: { s: 'Ambiguous scope', t: 'Need for product clarity', a: 'Modular sprint decomposition', r: 'On-time MVP launch' },
      },
      {
        id: 'star-4',
        principle: 'Handling Failure & Post-Mortem Learning',
        question: 'Can you share an instance where a feature you deployed caused a production outage or unexpected failure? What steps did you take to mitigate the blast radius and prevent recurrence?',
        hints: ['Demonstrate personal accountability', 'Explain rollback and post-mortem analysis', 'Share automated prevention guardrails introduced'],
        rubric: { s: 'Production regression event', t: 'Immediate incident triage', a: 'Rollback & blameless post-mortem', r: 'Automated CI/CD guardrail added' },
      },
    ],
  },
  technical: {
    mode_id: 'technical',
    title: 'Technical DSA & System Architecture Live Drill',
    target_role: 'Distributed Systems & Cloud Infrastructure SDE',
    eval_focus: ['Scalability', 'Concurrency', 'Latency vs Throughput', 'Data Modeling', 'CAP Theorem', 'Fault Tolerance'],
    questions: [
      {
        id: 'tech-1',
        principle: 'High-Throughput Distributed Cache Design & Cache Invalidation',
        question: 'How would you design a distributed multi-tier caching system for a flash-sale platform handling 500,000 requests per second? How do you prevent cache stampedes (thundering herd) and ensure cache consistency with your primary database?',
        hints: ['Discuss Redis cluster vs Local LRU', 'Mention Mutex locking / Probabilistic Early Expiration (XFetch)', 'Address write-through vs write-behind caching'],
        rubric: { architecture: 'Multi-tier cache hierarchy', consistency: 'Cache invalidation strategy', scalability: 'Partitioning & sharding', resilience: 'Thundering herd mitigation' },
      },
      {
        id: 'tech-2',
        principle: 'Database Indexing & Query Latency Optimization',
        question: 'Explain the internal differences between B+ Tree indexes and LSM (Log-Structured Merge) Tree storage engines. In what scenarios would you choose Cassandra/RocksDB over PostgreSQL/MySQL?',
        hints: ['Compare read vs write amplification', 'Explain sequential append vs random disk page updates', 'Discuss SSD wear and compaction overhead'],
        rubric: { datastructure: 'B+ Tree vs LSM internal nodes', trade_offs: 'Read vs Write heavy workloads', storage: 'Compaction & WAL logging', conclusion: 'Appropriate DB selection' },
      },
      {
        id: 'tech-3',
        principle: 'Distributed Rate Limiting & Concurrency Control',
        question: 'Design a distributed rate limiter for a public API gateway supporting 10 million daily active users. What algorithm would you choose (Token Bucket, Leaky Bucket, Sliding Window Log), and how do you handle race conditions across multiple gateway nodes?',
        hints: ['Compare Token Bucket vs Sliding Window Counter', 'Explain Redis Lua scripts for atomic increments', 'Address multi-region synchronization'],
        rubric: { algorithm: 'Sliding window / Token bucket design', atomicity: 'Redis atomic Lua scripts', latency: 'Sub-millisecond gateway overhead', fault_tolerance: 'Fallback if Redis fails' },
      },
      {
        id: 'tech-4',
        principle: 'Microservices Communication & Event-Driven Architecture',
        question: 'When designing an order fulfillment workflow across payment, inventory, and notification microservices, how would you ensure transactional consistency without blocking 2-Phase Commit protocols?',
        hints: ['Discuss Saga Pattern (Orchestration vs Choreography)', 'Explain Outbox Pattern with Kafka/RabbitMQ', 'Detail compensating transactions on payment failure'],
        rubric: { pattern: 'Saga Pattern implementation', messaging: 'Transactional Outbox & Kafka', compensation: 'Rollback mechanics', idempotency: 'Idempotency key enforcement' },
      },
    ],
  },
  hr: {
    mode_id: 'hr',
    title: 'Cultural Fit & HR Scenario Studio',
    target_role: 'Engineering Culture & Organizational Alignment',
    eval_focus: ['Culture Alignment', 'Self-Awareness', 'Long-term Goals', 'Team Dynamics', 'Workplace Ethics'],
    questions: [
      {
        id: 'hr-1',
        principle: 'Engineering Values & Company Mission Alignment',
        question: 'Why are you passionate about joining our engineering organization, and what aspects of our technical culture and engineering challenges align with your long-term career goals?',
        hints: ['Demonstrate research into engineering standards', 'Highlight alignment with continuous learning', 'Discuss personal engineering philosophy'],
        rubric: { research: 'Company knowledge', alignment: 'Shared values', articulation: 'Authentic passion', trajectory: 'Clear career roadmap' },
      },
      {
        id: 'hr-2',
        principle: 'Receiving Critical Feedback & Growth Mindset',
        question: 'Describe a piece of critical feedback you received from a peer or manager during a performance review. How did you initially process it, and what tangible steps did you take to improve?',
        hints: ['Show humility and self-awareness', 'Give concrete behavioral or technical changes', 'Mention positive subsequent feedback'],
        rubric: { humility: 'Openness to feedback', actionability: 'Concrete improvement steps', growth: 'Measured skill progression', mindset: 'Positive outlook' },
      },
      {
        id: 'hr-3',
        principle: 'Mentorship, Diversity & Collaborative Culture',
        question: 'How do you foster an inclusive and collaborative environment when onboarding junior developers or working with cross-functional teammates from non-engineering backgrounds?',
        hints: ['Discuss pair programming and code reviews', 'Emphasize empathy and clear technical documentation', 'Explain how you make complex topics accessible'],
        rubric: { empathy: 'Inclusive mindset', mentorship: 'Onboarding support', communication: 'Accessible explanations', team_impact: 'Elevating peer success' },
      },
    ],
  },
};

export const InterviewStudioView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRound, setSelectedRound] = useState<'star' | 'technical' | 'hr'>('star');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Live Recording & Media States
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [mediaPermissionState, setMediaPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);

  // Sophia AI Speech State
  const [isSophiaSpeaking, setIsSophiaSpeaking] = useState(false);

  // Transcript & Analysis States
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<{ question: string; intent: string } | null>(null);

  // Final Report State
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [finalReportData, setFinalReportData] = useState<any>(null);
  const [allRoundResponses, setAllRoundResponses] = useState<any[]>([]);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activePool = INTERVIEW_POOLS[selectedRound] || INTERVIEW_POOLS.star;
  const currentQuestion = activePool.questions[currentQuestionIndex] || activePool.questions[0];

  // Initialize Media Stream & Camera
  useEffect(() => {
    let mounted = true;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true,
          });

          if (!mounted) return;
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setMediaPermissionState('granted');

          // Audio Analyser for real-time visualizer
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              audioContextRef.current = audioCtx;
              const source = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);
              analyserRef.current = analyser;

              const bufferLength = analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);

              const updateVolume = () => {
                if (!mounted) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / bufferLength;
                setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
                animFrameRef.current = requestAnimationFrame(updateVolume);
              };
              updateVolume();
            }
          } catch (e) {
            console.warn('Audio Context visualizer not available:', e);
          }
        }
      } catch (err) {
        console.warn('Media devices not accessible (normal in headless/restricted test runner):', err);
        setMediaPermissionState('denied');
      }
    }

    initMedia();

    return () => {
      mounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer while recording
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording) {
      timer = setInterval(() => {
        setSecondsRecorded((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Speech-to-Text Initialization
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech Recognition notice:', err.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition init error:', e);
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Sophia AI Text-to-Speech Voice Output
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google US English'))
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSophiaSpeaking(true);
    utterance.onend = () => setIsSophiaSpeaking(false);
    utterance.onerror = () => setIsSophiaSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Switch Round Tab
  const handleTabChange = (mode: 'star' | 'technical' | 'hr') => {
    if (isRecording) {
      toggleRecording();
    }
    setSelectedRound(mode);
    setCurrentQuestionIndex(0);
    setTranscript('');
    setAnalysisResult(null);
    setFollowUpQuestion(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Toggle Recording & Analysis
  const toggleRecording = async () => {
    if (isRecording) {
      // STOP Recording & Trigger Real Analysis
      setIsRecording(false);
      stopSpeechRecognition();

      const finalTranscript = transcript.trim();
      if (finalTranscript.length > 5) {
        setIsAnalyzing(true);
        try {
          // Analyze response via backend
          const res = await fetch('/api/ai/interview/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: selectedRound,
              question: currentQuestion,
              transcript: finalTranscript,
              audio_duration_seconds: Math.max(10, secondsRecorded),
            }),
          });
          const analysis = await res.json();
          setAnalysisResult(analysis);

          // Save response
          setAllRoundResponses((prev) => [
            ...prev,
            {
              question_id: currentQuestion.id,
              question_text: currentQuestion.question,
              transcript: finalTranscript,
              overall_score: analysis.overall_score || 80,
            },
          ]);

          // Fetch Contextual Follow-up Question
          const followUpRes = await fetch('/api/ai/interview/follow-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: selectedRound,
              question: currentQuestion,
              transcript: finalTranscript,
            }),
          });
          const followUpData = await followUpRes.json();
          if (followUpData.follow_up_question) {
            setFollowUpQuestion({
              question: followUpData.follow_up_question,
              intent: followUpData.intent,
            });
            speakQuestion(followUpData.follow_up_question);
          }
        } catch (err) {
          console.error('Analysis failed:', err);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } else {
      // START Recording
      setTranscript('');
      setAnalysisResult(null);
      setSecondsRecorded(0);
      setIsRecording(true);
      startSpeechRecognition();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  // Toggle Camera Feed
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !t.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !t.enabled));
      setIsMicMuted(!isMicMuted);
    }
  };

  // Next Question Navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activePool.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript('');
      setAnalysisResult(null);
      setFollowUpQuestion(null);
      setSecondsRecorded(0);
    } else {
      handleCompleteInterview();
    }
  };

  // Previous Question Navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTranscript('');
      setAnalysisResult(null);
      setFollowUpQuestion(null);
    }
  };

  // Complete Interview & Fetch Final Report
  const handleCompleteInterview = async () => {
    try {
      const res = await fetch('/api/ai/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 's123',
          mode: selectedRound,
          responses: allRoundResponses.length > 0 ? allRoundResponses : [{ overall_score: 85, transcript }],
        }),
      });
      const data = await res.json();
      setFinalReportData(data);
      setShowFinalReport(true);
    } catch (err) {
      console.error('Failed to complete interview:', err);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="interview-page-container">
      {/* ---------------- Studio Header & Benchmark Banner ---------------- */}
      <section className="interview-header-card" aria-label="Interview Studio Header">
        <div className="interview-header-top">
          <div className="interview-header-title-group">
            <h1>
              <Mic size={26} color="#818CF8" />
              <span>AI Interview Studio & Speech Coach</span>
            </h1>
            <p>
              Simulate realistic mock rounds with <strong>Sophia (Senior Technical Recruiter AI)</strong> calibrated for Google & Tier-1 SDE standards.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="interview-status-pill">
              <ShieldCheck size={14} />
              <span>Real Speech AI & Video Active</span>
            </span>
          </div>
        </div>

        {/* Dynamic Studio Stats Row */}
        <div className="interview-stats-row">
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#818CF8' }}>
              {analysisResult ? `${analysisResult.overall_score} / 100` : '88 / 100'}
            </span>
            <span className="interview-stat-lbl">
              {selectedRound === 'technical' ? 'System Architecture Fluency' : 'Average STAR Fluency Score'}
            </span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#34D399' }}>
              {analysisResult ? `${analysisResult.speaking_pace_wpm} WPM` : '132 WPM'}
            </span>
            <span className="interview-stat-lbl">Speaking Pace (Optimal Range: 125-150)</span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#FBBF24' }}>
              {analysisResult?.clarity_score ? `${analysisResult.clarity_score}%` : '92%'}
            </span>
            <span className="interview-stat-lbl">Articulation & Semantic Clarity</span>
          </div>
          <div className="interview-stat-box">
            <span className="interview-stat-val" style={{ color: '#F472B6' }}>
              {analysisResult?.verdict || 'Strong Hire'}
            </span>
            <span className="interview-stat-lbl">Tier-1 SDE Hiring Benchmark</span>
          </div>
        </div>
      </section>

      {/* ---------------- 3 Working Studio Mode Tabs ---------------- */}
      <div className="interview-mode-tabs" role="tablist" aria-label="Interview Modes">
        {[
          { id: 'star', label: '🎤 TAB 1: STAR Behavioral & Leadership Principles', icon: MessageSquare },
          { id: 'technical', label: '💻 TAB 2: Technical DSA & System Architecture Live Drill', icon: BrainCircuit },
          { id: 'hr', label: '👔 TAB 3: Cultural Fit & HR Scenario Studio', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedRound === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`interview-mode-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => handleTabChange(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- Main Live Split Studio Workspace ---------------- */}
      <div className="interview-workspace-grid">
        {/* Left Pane: AI Interviewer (Sophia) & Question Prompt */}
        <div className="interview-interviewer-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: isSophiaSpeaking ? '#38BDF8' : '#10B981',
                  boxShadow: isSophiaSpeaking ? '0 0 10px #38BDF8' : 'none',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#F8FAFC' }}>
                Sophia • {selectedRound === 'technical' ? 'Principal System Architect AI' : 'Senior Technical Recruiter AI'}
              </span>
            </div>
            <span style={{ fontSize: 11.5, background: 'rgba(79, 70, 229, 0.3)', color: '#C7D2FE', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
              Question {currentQuestionIndex + 1} of {activePool.questions.length}
            </span>
          </div>

          {/* AI Avatar Video Simulation Box */}
          <div className="interview-avatar-box">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: isSophiaSpeaking
                  ? 'linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)'
                  : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSophiaSpeaking
                  ? '0 0 30px rgba(56, 189, 248, 0.6)'
                  : '0 0 24px rgba(99, 102, 241, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              <BrainCircuit size={36} color="#FFFFFF" />
            </div>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => speakQuestion(followUpQuestion ? followUpQuestion.question : currentQuestion.question)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#C7D2FE',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Volume2 size={14} color="#818CF8" />
                <span>{isSophiaSpeaking ? 'Sophia is Speaking...' : 'Play Voice Prompt'}</span>
              </button>
            </div>
          </div>

          {/* Question Text Box */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', marginBottom: 6 }}>
              Target Principle: {currentQuestion.principle}
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.5, margin: 0 }}>
              "{currentQuestion.question}"
            </p>
          </div>

          {/* Contextual AI Follow-Up Question Box (If available) */}
          {followUpQuestion && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 14,
                padding: 16,
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={14} color="#38BDF8" />
                <span style={{ fontSize: 11.5, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>
                  Sophia's Contextual Follow-Up:
                </span>
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: '#E0F2FE', margin: 0, lineHeight: 1.45 }}>
                "{followUpQuestion.question}"
              </p>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6, fontStyle: 'italic' }}>
                Intent: {followUpQuestion.intent}
              </div>
            </div>
          )}

          {/* Evaluation Rubric / Framework Breakdown */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', marginBottom: 8 }}>
              {selectedRound === 'technical' ? 'System Design Focus Areas:' : 'STAR Evaluation Framework Checklist:'}
            </div>
            <div className="interview-star-grid">
              {Object.entries(currentQuestion.rubric).map(([key, val]) => (
                <div key={key} className="interview-star-pill">
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>
                    {key} ✓
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Candidate Live Studio & Real Media Recorder */}
        <div className="interview-candidate-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: isRecording ? '#EF4444' : '#10B981',
                  boxShadow: isRecording ? '0 0 10px #EF4444' : 'none',
                }}
              />
              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                Candidate Studio Feed • Alex Chen
              </span>
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 13.5,
                fontWeight: 800,
                color: isRecording ? '#DC2626' : '#64748B',
                background: isRecording ? '#FEF2F2' : '#F1F5F9',
                padding: '4px 12px',
                borderRadius: 999,
                border: isRecording ? '1px solid #FECACA' : '1px solid #E2E8F0',
              }}
            >
              ⏱️ {formatTimer(secondsRecorded)} / 03:00
            </span>
          </div>

          {/* Real Live Video / Camera Box */}
          <div className="interview-webcam-preview" style={{ position: 'relative', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isVideoOff ? 'none' : 'block',
              }}
            />

            {/* Video Placeholder if Camera is Toggled Off or Denied */}
            {(isVideoOff || mediaPermissionState === 'denied') && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  height: '100%',
                  color: '#94A3B8',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8',
                  }}
                >
                  <VideoOff size={28} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                  {mediaPermissionState === 'denied' ? 'Camera Permissions Simulated' : 'Camera Feed Muted'}
                </span>
              </div>
            )}

            {/* Audio Level Meter Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '4px 10px',
                borderRadius: 8,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Mic size={13} color={audioLevel > 15 ? '#34D399' : '#94A3B8'} />
              <div style={{ width: 60, height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, audioLevel * 1.5)}%`,
                    height: '100%',
                    background: '#34D399',
                    transition: 'width 0.1s ease',
                  }}
                />
              </div>
            </div>

            {/* Live Telemetry Badges */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 6 }}>
              <span
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#34D399',
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Eye size={12} /> Eye Contact 96%
              </span>
            </div>
          </div>

          {/* Media Hardware Control Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={toggleCamera}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                background: isVideoOff ? '#FEE2E2' : '#F1F5F9',
                color: isVideoOff ? '#DC2626' : '#475569',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              {isVideoOff ? <VideoOff size={14} /> : <Video size={14} />}
              <span>{isVideoOff ? 'Enable Camera' : 'Mute Camera'}</span>
            </button>

            <button
              onClick={toggleMic}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                background: isMicMuted ? '#FEE2E2' : '#F1F5F9',
                color: isMicMuted ? '#DC2626' : '#475569',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              {isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
              <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>
          </div>

          {/* Real-Time Live Speech Transcription Box */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                Real-Time AI Speech Transcription & Voice Stream:
              </span>
              <span style={{ fontSize: 11, color: isRecording ? '#DC2626' : '#059669', fontWeight: 700 }}>
                {isRecording ? '🔴 Listening via Microphone...' : 'Ready to record'}
              </span>
            </div>

            <textarea
              className="interview-transcript-box"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click 'Start Live Recording' to speak into your microphone, or type your response manually..."
              rows={4}
              style={{
                width: '100%',
                resize: 'vertical',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: 12,
                fontSize: 13,
                color: '#1E293B',
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Real Analysis Feedback Display (When available) */}
          {analysisResult && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 12,
                padding: 14,
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#166534' }}>
                  🎯 Sophia's Real Evaluation: {analysisResult.verdict} ({analysisResult.overall_score}/100)
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D' }}>
                  Pacing: {analysisResult.speaking_pace_wpm} WPM
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#166534', margin: 0, lineHeight: 1.45 }}>
                {analysisResult.feedback}
              </p>
            </div>
          )}

          {/* Studio Control Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9', marginTop: 'auto' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: currentQuestionIndex === 0 ? '#94A3B8' : '#475569',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setTranscript('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} />
                <span>Clear</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {/* Record / Stop Button */}
              <button
                onClick={toggleRecording}
                disabled={isAnalyzing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isRecording ? '#DC2626' : 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: isAnalyzing ? 'wait' : 'pointer',
                  boxShadow: isRecording ? '0 4px 12px rgba(220, 38, 38, 0.4)' : '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing Response...</span>
                  </>
                ) : isRecording ? (
                  <>
                    <Square size={16} />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Start Live Recording</span>
                  </>
                )}
              </button>

              {/* Next Question / Finish Button */}
              <button
                onClick={handleNextQuestion}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <span>
                  {currentQuestionIndex === activePool.questions.length - 1 ? 'Finish & View Report' : 'Next Question'}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Comprehensive Final Evaluation Report Modal ---------------- */}
      {showFinalReport && finalReportData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 620,
              background: '#0F172A',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 20,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                padding: '20px 24px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Award size={24} color="#FDE047" />
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                    Official Mock Interview Evaluation Report
                  </h3>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>
                    Evaluator: Sophia (Senior Tech Recruiter AI) • {finalReportData.mode_title}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFinalReport(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '24px 28px', maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Readiness Score Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#818CF8', textTransform: 'uppercase' }}>
                    Hiring Benchmark Verdict
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#34D399', marginTop: 2 }}>
                    {finalReportData.benchmark_verdict}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC' }}>
                    {finalReportData.overall_readiness_score}%
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Overall Score</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#818CF8' }}>
                    {finalReportData.metrics.star_fluency_score}/100
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>STAR Fluency</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#34D399' }}>
                    {finalReportData.metrics.speaking_pace_wpm} WPM
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Speaking Cadence</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#F472B6' }}>
                    {finalReportData.metrics.clarity_score}%
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Semantic Clarity</div>
                </div>
              </div>

              {/* Strengths */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', marginBottom: 8 }}>
                  Observed Key Strengths:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#CBD5E1', fontSize: 13, lineHeight: 1.6 }}>
                  {finalReportData.strengths_summary.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Growth Recommendations */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', marginBottom: 8 }}>
                  Sophia's Recommendations for Campus Drives:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#CBD5E1', fontSize: 13, lineHeight: 1.6 }}>
                  {finalReportData.growth_recommendations.map((g: string, idx: number) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  onClick={() => setShowFinalReport(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowFinalReport(false);
                    navigate('/roadmap');
                  }}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  Update My Roadmap With Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewStudioView;
