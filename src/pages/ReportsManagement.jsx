import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';
import AnimatedModal from '../components/animations/AnimatedModal';

const ReportsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [summary, setSummary] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalAttendance: 0,
    totalMaterials: 0,
    averageGrade: 0,
    avgAttendance: 0,
    publishedMaterials: 0
  });

  const [reports, setReports] = useState([]);

  const [dateFilter, setDateFilter] = useState('All Time');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const [
        coursesResult,
        studentsResult,
        assignmentsResult,
        attendanceResult,
        gradesResult,
        materialsResult
      ] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('students').select('*'),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance').select('*').order('created_at', { ascending: false }),
        supabase.from('grades').select('*').order('created_at', { ascending: false }),
        supabase.from('materials').select('*').order('created_at', { ascending: false })
      ]);
  
      const results = [
        coursesResult,
        studentsResult,
        assignmentsResult,
        attendanceResult,
        gradesResult,
        materialsResult
      ];
  
      const firstError = results.find(result => result.error)?.error;
  
      if (firstError) {
        console.error('Supabase reports fetch error:', firstError);
        setError(firstError.message);
        return;
      }
  
      const coursesData = coursesResult.data || [];
      const studentsData = studentsResult.data || [];
      const assignmentsData = assignmentsResult.data || [];
      const attendanceData = attendanceResult.data || [];
      const gradesData = gradesResult.data || [];
      const materialsData = materialsResult.data || [];
  
      const gradeScores = gradesData
        .map(item => Number(item.grade_score))
        .filter(score => !Number.isNaN(score));
  
      const averageGrade =
        gradeScores.length > 0
          ? gradeScores.reduce((sum, score) => sum + score, 0) / gradeScores.length
          : 0;

      const presentCount = attendanceData.filter(a => a.status === 'Present').length;
      const avgAttendance = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0;
      
      const publishedMaterials = materialsData.filter(m => (m.status || 'Published') === 'Published').length;
  
      const reportSummary = {
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
        totalAssignments: assignmentsData.length,
        totalAttendance: attendanceData.length,
        totalMaterials: materialsData.length,
        averageGrade: Number(averageGrade.toFixed(2)),
        avgAttendance,
        publishedMaterials
      };
  
      setCourses(coursesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setMaterials(materialsData);
      setSummary(reportSummary);

      // Generate mixed "reports" list from recent real data for the table
      const mixedReports = [
        ...assignmentsData.map(a => ({ id: `asn-${a.id}`, title: a.assignment_title, course: a.course_code, type: 'Assignment', total_records: a.total_points, status: a.status, date: new Date(a.created_at).toLocaleDateString() })),
        ...attendanceData.map(a => ({ id: `att-${a.id}`, title: `Attendance - ${a.student_name}`, course: a.course_code, type: 'Attendance', total_records: 1, status: a.status, date: new Date(a.created_at).toLocaleDateString() })),
        ...gradesData.map(g => ({ id: `grd-${g.id}`, title: `Grade - ${g.student_name}`, course: g.course_code, type: 'Grade', total_records: g.grade_score, status: g.status, date: new Date(g.created_at).toLocaleDateString() })),
        ...materialsData.map(m => ({ id: `mat-${m.id}`, title: m.material_title, course: m.course_code, type: 'Material', total_records: 1, status: m.status, date: new Date(m.created_at).toLocaleDateString() }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setReports(mixedReports);
  
    } catch (err) {
      console.error('Reports unexpected error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert('PDF export will be connected later.');
  };

  const handleExportExcel = () => {
    alert('Excel export will be connected later.');
  };

  const handleViewReport = (report) => {
    setViewingReport(report);
    setIsModalOpen(true);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.course && r.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCourse = courseFilter === 'All Courses' || r.course === courseFilter || r.title.includes(courseFilter);
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || (r.status || 'Ready') === statusFilter;
    
    return matchesSearch && matchesCourse && matchesType && matchesStatus;
  });

  return (
    <PageContainer>
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="font-headline-xl text-headline-xl text-primary">Reports & Analytics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Generate insights and overview metrics across all modules.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-2 bg-surface border border-outline text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
                Export Excel
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                Export PDF
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-xl border border-surface-container-highest">
              <span className="material-symbols-outlined animate-spin text-[48px] text-primary mb-4">refresh</span>
              <p className="font-label-lg text-on-surface-variant">Loading real-time reports from Supabase...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 bg-error-container/10 rounded-xl border border-error/30">
              <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
              <p className="font-label-lg text-error">Failed to load reports: {error}</p>
            </div>
          ) : (
            <>
              {/* Global Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-on-surface-variant mb-1">Total Courses</span>
                  <span className="font-headline-lg text-primary">{summary.totalCourses}</span>
                </div>
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-on-surface-variant mb-1">Total Students</span>
                  <span className="font-headline-lg text-primary">{summary.totalStudents}</span>
                </div>
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-on-surface-variant mb-1">Total Assignments</span>
                  <span className="font-headline-lg text-primary">{summary.totalAssignments}</span>
                </div>
                <div className="bg-surface-container-lowest border border-[#E6F4EA] rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-[#137333] mb-1">Avg Attendance</span>
                  <span className="font-headline-lg text-[#137333]">{summary.avgAttendance}%</span>
                </div>
                <div className="bg-surface-container-lowest border border-primary-container rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-primary mb-1">Average Grade</span>
                  <span className="font-headline-lg text-primary">{summary.averageGrade}</span>
                </div>
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                  <span className="font-label-md text-on-surface-variant mb-1">Total Materials</span>
                  <span className="font-headline-lg text-primary">{summary.totalMaterials}</span>
                </div>
              </div>
              
              <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
                  <SelectField
                    label="Date Range"
                    wrapperClassName="lg:w-[160px]"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="All Time">All Time</option>
                  </SelectField>
                  <SelectField
                    label="Course"
                    wrapperClassName="lg:w-[160px]"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                  >
                    <option value="All Courses">All Courses</option>
                    {courses.map(c => <option key={c.id} value={c.course_code}>{c.course_code}</option>)}
                  </SelectField>
                  <SelectField
                    label="Report Type"
                    wrapperClassName="lg:w-[180px]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All Types">All Types</option>
                    <option value="Assignment">Assignments</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Grade">Grades</option>
                    <option value="Material">Learning Materials</option>
                  </SelectField>
                  <SelectField
                    label="Status"
                    wrapperClassName="lg:w-[140px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </SelectField>

                <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
                    placeholder="Search records..." 
                    type="text" 
                  />
                </div>
              </div>

              {/* Report Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 lg:p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">school</span>
                    </div>
                    <h3 className="font-headline-sm text-primary">Course</h3>
                  </div>
                  <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
                    {summary.totalCourses} records
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 lg:p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary">calendar_today</span>
                    </div>
                    <h3 className="font-headline-sm text-primary">Attendance</h3>
                  </div>
                  <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
                    {summary.totalAttendance} records
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 lg:p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-tertiary">grade</span>
                    </div>
                    <h3 className="font-headline-sm text-primary">Grades</h3>
                  </div>
                  <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
                    {grades.length} records
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 lg:p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-error">assignment</span>
                    </div>
                    <h3 className="font-headline-sm text-primary">Assignments</h3>
                  </div>
                  <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
                    {summary.totalAssignments} records
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 lg:p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group col-span-1 sm:col-span-2 md:col-span-1 xl:col-span-1">
                  <div className="flex items-center gap-3 mb-2 lg:mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-blue-600">auto_stories</span>
                    </div>
                    <h3 className="font-headline-sm text-primary">Materials</h3>
                  </div>
                  <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
                    {summary.totalMaterials} records
                  </div>
                </div>
              </div>

              {/* Visual Chart Placeholder Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-4 text-center">Attendance Overview</h3>
                  <div className="h-40 w-full bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-outline">pie_chart</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-4 text-center">Grade Distribution</h3>
                  <div className="h-40 w-full bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-outline">bar_chart</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
                  <h3 className="font-headline-sm text-primary mb-4 text-center">Assignment Completion</h3>
                  <div className="h-40 w-full bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-outline">stacked_line_chart</span>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
                <div className="p-4 border-b border-surface-container-highest">
                  <h3 className="font-headline-sm text-primary">Recent Records (All Modules)</h3>
                </div>
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-surface border-b border-surface-container-highest">
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Title / Name</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Module</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Metric Value</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Date</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-highest">
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-md">
                            <div className="flex flex-col items-center gap-2">
                              <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                              <p>No records found matching your criteria.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map(report => (
                          <tr key={report.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                            <td className="p-4 font-body-md text-body-md font-medium text-primary">{report.title}</td>
                            <td className="p-4 font-body-md text-body-md text-on-surface-variant">{report.course || '-'}</td>
                            <td className="p-4 font-body-md text-body-md text-on-surface">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">{report.type}</span>
                            </td>
                            <td className="p-4 font-body-md text-body-md text-on-surface">{report.total_records || '-'}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${['Ready', 'Published', 'Present'].includes(report.status) ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-tertiary-container text-on-tertiary-container'}`}>{report.status || 'N/A'}</span>
                            </td>
                            <td className="p-4 font-body-md text-body-md text-on-surface">{report.date}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleViewReport(report)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="View Detail"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
            </>
          )}

        <AnimatedModal isOpen={isModalOpen && viewingReport} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-primary">Record Detail</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {viewingReport && (
              <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                <div className="bg-surface-variant/30 rounded-lg p-4 border border-outline-variant/30">
                  <h4 className="font-headline-sm text-primary mb-2">{viewingReport.title}</h4>
                  <div className="grid grid-cols-2 gap-4 text-body-sm text-on-surface-variant">
                    <p><strong>Module:</strong> {viewingReport.type}</p>
                    <p><strong>Course:</strong> {viewingReport.course || '-'}</p>
                    <p><strong>Date:</strong> {viewingReport.date}</p>
                    <p><strong>Metric Value:</strong> {viewingReport.total_records || '-'}</p>
                    <p><strong>Status:</strong> {viewingReport.status || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                  <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                    Close Preview
                  </button>
                </div>
              </div>
            )}
      </AnimatedModal>
    </PageContainer>
  );
};

export default ReportsManagement;
