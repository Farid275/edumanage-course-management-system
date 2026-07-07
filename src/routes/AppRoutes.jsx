import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import LecturerDashboard from '../pages/LecturerDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import CoursesManagement from '../pages/CoursesManagement';
import StudentManagement from '../pages/StudentManagement';
import LecturerManagement from '../pages/LecturerManagement';
import AssignmentsManagement from '../pages/AssignmentsManagement';
import AttendanceManagement from '../pages/AttendanceManagement';
import GradesManagement from '../pages/GradesManagement';
import LearningMaterialsManagement from '../pages/LearningMaterialsManagement';
import ReportsManagement from '../pages/ReportsManagement';
import SettingsManagement from '../pages/SettingsManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Dashboard Routes wrapped in DashboardLayout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}><CoursesManagement /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}><StudentManagement /></ProtectedRoute>} />
        <Route path="/lecturers" element={<ProtectedRoute allowedRoles={['admin']}><LecturerManagement /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}><ReportsManagement /></ProtectedRoute>} />
        
        {/* Lecturer Routes */}
        <Route path="/lecturer/dashboard" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        
        {/* Shared Protected Routes */}
        <Route path="/assignments" element={<AssignmentsManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/grades" element={<GradesManagement />} />
        <Route path="/materials" element={<LearningMaterialsManagement />} />
        <Route path="/settings" element={<SettingsManagement />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
