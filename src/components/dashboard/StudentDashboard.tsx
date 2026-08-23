import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { StreakCalendar } from '../common/StreakCalendar';
import { useStudentProfile } from '../../utils/userProfile';
import { getUserActivitySummary, hasUserActivity } from '../../utils/userActivity';
import { getStudentAtsScore } from '../../utils/resumeVersioning';
import {
  PlanTask,
  SkillMasteryItem,
  DeadlineItem,
  OpportunityItem,
  CategoryTabId,
  SmartInsight,
} from '../../types/dashboard';

export const StudentDashboard: React.FC = () => {
  const profile = useStudentProfile();
  const summary = getUserActivitySummary(profile);

  const [readinessScore, setReadinessScore] = useState<number | null>(() => summary.assessmentScore);
  const [dktStatus, setDktStatus] = useState<'ready' | 'not_trained' | 'loading'>(() =>
    summary.hasAnyActivity ? 'ready' : 'not_trained'
  );
  const [recommendedSkillFocus, setRecommendedSkillFocus] = useState<string>(
    summary.hasAnyActivity ? 'Binary Trees & Path Sums' : 'Diagnostic Assessment'
  );

  useEffect(() => {
    const updated = getUserActivitySummary(profile);
    setReadinessScore(updated.assessmentScore);
  }, [profile.readinessScore]);

  // State for daily plan checklist
  const [tasks, setTasks] = useState<PlanTask[]>([
    {
      id: 't1',
      title: 'DSA Revision',
      topic: 'Graphs & Dynamic Programming',
      completed: false,
      tag: 'Pending',
    },
    {
      id: 't2',
      title: 'Aptitude Practice',
      topic: 'Quantitative & Logical Reasoning',
      completed: false,
      tag: 'Pending',
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

  // State for skills (Not assessed for unevaluated students)
  const [skills, setSkills] = useState<SkillMasteryItem[]>(() => {
    return [
      {
        id: 's1',
        name: 'Coding',
        percentage: summary.codingScore,
        level:
          summary.codingScore === null
            ? 'Not assessed'
            : summary.codingScore >= 85
            ? 'Master'
            : summary.codingScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'coding',
        targetPercentage: 85,
      },
      {
        id: 's2',
        name: 'Aptitude',
        percentage: summary.aptitudeScore,
        level:
          summary.aptitudeScore === null
            ? 'Not assessed'
            : summary.aptitudeScore >= 85
            ? 'Master'
            : summary.aptitudeScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'aptitude',
        targetPercentage: 85,
      },
      {
        id: 's3',
        name: 'Communication',
        percentage: summary.communicationScore,
        level:
          summary.communicationScore === null
            ? 'Not assessed'
            : summary.communicationScore >= 85
            ? 'Master'
            : summary.communicationScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'communication',
        targetPercentage: 80,
      },
    ];
  });

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

  // Sync DKT / skill calculations from actual user activity
  useEffect(() => {
    const act = getUserActivitySummary(profile);
    if (!act.hasAnyActivity) {
      setDktStatus('not_trained');
      setReadinessScore(null);
      return;
    }

    setDktStatus('ready');
    setReadinessScore(act.assessmentScore);
    setSkills([
      {
        id: 's1',
        name: 'Coding',
        percentage: act.codingScore,
        level:
          act.codingScore === null
            ? 'Not assessed'
            : act.codingScore >= 85
            ? 'Master'
            : act.codingScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'coding',
        targetPercentage: 85,
      },
      {
        id: 's2',
        name: 'Aptitude',
        percentage: act.aptitudeScore,
        level:
          act.aptitudeScore === null
            ? 'Not assessed'
            : act.aptitudeScore >= 85
            ? 'Master'
            : act.aptitudeScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'aptitude',
        targetPercentage: 85,
      },
      {
        id: 's3',
        name: 'Communication',
        percentage: act.communicationScore,
        level:
          act.communicationScore === null
            ? 'Not assessed'
            : act.communicationScore >= 85
            ? 'Master'
            : act.communicationScore >= 70
            ? 'Advanced'
            : 'Intermediate',
        category: 'communication',
        targetPercentage: 80,
      },
    ]);
  }, [profile]);

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

  const navigate = useNavigate();

  return (
    <main className="dashboard-content" role="main">
      {/* Top Duolingo-Style Streak Calendar Card */}
      <StreakCalendar streakDays={profile.streakDays} onOpenPractice={() => navigate('/practice')} />

      {/* Row 1: Top Metrics Grid */}
      <section className="metrics-grid" style={{ marginTop: 20 }} aria-label="Key Performance Metrics">
        <CareerReadinessCard
          score={readinessScore}
          onViewDetails={() => setModalContent({ type: 'readiness_breakdown', score: readinessScore })}
        />
        <TodaysPlanCard />
        <SkillMasteryCard
          skills={skills}
          isUntrained={dktStatus === 'not_trained'}
          onViewSkills={() => setModalContent({ type: 'readiness_breakdown', score: readinessScore })}
        />
      </section>

      {/* Row 2: Status & Intelligence Grid */}
      <section className="status-grid" aria-label="Intelligence & Deadlines">
        <ResumeScoreCard
          score={getStudentAtsScore(profile?.email)}
          onImproveResume={() =>
            setModalContent({ type: 'resume_ats', score: getStudentAtsScore(profile?.email) })
          }
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
            ? 'Diagnostic Assessment Required'
            : 'Your roadmap has been updated based on your performance.'
        }
        subMessage={
          dktStatus === 'not_trained'
            ? 'Complete your 15-minute diagnostic assessment to unlock your personalized AI Career Roadmap and baseline competencies.'
            : `AI detected consistent accuracy and prioritized ${recommendedSkillFocus} for upcoming placement rounds.`
        }
        buttonText={dktStatus === 'not_trained' ? 'Take Assessment' : 'View Roadmap'}
        onViewRoadmap={() => {
          if (dktStatus === 'not_trained') {
            navigate('/assessment');
          } else {
            navigate('/career-roadmap');
          }
        }}
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
