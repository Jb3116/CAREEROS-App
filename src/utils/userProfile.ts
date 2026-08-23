/**
 * CAREEROS - Student Profile Global State & Persistence Utility
 * Centralizes retrieval, mutation, and reactive subscriptions for student profile data.
 */

import { useState, useEffect } from 'react';
import type { StudentProfile } from '../types/dashboard.ts';

export const PROFILE_STORAGE_KEY = 'careeros_student_profile';
export const AUTH_STORAGE_KEY = 'careeros_auth_user';
export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@vit.edu',
  role: 'Student',
  college: 'Vellore Institute of Technology, Chennai',
  degree: 'B.Tech in Computer Science & Engineering',
  year: '3rd Year',
  currentYear: '3rd Year',
  gradYear: '2027',
  cgpa: '8.9',
  rollNumber: '23BCE1042',
  targetRoles: ['Software Development Engineer', 'Full Stack Developer'],
  targetCompanyTypes: ['Tier-1 Product Companies (FAANG & High Tier)', 'High-Growth Tech Startups'],
  primaryLanguages: ['C++', 'Python', 'TypeScript', 'SQL'],
  avatarText: 'AC',
  streakDays: 0,
  readinessScore: 0,
  atsScore: 0,
};

export function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Initialize a brand new student profile with dynamic zero-streak state
 */
export function createFreshStudentProfile(params: {
  name: string;
  email: string;
  college?: string;
  degree?: string;
}): StudentProfile {
  const profile: StudentProfile = {
    name: params.name,
    email: params.email,
    role: 'Student',
    college: params.college || 'Engineering Institution',
    degree: params.degree || 'B.Tech in Engineering',
    year: '1st Year',
    currentYear: '1st Year',
    gradYear: String(new Date().getFullYear() + 4),
    cgpa: '0.0',
    targetRoles: ['Software Development Engineer'],
    targetCompanyTypes: ['Tier-1 Product Companies (FAANG & High Tier)'],
    primaryLanguages: ['C++', 'Python', 'TypeScript', 'SQL'],
    avatarText: getInitials(params.name),
    streakDays: 0,
    readinessScore: 0,
    careerReadiness: null,
    atsScore: 0,
    assessmentStatus: 'not_started',
    assessmentCompleted: false,
    roadmap: null,
    resume: null,
  };
  return saveStudentProfile(profile);
}

export const SCHEMA_VERSION_KEY = 'careeros_schema_version';
export const CURRENT_SCHEMA_VERSION = '2026.3.1';

/**
 * Get current student profile from localStorage or fallback to defaults
 */
export function getStudentProfile(): StudentProfile {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_STUDENT_PROFILE;
  }

  // Check and run schema migration to invalidate stale demo caches
  try {
    const activeVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
    if (activeVersion !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      // Clean up stale mock/demo keys
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.streakDays === 5 && !localStorage.getItem('careeros_event_ledger')) {
            parsed.streakDays = 0;
            parsed.readinessScore = 0;
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsed));
          }
        } catch {}
      }
    }
  } catch {}

  let baseProfile: StudentProfile = { ...DEFAULT_STUDENT_PROFILE };

  // 1. Check student profile storage
  try {
    const savedProfileStr = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfileStr) {
      const parsed = JSON.parse(savedProfileStr);
      baseProfile = { ...baseProfile, ...parsed };
    }
  } catch (e) {
    console.error('Error loading saved student profile:', e);
  }

  // 2. Cross-reference with auth user if available
  try {
    const authStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStr) {
      const authUser = JSON.parse(authStr);
      if (authUser.name && !localStorage.getItem(PROFILE_STORAGE_KEY)) {
        baseProfile.name = authUser.name;
      }
    }
  } catch (e) {}

  baseProfile.avatarText = getInitials(baseProfile.name);
  if (baseProfile.currentYear && !baseProfile.year) {
    baseProfile.year = baseProfile.currentYear;
  }
  return baseProfile;
}

/**
 * Save / update student profile to localStorage and sync with auth user
 */
export function saveStudentProfile(updatedData: Partial<StudentProfile>): StudentProfile {
  const current = getStudentProfile();
  const merged: StudentProfile = {
    ...current,
    ...updatedData,
    avatarText: getInitials(updatedData.name || current.name),
  };

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));

      // Sync auth user name if needed
      const authStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authStr) {
        const authObj = JSON.parse(authStr);
        authObj.name = merged.name;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authObj));
      } else {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            id: 's123',
            name: merged.name,
            role: 'student',
          })
        );
      }

      // Dispatch event for reactive updates in all open components
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('careeros_profile_updated', { detail: merged }));
      }
    } catch (e) {
      console.error('Error saving student profile:', e);
    }
  }

  return merged;
}

/**
 * React hook to subscribe to reactive profile changes
 */
export function useStudentProfile(): StudentProfile {
  const [profile, setProfile] = useState<StudentProfile>(() => getStudentProfile());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getStudentProfile());
    };

    window.addEventListener('careeros_profile_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('careeros_profile_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return profile;
}
