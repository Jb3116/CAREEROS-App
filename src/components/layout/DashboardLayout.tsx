import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { DetailModal, ModalContentType } from '../dashboard/DetailModal';
import { AiMentorChatModal } from '../chat/AiMentorChatModal';
import { AiWebsiteTour } from '../tour/AiWebsiteTour';
import { StudentProfile } from '../../types/dashboard';
import { useStudentProfile } from '../../utils/userProfile';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const studentProfile = useStudentProfile();

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

      {/* Interactive AI Website Tour Overlay */}
      <AiWebsiteTour />
    </div>
  );
};

export default DashboardLayout;
