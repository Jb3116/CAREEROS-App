import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout-container">
      {/* Specialized Institutional Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Content Area */}
      <div className="admin-main-wrapper">
        <AdminHeader />
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
