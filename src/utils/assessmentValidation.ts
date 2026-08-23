/**
 * CAREEROS - Assessment State, Validation & Scoring Engine
 * Enforces strict validation rules, state management (NOT_STARTED, IN_PROGRESS,
 * COMPLETED_WITH_RESPONSES, COMPLETED_EMPTY, INVALID), and data-driven scoring.
 */

import { CODING_QUESTION_BANK, APTITUDE_QUESTION_BANK } from '../data/assessmentQuestions.ts';
import type { CodingQuestion } from '../data/assessmentQuestions.ts';

export type AssessmentStateStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED_WITH_RESPONSES'
  | 'COMPLETED_EMPTY'
  | 'INVALID';

export interface AssessmentRecord {
  status: AssessmentStateStatus;
  studentId: string;
  totalQuestions: number;
  attemptedCount: number;
  codingAttemptedCount: number;
  codingPassedCount: number;
  codingScore: number | null; // percentage score or null if not attempted
  aptitudeAttemptedCount: number;
  aptitudeCorrectCount: number;
  aptitudeScore: number | null; // percentage score or null if not attempted
  overallScore: number | null; // derived readiness score or null if 0 attempted
  categoryStats?: Record<string, { correct: number; total: number; attempted: number }>;
  difficultyStats?: Record<string, { correct: number; total: number; attempted: number }>;
  submittedAt: string | null;
  answers?: {
    coding: Record<string, { code: string; lang: string }>;
    aptitude: Record<string, number>;
  };
}

/**
 * Check if a coding submission represents a genuine attempt (not empty, not blank, not untouched starter template)
 */
export function isCodingAttempted(
  code: string | undefined | null,
  question?: CodingQuestion,
  lang: string = 'python'
): boolean {
  if (!code || typeof code !== 'string') return false;
  const trimmed = code.trim();
  if (trimmed.length === 0) return false;

  // Check if code is just untouched starter template
  if (question && question.starterTemplates) {
    const templates = Object.values(question.starterTemplates).map((t) => (t || '').trim());
    if (templates.includes(trimmed)) {
      return false;
    }
  }

  // Meaningful user code must have substantive non-comment, non-pass content
  const codeLines = trimmed
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('//') && l !== 'pass' && l !== '{' && l !== '}');

  return codeLines.length > 0;
}

/**
 * Check if an aptitude submission represents a selected answer
 */
export function isAptitudeAttempted(answer: number | undefined | null): boolean {
  return typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer <= 3;
}

/**
 * Calculate attempt statistics across coding and aptitude question banks
 */
export function calculateAssessmentAttemptCounts(
  userCodeAnswers: Record<string, { code: string; lang: string }> = {},
  userAptitudeAnswers: Record<string, number> = {}
): {
  totalQuestions: number;
  codingTotal: number;
  codingAttempted: number;
  aptitudeTotal: number;
  aptitudeAttempted: number;
  totalAttempted: number;
} {
  const codingTotal = CODING_QUESTION_BANK.length;
  const aptitudeTotal = APTITUDE_QUESTION_BANK.length;
  const totalQuestions = codingTotal + aptitudeTotal;

  let codingAttempted = 0;
  for (const q of CODING_QUESTION_BANK) {
    const ans = userCodeAnswers[q.id];
    if (ans && isCodingAttempted(ans.code, q, ans.lang)) {
      codingAttempted++;
    }
  }

  let aptitudeAttempted = 0;
  for (const q of APTITUDE_QUESTION_BANK) {
    const ans = userAptitudeAnswers[q.id];
    if (isAptitudeAttempted(ans)) {
      aptitudeAttempted++;
    }
  }

  return {
    totalQuestions,
    codingTotal,
    codingAttempted,
    aptitudeTotal,
    aptitudeAttempted,
    totalAttempted: codingAttempted + aptitudeAttempted,
  };
}

/**
 * Storage key helper scoped to student ID / email to ensure strict auth isolation
 */
export function getAssessmentStorageKey(studentId?: string): string {
  if (!studentId) return 'careeros_assessment_results';
  const cleanId = String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `careeros_assessment_results_${cleanId}`;
}

/**
 * Retrieve persistent assessment record for a student
 */
export function getAssessmentRecord(studentId?: string): AssessmentRecord | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    // 1. Try user-scoped storage key
    if (studentId) {
      const userScopedKey = getAssessmentStorageKey(studentId);
      const scopedStr = localStorage.getItem(userScopedKey);
      if (scopedStr) {
        const record = JSON.parse(scopedStr) as AssessmentRecord;
        if (record) {
          if (!record.status && typeof (record as any).overallScore === 'number' && (record as any).overallScore > 0) {
            record.status = 'COMPLETED_WITH_RESPONSES';
          }
          if (record.status) return record;
        }
      }
    }

    // 2. Fallback to generic key if matching studentId
    const genericStr = localStorage.getItem('careeros_assessment_results');
    if (genericStr) {
      const record = JSON.parse(genericStr) as AssessmentRecord;
      if (record) {
        if (!record.status && typeof (record as any).overallScore === 'number' && (record as any).overallScore > 0) {
          record.status = 'COMPLETED_WITH_RESPONSES';
        }
        if (record.status) {
          if (!studentId || !record.studentId || record.studentId === studentId) {
            return record;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error loading assessment record:', e);
  }

  return null;
}

/**
 * Save persistent assessment record with user-scoped isolation
 */
export function saveAssessmentRecord(record: AssessmentRecord): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const recordStr = JSON.stringify(record);

    // Save under generic key
    localStorage.setItem('careeros_assessment_results', recordStr);

    // Save under user-scoped key
    if (record.studentId) {
      const userScopedKey = getAssessmentStorageKey(record.studentId);
      localStorage.setItem(userScopedKey, recordStr);
    }
  } catch (e) {
    console.error('Error saving assessment record:', e);
  }
}

/**
 * Check if the user has a valid completed assessment with actual responses & derived score
 */
export function hasAssessmentRecord(studentId?: string): boolean {
  const record = getAssessmentRecord(studentId);
  return Boolean(
    record &&
    record.status === 'COMPLETED_WITH_RESPONSES' &&
    typeof record.overallScore === 'number' &&
    record.overallScore > 0
  );
}

/**
 * Storage key helper for user-scoped career roadmap
 */
export function getRoadmapStorageKey(studentId?: string): string {
  if (!studentId) return 'careeros_career_roadmap';
  const cleanId = String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `careeros_career_roadmap_${cleanId}`;
}

/**
 * Retrieve user-scoped personalized roadmap
 */
export function getUserRoadmap(studentId?: string): any[] | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    if (studentId) {
      const userKey = getRoadmapStorageKey(studentId);
      const scopedStr = localStorage.getItem(userKey);
      if (scopedStr) {
        const parsed = JSON.parse(scopedStr);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }

    // Fallback to generic key only if valid assessment exists
    const genericStr = localStorage.getItem('careeros_career_roadmap');
    if (genericStr && hasAssessmentRecord(studentId)) {
      const parsed = JSON.parse(genericStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error retrieving user roadmap:', e);
  }

  return null;
}

/**
 * Save user-scoped personalized roadmap
 */
export function saveUserRoadmap(phases: any[], studentId?: string): void {
  if (typeof localStorage === 'undefined' || !Array.isArray(phases)) return;

  try {
    const serialized = JSON.stringify(phases);
    localStorage.setItem('careeros_career_roadmap', serialized);

    if (studentId) {
      const userKey = getRoadmapStorageKey(studentId);
      localStorage.setItem(userKey, serialized);
    }
  } catch (e) {
    console.error('Error saving user roadmap:', e);
  }
}

/**
 * Clear temporary answers and assessment record (e.g. for retaking test)
 */
export function clearAssessmentRecord(studentId?: string): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem('careeros_assessment_results');
    localStorage.removeItem('careeros_assessment_coding');
    localStorage.removeItem('careeros_assessment_aptitude');
    localStorage.removeItem('careeros_career_roadmap');

    if (studentId) {
      const cleanId = String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_');
      localStorage.removeItem(`careeros_assessment_results_${cleanId}`);
      localStorage.removeItem(`careeros_assessment_coding_${cleanId}`);
      localStorage.removeItem(`careeros_assessment_aptitude_${cleanId}`);
      localStorage.removeItem(`careeros_career_roadmap_${cleanId}`);
    }
  } catch {}
}
