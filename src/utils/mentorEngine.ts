/**
 * CAREEROS - Intent-Aware AI Career Mentor & Resource Engine
 * Detects user intent across coding, aptitude, programming tutorials, interview prep,
 * and placement drives. Enforces strict personalization gating and verified external links.
 */

import { getUserActivitySummary } from './userActivity.ts';
import { getAssessmentRecord, getUserRoadmap } from './assessmentValidation.ts';
import { getStudentProfile } from './userProfile.ts';
import { getResumeVersions, getStudentAtsScore, hasUserResume } from './resumeVersioning.ts';
import type { StudentProfile } from '../types/dashboard.ts';

export interface ActionButton {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface MentorReply {
  text: string;
  actionUrl?: string;
  actionLabel?: string;
  actionButtons: ActionButton[];
}

/**
 * Intelligent Intent-Aware Career & Learning Assistant Engine
 */
export function generateSmartMentorReply(
  query: string,
  profile?: Partial<StudentProfile> | null
): MentorReply {
  const q = query.toLowerCase().trim();
  const name = profile?.name ? profile.name.trim().split(' ')[0] : 'there';
  const summary = getUserActivitySummary(profile);
  const isAssessed = summary.hasAssessment;

  // Personalization notice helper
  const personalizationNote = !isAssessed
    ? `\n\n> ⚠️ *I don't have enough assessment data yet to personalize this recommendation. Complete your 15-minute diagnostic assessment to calibrate your exact skill gaps.*`
    : `\n\n> 🎯 *Personalized Insight: Your verified diagnostic benchmark is ${summary.assessmentScore}% with active knowledge tracking enabled.*`;

  // 1. Aptitude & Quantitative Reasoning Practice
  if (
    q.includes('aptitude') ||
    q.includes('reasoning') ||
    q.includes('indiabix') ||
    q.includes('quantitative') ||
    q.includes('math problem') ||
    q.includes('placement aptitude') ||
    q.includes('data interpretation')
  ) {
    return {
      text: `Here is the **recommended ecosystem for Aptitude & Quantitative Reasoning** preparation:\n\n` +
        `### 🧠 Top Practice Platforms & Resources:\n` +
        `1. **CAREEROS Assessment & Practice Engine** (Built-in)\n` +
        `   - Timed quantitative, logical reasoning, and data interpretation questions calibrated to campus cutoffs.\n\n` +
        `2. [IndiaBIX Quantitative Aptitude](https://www.indiabix.com/aptitude/questions-and-answers/)\n` +
        `   - **100% Free**: Industry standard for topic-wise placement aptitude practice (Numbers, Work & Time, Probability, Geometry).\n\n` +
        `3. [GeeksforGeeks Aptitude Practice](https://www.geeksforgeeks.org/aptitude-questions-and-answers/)\n` +
        `   - **100% Free**: Curated company-wise test series and step-by-step mathematical reasoning shortcuts.\n\n` +
        `4. [Khan Academy Math](https://www.khanacademy.org/math)\n` +
        `   - **100% Free**: World-class foundational refreshers for algebra, statistics, and mental math.` +
        personalizationNote,
      actionUrl: '/practice',
      actionLabel: 'Open Aptitude Practice 🧠',
      actionButtons: [
        { label: 'Open Aptitude Practice 🧠', url: '/practice' },
        { label: isAssessed ? 'Review Assessment 🎯' : 'Take Diagnostic Assessment 🎯', url: '/assessment' },
      ],
    };
  }

  // 2. Programming Languages & Tutorials (Python, SQL, C++, Java, Web Dev)
  if (
    q.includes('python') ||
    q.includes('sql') ||
    q.includes('c++') ||
    q.includes('java') ||
    q.includes('learn programming') ||
    q.includes('tutorial') ||
    q.includes('freecodecamp') ||
    q.includes('exercism') ||
    q.includes('course') ||
    q.includes('web dev') ||
    q.includes('javascript')
  ) {
    return {
      text: `Here are the **top verified platforms & tutorials** to master programming languages and SQL:\n\n` +
        `### 📚 Verified Learning Tracks:\n` +
        `1. **CAREEROS Learning Hub** (Built-in)\n` +
        `   - Curated engineering courses, lesson roadmaps, and instant sandbox environments.\n\n` +
        `2. [freeCodeCamp](https://www.freecodecamp.org/)\n` +
        `   - **100% Free**: Comprehensive interactive certifications in Python, JavaScript, Relational Databases, and Backend Engineering.\n\n` +
        `3. [Exercism](https://exercism.org/)\n` +
        `   - **100% Free**: Code exercises with automated test suites and real human mentor feedback across 60+ languages.\n\n` +
        `4. [HackerRank SQL Track](https://www.hackerrank.com/domains/sql)\n` +
        `   - **100% Free**: Interactive queries covering aggregations, joins, subqueries, and window functions.\n\n` +
        `5. [freeCodeCamp YouTube Channel](https://www.youtube.com/@freecodecamp)\n` +
        `   - **100% Free**: High-definition, full-length crash courses on Python, DSA, and System Design.` +
        personalizationNote,
      actionUrl: '/learning',
      actionLabel: 'Open Learning Hub 📚',
      actionButtons: [
        { label: 'Open Learning Hub 📚', url: '/learning' },
        { label: 'Open Coding Practice 💻', url: '/practice' },
      ],
    };
  }

  // 3. Free vs Paid Resource Clarification
  if (q.includes('free vs paid') || q.includes('is it free') || q.includes('cost') || q.includes('best free')) {
    return {
      text: `### 💡 Free vs. Paid Career Preparation Resources Breakdown:\n\n` +
        `#### 🟢 Top 100% Free Platforms:\n` +
        `- [freeCodeCamp](https://www.freecodecamp.org/): Complete interactive curriculum & certificates (Zero paywalls).\n` +
        `- [Exercism](https://exercism.org/): Mentored language tracks (Completely open-source).\n` +
        `- [IndiaBIX](https://www.indiabix.com/aptitude/questions-and-answers/): Full aptitude question bank.\n` +
        `- [Codeforces](https://codeforces.com/problemset): Free competitive contest archive.\n` +
        `- [LeetCode Free](https://leetcode.com/problemset/all/): 2,000+ free algorithmic problems and NeetCode 150.\n\n` +
        `#### 🟡 Freemium / Paid Options (Optional):\n` +
        `- **LeetCode Premium**: Unlocks company-specific tagged filters ($35/mo).\n` +
        `- **Coursera / edX**: Free to audit; paid certificate verification.\n\n` +
        `💡 *Recommendation*: You do NOT need paid subscriptions for Tier-1 placements. Free resources combined with CAREEROS Deep Knowledge Tracing provide all necessary practice!`,
      actionUrl: '/practice',
      actionLabel: 'Open Coding Practice 💻',
      actionButtons: [
        { label: 'Open Coding Practice 💻', url: '/practice' },
        { label: 'Open Learning Hub 📚', url: '/learning' },
      ],
    };
  }

  // 4. Coding & DSA Practice Platforms
  if (
    q.includes('where to practice') ||
    q.includes('where can i practice') ||
    q.includes('practice coding') ||
    q.includes('practice dsa') ||
    q.includes('coding platform') ||
    q.includes('leetcode') ||
    q.includes('hackerrank') ||
    q.includes('geeksforgeeks') ||
    q.includes('gfg') ||
    q.includes('coding site') ||
    q.includes('solve problem') ||
    q.includes('dsa problem') ||
    q.includes('codeforces') ||
    q.includes('codechef')
  ) {
    return {
      text: `Here are the **top verified platforms & resources** to practice coding and master DSA for technical interviews:\n\n` +
        `### 🚀 Recommended Practice Ecosystem:\n` +
        `1. **CAREEROS Practice Arena** (Built-in)\n` +
        `   - Tailored algorithmic challenges categorized by topic (Binary Trees, Dynamic Programming, Two Pointers, Graphs, Arrays).\n` +
        `   - Sectional timed cutoffs and instant unit test evaluation.\n\n` +
        `2. [LeetCode](https://leetcode.com/problemset/all/)\n` +
        `   - **NeetCode 150 & Blind 75**: Essential problem patterns for FAANG/Tier-1 placement rounds.\n` +
        `   - **Weekly Contests**: Weekly contests to build time-management stamina under exam conditions.\n\n` +
        `3. [HackerRank](https://www.hackerrank.com/domains)\n` +
        `   - Excellent for language certifications (C++, Java, Python) and SQL problem solving.\n\n` +
        `4. [GeeksforGeeks](https://www.geeksforgeeks.org/explore)\n` +
        `   - Best for company-specific interview archives (Amazon, Microsoft, TCS, Goldman Sachs).\n\n` +
        `5. [Codeforces](https://codeforces.com/problemset) & [CodeChef](https://www.codechef.com/practice)\n` +
        `   - Competitive programming to accelerate algorithmic intuition and rapid debugging.` +
        personalizationNote,
      actionUrl: '/practice',
      actionLabel: 'Open Practice Arena 💻',
      actionButtons: [
        { label: 'Open Practice Arena 💻', url: '/practice' },
        { label: isAssessed ? 'View AI Roadmap 🗺️' : 'Take Diagnostic Assessment 🎯', url: isAssessed ? '/career-roadmap' : '/assessment' },
      ],
    };
  }

  // 5. Skill gaps & Weaknesses (Strict Personalization Gated)
  if (
    q.includes('skill gap') ||
    q.includes('weakness') ||
    q.includes('what should i study') ||
    q.includes('where am i lagging') ||
    q.includes('my skills') ||
    q.includes('readiness')
  ) {
    if (!isAssessed) {
      return {
        text: `### 📊 Skill Gap & Knowledge State Analysis\n\n` +
          `> ⚠️ **Notice**: I don't have enough assessment data yet to personalize this recommendation.\n\n` +
          `CAREEROS uses **Deep Knowledge Tracing (DKT)** and **Sentence-BERT embeddings** to analyze your genuine competencies across Algorithms, Data Structures, Aptitude, and Communication.\n\n` +
          `To calibrate your baseline and discover your exact skill gaps:\n` +
          `1. Complete the **15-minute diagnostic placement assessment**.\n` +
          `2. Your dashboard will automatically calculate your verified readiness score and identify priority remediation areas.\n` +
          `3. Your daily adaptive roadmap will be personalized to target your weakest topics.`,
        actionUrl: '/assessment',
        actionLabel: 'Take Diagnostic Assessment 🎯',
        actionButtons: [
          { label: 'Take Diagnostic Assessment 🎯', url: '/assessment' },
          { label: 'Open Coding Practice 💻', url: '/practice' },
        ],
      };
    }

    return {
      text: `### 📊 Verified Skill Gap & Knowledge State Analysis\n\n` +
        `Based on your completed diagnostic assessment:\n\n` +
        `- **Verified Overall Readiness**: **${summary.assessmentScore}%**\n` +
        `- **Coding Competency**: **${summary.codingScore !== null ? summary.codingScore + '%' : 'Awaiting practice submissions'}**\n` +
        `- **Aptitude & Logic**: **${summary.aptitudeScore !== null ? summary.aptitudeScore + '%' : 'Awaiting practice submissions'}**\n` +
        `- **Communication Level**: **${summary.communicationScore !== null ? summary.communicationScore + '%' : 'Awaiting speaking drill'}**\n\n` +
        `### 🎯 Recommended Action Plan:\n` +
        `- Focus on **Hierarchical Data Structures & Dynamic Programming** in the Practice Arena.\n` +
        `- Complete scheduled morning study tasks in **Today's Plan** to maintain your streak.`,
      actionUrl: '/practice',
      actionLabel: 'Open Practice Arena 💻',
      actionButtons: [
        { label: 'Open Practice Arena 💻', url: '/practice' },
        { label: 'View AI Roadmap 🗺️', url: '/career-roadmap' },
      ],
    };
  }

  // 6. Roadmap / Learning Path
  if (
    q.includes('roadmap') ||
    q.includes('learning path') ||
    q.includes('syllabus') ||
    q.includes('curriculum') ||
    q.includes('schedule')
  ) {
    return {
      text: `### 🗺️ Your Adaptive AI Career Roadmap\n\n` +
        `Your personalized roadmap aligns your study milestones directly with upcoming placement drives:\n\n` +
        `- **Phase 1**: Foundations & Asymptotic Complexity Analysis\n` +
        `- **Phase 2**: Hierarchical Structures, Binary Trees & Graphs\n` +
        `- **Phase 3**: Systems Engineering, Database Indexing & Concurrency\n` +
        `- **Phase 4**: Timed Mock Placement Diagnoses & STAR Behavioral Mastery\n\n` +
        `Explore your milestones and track real-time progress on your roadmap!` +
        personalizationNote,
      actionUrl: '/career-roadmap',
      actionLabel: 'View AI Roadmap 🗺️',
      actionButtons: [
        { label: 'View AI Roadmap 🗺️', url: '/career-roadmap' },
        { label: isAssessed ? 'Open Coding Practice 💻' : 'Take Diagnostic Assessment 🎯', url: isAssessed ? '/practice' : '/assessment' },
      ],
    };
  }

  // 7. Resume & ATS Score
  if (
    q.includes('resume') ||
    q.includes('ats') ||
    q.includes('cv') ||
    q.includes('score my resume')
  ) {
    return {
      text: `### 📄 AI Resume Builder & ATS Score Optimization\n\n` +
        `Our ATS Analyzer parses your resume against top applicant tracking systems (Workday, Greenhouse, Lever):\n\n` +
        `- **100% Data-Driven Scoring**: Quantified action verb usage, technical skills taxonomy, and JD alignment.\n` +
        `- **Actionable Recommendations**: Clear suggestions to format bullets with measurable metrics.\n` +
        `- **One-Click Export**: Download professional PDF and DOCX formats anytime.`,
      actionUrl: '/resume-builder',
      actionLabel: 'Open Resume Builder 📄',
      actionButtons: [
        { label: 'Open Resume Builder 📄', url: '/resume-builder' },
        { label: 'Explore Opportunities 💼', url: '/opportunities' },
      ],
    };
  }

  // 8. Interview / Mock / STAR method
  if (
    q.includes('interview') ||
    q.includes('mock') ||
    q.includes('star') ||
    q.includes('speaking') ||
    q.includes('hr round')
  ) {
    return {
      text: `### 🎤 AI Interview & Behavioral Studio\n\n` +
        `Prepare for technical and manager rounds with real-time feedback:\n\n` +
        `- **STAR Behavioral Method**: Structure answers into *Situation, Task, Action, and Result*.\n` +
        `- **Technical Q&A**: Live coding simulation and architectural storytelling.\n` +
        `- **Speaking Studio**: Practice fluency, vocabulary, and communication clarity.`,
      actionUrl: '/interview-studio',
      actionLabel: 'Launch Interview Studio 🎤',
      actionButtons: [
        { label: 'Launch Interview Studio 🎤', url: '/interview-studio' },
        { label: 'Open Speaking Studio 🗣️', url: '/speaking' },
      ],
    };
  }

  // 9. Placement Opportunities & Drives
  if (
    q.includes('opportunity') ||
    q.includes('internship') ||
    q.includes('drive') ||
    q.includes('job') ||
    q.includes('company') ||
    q.includes('placement')
  ) {
    return {
      text: `### 💼 Placement Opportunities & Deadlines\n\n` +
        `Track upcoming campus placement drives and match your verified skill profile:\n\n` +
        `- **Role Fit Matching**: Real-time compatibility scores for Goldman Sachs, Google, Microsoft, and high-growth tech startups.\n` +
        `- **Smart Deadlines**: Urgency countdowns and curated pre-test revision packets.\n` +
        `- **Application Tracker**: Manage shortlisted opportunities in one place.`,
      actionUrl: '/opportunities',
      actionLabel: 'Explore Opportunities 💼',
      actionButtons: [
        { label: 'Explore Opportunities 💼', url: '/opportunities' },
        { label: 'Open Resume Builder 📄', url: '/resume-builder' },
      ],
    };
  }

  // 10. General Assistant Response
  return {
    text: `Hello ${name}! As your **CAREEROS AI Career Mentor**, I can assist you with:\n\n` +
      `- 💻 **Coding & DSA Practice**: Recommending LeetCode, HackerRank, and internal practice arena drills.\n` +
      `- 🧠 **Aptitude & Reasoning**: Recommending IndiaBIX, GFG, and sectional placement drills.\n` +
      `- 📚 **Programming Tutorials**: Free certifications on Python, SQL, C++, and Web Development.\n` +
      `- 🗺️ **Personalized Roadmap**: Generating adaptive milestones tailored to your target company drives.\n` +
      `- 📊 **Skill Gap Diagnosis**: Analyzing strengths and weaknesses using Deep Knowledge Tracing.\n` +
      `- 📄 **Resume ATS Optimization**: Crafting high-impact resumes tailored to product engineering criteria.\n` +
      `- 🎤 **Mock Interviews**: Interactive STAR behavioral and technical simulation.` +
      personalizationNote,
    actionUrl: '/practice',
    actionLabel: 'Open Coding Practice 💻',
    actionButtons: [
      { label: 'Open Coding Practice 💻', url: '/practice' },
      { label: isAssessed ? 'View AI Roadmap 🗺️' : 'Take Diagnostic Assessment 🎯', url: isAssessed ? '/career-roadmap' : '/assessment' },
    ],
  };
}

export function generateFallbackMentorReply(
  query: string,
  profile?: Partial<StudentProfile> | null
): MentorReply {
  return generateSmartMentorReply(query, profile);
}

/**
 * Authoritative Single-Source-of-Truth Data Retrieval Functions
 */
export function getUserAssessmentResults(studentId?: string) {
  return getAssessmentRecord(studentId);
}

export function getUserCodingHistory(studentId?: string) {
  const summary = getUserActivitySummary(getStudentProfile());
  return {
    codingScore: summary.codingScore,
    hasCodingActivity: summary.hasCodingActivity,
    eventsCount: summary.totalEventsCount,
  };
}

export function getUserSkillScores(studentId?: string) {
  const summary = getUserActivitySummary(getStudentProfile());
  return {
    readinessScore: summary.assessmentScore,
    codingScore: summary.codingScore,
    aptitudeScore: summary.aptitudeScore,
    communicationScore: summary.communicationScore,
    isAssessed: summary.hasAssessment,
  };
}

export function getUserRoadmapData(studentId?: string) {
  return getUserRoadmap(studentId);
}

export function getUserResumeData(studentId?: string) {
  const hasResume = hasUserResume(studentId);
  const atsScore = getStudentAtsScore(studentId);
  const versions = getResumeVersions(studentId);
  return {
    hasResume,
    atsScore,
    versionsCount: versions.length,
    activeVersion: versions[0] || null,
  };
}

// Canonical tool-use aliases
export const getAssessmentResults = getUserAssessmentResults;
export const getCodingHistory = getUserCodingHistory;
export const getSkillScores = getUserSkillScores;
export const getRoadmap = getUserRoadmapData;
export const getResume = getUserResumeData;


