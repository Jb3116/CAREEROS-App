import React, { useState } from 'react';
import {
  Mic,
  Video,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Shield,
  MessageSquare,
} from 'lucide-react';

export const CommunicationView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [feedback, setFeedback] = useState<{ score: number; starBreakdown: string; strengths: string[]; improvements: string[] } | null>(null);

  const questions = [
    {
      id: 'q1',
      title: 'Tell me about a time you faced a tough technical challenge and how you resolved it.',
      role: 'SWE Core Round • STAR Framework',
      hints: 'Situation: Context of the project; Task: Your exact responsibility; Action: What engineering choices you made; Result: Quantified impact.',
    },
    {
      id: 'q2',
      title: 'Describe a situation where you had a disagreement with a teammate on technical architecture.',
      role: 'Behavioral & Leadership Fit',
      hints: 'Focus on constructive dialogue, data-driven benchmarking, and arriving at consensus.',
    },
    {
      id: 'q3',
      title: 'Why do you want to join Goldman Sachs / Tier 1 Engineering teams?',
      role: 'Motivation & Company Alignment',
      hints: 'Connect their low-latency distributed architecture with your personal learning goals.',
    },
  ];

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setFeedback(null);
    } else {
      setIsRecording(false);
      // Simulate AI Feedback
      setTimeout(() => {
        setFeedback({
          score: 86,
          starBreakdown: 'Strong Situation (25s) and Action (50s) explanation. Clear quantified result mentioning a 42% query latency reduction.',
          strengths: [
            'Clear pacing and structured STAR delivery',
            'Strong engineering rationale using Redis and PostgreSQL index benchmarking',
            'Confident tone with minimal filler words (3 um/uh detected)',
          ],
          improvements: [
            'Spend 10 more seconds clarifying the trade-offs considered (e.g. why Redis over Memcached)',
          ],
        });
      }, 500);
    }
  };

  return (
    <div style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageSquare size={24} color="#7C3AED" />
          <span>AI Mock Interview Studio</span>
        </h1>
        <p style={{ fontSize: 13.5, color: '#64748B' }}>
          Practice behavioral STAR rounds with real-time speech pace, clarity, and structural scoring.
        </p>
      </div>

      {/* Main Grid: Question Selection + Recording Studio */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Left: Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>Interview Prompts</h2>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => {
                setSelectedQuestion(idx);
                setFeedback(null);
              }}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: selectedQuestion === idx ? '#F5F3FF' : '#FFFFFF',
                border: selectedQuestion === idx ? '1.5px solid #7C3AED' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#7C3AED', marginBottom: 4 }}>
                {q.role}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                {q.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Studio Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: '#0F172A',
              borderRadius: 20,
              padding: 32,
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 280,
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
            }}
          >
            <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94A3B8' }}>
              <Shield size={14} color="#10B981" />
              <span>Camera/Mic Safe Preview</span>
            </div>

            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: isRecording ? '#DC2626' : '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: isRecording ? '0 0 0 12px rgba(220, 38, 38, 0.25)' : '0 0 0 8px rgba(79, 70, 229, 0.25)',
                transition: 'all 200ms ease',
              }}
            >
              <Mic size={32} color="#FFFFFF" />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, maxWidth: 500, marginBottom: 8 }}>
              "{questions[selectedQuestion].title}"
            </h3>
            <p style={{ fontSize: 12.5, color: '#94A3B8', maxWidth: 440, marginBottom: 20 }}>
              {questions[selectedQuestion].hints}
            </p>

            <button
              onClick={handleToggleRecord}
              style={{
                background: isRecording ? '#DC2626' : '#FFFFFF',
                color: isRecording ? '#FFFFFF' : '#0F172A',
                fontWeight: 800,
                fontSize: 14,
                padding: '10px 24px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{isRecording ? 'Stop & Evaluate Response' : 'Start Answer Simulation'}</span>
            </button>
          </div>

          {/* Feedback Card */}
          {feedback && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: 24,
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={20} color="#7C3AED" />
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                    AI STAR Evaluation Score: <span style={{ color: '#059669' }}>{feedback.score}/100</span>
                  </span>
                </div>
                <span style={{ fontSize: 12, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                  Placement Ready
                </span>
              </div>

              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                {feedback.starBreakdown}
              </p>

              <div>
                <strong style={{ fontSize: 13, color: '#0F172A' }}>Key Strengths:</strong>
                <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {feedback.strengths.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#059669' }}>
                      <CheckCircle2 size={14} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationView;
