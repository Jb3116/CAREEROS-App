import React from 'react';
import { ArrowRight, Code, Brain, MessageSquare } from 'lucide-react';
import { SkillMasteryItem } from '../../types/dashboard';

interface SkillMasteryCardProps {
  skills: SkillMasteryItem[];
  onViewSkills?: () => void;
}

export const SkillMasteryCard: React.FC<SkillMasteryCardProps> = ({
  skills,
  onViewSkills,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'coding':
        return <Code size={14} color="#4F46E5" />;
      case 'aptitude':
        return <Brain size={14} color="#7C3AED" />;
      case 'communication':
      default:
        return <MessageSquare size={14} color="#6366F1" />;
    }
  };

  return (
    <div className="dash-card">
      <div className="card-header">
        <h2 className="card-title">
          Skill Mastery
        </h2>
        <button className="card-action-link" onClick={onViewSkills}>
          <span>View all</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="skill-list">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-header">
              <span className="skill-name">
                {getIcon(skill.category)}
                {skill.name}
              </span>
              <span className="skill-pct">{skill.percentage}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className={`skill-bar-fill ${skill.category}`}
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
