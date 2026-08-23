import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Compass,
  Code2,
  Mic,
  Map,
  Bot,
  BarChart3,
  User,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

export interface TourStepItem {
  id: string;
  target: string;
  title: string;
  description: string;
  route: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  keyFeatures: string[];
}

export const INTERACTIVE_TOUR_STEPS: TourStepItem[] = [
  {
    id: 'dashboard',
    target: 'dashboard',
    title: '1. Intelligent Student Dashboard',
    description:
      'Your central career mission control. Real-time Deep Knowledge Tracing (DKT) tracks your skill mastery across 10 foundational competencies with hiring readiness benchmarks.',
    route: '/dashboard',
    badge: 'Live DKT Knowledge State',
    icon: Compass,
    keyFeatures: ['Live Readiness Score Gauge', 'Category Mastery Breakdown', 'Target Role Calibration'],
  },
  {
    id: 'assessment',
    target: 'assessment',
    title: '2. Diagnostic Assessment Arena',
    description:
      'Proctored Tier-1 benchmark evaluation. 22 real coding problems and 32 aptitude questions with real sandbox execution and persistent answer state.',
    route: '/assessment',
    badge: 'Real V8 Sandbox Execution',
    icon: Code2,
    keyFeatures: ['Isolated VM Sandbox Code Runner', 'Multi-Section Aptitude Arena', 'Real Telemetry Ingestion'],
  },
  {
    id: 'roadmap',
    target: 'roadmap',
    title: '3. Adaptive AI Learning Roadmap',
    description:
      'Personalized learning pathway powered by Sentence-BERT skill gap detection. Dynamically prioritizes critical weaknesses to maximize interview readiness.',
    route: '/career-roadmap',
    badge: 'Sentence-BERT Skill Gaps',
    icon: Map,
    keyFeatures: ['Real Pretrained Transformer (384-d)', 'Automated Phase Generation', 'Hiring Threshold Calibration'],
  },
  {
    id: 'practice',
    target: 'practice',
    title: '4. Real-Time Coding Practice',
    description:
      'Master data structures and algorithms with real-time test case verification, asymptotic complexity hints, and instant syntax diagnostics.',
    route: '/practice',
    badge: 'Active Problem Sets',
    icon: Code2,
    keyFeatures: ['Instant Execution Feedback', 'Zero Mocked Passes', 'Multi-Language Support (Python/JS/Java)'],
  },
  {
    id: 'interview-studio',
    target: 'interview-studio',
    title: '5. AI Interview Studio & Speech Coach',
    description:
      'Simulate high-stakes mock interviews with Sophia (Senior AI Recruiter). Real camera feed, live microphone speech-to-text, and intelligent conversational follow-ups.',
    route: '/interview-studio',
    badge: 'Webcam + Mic Speech AI',
    icon: Mic,
    keyFeatures: ['STAR Behavioral & Tech Modes', 'Web Speech API Transcription', 'Dynamic Gemini Follow-up Questions'],
  },
  {
    id: 'ai-mentor',
    target: 'ai-mentor',
    title: '6. Floating AI Career Mentor',
    description:
      'Your 24/7 personalized AI career copilot. Ask questions, get real-time DKT insights, request mock drills, or navigate anywhere across CAREER OS seamlessly.',
    route: '/dashboard',
    badge: 'Conversational AI Copilot',
    icon: Bot,
    keyFeatures: ['Multi-turn Career Mentorship', 'Real DKT Telemetry Ingestion', 'Instant Navigation Shortcuts'],
  },
  {
    id: 'analytics',
    target: 'analytics',
    title: '7. Skill Growth & Telemetry Analytics',
    description:
      'Comprehensive performance analytics, learning curve trajectories, and time-series skill progression mapped directly to campus placement standards.',
    route: '/dashboard',
    badge: 'Time-Series Progression',
    icon: BarChart3,
    keyFeatures: ['Historical Knowledge Curves', 'Sectional Accuracy Trends', 'Placement Readiness Milestones'],
  },
  {
    id: 'profile',
    target: 'profile',
    title: '8. Student Profile & Readiness Calibration',
    description:
      'Manage your academic credentials, verified skills, target company preferences, and overall placement readiness index.',
    route: '/profile',
    badge: 'Student Identity & ATS',
    icon: User,
    keyFeatures: ['ATS Compatibility Score', 'Campus Drive Registration', 'Target Company Calibration'],
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface InteractiveTourProps {
  onClose?: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isElementFound, setIsElementFound] = useState(false);

  const currentStep = INTERACTIVE_TOUR_STEPS[currentStepIndex];

  // Check initial tour launch or listen to custom triggers
  useEffect(() => {
    const isCompleted = localStorage.getItem('careeros_onboarding_completed');
    if (!isCompleted) {
      // Auto-start for first-time visitors
      setIsVisible(true);
    }

    const handleCustomStart = () => {
      setCurrentStepIndex(0);
      setIsVisible(true);
    };

    window.addEventListener('careeros-start-tour', handleCustomStart);
    return () => {
      window.removeEventListener('careeros-start-tour', handleCustomStart);
    };
  }, []);

  // Update Target Element Bounding Box
  const updateTargetRect = useCallback(() => {
    if (!isVisible || !currentStep) return;

    const selector = `[data-tour="${currentStep.target}"]`;
    const el = document.querySelector(selector);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setIsElementFound(true);
    } else {
      setTargetRect(null);
      setIsElementFound(false);
    }
  }, [isVisible, currentStep]);

  // Update rect on step change, route change, resize, and scroll
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(updateTargetRect, 200);
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [currentStepIndex, location.pathname, isVisible, updateTargetRect]);

  const handleNext = () => {
    if (currentStepIndex < INTERACTIVE_TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextRoute = INTERACTIVE_TOUR_STEPS[nextIndex].route;
      if (location.pathname !== nextRoute) {
        navigate(nextRoute);
      }
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevRoute = INTERACTIVE_TOUR_STEPS[prevIndex].route;
      if (location.pathname !== prevRoute) {
        navigate(prevRoute);
      }
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    const targetRoute = INTERACTIVE_TOUR_STEPS[index].route;
    if (location.pathname !== targetRoute) {
      navigate(targetRoute);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    const firstRoute = INTERACTIVE_TOUR_STEPS[0].route;
    if (location.pathname !== firstRoute) {
      navigate(firstRoute);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('careeros_onboarding_completed', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !currentStep) return null;

  const IconComponent = currentStep.icon;

  // Calculate Popover Position relative to targetRect with viewport boundary protection
  const getPopoverStyle = (): React.CSSProperties => {
    if (!targetRect || !isElementFound) {
      // Centered fallback modal
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 540,
        zIndex: 10002,
      };
    }

    const margin = 16;
    const popoverWidth = 460;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    let left = targetRect.left + targetRect.width + margin;
    let top = targetRect.top;

    // If target is too far right (or floating widget), place popover to the left of element
    if (left + popoverWidth > windowWidth - 20) {
      left = targetRect.left - popoverWidth - margin;
    }

    // If it still overflows left, center horizontally
    if (left < 20) {
      left = Math.max(20, (windowWidth - popoverWidth) / 2);
      top = targetRect.top + targetRect.height + margin;
    }

    // If overflowing bottom, shift upward
    if (top + 400 > windowHeight - 20) {
      top = Math.max(20, windowHeight - 440);
    }

    // Ensure within bounds
    top = Math.max(20, Math.min(top, windowHeight - 420));
    left = Math.max(20, Math.min(left, windowWidth - popoverWidth - 20));

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      zIndex: 10002,
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  return (
    <>
      {/* ---------------- 1. Dimmed Spotlight Backdrop Layer ---------------- */}
      <div
        className="tour-backdrop-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(3px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
        }}
        onClick={handleComplete}
      />

      {/* ---------------- 2. Animated Spotlight Glow Ring ---------------- */}
      {targetRect && isElementFound && (
        <div
          className="tour-spotlight-ring"
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: 14,
            border: '2.5px solid #818CF8',
            boxShadow:
              '0 0 0 4px rgba(99, 102, 241, 0.35), 0 0 35px rgba(99, 102, 241, 0.8), inset 0 0 15px rgba(99, 102, 241, 0.25)',
            zIndex: 10001,
            pointerEvents: 'none',
            animation: 'tourPulseGlow 2s infinite ease-in-out',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* ---------------- 3. Anchored Contextual AI Explanation Bubble ---------------- */}
      <div style={getPopoverStyle()}>
        <div
          style={{
            background: 'linear-gradient(155deg, #1E293B 0%, #0F172A 100%)',
            border: '1.5px solid rgba(99, 102, 241, 0.45)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(99, 102, 241, 0.3)',
            borderRadius: 20,
            overflow: 'hidden',
            animation: 'tourFadeIn 0.25s ease-out',
            color: '#FFFFFF',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #7C3AED 100%)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Sparkles size={18} color="#FDE047" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#E0E7FF',
                  }}
                >
                  Interactive AI Platform Tour
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  Sophia • AI Career Guide
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleRestart}
                title="Restart Tour"
                aria-label="Restart Tour"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={handleComplete}
                title="Close Tour"
                aria-label="Close Tour"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: '20px 22px' }}>
            {/* Step Badge & Step Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A5B4FC',
                  }}
                >
                  <IconComponent size={16} />
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: 'rgba(99, 102, 241, 0.25)',
                    color: '#C7D2FE',
                    padding: '3px 9px',
                    borderRadius: 999,
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                  }}
                >
                  {currentStep.badge}
                </span>
              </div>

              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#94A3B8' }}>
                Step {currentStepIndex + 1} of {INTERACTIVE_TOUR_STEPS.length}
              </span>
            </div>

            {/* Title & Description */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', marginBottom: 8, lineHeight: 1.3 }}>
              {currentStep.title}
            </h3>
            <p style={{ fontSize: 12.8, color: '#CBD5E1', lineHeight: 1.55, marginBottom: 16 }}>
              {currentStep.description}
            </p>

            {/* Feature Highlights Grid */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  letterSpacing: '0.05em',
                }}
              >
                Key System Capabilities:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 6 }}>
                {currentStep.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: '#E2E8F0',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '5px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <CheckCircle2 size={12} color="#34D399" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                marginBottom: 16,
              }}
            >
              {INTERACTIVE_TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => handleJumpToStep(idx)}
                  aria-label={`Jump to ${step.title}`}
                  style={{
                    width: idx === currentStepIndex ? 20 : 6,
                    height: 6,
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 14px',
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: currentStepIndex === 0 ? '#64748B' : '#CBD5E1',
                  cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleComplete}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 9,
                    fontSize: 12,
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
                    padding: '8px 18px',
                    borderRadius: 9,
                    fontSize: 12.5,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  <span>
                    {currentStepIndex === INTERACTIVE_TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveTour;
