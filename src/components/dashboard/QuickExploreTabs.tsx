import React from 'react';
import {
  BookOpen,
  Code2,
  Zap,
  MessageSquare,
  GraduationCap,
  Building,
  Mic,
  FileText,
  LucideIcon
} from 'lucide-react';
import { CategoryTabId } from '../../types/dashboard';

interface QuickExploreTabsProps {
  activeTab: CategoryTabId | null;
  onSelectCategory: (tab: CategoryTabId) => void;
}

export const QuickExploreTabs: React.FC<QuickExploreTabsProps> = ({
  activeTab,
  onSelectCategory,
}) => {
  const tabs: {
    id: CategoryTabId;
    label: string;
    icon: LucideIcon;
    color: string;
  }[] = [
    { id: 'learn', label: 'Learn', icon: BookOpen, color: '#4F46E5' },
    { id: 'practice', label: 'Practice', icon: Code2, color: '#6366F1' },
    { id: 'aptitude', label: 'Aptitude', icon: Zap, color: '#8B5CF6' },
    { id: 'communication', label: 'Communication', icon: MessageSquare, color: '#3B82F6' },
    { id: 'internships', label: 'Internships', icon: GraduationCap, color: '#059669' },
    { id: 'placements', label: 'Placements', icon: Building, color: '#2563EB' },
    { id: 'interview', label: 'Interview Prep', icon: Mic, color: '#7C3AED' },
    { id: 'resume', label: 'Resume Builder', icon: FileText, color: '#4F46E5' },
  ];

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
              onClick={() => onSelectCategory(tab.id)}
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
