import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import SummaryCard from '../components/SummaryCard';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const StudentDashboard = () => {
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

  const upcomingAssignments = assignments.slice(0, 5).map(a => {
    const d = new Date(a.due_date || a.created_at);
    return {
      id: a.id,
      date: {
        month: d.toLocaleString('default', { month: 'short' }),
        day: d.getDate()
      },
      title: a.assignment_title,
      course: a.course_name,
      lecturer: 'Instructor',
      status: a.status === 'Active' ? 'urgent' : 'normal',
      due: 'Pending'
    };
  });

  const courseProgress = grades.slice(0, 4).map(g => {
    return {
      id: g.id,
      course: g.course_name,
      module: g.assignment_title,
      progress: Math.min(100, Math.max(0, g.grade_score || 0)),
      colorClass: (g.grade_score || 0) > 80 ? 'bg-primary' : ((g.grade_score || 0) > 60 ? 'bg-secondary' : 'bg-[#E67E22]')
    };
  });

  const recentMaterials = materials.slice(0, 5).map(m => {
    return {
      id: m.id,
      title: m.material_title,
      meta: `${m.course_name} • ${new Date(m.created_at).toLocaleDateString()}`,
      bgClass: 'bg-primary-container',
      iconColor: 'text-primary',
      icon: 'description'
    };
  });

  const todaysSchedule = attendance.slice(0, 4).map(a => ({
    id: a.id,
    time: new Date(a.attendance_date || a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    title: a.course_name || 'Class Session',
    location: 'Room TBD',
    active: a.status === 'Present'
  }));

  const estimatedGPA = summary.averageGrade ? (summary.averageGrade / 25).toFixed(2) : 'N/A';

  return (
    <PageContainer>
      {/* Welcome Banner */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary mb-1">Good Morning.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Here is an overview of academic progress.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors">Schedule Meeting</motion.button>
          <Link to="/assignments" className="px-6 py-2.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md hover:brightness-95 transition-all shadow-sm flex items-center">View Assignments</Link>
        </div>
      </div>
      
      {/* Metrics Bento Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Enrolled Courses */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">school</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Available Courses</p>
            <p className="font-headline-xl text-headline-xl text-primary">{summary.totalCourses}</p>
          </div>
        </motion.div>
        {/* Average Grade */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">grade</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Est. GPA</p>
            <p className="font-headline-xl text-headline-xl text-primary">{estimatedGPA}</p>
          </div>
        </motion.div>
        {/* Attendance */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Global Attendance Records</p>
            <div className="flex items-end gap-2">
              <p className="font-headline-xl text-headline-xl text-primary">{summary.totalAttendance}</p>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{width: '94%'}} />
            </div>
          </div>
        </motion.div>
        {/* Pending Tasks */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-[#E67E22]/30 border-l-4 border-l-[#E67E22] transition-colors bg-white cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E67E22]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#E67E22]">notification_important</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Global Assignments</p>
            <p className="font-headline-xl text-headline-xl text-[#E67E22]">{summary.totalAssignments}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Content Grid */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Assignments & Tasks (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {/* Upcoming Assignments */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-sm w-full">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-headline-md text-primary">Recent Assignments</h3>
              <Link to="/assignments" className="text-secondary font-label-md text-label-md hover:underline">View All</Link>
            </div>
            <div className="p-0">
              {upcomingAssignments.length === 0 ? (
                 <div className="p-6 text-center text-on-surface-variant">No recent assignments.</div>
              ) : upcomingAssignments.map(a => (
              <div key={a.id} className={`p-4 border-b border-surface-container-highest flex items-center justify-between hover:bg-surface-container-lowest/50 transition-colors ${a.status === 'urgent' ? 'bg-[#E67E22]/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border ${a.status === 'urgent' ? 'bg-[#E67E22]/10 border-[#E67E22]/20 text-[#E67E22]' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'}`}>
                    <span className="font-label-sm text-[10px] uppercase font-bold">{a.date.month}</span>
                    <span className="font-headline-md text-[18px] leading-tight font-bold">{a.date.day}</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-primary mb-1">{a.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">school</span> {a.course} • {a.lecturer}</p>
                  </div>
                </div>
                <div className="text-right">
                  {a.status === 'urgent' ? (
                    <span className="inline-block px-2 py-1 bg-[#E67E22] text-white rounded font-label-sm text-[10px] font-bold uppercase tracking-wider mb-1">{a.due}</span>
                  ) : (
                    <Link to="/assignments" className="px-3 py-1.5 border border-outline-variant rounded text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">View</Link>
                  )}
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Course Progress */}
          <div className="glass-panel rounded-xl p-6 shadow-sm w-full">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">Recent Grades Progress</h3>
            {courseProgress.length === 0 ? (
               <div className="text-center text-on-surface-variant">No recent grades available.</div>
            ) : (
            <div className="space-y-6">
              {courseProgress.map(g => (
              <div key={g.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-label-md text-label-md text-primary">{g.course}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{g.module}</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-bold">{g.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className={`${g.colorClass} h-full rounded-full`} style={{width: `${g.progress}%`}} />
                </div>
              </div>
              ))}
            </div>
            )}
          </div>
        </div>
        {/* Right Column: Materials & Summary */}
        <div className="flex flex-col gap-6 w-full">
          {/* New Materials */}
          <div className="glass-panel rounded-xl overflow-hidden shadow-sm w-full">
            <div className="p-5 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">New Materials</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">folder_special</span>
            </div>
            <div className="p-0">
              {recentMaterials.length === 0 ? (
                 <div className="p-6 text-center text-on-surface-variant">No materials found.</div>
              ) : recentMaterials.map(m => (
              <Link key={m.id} className="flex items-start gap-3 p-4 border-b border-surface-container-highest hover:bg-surface-container-lowest/50 transition-colors" to="/materials">
                <div className={`w-8 h-8 rounded-lg ${m.bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className={`material-symbols-outlined ${m.iconColor} text-[16px]`}>{m.icon}</span>
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-primary mb-0.5 leading-snug">{m.title}</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{m.meta}</p>
                </div>
              </Link>
              ))}
            </div>
            <div className="p-3 border-t border-surface-container-highest bg-surface-bright text-center">
              <Link to="/materials" className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors">Browse Library</Link>
            </div>
          </div>
          {/* Mini Calendar/Schedule Widget */}
          <div className="glass-panel rounded-xl p-5 shadow-sm w-full">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-4">Recent Attendance</h3>
            {todaysSchedule.length === 0 ? (
               <div className="text-center text-on-surface-variant">No attendance records.</div>
            ) : (
            <div className="relative pl-4 border-l-2 border-surface-container-highest space-y-4">
              {todaysSchedule.map(a => (
              <div key={a.id} className="relative">
                <div className={`absolute w-2.5 h-2.5 rounded-full -left-[21px] top-1 ${a.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline'}`} />
                <p className={`font-label-sm text-[12px] mb-0.5 ${a.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{a.time}</p>
                <p className="font-label-md text-label-md text-primary">{a.title}</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">{a.location}</p>
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

export default StudentDashboard;
