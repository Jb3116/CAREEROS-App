import React from 'react';
import { GitFork, AlertTriangle, Sparkles, FileCheck, ArrowUpRight } from 'lucide-react';
import { SmartInsight } from '../../types/dashboard';

interface SmartInsightBadgesProps {
  onSelectInsight: (insight: SmartInsight) => void;
}

export const SmartInsightBadges: React.FC<SmartInsightBadgesProps> = ({ onSelectInsight }) => {
  const insights: SmartInsight[] = [
    {
      id: 'i1',
      title: 'AI Roadmap Updated',
      description: 'Syllabus tailored to upcoming deadline',
      type: 'roadmap',
      iconType: 'purple',
    },
    {
      id: 'i2',
      title: 'Skill Gap Detected',
      description: 'Recommended: Graphs & Dynamic Programming module',
      type: 'gap',
      iconType: 'amber',
    },
    {
      id: 'i3',
      title: 'New Opportunity Match',
      description: 'Goldman Sachs SWE Internship • 94% match',
      type: 'opportunity',
      iconType: 'green',
    },
    {
      id: 'i4',
      title: 'Resume ATS: 91%',
      description: 'Verified & ready for placement drive upload',
      type: 'ats',
      iconType: 'blue',
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

  return (
    <div className="smart-insights-container" aria-label="AI Career Insights">
      {insights.map((item) => (
        <div
          key={item.id}
          className="insight-pill-card"
          onClick={() => onSelectInsight(item)}
          role="button"
          tabIndex={0}
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
