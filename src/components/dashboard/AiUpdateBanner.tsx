import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AiUpdateBannerProps {
  message?: string;
  subMessage?: string;
  onViewRoadmap?: () => void;
}

export const AiUpdateBanner: React.FC<AiUpdateBannerProps> = ({
  message = 'Your roadmap has been updated based on your performance.',
  subMessage = 'AI detected high aptitude mastery and dynamically rescheduled 2 graph problems for your upcoming coding round.',
  onViewRoadmap,
}) => {
  const navigate = useNavigate();

  const handleRoadmapClick = () => {
    if (onViewRoadmap) {
      onViewRoadmap();
    } else {
      navigate('/career-roadmap');
    }
  };

  return (
    <div className="ai-banner" role="status">
      <div className="ai-banner-left">
        <div className="ai-sparkle-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="ai-banner-text">{message}</h2>
          <p className="ai-banner-sub">{subMessage}</p>
        </div>
      </div>

      <button className="ai-banner-btn" onClick={handleRoadmapClick} title="Open AI Career Roadmap">
        <span>View Roadmap</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default AiUpdateBanner;
