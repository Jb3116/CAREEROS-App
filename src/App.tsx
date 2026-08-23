import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Student Layout & Components
import { DashboardLayout } from './components/layout/DashboardLayout';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { LearningPage } from './pages/LearningPage';
import { PracticeView } from './components/practice/PracticeView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { InterviewStudioPage } from './pages/InterviewStudioPage';
import { ProfileView } from './components/profile/ProfileView';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';

// College Admin Layout & Components
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminOpportunityManagerPage } from './pages/AdminOpportunityManagerPage';
import { AdminInterviewCriteriaPage } from './pages/AdminInterviewCriteriaPage';
import { AdminAnnouncementsPage } from './pages/AdminAnnouncementsPage';
import { AdminCompaniesPage } from './pages/AdminCompaniesPage';
import { AdminDrivesPage } from './pages/AdminDrivesPage';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Unified Auth / Login (with Student & College Admin role switcher) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Student Experience (Protected by DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/roadmap" element={<RoadmapView />} />
          <Route path="/career-roadmap" element={<RoadmapView />} />
          <Route path="/assessment" element={<AssessmentView />} />
          <Route path="/opportunities" element={<OpportunitiesView />} />
          <Route path="/interview-studio" element={<InterviewStudioPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/practice" element={<PracticeView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        </Route>

        {/* Authenticated College Admin & TPO Experience (Protected by AdminLayout) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/opportunities" element={<AdminOpportunityManagerPage />} />
          <Route path="/admin/interview-criteria" element={<AdminInterviewCriteriaPage />} />
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/drives" element={<AdminDrivesPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/control" element={<AdminSettingsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback / Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
