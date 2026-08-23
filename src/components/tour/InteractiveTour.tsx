import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Compass,
  Code2,
  Mic,
  Map,
  Bot,
  Briefcase,
  User,
  RotateCcw,
} from 'lucide-react';

export interface TourStepItem {
  id: string;
  tourId: string;
  target: string;
  title: string;
  description: string;
  route: string;
  badge: string;
  icon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}

export const INTERACTIVE_TOUR_STEPS: TourStepItem[] = [
  {
    id: 'dashboard',
    tourId: 'dashboard',
    target: 'dashboard',
    title: 'Student Dashboard',
    description: 'Your career mission control. Track live DKT skill mastery, readiness scores, and daily tasks.',
    route: '/dashboard',
    badge: 'Live DKT State',
    icon: Compass,
  },
  {
    id: 'assessment',
    tourId: 'assessment',
    target: 'assessment',
    title: 'Diagnostic Assessment',
    description: 'Proctored Tier-1 benchmark arena with 22 coding challenges and real sandbox execution.',
    route: '/assessment',
    badge: 'V8 Sandbox Arena',
    icon: Code2,
  },
  {
    id: 'roadmap',
    tourId: 'roadmap',
    target: 'roadmap',
    title: 'Adaptive AI Roadmap',
    description: 'Personalized pathway powered by Sentence-BERT embeddings, prioritizing critical skill gaps.',
    route: '/career-roadmap',
    badge: 'Sentence-BERT Engine',
    icon: Map,
  },
  {
    id: 'practice',
    tourId: 'practice',
    target: 'practice',
    title: 'Coding & Aptitude Practice',
    description: 'Master core DSA problems with instant test case verification and complexity feedback.',
    route: '/practice',
    badge: 'Real Testcases',
    icon: Code2,
  },
  {
    id: 'interview',
    tourId: 'interview',
    target: 'interview',
    title: 'AI Interview Studio',
    description: 'Simulate high-stakes mock interviews with Sophia AI featuring speech transcription and voice prompts.',
    route: '/interview-studio',
    badge: 'Voice & Speech AI',
    icon: Mic,
  },
  {
    id: 'mentor',
    tourId: 'mentor',
    target: 'mentor',
    title: 'AI Career Mentor',
    description: 'Your 24/7 copilot for instant interview drills, skill gap insights, and platform guidance.',
    route: '/dashboard',
    badge: '24/7 AI Copilot',
    icon: Bot,
  },
  {
    id: 'opportunities',
    tourId: 'opportunities',
    target: 'opportunities',
    title: 'Placement Drives & Calendar',
    description: 'Explore campus hiring drives and internship openings with semantic skill-match scoring.',
    route: '/opportunities',
    badge: 'Campus Drives',
    icon: Briefcase,
  },
  {
    id: 'profile',
    tourId: 'profile',
    target: 'profile',
    title: 'Profile & ATS Calibration',
    description: 'Calibrate your target roles, verified competencies, and ATS resume compatibility.',
    route: '/profile',
    badge: 'Student Identity',
    icon: User,
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

  // Auto-launch on first visit if not completed/skipped
  useEffect(() => {
    const tourStatus =
      localStorage.getItem('careeros_tour_completed') ||
      localStorage.getItem('careeros_onboarding_completed');

    if (!tourStatus) {
      // Delay slightly for initial dashboard render
      const launchTimer = setTimeout(() => {
        setIsVisible(true);
      }, 600);
      return () => clearTimeout(launchTimer);
    }
  }, []);

  // Listen for manual re-launch events
  useEffect(() => {
    const handleCustomStart = () => {
      setCurrentStepIndex(0);
      setIsVisible(true);
      const firstRoute = INTERACTIVE_TOUR_STEPS[0].route;
      if (location.pathname !== firstRoute) {
        navigate(firstRoute);
      }
    };

    window.addEventListener('careeros-start-tour', handleCustomStart);
    return () => {
      window.removeEventListener('careeros-start-tour', handleCustomStart);
    };
  }, [location.pathname, navigate]);

  // Find DOM Target Element by data-tour-id or data-tour
  const updateTargetRect = useCallback(() => {
    if (!isVisible || !currentStep) return;

    const selectors = [
      `[data-tour-id="${currentStep.tourId}"]`,
      `[data-tour="${currentStep.target}"]`,
      `[data-tour="${currentStep.id}"]`,
      `[data-tour-id="${currentStep.id}"]`,
    ];

    let el: Element | null = null;
    for (const sel of selectors) {
      el = document.querySelector(sel);
      if (el) break;
    }

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

  // Re-calculate target rect on route changes, resize, or scroll
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(updateTargetRect, 220);
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [currentStepIndex, location.pathname, isVisible, updateTargetRect]);

  // Navigation handlers
  const handleNext = useCallback(() => {
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
  }, [currentStepIndex, location.pathname, navigate]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevRoute = INTERACTIVE_TOUR_STEPS[prevIndex].route;
      if (location.pathname !== prevRoute) {
        navigate(prevRoute);
      }
    }
  }, [currentStepIndex, location.pathname, navigate]);

  const handleComplete = () => {
    localStorage.setItem('careeros_tour_completed', 'true');
    localStorage.setItem('careeros_onboarding_completed', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleSkip = useCallback(() => {
    localStorage.setItem('careeros_tour_completed', 'skipped');
    localStorage.setItem('careeros_onboarding_completed', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  // Keyboard navigation & accessibility (Escape, ArrowRight, ArrowLeft, Enter)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNext, handlePrev, handleSkip]);

  if (!isVisible || !currentStep) return null;

  // Calculate compact tooltip coordinates (280-320px width)
  const getTooltipStyle = (): React.CSSProperties => {
    const tooltipWidth = 300;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (!targetRect || !isElementFound) {
      // Centered compact fallback
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${tooltipWidth}px`,
        zIndex: 10002,
      };
    }

    const margin = 14;
    let left = targetRect.left + targetRect.width + margin;
    let top = targetRect.top;

    // If overflowing right (or target is in right panel/floating), place to the left
    if (left + tooltipWidth > windowWidth - 16) {
      left = targetRect.left - tooltipWidth - margin;
    }

    // If still overflowing left, place below
    if (left < 16) {
      left = Math.max(16, targetRect.left);
      top = targetRect.top + targetRect.height + margin;
    }

    // Clamp inside viewport
    left = Math.max(16, Math.min(left, windowWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, windowHeight - 220));

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 10002,
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  const IconComponent = currentStep.icon || Sparkles;

  return (
    <>
      {/* ---------------- 1. Semi-Transparent Dark SaaS Overlay ---------------- */}
      <div
        className="tour-backdrop-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.62)',
          backdropFilter: 'blur(2px)',
          transition: 'opacity 0.2s ease',
        }}
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* ---------------- 2. Spotlight Cutout & Glowing Ring ---------------- */}
      {targetRect && isElementFound && (
        <div
          className="tour-spotlight-ring"
          style={{
            position: 'fixed',
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: 12,
            border: '2px solid #818CF8',
            boxShadow:
              '0 0 0 3px rgba(99, 102, 241, 0.35), 0 0 25px rgba(99, 102, 241, 0.7), inset 0 0 8px rgba(99, 102, 241, 0.25)',
            zIndex: 10001,
            pointerEvents: 'none',
            animation: 'tourPulseGlow 2s infinite ease-in-out',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* ---------------- 3. Compact SaaS Tooltip (280-320px) ---------------- */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Website Tour: ${currentStep.title}`}
        style={getTooltipStyle()}
      >
        <div
          style={{
            background: '#0F172A',
            border: '1.5px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.25)',
            borderRadius: 14,
            padding: '16px 18px',
            color: '#FFFFFF',
            animation: 'tourFadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Top Row: Step Count Pill + Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#C7D2FE',
                  background: 'rgba(99, 102, 241, 0.25)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                }}
              >
                {currentStepIndex + 1} of {INTERACTIVE_TOUR_STEPS.length}
              </span>
              <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>
                {currentStep.badge}
              </span>
            </div>

            <button
              onClick={handleSkip}
              title="Close tour (Esc)"
              aria-label="Close tour"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'color 0.15s ease',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Title & Short Punchy Copy */}
          <div>
            <h4
              style={{
                fontSize: 14.5,
                fontWeight: 800,
                color: '#F8FAFC',
                margin: '0 0 4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <IconComponent size={15} color="#818CF8" />
              <span>{currentStep.title}</span>
            </h4>
            <p
              style={{
                fontSize: 12.2,
                color: '#CBD5E1',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {currentStep.description}
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: 2,
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              aria-label="Previous step"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '5px 10px',
                borderRadius: 7,
                fontSize: 11.5,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentStepIndex === 0 ? '#475569' : '#CBD5E1',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={13} />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleSkip}
                aria-label="Skip tour"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                Skip
              </button>

              <button
                onClick={handleNext}
                aria-label={currentStepIndex === INTERACTIVE_TOUR_STEPS.length - 1 ? 'Finish tour' : 'Next step'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 14px',
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
                }}
              >
                <span>
                  {currentStepIndex === INTERACTIVE_TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                </span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveTour;
