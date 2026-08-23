import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { DetailModal, ModalContentType } from '../components/dashboard/DetailModal';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { PracticeView } from '../components/practice/PracticeView';
import { OpportunitiesView } from '../components/opportunities/OpportunitiesView';
import { CommunicationView } from '../components/communication/CommunicationView';
import { SettingsView } from '../components/settings/SettingsView';
import { ProfileView } from '../components/profile/ProfileView';
import { NavTabId, StudentProfile } from '../types/dashboard';
import { useStudentProfile } from '../utils/userProfile';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const studentProfile = useStudentProfile();

  const handleOpenProfile = () => {
    setActiveTab('profile');
  };

  return (
    <div className="app-container">
      {/* Sleek Dark Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'learn') {
            navigate('/learning');
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main App Workspace */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          profile={studentProfile}
          onOpenProfile={handleOpenProfile}
          onOpenNotifications={() => {}}
        />

        {/* Full Dynamic View Rendering (Zero Placeholders) */}
        <main className="dashboard-content">
          {activeTab === 'dashboard' && <StudentDashboard />}
          {activeTab === 'roadmap' && <RoadmapView />}
          {activeTab === 'practice' && <PracticeView />}
          {activeTab === 'opportunities' && <OpportunitiesView />}
          {activeTab === 'communication' && <CommunicationView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Profile / Auxiliary Modal */}
      <DetailModal content={modalContent} onClose={() => setModalContent(null)} />
    </div>
  );
};

export default DashboardPage;
