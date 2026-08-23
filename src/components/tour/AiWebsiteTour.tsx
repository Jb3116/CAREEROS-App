import React, { useState, useEffect } from 'react';
import { InteractiveTour, INTERACTIVE_TOUR_STEPS, TourStepItem, isTourCompleted } from './InteractiveTour';

export interface TourStep extends TourStepItem {}
export const TOUR_STEPS = INTERACTIVE_TOUR_STEPS;

export interface AiWebsiteTourProps {
  onClose?: () => void;
}

export const AiWebsiteTour: React.FC<AiWebsiteTourProps> = ({ onClose }) => {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const handleReplay = () => {
      setForceShow(true);
    };

    window.addEventListener('careeros-start-tour', handleReplay);
    return () => window.removeEventListener('careeros-start-tour', handleReplay);
  }, []);

  // Persistent State Check: If tour has been completed, do not render or trigger
  if (typeof window !== 'undefined' && isTourCompleted() && !forceShow) {
    return null;
  }

  return (
    <InteractiveTour
      onClose={() => {
        setForceShow(false);
        if (onClose) onClose();
      }}
    />
  );
};

export { InteractiveTour };
export default AiWebsiteTour;
