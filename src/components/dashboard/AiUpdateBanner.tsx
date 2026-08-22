import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AiUpdateBannerProps {
  message?: string;
  subMessage?: string;
  onViewRoadmap: () => void;
}

export const AiUpdateBanner: React.FC<AiUpdateBannerProps> = ({
  message = 'Your roadmap has been updated based on your performance.',
  subMessage = 'AI detected high aptitude mastery and dynamically rescheduled 2 graph problems for your upcoming coding round.',
  onViewRoadmap,
}) => {
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

      <button className="ai-banner-btn" onClick={onViewRoadmap}>
        <span>View Roadmap</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
