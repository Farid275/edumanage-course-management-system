import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { role } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <Sidebar role={role || 'admin'} className="h-screen w-[300px] flex-shrink-0 overflow-y-auto hidden lg:flex" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar className="h-16 flex-shrink-0" />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <div key={location.pathname} className="w-full">
                <Outlet />
              </div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
