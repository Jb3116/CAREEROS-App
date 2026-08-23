import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Zap,
  MessageSquare,
  GraduationCap,
  Building,
  Mic,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { CategoryTabId } from '../../types/dashboard';

interface QuickExploreTabsProps {
  activeTab: CategoryTabId | null;
  onSelectCategory?: (tab: CategoryTabId) => void;
}

export const QuickExploreTabs: React.FC<QuickExploreTabsProps> = ({
  activeTab,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const tabs: {
    id: CategoryTabId;
    label: string;
    icon: LucideIcon;
    color: string;
    path: string;
  }[] = [
    { id: 'learn', label: 'Learning Hub', icon: BookOpen, color: '#4F46E5', path: '/learning' },
    { id: 'practice', label: 'Coding Arena', icon: Code2, color: '#6366F1', path: '/practice' },
    { id: 'aptitude', label: 'Aptitude Drills', icon: Zap, color: '#8B5CF6', path: '/practice' },
    { id: 'communication', label: 'Interview Studio', icon: MessageSquare, color: '#3B82F6', path: '/interview-studio' },
    { id: 'internships', label: 'Opportunities', icon: GraduationCap, color: '#059669', path: '/opportunities' },
    { id: 'placements', label: 'AI Placement', icon: Building, color: '#2563EB', path: '/placement' },
    { id: 'interview', label: 'Mock Interviews', icon: Mic, color: '#7C3AED', path: '/interview-studio' },
    { id: 'resume', label: 'Resume Builder', icon: FileText, color: '#4F46E5', path: '/resume-builder' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (onSelectCategory) {
      onSelectCategory(tab.id);
    }
    navigate(tab.path);
  };

  return (
    <section className="explorer-section" aria-label="Explore Platform Modules">
      <div className="explorer-title-row">
        <h2 className="explorer-heading">
          Everything you need, in one intelligent platform
        </h2>
      </div>

      <div className="explorer-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`explorer-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
              title={`Navigate to ${tab.label}`}
              type="button"
            >
              <Icon size={16} color={isActive ? '#4F46E5' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickExploreTabs;
