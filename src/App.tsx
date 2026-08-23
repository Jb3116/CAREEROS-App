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
import { CommunicationPage } from './pages/CommunicationPage';
import { SpeakingStudioPage } from './pages/SpeakingStudioPage';

// College Admin Layout & Components
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminPlacementCalendarPage } from './pages/AdminPlacementCalendarPage';
import { AdminOpportunityManagerPage } from './pages/AdminOpportunityManagerPage';
import { AdminInterviewCriteriaPage } from './pages/AdminInterviewCriteriaPage';
import { AdminAnnouncementsPage } from './pages/AdminAnnouncementsPage';
import { AdminCompaniesPage } from './pages/AdminCompaniesPage';
import { AdminDrivesPage } from './pages/AdminDrivesPage';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

const RootRouteHandler: React.FC = () => {
  const authUser = typeof window !== 'undefined' ? localStorage.getItem('careeros_auth_user') : null;
  if (authUser) {
    try {
      const parsed = JSON.parse(authUser);
      if (parsed.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch (e) {}
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root URL: Routes unauthenticated to /login, authenticated to /dashboard */}
        <Route path="/" element={<RootRouteHandler />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage defaultSignUp={false} />} />
        <Route path="/signup" element={<LoginPage defaultSignUp={true} />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Student Experience (Protected by DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/placement" element={<AssessmentView />} />
          <Route path="/assessment" element={<AssessmentView />} />
          <Route path="/career-roadmap" element={<RoadmapView />} />
          <Route path="/roadmap" element={<RoadmapView />} />
          <Route path="/practice" element={<PracticeView />} />
          <Route path="/opportunities" element={<OpportunitiesView />} />
          <Route path="/interview-studio" element={<InterviewStudioPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/speaking" element={<SpeakingStudioPage />} />
          <Route path="/speaking-studio" element={<SpeakingStudioPage />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>

        {/* Authenticated College Admin & TPO Experience (Protected by AdminLayout) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/control" element={<AdminSettingsPage />} />
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/opportunities" element={<AdminOpportunityManagerPage />} />
          <Route path="/admin/interview-criteria" element={<AdminInterviewCriteriaPage />} />
          <Route path="/admin/placement-calendar" element={<AdminPlacementCalendarPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/drives" element={<AdminDrivesPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback / Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
