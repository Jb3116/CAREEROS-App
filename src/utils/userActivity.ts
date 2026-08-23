/**
 * CAREEROS - Authoritative User Activity & Evaluation State Engine
 * Determines whether a student profile has genuine evaluation evidence
 * (completed assessment, real coding/aptitude submissions, speaking drills, etc.).
 */

import type { StudentProfile } from '../types/dashboard.ts';
import { getAssessmentRecord } from './assessmentValidation.ts';

export interface UserActivitySummary {
  hasAnyActivity: boolean;
  hasAssessment: boolean;
  assessmentScore: number | null;
  hasCodingActivity: boolean;
  codingScore: number | null;
  hasAptitudeActivity: boolean;
  aptitudeScore: number | null;
  hasCommunicationActivity: boolean;
  communicationScore: number | null;
  hasLanguageActivity: boolean;
  languageProgress: number | null;
  totalEventsCount: number;
  streakDays: number;
}

export function getUserActivitySummary(profile?: Partial<StudentProfile> | null): UserActivitySummary {
  let hasAssessment = false;
  let assessmentScore: number | null = null;
  let hasCoding = false;
  let codingScore: number | null = null;
  let hasAptitude = false;
  let aptitudeScore: number | null = null;
  let hasCommunication = false;
  let communicationScore: number | null = null;
  let hasLanguage = false;
  let languageProgress: number | null = null;
  let totalEventsCount = 0;
  let streakDays = 0;

  if (typeof localStorage !== 'undefined') {
    const studentIdentifier = profile?.email || (profile as any)?.id;

    // 1. Check validated assessment record
    try {
      const record = getAssessmentRecord(studentIdentifier);
      if (
        record &&
        record.status === 'COMPLETED_WITH_RESPONSES' &&
        typeof record.overallScore === 'number' &&
        record.overallScore > 0
      ) {
        hasAssessment = true;
        assessmentScore = record.overallScore;
        if (typeof record.codingScore === 'number') {
          hasCoding = true;
          codingScore = record.codingScore;
        }
        if (typeof record.aptitudeScore === 'number') {
          hasAptitude = true;
          aptitudeScore = record.aptitudeScore;
        }
      }
    } catch {}

    // 2. Check local student events ledger (independent practice activities)
    try {
      const localEventsStr = localStorage.getItem('careeros_local_events');
      if (localEventsStr) {
        const events = JSON.parse(localEventsStr);
        if (Array.isArray(events)) {
          totalEventsCount = events.length;

          // Coding events
          const codingEvents = events.filter(
            (e) => e.activity === 'problemSolved' || e.activity === 'code_practice'
          );
          if (codingEvents.length > 0) {
            hasCoding = true;
            const correctCoding = codingEvents.filter((e) => e.correct !== false).length;
            codingScore = Math.min(100, Math.round((correctCoding / codingEvents.length) * 100));
          }

          // Aptitude events
          const aptitudeEvents = events.filter(
            (e) => e.activity === 'aptitude_quiz' || e.activity === 'assessment_aptitude'
          );
          if (aptitudeEvents.length > 0) {
            hasAptitude = true;
            const correctApt = aptitudeEvents.filter((e) => e.correct !== false).length;
            aptitudeScore = Math.min(100, Math.round((correctApt / aptitudeEvents.length) * 100));
          }

          // Communication events
          const commEvents = events.filter(
            (e) => e.activity === 'speakingSessionCompleted' || e.activity === 'interviewCompleted'
          );
          if (commEvents.length > 0) {
            hasCommunication = true;
            communicationScore = Math.min(100, Math.round(commEvents.length * 20));
          }

          // Language events
          const langEvents = events.filter((e) => e.activity === 'lessonCompleted');
          if (langEvents.length > 0) {
            hasLanguage = true;
            languageProgress = Math.min(100, langEvents.length * 15);
          }
        }
      }
    } catch {}

    // Check language storage keys
    try {
      const germanStr = localStorage.getItem('careeros_lang_german_progress');
      if (germanStr) {
        const parsed = JSON.parse(germanStr);
        if (parsed && parsed.completedLessonIds && parsed.completedLessonIds.length > 0) {
          hasLanguage = true;
          languageProgress = parsed.courseProgressPercent || Math.round((parsed.completedLessonIds.length / 10) * 100);
        }
      }
    } catch {}

    streakDays = (profile && profile.streakDays) || 0;
  }

  const hasAnyActivity =
    hasAssessment || hasCoding || hasAptitude || hasCommunication || hasLanguage || totalEventsCount > 0;

  return {
    hasAnyActivity,
    hasAssessment,
    assessmentScore,
    hasCodingActivity: hasCoding,
    codingScore,
    hasAptitudeActivity: hasAptitude,
    aptitudeScore,
    hasCommunicationActivity: hasCommunication,
    communicationScore,
    hasLanguageActivity: hasLanguage,
    languageProgress,
    totalEventsCount,
    streakDays,
  };
}

export function hasUserActivity(profile?: Partial<StudentProfile> | null): boolean {
  return getUserActivitySummary(profile).hasAnyActivity;
}
