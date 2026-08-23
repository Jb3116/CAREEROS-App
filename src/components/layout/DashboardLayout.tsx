import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { DetailModal, ModalContentType } from '../dashboard/DetailModal';
import { AiMentorChatModal } from '../chat/AiMentorChatModal';
import { StudentProfile } from '../../types/dashboard';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalContent, setModalContent] = useState<ModalContentType>(null);

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

  const handleOpenProfile = () => {
    navigate('/profile');
  };

  const isAssessment = location.pathname === '/assessment';

  return (
    <div className="app-container">
      {/* Permanent Persistent Application Sidebar using UI Primitives */}
      <AppSidebar />

      {/* Main App Content Wrapper */}
      <div className="main-wrapper">
        {/* Permanent Top Header (Active for all views except fullscreen proctored assessment) */}
        {!isAssessment && (
          <Header
            profile={studentProfile}
            onOpenProfile={handleOpenProfile}
            onOpenNotifications={() => {}}
          />
        )}

        {/* Dynamic Nested Child Route View */}
        <main
          className="dashboard-content"
          style={isAssessment ? { padding: 0, maxWidth: '100%', background: '#0B0F19' } : undefined}
        >
          <Outlet />
        </main>
      </div>

      {/* Global Auxiliary Modal */}
      <DetailModal content={modalContent} onClose={() => setModalContent(null)} />

      {/* Floating CAREEROS AI Career Mentor Widget */}
      <AiMentorChatModal />
    </div>
  );
};

export default DashboardLayout;
