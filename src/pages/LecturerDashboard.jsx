import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import SummaryCard from '../components/SummaryCard';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const LecturerDashboard = () => {
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

  // Derive lecturer view subsets
  const todaysSchedule = attendance.slice(0, 4).map(a => ({
    id: a.id,
    time: new Date(a.attendance_date || a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    endTime: new Date(new Date(a.attendance_date || a.created_at).getTime() + 90*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    title: a.course_name || 'Class Session',
    location: 'Room TBD',
    isSoftware: (a.course_name || '').includes('Software')
  }));

  const recentSubmissions = assignments.slice(0, 5).map(a => {
    // try to find related grade or student name if it was a submission table, but assignments is just definitions right now.
    // We mock the student side using recent grades to look like submissions.
    return {
      id: a.id,
      student: 'Waiting for submission',
      initials: '?',
      bgClass: 'bg-surface-container-high',
      title: a.assignment_title,
      course: a.course_name
    };
  });
  
  // Use grades for recent submissions view to show actual student interactions
  const recentGradesAsSubmissions = grades.slice(0, 5).map(g => ({
    id: g.id,
    student: g.student_name || 'Unknown',
    initials: (g.student_name || 'U').substring(0,2).toUpperCase(),
    bgClass: 'bg-secondary-container text-on-secondary-container',
    title: g.assignment_title || 'Assignment',
    course: g.course_name || 'Course'
  }));

  const gradingProgress = courses.slice(0, 4).map(c => {
    // Mock progress based on course id length
    const progress = Math.min(100, Math.max(10, c.id.length * 5));
    return {
      id: c.id,
      course: c.course_code,
      progress: progress,
      colorClass: progress > 80 ? 'bg-primary' : 'bg-[#E67E22]'
    };
  });

  return (
    <PageContainer>
      {/* Header & Actions */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-headline-xl text-headline-xl text-primary">Lecturer Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Welcome back. Here's your overview for today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/assignments" className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-tertiary-fixed transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 1'}}>add</span>
            Assignments
          </Link>
          <Link to="/materials" className="border border-primary text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined">upload</span>
            Materials
          </Link>
        </div>
      </div>
      
      {/* Metrics Bento Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container/20 rounded-lg text-primary">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Total Courses</h3>
          <p className="font-headline-lg text-headline-lg text-primary">{summary.totalCourses}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Active this semester</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/30 rounded-lg text-primary">
              <span className="material-symbols-outlined">assignment</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Total Assignments</h3>
          <p className="font-headline-lg text-headline-lg text-primary">{summary.totalAssignments}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container/30 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">inbox</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Graded Activities</h3>
          <p className="font-headline-lg text-headline-lg text-primary">{summary.totalGrades}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Completed so far</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container/20 rounded-lg text-primary">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Attendance Records</h3>
          <p className="font-headline-lg text-headline-lg text-primary">{summary.totalAttendance}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Historical entries</p>
        </motion.div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Column (Schedule & Submissions) */}
        <div className="xl:col-span-8 space-y-6 w-full flex flex-col">
          {/* Today's Schedule */}
          <div className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 bg-surface-bright">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Attendance Logs</h2>
              <Link to="/attendance" className="text-secondary font-label-md text-label-md hover:underline">View All</Link>
            </div>
            {todaysSchedule.length === 0 ? (
               <div className="text-center text-on-surface-variant">No recent attendance records.</div>
            ) : (
            <div className="space-y-4 w-full">
              {todaysSchedule.map(a => (
              <div key={a.id} className="flex gap-4 p-4 rounded-lg border border-outline-variant/30 hover:border-secondary-container transition-colors items-center w-full">
                <div className="text-center min-w-[80px]">
                  <p className="font-label-md text-label-md text-on-surface-variant">{a.time}</p>
                </div>
                <div className={`w-1 h-12 rounded-full flex-shrink-0 ${a.isSoftware ? 'bg-tertiary' : 'bg-secondary'}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline-md text-headline-md text-on-surface truncate">{a.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1 truncate">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {a.location}
                  </p>
                </div>
                <div>
                  <Link to="/attendance" className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors" title="Record Attendance">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </Link>
                </div>
              </div>
              ))}
            </div>
            )}
          </div>
          {/* Recent Submissions */}
          <div className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 bg-surface-bright">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Grades Given</h2>
              <Link to="/grades" className="text-secondary font-label-md text-label-md hover:underline">View All</Link>
            </div>
            <div className="w-full overflow-x-auto">
              {recentGradesAsSubmissions.length === 0 ? (
                 <div className="text-center text-on-surface-variant p-4">No recent grades given.</div>
              ) : (
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-highest">
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 pr-4 font-semibold">Student</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 px-4 font-semibold">Assignment</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 px-4 font-semibold">Course</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 pl-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGradesAsSubmissions.map(a => (
                  <tr key={a.id} className="border-b border-surface-container-highest/50 hover:bg-surface-container-low transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md shrink-0 ${a.bgClass}`}>{a.initials}</div>
                        <span className="font-body-md text-body-md text-on-surface whitespace-nowrap">{a.student}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.title}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.course}</td>
                    <td className="py-4 pl-4">
                      <Link to="/grades" className="text-secondary font-label-sm text-label-sm hover:underline">Review</Link>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column (Stats) */}
        <div className="xl:col-span-4 space-y-6 w-full flex flex-col">
          {/* Grade Completion Chart (Placeholder) */}
          <div className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Course Coverage</h2>
            {gradingProgress.length === 0 ? (
               <div className="text-center text-on-surface-variant">No active courses.</div>
            ) : (
            <div className="space-y-6 w-full">
              {gradingProgress.map(g => (
              <div key={g.id} className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="font-label-md text-label-md text-on-surface">{g.course}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">{g.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div className={`${g.colorClass} h-2 rounded-full`} style={{width: `${g.progress}%`}} />
                </div>
              </div>
              ))}
            </div>
            )}
          </div>
          {/* Average Attendance */}
          <div className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Average Grade Score</h2>
            <div className="flex items-end gap-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-primary">{summary.averageGrade}</span>
              <span className="text-secondary flex items-center font-label-md text-label-md mb-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Across all graded activities</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LecturerDashboard;
