import React, { useState, useEffect } from 'react';
import { CareerReadinessCard } from './CareerReadinessCard';
import { TodaysPlanCard } from './TodaysPlanCard';
import { SkillMasteryCard } from './SkillMasteryCard';
import { ResumeScoreCard } from './ResumeScoreCard';
import { UpcomingDeadlineCard } from './UpcomingDeadlineCard';
import { OpportunityMatchCard } from './OpportunityMatchCard';
import { AiUpdateBanner } from './AiUpdateBanner';
import { SmartInsightBadges } from './SmartInsightBadges';
import { QuickExploreTabs } from './QuickExploreTabs';
import { DetailModal, ModalContentType } from './DetailModal';
import {
  PlanTask,
  SkillMasteryItem,
  DeadlineItem,
  OpportunityItem,
  CategoryTabId,
  SmartInsight,
} from '../../types/dashboard';

export const StudentDashboard: React.FC = () => {
  const [readinessScore, setReadinessScore] = useState<number>(78);
  const [dktStatus, setDktStatus] = useState<'ready' | 'not_trained' | 'loading'>('loading');
  const [recommendedSkillFocus, setRecommendedSkillFocus] = useState<string>('Binary Trees & Path Sums');

  // State for daily plan checklist
  const [tasks, setTasks] = useState<PlanTask[]>([
    {
      id: 't1',
      title: 'DSA Revision',
      topic: 'Graphs & Dynamic Programming',
      completed: true,
      tag: 'Completed',
    },
    {
      id: 't2',
      title: 'Aptitude Practice',
      topic: 'Quantitative & Logical Reasoning',
      completed: true,
      tag: 'Completed',
    },
    {
      id: 't3',
      title: '2 Tree Problems',
      topic: 'Binary Tree Maximum Path Sum & LCA',
      completed: false,
      tag: 'Pending',
    },
    {
      id: 't4',
      title: 'Interview Practice',
      topic: 'System Design & STAR Behavioral Round',
      completed: false,
      tag: 'Pending',
    },
  ]);

  // State for skills
  const [skills, setSkills] = useState<SkillMasteryItem[]>([
    {
      id: 's1',
      name: 'Coding',
      percentage: 72,
      level: 'Advanced',
      category: 'coding',
      targetPercentage: 85,
    },
    {
      id: 's2',
      name: 'Aptitude',
      percentage: 81,
      level: 'Master',
      category: 'aptitude',
      targetPercentage: 85,
    },
    {
      id: 's3',
      name: 'Communication',
      percentage: 64,
      level: 'Intermediate',
      category: 'communication',
      targetPercentage: 80,
    },
  ]);

  // State for upcoming deadline
  const deadline: DeadlineItem = {
    id: 'd1',
    title: 'SWE Coding Assessment',
    company: 'Google Campus Drive',
    dueDate: 'Aug 26, 2026',
    daysLeft: 3,
    type: 'Round 1 Assessment',
    actionText: 'Prepare Now',
  };

  // State for matched opportunity
  const opportunity: OpportunityItem = {
    id: 'o1',
    role: 'Goldman Sachs SWE Internship',
    company: 'Goldman Sachs',
    matchScore: 94,
    location: 'Bangalore / Hybrid',
    stipendOrSalary: '₹1,20,000/mo',
    deadlineDays: 5,
    tags: ['Algorithms', 'Systems', 'Python/C++'],
  };

  // Modal / Drawer state
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabId | null>(null);

  // Fetch live AI DKT skill profile on mount
  useEffect(() => {
    async function loadDktProfile() {
      try {
        const res = await fetch('/api/ai/skill-profile/s123');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();

        if (data.status === 'ready' && data.category_mastery) {
          setDktStatus('ready');
          setReadinessScore(data.readiness_score || 78);
          if (data.recommended_focus?.skill_name) {
            setRecommendedSkillFocus(data.recommended_focus.skill_name);
          }

          setSkills([
            {
              id: 's1',
              name: 'Coding',
              percentage: data.category_mastery.coding,
              level: data.category_mastery.coding >= 85 ? 'Master' : data.category_mastery.coding >= 70 ? 'Advanced' : 'Intermediate',
              category: 'coding',
              targetPercentage: 85,
            },
            {
              id: 's2',
              name: 'Aptitude',
              percentage: data.category_mastery.aptitude,
              level: data.category_mastery.aptitude >= 85 ? 'Master' : data.category_mastery.aptitude >= 70 ? 'Advanced' : 'Intermediate',
              category: 'aptitude',
              targetPercentage: 85,
            },
            {
              id: 's3',
              name: 'Communication',
              percentage: data.category_mastery.communication,
              level: data.category_mastery.communication >= 85 ? 'Master' : data.category_mastery.communication >= 70 ? 'Advanced' : 'Intermediate',
              category: 'communication',
              targetPercentage: 80,
            },
          ]);
        } else if (data.status === 'not_trained') {
          setDktStatus('not_trained');
        }
      } catch (err) {
        console.warn('Live DKT service connection status:', err);
      }
    }

    loadDktProfile();
  }, []);

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              tag: !t.completed ? 'Completed' : 'Pending',
            }
          : t
      )
    );
  };

  return (
    <main className="dashboard-content" role="main">
      {/* Row 1: Top Metrics Grid */}
      <section className="metrics-grid" aria-label="Key Performance Metrics">
        <CareerReadinessCard
          score={readinessScore}
          onViewDetails={() => setModalContent({ type: 'readiness_breakdown', score: readinessScore })}
        />
        <TodaysPlanCard
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onStartPlan={() => {
            const firstIncomplete = tasks.find((t) => !t.completed) || tasks[0];
            setModalContent({ type: 'task_detail', data: firstIncomplete });
          }}
        />
        <SkillMasteryCard
          skills={skills}
          isUntrained={dktStatus === 'not_trained'}
          onViewSkills={() => setModalContent({ type: 'readiness_breakdown', score: readinessScore })}
        />
      </section>

      {/* Row 2: Status & Intelligence Grid */}
      <section className="status-grid" aria-label="Intelligence & Deadlines">
        <ResumeScoreCard
          score={91}
          onImproveResume={() => setModalContent({ type: 'resume_ats', score: 91 })}
        />
        <UpcomingDeadlineCard
          deadline={deadline}
          onPrepare={() => setModalContent({ type: 'deadline_detail', deadline })}
        />
        <OpportunityMatchCard
          opportunity={opportunity}
          onViewDetails={() => setModalContent({ type: 'opportunity_detail', opportunity })}
        />
      </section>

      {/* Row 3: AI Intelligence Banner */}
      <AiUpdateBanner
        message={
          dktStatus === 'not_trained'
            ? 'AI skill analysis is being prepared.'
            : 'Your roadmap has been updated based on your performance.'
        }
        subMessage={
          dktStatus === 'not_trained'
            ? 'Deep Knowledge Tracing neural models are calibrating your baseline competencies.'
            : `AI detected consistent accuracy and prioritized ${recommendedSkillFocus} for upcoming placement rounds.`
        }
        onViewRoadmap={() =>
          setModalContent({
            type: 'insight_detail',
            insight: {
              id: 'banner',
              title: 'Adaptive AI Roadmap',
              description:
                'Your dynamic roadmap prioritized Tree algorithms, Binary Search variations, and Mock Interview simulations for maximum placement readiness.',
              type: 'roadmap',
              iconType: 'purple',
            },
          })
        }
      />

      {/* Interactive Floating Smart Insights */}
      <SmartInsightBadges
        onSelectInsight={(insight: SmartInsight) =>
          setModalContent({ type: 'insight_detail', insight })
        }
      />

      {/* Bottom Category Explorer Tabs */}
      <QuickExploreTabs
        activeTab={activeCategoryTab}
        onSelectCategory={(tabId) => {
          setActiveCategoryTab(tabId);
          setModalContent({ type: 'category_preview', category: tabId });
        }}
      />

      {/* Global Interactive Modal */}
      <DetailModal content={modalContent} onClose={() => setModalContent(null)} />
    </main>
  );
};

export default StudentDashboard;
