import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { role } = useAuth();
  
  return (
    <div>
      <Sidebar role={role || 'admin'} />
      <div className="flex-1 flex flex-col lg:ml-[280px] h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-container-padding bg-background pb-20 lg:pb-8">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
