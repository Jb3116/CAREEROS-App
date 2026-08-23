import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { StudentProfile } from '../types/dashboard';
import { useStudentProfile } from '../utils/userProfile';

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const studentProfile = useStudentProfile();

  return (
    <div className="app-container">
      <Sidebar
        activeTab="roadmap"
        onTabChange={(tab) => {
          if (tab === 'dashboard') navigate('/dashboard');
          else if (tab === 'roadmap') navigate('/roadmap');
          else navigate(`/dashboard?tab=${tab}`);
        }}
      />
      <div className="main-wrapper">
        <Header
          profile={studentProfile}
          onOpenProfile={() => navigate('/dashboard?tab=profile')}
          onOpenNotifications={() => {}}
        />
        <main className="dashboard-content">
          <RoadmapView />
        </main>
      </div>
    </div>
  );
};

export default RoadmapPage;
