import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import SummaryCard from '../components/SummaryCard';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        coursesResult,
        studentsResult,
        assignmentsResult,
        attendanceResult,
        gradesResult,
        materialsResult,
        profilesResult
      ] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance').select('*').order('created_at', { ascending: false }),
        supabase.from('grades').select('*').order('created_at', { ascending: false }),
        supabase.from('materials').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      const results = [
        coursesResult,
        studentsResult,
        assignmentsResult,
        attendanceResult,
        gradesResult,
        materialsResult,
        profilesResult
      ];

      const firstError = results.find(result => result.error)?.error;

      if (firstError) {
        console.error('Supabase dashboard fetch error:', firstError);
        setError(firstError.message);
        return;
      }

      const coursesData = coursesResult.data || [];
      const studentsData = studentsResult.data || [];
      const assignmentsData = assignmentsResult.data || [];
      const attendanceData = attendanceResult.data || [];
      const gradesData = gradesResult.data || [];
      const materialsData = materialsResult.data || [];
      const profilesData = profilesResult.data || [];

      const gradeScores = gradesData
        .map(item => Number(item.grade_score))
        .filter(score => !Number.isNaN(score));

      const averageGrade =
        gradeScores.length > 0
          ? gradeScores.reduce((sum, score) => sum + score, 0) / gradeScores.length
          : 0;

      const dashboardSummary = {
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
        totalAssignments: assignmentsData.length,
        totalAttendance: attendanceData.length,
        totalGrades: gradesData.length,
        totalMaterials: materialsData.length,
        totalUsers: profilesData.length,
        averageGrade: Number(averageGrade.toFixed(2)),
        highestGrade: gradeScores.length > 0 ? Math.max(...gradeScores) : 0,
        lowestGrade: gradeScores.length > 0 ? Math.min(...gradeScores) : 0
      };

      setCourses(coursesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setMaterials(materialsData);
      setProfiles(profilesData);
      setSummary(dashboardSummary);

    } catch (err) {
      console.error('Dashboard unexpected error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 mt-10">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary mb-4">refresh</span>
          <p className="font-label-lg text-on-surface-variant">Loading dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 mt-10 bg-error-container/10 rounded-xl border border-error/30">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <p className="font-label-lg text-error">Failed to load dashboard: {error}</p>
        </div>
      </PageContainer>
    );
  }

  const adminSummaryStats = [
    { title: 'Total Students', value: summary.totalStudents, trend: '', trendUp: true, icon: 'group', color: 'primary' },
    { title: 'Active Courses', value: summary.totalCourses, trend: '', trendUp: true, icon: 'school', color: 'secondary' },
    { title: 'Total Assignments', value: summary.totalAssignments, trend: '', trendUp: true, icon: 'assignment', color: 'tertiary' },
    { title: 'Total Attendance', value: summary.totalAttendance, trend: '', trendUp: true, icon: 'fact_check', color: 'primary' },
    { title: 'Total Grades', value: summary.totalGrades, trend: '', trendUp: true, icon: 'grade', color: 'secondary' },
    { title: 'Total Materials', value: summary.totalMaterials, trend: '', trendUp: true, icon: 'library_books', color: 'tertiary' }
  ];

  const latestCourses = courses.slice(0, 5).map(c => ({
    id: c.id,
    name: c.course_name,
    lecturer: profiles.find(p => p.id === c.created_by)?.full_name || 'Admin',
    enrolled: students.length, // approximation
    status: c.status || 'Active',
    statusVariant: (c.status || 'Active') === 'Active' ? 'primary' : 'secondary'
  }));

  const recentActivity = [
    ...assignments.map(a => ({ id: `a_${a.id}`, time: new Date(a.created_at).toLocaleDateString(), title: a.assignment_title, description: `Assignment for ${a.course_code}`, colorClass: 'bg-tertiary', date: new Date(a.created_at) })),
    ...materials.map(m => ({ id: `m_${m.id}`, time: new Date(m.created_at).toLocaleDateString(), title: m.material_title, description: `Material for ${m.course_code}`, colorClass: 'bg-primary', date: new Date(m.created_at) })),
    ...grades.map(g => ({ id: `g_${g.id}`, time: new Date(g.created_at).toLocaleDateString(), title: `Grade: ${g.grade_score}`, description: `For ${g.student_name} in ${g.course_code}`, colorClass: 'bg-secondary', date: new Date(g.created_at) }))
  ].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <PageContainer>
      {/* Page Header & Actions */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Dashboard Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/courses" className="flex items-center justify-center gap-2 bg-tertiary-container hover:bg-tertiary text-on-tertiary-container font-label-md text-label-md px-6 py-2.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Courses
          </Link>
          <Link to="/students" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md px-6 py-2.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Students
          </Link>
        </div>
      </div>
      
      {/* Summary Cards (Bento Grid Style) */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {adminSummaryStats.map((stat, i) => (
          <div key={i} className="w-full h-full">
            <SummaryCard item={stat} index={i} />
          </div>
        ))}
        {/* Pending Reports (Custom card) */}
        <div className="w-full h-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: adminSummaryStats.length * 0.05, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-full bg-surface-container-lowest p-6 rounded-xl border border-error-container bg-error-container/20 flex flex-col gap-3 relative overflow-hidden group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-error-container">System Users</span>
              <span className="material-symbols-outlined text-on-error-container">group</span>
            </div>
            <div className="font-headline-xl text-headline-xl text-on-error-container">{summary.totalUsers}</div>
            <Link to="/settings" className="mt-auto text-left font-label-sm text-label-sm text-on-error-container underline hover:opacity-80">View Profiles</Link>
          </motion.div>
        </div>
      </div>
      
      {/* Complex Layout Area */}
      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Latest Courses Table (Spans 8 cols on XL) */}
        <div className="xl:col-span-8 flex flex-col min-w-0">
          <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest flex-1 flex flex-col">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright min-w-[600px]">
              <h3 className="font-headline-md text-headline-md text-primary">Latest Courses</h3>
              <Link to="/courses" className="text-secondary font-label-md text-label-md hover:underline">View All</Link>
            </div>
            {latestCourses.length === 0 ? (
               <div className="p-8 text-center text-on-surface-variant">No courses found.</div>
            ) : (
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Course Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Lecturer</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Enrolled (Est)</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {latestCourses.map(course => (
                  <tr key={course.id} className="border-b border-surface-container-highest/50 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-medium text-primary">{course.name}</td>
                    <td className="p-4 text-on-surface-variant">{course.lecturer}</td>
                    <td className="p-4 text-on-surface-variant">{course.enrolled}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full bg-${course.statusVariant}-fixed/50 text-on-${course.statusVariant}-fixed font-label-sm text-label-sm`}>{course.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
        
        {/* Recent Activity (Spans 4 cols on XL) */}
        <div className="xl:col-span-4 w-full h-full bg-white rounded-xl border border-surface-container-highest shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-container-highest bg-surface-bright">
            <h3 className="font-headline-md text-headline-md text-primary">Recent Activity</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {recentActivity.length === 0 ? (
               <div className="text-center text-on-surface-variant">No recent activity.</div>
            ) : (
            <div className="relative border-l border-surface-container-highest ml-3 space-y-6">
              {recentActivity.map(item => (
                <div key={item.id} className="relative pl-6">
                  <span className={`absolute -left-1.5 top-1 w-3 h-3 ${item.colorClass} rounded-full ring-4 ring-white`} />
                  <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.time}</div>
                  <div className="font-body-md text-body-md text-primary font-medium">{item.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.description}</div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
