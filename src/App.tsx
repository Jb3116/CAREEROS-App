import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { LearningPage } from './pages/LearningPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticePage } from './pages/PracticePage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth / Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Student Onboarding (5-step guided wizard) */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Student Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Adaptive Career Roadmap */}
        <Route path="/roadmap" element={<RoadmapPage />} />

        {/* Learning Hub & Handbooks */}
        <Route path="/learning" element={<LearningPage />} />

        {/* Practice & Coding Arena */}
        <Route path="/practice" element={<PracticePage />} />

        {/* ATS Resume Builder */}
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />

        {/* Student Profile & Skill Intelligence */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback / Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
