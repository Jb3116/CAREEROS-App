import React, { useState } from 'react';
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
  const skills: SkillMasteryItem[] = [
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
  ];

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
          score={78}
          onViewDetails={() => setModalContent({ type: 'readiness_breakdown', score: 78 })}
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
          onViewSkills={() => setModalContent({ type: 'readiness_breakdown', score: 78 })}
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
        message="Your roadmap has been updated based on your performance."
        subMessage="AI detected consistent aptitude accuracy and scheduled 2 tree problems for the SWE Coding Assessment."
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
