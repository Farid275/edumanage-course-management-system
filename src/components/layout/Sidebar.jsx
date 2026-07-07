import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['admin'] },
  { path: '/lecturer/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['lecturer'] },
  { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['student'] },
  { path: '/courses', icon: 'school', label: 'Courses', roles: ['admin', 'lecturer', 'student'] },
  { path: '/students', icon: 'group', label: 'Students', roles: ['admin', 'lecturer'] },
  { path: '/lecturers', icon: 'record_voice_over', label: 'Lecturers', roles: ['admin'] },
  { path: '/assignments', icon: 'assignment', label: 'Assignments', roles: ['admin', 'lecturer', 'student'] },
  { path: '/attendance', icon: 'calendar_today', label: 'Attendance', roles: ['admin', 'lecturer', 'student'] },
  { path: '/grades', icon: 'grade', label: 'Grades', roles: ['admin', 'lecturer', 'student'] },
  { path: '/materials', icon: 'folder_open', label: 'Materials', roles: ['admin', 'lecturer', 'student'] },
  { path: '/reports', icon: 'bar_chart', label: 'Reports', roles: ['admin', 'lecturer'] },
  { path: '/settings', icon: 'settings', label: 'Settings', roles: ['admin', 'lecturer', 'student'], isBottom: true }
];

const Sidebar = ({ role = 'admin', className = '' }) => {
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className={`flex-col h-full border-r border-outline-variant/20 bg-primary dark:bg-primary-container z-50 ${className || 'hidden lg:flex fixed left-0 top-0 w-[280px]'}`}>
      <div className="p-container-padding pb-card-gap">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded bg-tertiary-fixed flex items-center justify-center text-primary font-bold text-xl">E</div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-white">EduManage</h1>
        </div>
        <p className="font-label-md text-label-md text-primary-fixed-dim">Academic Portal</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            const activeClasses = "flex items-center gap-base text-secondary-fixed dark:text-secondary-fixed-dim border-l-4 border-secondary-container bg-on-primary-fixed-variant/10 px-4 py-3 font-label-md text-label-md transition-all duration-200";
            const inactiveClasses = "flex items-center gap-base text-on-primary/70 dark:text-on-primary-container/70 border-l-4 border-transparent px-4 py-3 font-label-md text-label-md hover:bg-on-primary-fixed-variant/5 hover:text-white transition-all duration-200";
            
            return (
              <li key={index}>
                <Link 
                  className={`${isActive ? activeClasses : inactiveClasses} ${item.isBottom ? 'mt-8 border-t border-white/10 pt-4' : ''}`} 
                  to={item.path}
                >
                  <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
