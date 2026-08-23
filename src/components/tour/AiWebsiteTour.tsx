import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Compass,
  BrainCircuit,
  Code2,
  Mic,
  MapPin,
  Briefcase,
  BarChart3,
  RotateCcw,
} from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  route: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  keyFeatures: string[];
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    title: '1. Intelligent Student Dashboard',
    description:
      'Your central career mission control. Real-time Deep Knowledge Tracing (DKT) tracks your skill mastery across 10 foundational competencies with hiring readiness benchmarks.',
    route: '/',
    badge: 'Live DKT Knowledge State',
    icon: Compass,
    keyFeatures: ['Live Readiness Score Gauge', 'Category Mastery Breakdown', 'Target Role Calibration'],
  },
  {
    id: 'assessment',
    title: '2. Diagnostic Assessment Arena',
    description:
      'Proctored Tier-1 benchmark evaluation. 22 real coding problems and 32 aptitude questions with real sandbox execution and persistent answer state.',
    route: '/assessment',
    badge: 'Real V8 Sandbox Execution',
    icon: Code2,
    keyFeatures: ['Isolated VM Sandbox Code Runner', 'Multi-Section Aptitude Arena', 'Real Telemetry Ingestion'],
  },
  {
    id: 'practice',
    title: '3. Real-Time Coding Practice',
    description:
      'Master data structures and algorithms with real-time test case verification, asymptotic complexity hints, and instant syntax diagnostics.',
    route: '/practice',
    badge: 'Active Problem Sets',
    icon: Code2,
    keyFeatures: ['Instant Execution Feedback', 'Zero Mocked Passes', 'Multi-Language Support (Python/JS/Java)'],
  },
  {
    id: 'interview',
    title: '4. AI Interview Studio & Speech Coach',
    description:
      'Simulate high-stakes mock interviews with Sophia (Senior AI Recruiter). Real camera feed, live microphone speech-to-text, and intelligent conversational follow-ups.',
    route: '/interview',
    badge: 'Webcam + Mic Speech AI',
    icon: Mic,
    keyFeatures: ['STAR Behavioral & Tech Modes', 'Web Speech API Transcription', 'Dynamic Gemini Follow-up Questions'],
  },
  {
    id: 'roadmap',
    title: '5. Adaptive AI Learning Roadmap',
    description:
      'Personalized learning pathway powered by Sentence-BERT skill gap detection. Dynamically prioritizes critical weaknesses to maximize interview readiness.',
    route: '/roadmap',
    badge: 'Sentence-BERT Skill Gaps',
    icon: MapPin,
    keyFeatures: ['Real Pretrained Transformer (384-d)', 'Automated Phase Generation', 'Hiring Threshold Calibration'],
  },
  {
    id: 'opportunities',
    title: '6. AI-Matched Placement Drives',
    description:
      'Curated campus internship and full-time hiring opportunities with real-time semantic role-fit scoring tailored to your verified skill profile.',
    route: '/opportunities',
    badge: 'Semantic Role Matching',
    icon: Briefcase,
    keyFeatures: ['Target Role Fit Scores', 'Direct Application Portals', 'Campus Drive Deadlines'],
  },
  {
    id: 'analytics',
    title: '7. Skill Growth & Telemetry Analytics',
    description:
      'Comprehensive performance analytics, learning curve trajectories, and time-series skill progression mapped directly to campus placement standards.',
    route: '/analytics',
    badge: 'Time-Series Progression',
    icon: BarChart3,
    keyFeatures: ['Historical Knowledge Curves', 'Sectional Accuracy Trends', 'Placement Readiness Milestones'],
  },
];

interface AiWebsiteTourProps {
  onClose?: () => void;
}

export const AiWebsiteTour: React.FC<AiWebsiteTourProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tour should auto-start or listen to custom event
    const checkTourState = () => {
      const isCompleted = localStorage.getItem('careeros_onboarding_completed');
      if (!isCompleted) {
        setIsVisible(true);
      }
    };

    checkTourState();

    const handleCustomStart = () => {
      setCurrentStepIndex(0);
      setIsVisible(true);
    };

    window.addEventListener('careeros-start-tour', handleCustomStart);
    return () => {
      window.removeEventListener('careeros-start-tour', handleCustomStart);
    };
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      navigate(TOUR_STEPS[nextIndex].route);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      navigate(TOUR_STEPS[prevIndex].route);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('careeros_onboarding_completed', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    navigate(TOUR_STEPS[index].route);
  };

  if (!isVisible || !currentStep) return null;

  const IconComponent = currentStep.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.25)',
          borderRadius: 20,
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Tour Header Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Sparkles size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                Interactive Platform Tour
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                Welcome to CAREER OS AI
              </h2>
            </div>
          </div>

          <button
            onClick={handleComplete}
            aria-label="Close Tour"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tour Content Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Step Badge & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818CF8',
                }}
              >
                <IconComponent size={20} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#A5B4FC',
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                {currentStep.badge}
              </span>
            </div>

            <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          {/* Title & Description */}
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F8FAFC', marginBottom: 10 }}>
            {currentStep.title}
          </h3>
          <p style={{ fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 20 }}>
            {currentStep.description}
          </p>

          {/* Feature Highlights Grid */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
              Core System Capabilities:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
              {currentStep.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#E2E8F0',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <CheckCircle2 size={13} color="#34D399" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Progress Dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleJumpToStep(idx)}
                aria-label={`Jump to ${step.title}`}
                style={{
                  width: idx === currentStepIndex ? 22 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: idx === currentStepIndex ? '#818CF8' : 'rgba(148, 163, 184, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Action Navigation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentStepIndex === 0 ? '#64748B' : '#CBD5E1',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleComplete}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                }}
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
