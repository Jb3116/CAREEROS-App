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
  BookOpen,
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
    title: 'Dashboard',
    description: 'Your career overview and daily progress.',
    route: '/dashboard',
    badge: 'Overview',
    icon: Compass,
  },
  {
    id: 'assessment',
    tourId: 'assessment',
    target: 'assessment',
    title: 'Assessment',
    description: 'Proctored coding and aptitude test arena.',
    route: '/assessment',
    badge: 'Benchmark',
    icon: Code2,
  },
  {
    id: 'roadmap',
    tourId: 'roadmap',
    target: 'roadmap',
    title: 'Roadmap',
    description: 'Adaptive AI pathway targeting your skill gaps.',
    route: '/career-roadmap',
    badge: 'AI Path',
    icon: Map,
  },
  {
    id: 'opportunities',
    tourId: 'opportunities',
    target: 'opportunities',
    title: 'Opportunities',
    description: 'Campus hiring drives and smart placement calendar.',
    route: '/opportunities',
    badge: 'Drives',
    icon: Briefcase,
  },
  {
    id: 'interview',
    tourId: 'interview',
    target: 'interview',
    title: 'Interview Studio',
    description: 'Live mock interviews with Sophia AI.',
    route: '/interview-studio',
    badge: 'Speech AI',
    icon: Mic,
  },
  {
    id: 'learning',
    tourId: 'learning',
    target: 'learning',
    title: 'Learning Hub',
    description: 'Curated learning modules and technical practice.',
    route: '/learning',
    badge: 'Skills',
    icon: BookOpen,
  },
  {
    id: 'mentor',
    tourId: 'mentor',
    target: 'mentor',
    title: 'AI Mentor',
    description: '24/7 copilot for instant career guidance.',
    route: '/dashboard',
    badge: 'Copilot',
    icon: Bot,
  },
  {
    id: 'profile',
    tourId: 'profile',
    target: 'profile',
    title: 'Profile',
    description: 'Manage verified competencies and ATS calibration.',
    route: '/profile',
    badge: 'Account',
    icon: User,
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type PlacementSide = 'right' | 'left' | 'bottom' | 'top' | 'center';

interface InteractiveTourProps {
  onClose?: () => void;
}

// User-specific persistence key helper
export const getCurrentUserId = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem('careeros_auth_user');
      if (authUser) {
        const parsed = JSON.parse(authUser);
        if (parsed?.id) return parsed.id;
        if (parsed?.email) return parsed.email.replace(/[^a-zA-Z0-9_-]/g, '_');
      }
    }
  } catch (e) {}
  return 'default_student';
};

export const getTourStorageKey = (userId?: string): string => {
  const uid = userId || getCurrentUserId();
  return `tour_completed_${uid}`;
};

/**
 * Check if the onboarding tour has already been completed or dismissed
 */
export const isTourCompleted = (userId?: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const uid = userId || getCurrentUserId();

    // User-scoped keys
    if (
      localStorage.getItem(`tour_completed_${uid}`) === 'true' ||
      localStorage.getItem(`tour_completed_${uid}`) === 'skipped' ||
      localStorage.getItem(`careeros_tour_completed_${uid}`) === 'true' ||
      localStorage.getItem(`careeros_tour_completed_${uid}`) === 'skipped'
    ) {
      return true;
    }

    // Global flags (fallback)
    if (
      localStorage.getItem('careeros_tour_completed') === 'true' ||
      localStorage.getItem('careeros_tour_completed') === 'skipped' ||
      localStorage.getItem('careeros_ai_tour_completed') === 'true' ||
      localStorage.getItem('careeros_ai_tour_completed') === 'skipped' ||
      localStorage.getItem('tour_completed') === 'true' ||
      localStorage.getItem('tour_completed') === 'skipped'
    ) {
      return true;
    }
  } catch (e) {}
  return false;
};

/**
 * Mark the tour as completed / skipped in localStorage
 */
export const setTourCompleted = (userId?: string, status: 'true' | 'skipped' = 'true'): void => {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId || getCurrentUserId();
    localStorage.setItem(`tour_completed_${uid}`, status);
    localStorage.setItem(`careeros_tour_completed_${uid}`, status);
    localStorage.setItem('careeros_tour_completed', status);
    localStorage.setItem('careeros_ai_tour_completed', 'true');
    localStorage.setItem('tour_completed', status);
    localStorage.removeItem('careeros_tour_current_step');
  } catch (e) {}
};

/**
 * Reset/clear tour completion status in localStorage (for logouts & new users)
 */
export const clearTourCompleted = (userId?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId || getCurrentUserId();
    localStorage.removeItem(`tour_completed_${uid}`);
    localStorage.removeItem(`careeros_tour_completed_${uid}`);
    localStorage.removeItem('careeros_tour_completed');
    localStorage.removeItem('careeros_ai_tour_completed');
    localStorage.removeItem('tour_completed');
    localStorage.removeItem('careeros_tour_current_step');
  } catch (e) {}
};

export const InteractiveTour: React.FC<InteractiveTourProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ALWAYS initialize at step 0 (Dashboard)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isElementFound, setIsElementFound] = useState(false);
  const [placement, setPlacement] = useState<PlacementSide>('right');

  const currentStep = INTERACTIVE_TOUR_STEPS[currentStepIndex] || INTERACTIVE_TOUR_STEPS[0];

  // Dedicated startTour function: Explicitly forces step 0 and navigates to Dashboard
  const startTour = useCallback(
    (resetPersistence = false) => {
      if (resetPersistence) {
        clearTourCompleted();
      }

      console.log('[AI TOUR] Starting automatic tour');
      console.log('[AI TOUR] Step 1');

      setCurrentStepIndex(0);
      setIsElementFound(false);
      setTargetRect(null);

      const dashboardRoute = INTERACTIVE_TOUR_STEPS[0].route;
      if (location.pathname !== dashboardRoute) {
        navigate(dashboardRoute);
      }

      setIsVisible(true);
    },
    [location.pathname, navigate]
  );

  // Automatic Delayed Launch on First Dashboard Load for Authenticated Users
  useEffect(() => {
    // Only trigger on authenticated /dashboard route
    if (location.pathname !== '/dashboard') return;

    // Strictly check if tour has ever been completed or skipped
    if (isTourCompleted()) {
      return;
    }

    console.log('[AI TOUR] Dashboard detected');
    console.log('[AI TOUR] Waiting for dashboard target');

    let pollInterval: ReturnType<typeof setInterval>;
    let initialDelayTimer: ReturnType<typeof setTimeout>;

    // Wait 1000ms after dashboard render to let all cards mount smoothly
    initialDelayTimer = setTimeout(() => {
      let attempts = 0;
      const maxAttempts = 40; // 6 seconds of retries (every 150ms)

      pollInterval = setInterval(() => {
        attempts++;
        const dashboardTarget = document.querySelector(
          '[data-tour-id="dashboard"], [data-tour="dashboard"]'
        );
        const dashboardContainer = document.querySelector('.dashboard-content, main');

        if (dashboardTarget && dashboardContainer) {
          const rect = dashboardTarget.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            console.log('[AI TOUR] Target found: dashboard');
            clearInterval(pollInterval);
            startTour(false);
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
        }
      }, 150);
    }, 1000);

    return () => {
      clearTimeout(initialDelayTimer);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [location.pathname, startTour]);

  // Listen for manual re-launch events ("Replay Tour")
  useEffect(() => {
    const handleCustomStart = () => {
      console.log('[AI TOUR] Manual Replay Tour triggered');
      startTour(true);
    };

    window.addEventListener('careeros-start-tour', handleCustomStart);
    return () => {
      window.removeEventListener('careeros-start-tour', handleCustomStart);
    };
  }, [startTour]);

  // Active DOM Polling & Positioning for the current step
  useEffect(() => {
    if (!isVisible || !currentStep) return;

    let isCancelled = false;
    let pollTimer: ReturnType<typeof setInterval>;

    const checkElement = () => {
      if (isCancelled) return;

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
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          const updatedRect = el.getBoundingClientRect();
          setTargetRect({
            top: updatedRect.top,
            left: updatedRect.left,
            width: updatedRect.width,
            height: updatedRect.height,
          });
          setIsElementFound(true);
          if (pollTimer) clearInterval(pollTimer);
          return;
        }
      }
    };

    checkElement();
    pollTimer = setInterval(checkElement, 150);

    const handleWindowUpdate = () => {
      checkElement();
    };

    window.addEventListener('resize', handleWindowUpdate);
    window.addEventListener('scroll', handleWindowUpdate, true);

    return () => {
      isCancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      window.removeEventListener('resize', handleWindowUpdate);
      window.removeEventListener('scroll', handleWindowUpdate, true);
    };
  }, [currentStepIndex, location.pathname, isVisible, currentStep]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentStepIndex < INTERACTIVE_TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      console.log(`[AI TOUR] Step ${nextIndex + 1}`);
      setCurrentStepIndex(nextIndex);
      setIsElementFound(false);
      setTargetRect(null);
      const nextRoute = INTERACTIVE_TOUR_STEPS[nextIndex].route;
      if (location.pathname !== nextRoute) {
        navigate(nextRoute);
      }
    } else {
      handleComplete(true);
    }
  }, [currentStepIndex, location.pathname, navigate]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      console.log(`[AI TOUR] Step ${prevIndex + 1}`);
      setCurrentStepIndex(prevIndex);
      setIsElementFound(false);
      setTargetRect(null);
      const prevRoute = INTERACTIVE_TOUR_STEPS[prevIndex].route;
      if (location.pathname !== prevRoute) {
        navigate(prevRoute);
      }
    }
  }, [currentStepIndex, location.pathname, navigate]);

  const handleComplete = (routeToOnboarding = true) => {
    const uid = getCurrentUserId();
    setTourCompleted(uid, 'true');
    setIsVisible(false);
    if (onClose) onClose();

    if (routeToOnboarding) {
      navigate('/onboarding');
    }
  };

  const handleSkip = useCallback(() => {
    const uid = getCurrentUserId();
    setTourCompleted(uid, 'skipped');
    setIsVisible(false);
    if (onClose) onClose();
    navigate('/onboarding');
  }, [onClose, navigate]);

  // Keyboard navigation (Escape, ArrowRight, ArrowLeft, Enter)
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

  // Calculate compact responsive tooltip coordinates with pointer placement
  const getTooltipStyle = (): { style: React.CSSProperties; side: PlacementSide } => {
    const tooltipWidth = 290;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (!targetRect || !isElementFound) {
      return {
        style: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${tooltipWidth}px`,
          zIndex: 10002,
        },
        side: 'center',
      };
    }

    const margin = 16;
    let left = targetRect.left + targetRect.width + margin;
    let top = targetRect.top - 6;
    let determinedSide: PlacementSide = 'right';

    // If overflowing right (e.g. element on right edge of screen), place on left
    if (left + tooltipWidth > windowWidth - 16) {
      left = targetRect.left - tooltipWidth - margin;
      determinedSide = 'left';
    }

    // If still overflowing left (e.g. narrow mobile screen), place below
    if (left < 16) {
      left = Math.max(16, targetRect.left);
      top = targetRect.top + targetRect.height + margin;
      determinedSide = 'bottom';
    }

    // Clamp inside viewport boundaries
    left = Math.max(16, Math.min(left, windowWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, windowHeight - 200));

    return {
      style: {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
        zIndex: 10002,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      side: determinedSide,
    };
  };

  const { style: tooltipStyle, side: currentPlacement } = getTooltipStyle();
  const IconComponent = currentStep.icon || Sparkles;

  return (
    <>
      {/* ---------------- 1. Lightweight Non-Blocking Glowing Ring (Zero Dark Backdrop / Zero Blur) ---------------- */}
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

      {/* ---------------- 3. Compact SaaS Tooltip with Connecting Arrow ---------------- */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Website Tour: ${currentStep.title}`}
        style={tooltipStyle}
      >
        <div
          style={{
            position: 'relative',
            background: '#0F172A',
            border: '1.5px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.25)',
            borderRadius: 14,
            padding: '14px 16px',
            color: '#FFFFFF',
            animation: 'tourFadeIn 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* Connecting Arrow Pointer */}
          {targetRect && isElementFound && currentPlacement === 'right' && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: -7,
                width: 12,
                height: 12,
                background: '#0F172A',
                borderLeft: '1.5px solid rgba(99, 102, 241, 0.5)',
                borderBottom: '1.5px solid rgba(99, 102, 241, 0.5)',
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {targetRect && isElementFound && currentPlacement === 'left' && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: -7,
                width: 12,
                height: 12,
                background: '#0F172A',
                borderRight: '1.5px solid rgba(99, 102, 241, 0.5)',
                borderTop: '1.5px solid rgba(99, 102, 241, 0.5)',
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {targetRect && isElementFound && currentPlacement === 'bottom' && (
            <div
              style={{
                position: 'absolute',
                top: -7,
                left: 24,
                width: 12,
                height: 12,
                background: '#0F172A',
                borderTop: '1.5px solid rgba(99, 102, 241, 0.5)',
                borderLeft: '1.5px solid rgba(99, 102, 241, 0.5)',
                transform: 'rotate(45deg)',
              }}
            />
          )}

          {/* Top Row: Step Count Pill + Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#C7D2FE',
                  background: 'rgba(99, 102, 241, 0.25)',
                  padding: '2px 7px',
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
              <X size={14} />
            </button>
          </div>

          {/* Title & Short Punchy Copy (< 20 words) */}
          <div>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#F8FAFC',
                margin: '0 0 3px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <IconComponent size={14} color="#818CF8" />
              <span>{currentStep.title}</span>
            </h4>
            <p
              style={{
                fontSize: 12,
                color: '#CBD5E1',
                lineHeight: 1.4,
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
              paddingTop: 6,
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
                padding: '4px 9px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentStepIndex === 0 ? '#475569' : '#CBD5E1',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={12} />
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
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '3px 5px',
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
                  gap: 3,
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
                }}
              >
                <span>
                  {currentStepIndex === INTERACTIVE_TOUR_STEPS.length - 1 ? 'Finish & Start Onboarding 🎓' : 'Next'}
                </span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveTour;
