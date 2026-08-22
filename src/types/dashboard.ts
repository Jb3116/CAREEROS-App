export type NavTabId =
  | 'dashboard'
  | 'roadmap'
  | 'practice'
  | 'learn'
  | 'communication'
  | 'opportunities'
  | 'settings'
  | 'profile';

export type CategoryTabId =
  | 'learn'
  | 'practice'
  | 'aptitude'
  | 'communication'
  | 'internships'
  | 'placements'
  | 'interview'
  | 'resume';

export interface PlanTask {
  id: string;
  title: string;
  topic: string;
  completed: boolean;
  tag?: string;
  timeEstimate?: string;
}

export interface SkillMasteryItem {
  id: string;
  name: string;
  percentage: number;
  level: string;
  category: 'coding' | 'aptitude' | 'communication';
  targetPercentage: number;
}

export interface DeadlineItem {
  id: string;
  title: string;
  company: string;
  dueDate: string;
  daysLeft: number;
  type: string;
  actionText: string;
}

export interface OpportunityItem {
  id: string;
  role: string;
  company: string;
  matchScore: number;
  location: string;
  stipendOrSalary: string;
  deadlineDays: number;
  tags: string[];
}

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  type: 'roadmap' | 'gap' | 'opportunity' | 'ats';
  iconType: 'purple' | 'amber' | 'green' | 'blue';
  actionLabel?: string;
}

export interface StudentProfile {
  name: string;
  role: string;
  college: string;
  year: string;
  avatarText: string;
  streakDays: number;
  readinessScore: number;
  atsScore: number;
}
