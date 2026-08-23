import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { LearningPage } from './pages/LearningPage';
import { PracticeView } from './components/practice/PracticeView';
import { ProfileView } from './components/profile/ProfileView';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Onboarding Entry Points */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Application with Unified Permanent Sidebar & Header Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/roadmap" element={<RoadmapView />} />
          <Route path="/career-roadmap" element={<RoadmapView />} />
          <Route path="/assessment" element={<AssessmentView />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/practice" element={<PracticeView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        </Route>

        {/* Fallback / Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
