import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ProfileView } from '../components/profile/ProfileView';
import { StudentProfile } from '../types/dashboard';

export const ProfilePage: React.FC = () => {
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
      <Sidebar activeTab="profile" />
      <div className="main-wrapper">
        <Header
          profile={studentProfile}
          onOpenProfile={() => navigate('/profile')}
          onOpenNotifications={() => {}}
        />
        <main className="dashboard-content">
          <ProfileView />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
