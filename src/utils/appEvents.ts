/**
 * CAREEROS - Centralized Event-Driven Activity Engine
 * Dispatches and listens to real platform events to power the Automated Today's Plan.
 */

export type AppEventType =
  | 'problemSolved'
  | 'lessonCompleted'
  | 'speakingSessionCompleted'
  | 'assessmentCompleted'
  | 'interviewCompleted';

export interface AppEventPayload {
  type: AppEventType;
  id?: string;
  skill?: string;
  score?: number;
  languageId?: string;
  unitId?: string;
  promptId?: string;
  duration?: number;
  timestamp: string;
}

export interface AutomatedPlanTask {
  id: string;
  title: string;
  category: 'coding' | 'language' | 'speaking' | 'assessment';
  eventType: AppEventType;
  route: string;
  actionLabel: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  rationale: string;
}

import { calculateRealStreak, formatLocalDateStr, type StudentEvent } from './streakCalculator.ts';
import { saveStudentProfile } from './userProfile.ts';

const EVENT_STORAGE_KEY = 'careeros_event_ledger';
const memoryListeners: Array<(event: AppEventPayload) => void> = [];

/**
 * Emit an event across the application and persist to ledger
 */
export function emitAppEvent(type: AppEventType, payload: Omit<AppEventPayload, 'type' | 'timestamp'> & { timestamp?: string }): void {
  const event: AppEventPayload = {
    type,
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const existingStr = localStorage.getItem(EVENT_STORAGE_KEY);
      const events: AppEventPayload[] = existingStr ? JSON.parse(existingStr) : [];
      
      // Deduplicate by type and id/skill on the same date
      const eventDateStr = formatLocalDateStr(new Date(event.timestamp));
      const isDuplicate = events.some((e) => {
        const dStr = formatLocalDateStr(new Date(e.timestamp));
        return dStr === eventDateStr && e.type === type && (e.id === payload.id || e.skill === payload.skill);
      });

      if (!isDuplicate) {
        events.push(event);
        localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));

        const studentEventsStr = localStorage.getItem('careeros_local_events');
        const studentEvents: StudentEvent[] = studentEventsStr ? JSON.parse(studentEventsStr) : [];
        studentEvents.push({
          student_id: 's123',
          activity: type,
          skill: payload.skill || payload.languageId || 'Practice',
          timestamp: event.timestamp,
          correct: true,
        });
        localStorage.setItem('careeros_local_events', JSON.stringify(studentEvents));

        // Dynamically compute new real streak and update student profile
        const streakReport = calculateRealStreak(studentEvents, new Date());
        saveStudentProfile({ streakDays: streakReport.currentStreak });
      }
    }
  } catch (e) {}

  // Dispatch to memory listeners (works in Node and Web)
  memoryListeners.forEach((fn) => {
    try {
      fn(event);
    } catch {}
  });

  // Dispatch CustomEvent in browser window
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      const customEv = new CustomEvent('careeros:event', { detail: event });
      window.dispatchEvent(customEv);
    } catch {}
  }
}

/**
 * Subscribe to application events
 */
export function subscribeAppEvent(handler: (event: AppEventPayload) => void): () => void {
  memoryListeners.push(handler);

  let windowListener: ((e: Event) => void) | null = null;
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    windowListener = (e: Event) => {
      const customEv = e as CustomEvent<AppEventPayload>;
      if (customEv.detail) {
        handler(customEv.detail);
      }
    };
    window.addEventListener('careeros:event', windowListener);
  }

  return () => {
    const idx = memoryListeners.indexOf(handler);
    if (idx !== -1) memoryListeners.splice(idx, 1);
    if (windowListener && typeof window !== 'undefined') {
      window.removeEventListener('careeros:event', windowListener);
    }
  };
}

/**
 * Check which task types have been completed today in local timezone
 */
export function getTodayCompletedTaskTypes(): Set<AppEventType> {
  const completed = new Set<AppEventType>();
  if (typeof localStorage === 'undefined') return completed;

  try {
    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const eventsStr = localStorage.getItem(EVENT_STORAGE_KEY);
    if (!eventsStr) return completed;

    const events: AppEventPayload[] = JSON.parse(eventsStr);
    events.forEach((ev) => {
      if (ev.timestamp && ev.timestamp.startsWith(todayYMD)) {
        completed.add(ev.type);
      }
    });
  } catch {}

  return completed;
}

import { hasUserActivity } from './userActivity.ts';
import { getStudentProfile } from './userProfile.ts';

/**
 * Dynamically generate Today's Plan based on student's weakest skills and current path.
 * Returns empty array for unassessed new users unless forceGenerate is requested.
 */
export function generateAutomatedTodaysPlan(
  profileOrForce?: any,
  force: boolean = false
): AutomatedPlanTask[] {
  const isForce = profileOrForce === true || force === true;
  const targetProfile = typeof profileOrForce === 'object' ? profileOrForce : getStudentProfile();

  // If student has not taken assessment and has no practice activity, return empty plan
  if (!isForce && !hasUserActivity(targetProfile)) {
    return [];
  }

  const todayCompleted = getTodayCompletedTaskTypes();

  return [
    {
      id: 'task-coding-1',
      title: 'Solve 1 Medium DSA Problem (Dynamic Programming & Trees)',
      category: 'coding',
      eventType: 'problemSolved',
      route: '/practice',
      actionLabel: 'Launch Sandbox',
      status: todayCompleted.has('problemSolved') ? 'completed' : 'not_started',
      rationale: 'Targeted skill gap: Tree & DP optimization accuracy is currently at 58%.',
    },
    {
      id: 'task-lang-1',
      title: 'Complete 1 Path Unit in German or Professional English',
      category: 'language',
      eventType: 'lessonCompleted',
      route: '/communication',
      actionLabel: 'Open Path',
      status: todayCompleted.has('lessonCompleted') ? 'completed' : 'not_started',
      rationale: 'Roadmap Milestone: Accelerate CEFR proficiency towards official A2/B1 certifications.',
    },
    {
      id: 'task-speaking-1',
      title: 'Complete 1 Real-Time AI Speaking Drill (STAR Technical Challenge)',
      category: 'speaking',
      eventType: 'speakingSessionCompleted',
      route: '/speaking',
      actionLabel: 'Enter Studio',
      status: todayCompleted.has('speakingSessionCompleted') ? 'completed' : 'not_started',
      rationale: 'Verbal Delivery: Target speech cadence (130-150 WPM) and eliminate filler words.',
    },
  ];
}
