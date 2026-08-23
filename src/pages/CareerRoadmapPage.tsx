import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { RoadmapView } from '../components/roadmap/RoadmapView';
import { StudentProfile } from '../types/dashboard';

export const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();

  const studentProfile: StudentProfile = {
    name: 'Alex Chen',
    role: 'Student',
    college: 'Vellore Institute of Technology',
    year: 'CS @ 3rd Year',
    avatarText: 'AC',
    streakDays: 5,
    readinessScore: 78,
    atsScore: 91,
  };

  return (
    <div className="app-container">
      <Sidebar activeTab="career-roadmap" />
      <div className="main-wrapper">
        <Header
          profile={studentProfile}
          onOpenProfile={() => navigate('/profile')}
          onOpenNotifications={() => {}}
        />
        <main className="dashboard-content">
          <RoadmapView />
        </main>
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
