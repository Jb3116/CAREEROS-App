import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitFork, AlertTriangle, Sparkles, FileCheck, ArrowUpRight } from 'lucide-react';
import { SmartInsight } from '../../types/dashboard';

import { useStudentProfile } from '../../utils/userProfile';
import { hasAssessmentRecord } from '../../utils/assessmentValidation';
import { getStudentAtsScore } from '../../utils/resumeVersioning';

interface SmartInsightBadgesProps {
  onSelectInsight?: (insight: SmartInsight) => void;
}

export const SmartInsightBadges: React.FC<SmartInsightBadgesProps> = ({ onSelectInsight }) => {
  const navigate = useNavigate();
  const profile = useStudentProfile();
  const studentId = profile.email || 'student';
  const isAssessed = hasAssessmentRecord(studentId);
  const atsScore = getStudentAtsScore(studentId);

  const insights: (SmartInsight & { path: string })[] = [
    {
      id: 'i1',
      title: isAssessed ? 'AI Roadmap Active' : 'Diagnostic Test Required',
      description: isAssessed
        ? 'Personalized syllabus tailored to target engineering roles'
        : 'Take assessment to calculate competencies and unlock roadmap',
      type: 'roadmap',
      iconType: 'purple',
      path: isAssessed ? '/career-roadmap' : '/assessment',
    },
    {
      id: 'i2',
      title: isAssessed ? 'Target Skill Focus' : 'Practice Arena',
      description: isAssessed
        ? 'Recommended: Tree Algorithms & Asymptotic Optimization'
        : 'Explore practice challenges in the interactive coding arena',
      type: 'gap',
      iconType: 'amber',
      path: '/practice',
    },
    {
      id: 'i3',
      title: 'Opportunity Match',
      description: 'Goldman Sachs SWE Internship • Tier-1 Campus Drive',
      type: 'opportunity',
      iconType: 'green',
      path: '/opportunities',
    },
    {
      id: 'i4',
      title: atsScore > 0 ? `Resume ATS: ${atsScore}%` : 'Resume ATS: 0%',
      description:
        atsScore >= 80
          ? 'Verified & ready for placement drive upload'
          : atsScore > 0
          ? 'Optimization recommended for company screening'
          : 'Upload or build resume to compute ATS compatibility',
      type: 'ats',
      iconType: 'blue',
      path: '/resume-builder',
    },
  ];

  const renderIcon = (type: SmartInsight['iconType']) => {
    switch (type) {
      case 'purple':
        return <GitFork size={18} />;
      case 'amber':
        return <AlertTriangle size={18} />;
      case 'green':
        return <Sparkles size={18} />;
      case 'blue':
      default:
        return <FileCheck size={18} />;
    }
  };

  const handleInsightClick = (item: typeof insights[0]) => {
    if (onSelectInsight) {
      onSelectInsight(item);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="smart-insights-container" aria-label="AI Career Insights">
      {insights.map((item) => (
        <div
          key={item.id}
          className="insight-pill-card"
          onClick={() => handleInsightClick(item)}
          role="button"
          tabIndex={0}
          title={`Click to explore ${item.title}`}
          style={{ cursor: 'pointer' }}
        >
          <div className={`insight-icon-wrap ${item.iconType}`}>
            {renderIcon(item.iconType)}
          </div>
          <div className="insight-text-wrap">
            <span className="insight-headline">{item.title}</span>
            <span className="insight-desc">{item.description}</span>
          </div>
          <ArrowUpRight size={14} color="#94A3B8" style={{ marginLeft: 'auto' }} />
        </div>
      ))}
    </div>
  );
};

export default SmartInsightBadges;
