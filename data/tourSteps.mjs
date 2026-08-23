/**
 * CAREEROS - AI Website Tour Steps Data Definition
 * Compact, punchy 1-2 sentence tour configurations with stable data-tour-id selectors
 */

export const TOUR_STEPS = [
  {
    id: 'dashboard',
    tourId: 'dashboard',
    target: 'dashboard',
    title: 'Student Dashboard',
    description: 'Your career mission control. Track live DKT skill mastery, readiness scores, and daily tasks.',
    route: '/dashboard',
    badge: 'Live DKT State',
  },
  {
    id: 'assessment',
    tourId: 'assessment',
    target: 'assessment',
    title: 'Diagnostic Assessment',
    description: 'Proctored Tier-1 benchmark arena with 22 coding challenges and real sandbox execution.',
    route: '/assessment',
    badge: 'V8 Sandbox Arena',
  },
  {
    id: 'roadmap',
    tourId: 'roadmap',
    target: 'roadmap',
    title: 'Adaptive AI Roadmap',
    description: 'Personalized pathway powered by Sentence-BERT embeddings, prioritizing critical skill gaps.',
    route: '/career-roadmap',
    badge: 'Sentence-BERT Engine',
  },
  {
    id: 'practice',
    tourId: 'practice',
    target: 'practice',
    title: 'Coding & Aptitude Practice',
    description: 'Master core DSA problems with instant test case verification and complexity feedback.',
    route: '/practice',
    badge: 'Real Testcases',
  },
  {
    id: 'interview',
    tourId: 'interview',
    target: 'interview',
    title: 'AI Interview Studio',
    description: 'Simulate high-stakes mock interviews with Sophia AI featuring speech transcription and voice prompts.',
    route: '/interview-studio',
    badge: 'Voice & Speech AI',
  },
  {
    id: 'mentor',
    tourId: 'mentor',
    target: 'mentor',
    title: 'AI Career Mentor',
    description: 'Your 24/7 copilot for instant interview drills, skill gap insights, and platform guidance.',
    route: '/dashboard',
    badge: '24/7 AI Copilot',
  },
  {
    id: 'opportunities',
    tourId: 'opportunities',
    target: 'opportunities',
    title: 'Placement Drives & Calendar',
    description: 'Explore campus hiring drives and internship openings with semantic skill-match scoring.',
    route: '/opportunities',
    badge: 'Campus Drives',
  },
  {
    id: 'profile',
    tourId: 'profile',
    target: 'profile',
    title: 'Profile & ATS Calibration',
    description: 'Calibrate your target roles, verified competencies, and ATS resume compatibility.',
    route: '/profile',
    badge: 'Student Identity',
  },
];
