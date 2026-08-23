import React from 'react';
import { InteractiveTour, INTERACTIVE_TOUR_STEPS, TourStepItem } from './InteractiveTour';

export interface TourStep extends TourStepItem {}
export const TOUR_STEPS = INTERACTIVE_TOUR_STEPS;

export interface AiWebsiteTourProps {
  onClose?: () => void;
}

export const AiWebsiteTour: React.FC<AiWebsiteTourProps> = ({ onClose }) => {
  return <InteractiveTour onClose={onClose} />;
};

export { InteractiveTour };
export default AiWebsiteTour;
