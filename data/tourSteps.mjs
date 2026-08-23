/**
 * CAREEROS - AI Website Tour Steps Data Definition
 * Covers all 8 critical application zones with stable data-tour attributes
 */

export const TOUR_STEPS = [
  {
    id: 'dashboard',
    target: 'dashboard',
    title: '1. Intelligent Student Dashboard',
    description:
      'Your central career mission control. Real-time Deep Knowledge Tracing (DKT) tracks your skill mastery across 10 foundational competencies with hiring readiness benchmarks.',
    route: '/dashboard',
    badge: 'Live DKT Knowledge State',
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
    keyFeatures: ['ATS Compatibility Score', 'Campus Drive Registration', 'Target Company Calibration'],
  },
];
