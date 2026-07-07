import React, { useState } from 'react';
import { 
  reportsData as initialReports, 
  courses, 
  students, 
  assignmentsData, 
  attendanceData, 
  gradesData, 
  learningMaterialsData 
} from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';
import AnimatedModal from '../components/animations/AnimatedModal';

const ReportsManagement = () => {
  const [reports, setReports] = useState(initialReports);
  const [dateFilter, setDateFilter] = useState('All Time');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

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
      
    const matchesCourse = courseFilter === 'All Courses' || r.course === courseFilter || r.title.includes(courseFilter); // Mock data doesn't have course field natively, so we check title
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || (r.status || 'Ready') === statusFilter;
    
    // dateFilter is dummy, so we just assume true for now, or could parse r.date
    
    return matchesSearch && matchesCourse && matchesType && matchesStatus;
  });

  // Dynamically calculate summary stats
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const totalAssignments = assignmentsData.length;
  
  const presentCount = attendanceData.filter(a => a.status === 'Present').length;
  const avgAttendance = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0;
  
  const completedGrades = gradesData.filter(g => g.final_grade !== null);
  const avgGrade = completedGrades.length > 0 ? (completedGrades.reduce((acc, curr) => acc + curr.final_grade, 0) / completedGrades.length).toFixed(1) : 0;
  
  const publishedMaterials = learningMaterialsData.filter(m => (m.status || 'Published') === 'Published').length;

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

          {/* Global Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-on-surface-variant mb-1">Total Courses</span>
              <span className="font-headline-lg text-primary">{totalCourses}</span>
            </div>
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-on-surface-variant mb-1">Total Students</span>
              <span className="font-headline-lg text-primary">{totalStudents}</span>
            </div>
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-on-surface-variant mb-1">Total Assignments</span>
              <span className="font-headline-lg text-primary">{totalAssignments}</span>
            </div>
            <div className="bg-surface-container-lowest border border-[#E6F4EA] rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-[#137333] mb-1">Avg Attendance</span>
              <span className="font-headline-lg text-[#137333]">{avgAttendance}%</span>
            </div>
            <div className="bg-surface-container-lowest border border-primary-container rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-primary mb-1">Average Grade</span>
              <span className="font-headline-lg text-primary">{avgGrade}</span>
            </div>
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <span className="font-label-md text-on-surface-variant mb-1">Published Materials</span>
              <span className="font-headline-lg text-primary">{publishedMaterials}</span>
            </div>
          </div>
          
          <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
              <SelectField
                label="Date Range"
                wrapperClassName="lg:w-[160px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Semester">This Semester</option>
                <option value="All Time">All Time</option>
              </SelectField>
              <SelectField
                label="Course"
                wrapperClassName="lg:w-[160px]"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="All Courses">All Courses</option>
                {courses.map(c => <option key={c.id} value={c.courseCode}>{c.courseCode}</option>)}
              </SelectField>
              <SelectField
                label="Report Type"
                wrapperClassName="lg:w-[180px]"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All Types">All Types</option>
                <option value="Course Report">Course Report</option>
                <option value="Attendance Report">Attendance Report</option>
                <option value="Grade Report">Grade Report</option>
                <option value="Assignment Report">Assignment Report</option>
                <option value="Learning Materials Report">Learning Materials</option>
              </SelectField>
              <SelectField
                label="Status"
                wrapperClassName="lg:w-[140px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Ready">Ready</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
              </SelectField>

            <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
                placeholder="Search reports..." 
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
                Generate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                Generate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                Generate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                Generate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                Generate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
              <h3 className="font-headline-sm text-primary">Report Library</h3>
            </div>
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-surface border-b border-surface-container-highest">
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Report Title</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Category</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Total Records</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Last Updated</th>
                    <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-md">
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                          <p>No reports found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                        <td className="p-4 font-body-md text-body-md font-medium text-primary">{report.title}</td>
                        <td className="p-4 font-body-md text-body-md text-on-surface-variant">{report.course || 'Institution Wide'}</td>
                        <td className="p-4 font-body-md text-body-md text-on-surface">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">{report.type}</span>
                        </td>
                        <td className="p-4 font-body-md text-body-md text-on-surface">{report.total_records || Math.floor(Math.random() * 500) + 50}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(report.status || 'Ready') === 'Ready' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-tertiary-container text-on-tertiary-container'}`}>{report.status || 'Ready'}</span>
                        </td>
                        <td className="p-4 font-body-md text-body-md text-on-surface">{report.date}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleViewReport(report)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="View Report"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                            <button onClick={handleExportPDF} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Export PDF"><span className="material-symbols-outlined text-[20px]">picture_as_pdf</span></button>
                            <button onClick={handleExportExcel} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Export Excel"><span className="material-symbols-outlined text-[20px]">table_chart</span></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        <AnimatedModal isOpen={isModalOpen && viewingReport} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-primary">Report Preview</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
              <div className="bg-surface-variant/30 rounded-lg p-4 border border-outline-variant/30">
                <h4 className="font-headline-sm text-primary mb-2">{viewingReport.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-body-sm text-on-surface-variant">
                  <p><strong>Category:</strong> {viewingReport.type}</p>
                  <p><strong>Course:</strong> {viewingReport.course || 'Institution Wide'}</p>
                  <p><strong>Generated Date:</strong> {viewingReport.date}</p>
                  <p><strong>Generated By:</strong> {viewingReport.author}</p>
                  <p><strong>Total Records:</strong> {viewingReport.total_records || '156'}</p>
                  <p><strong>Status:</strong> {viewingReport.status || 'Ready'}</p>
                </div>
              </div>

              <div>
                <h5 className="font-label-md text-primary mb-3">Data Snapshot (Dummy Data)</h5>
                <div className="border border-outline-variant rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-variant/50">
                      <tr>
                        <th className="p-2 font-medium">Metric 1</th>
                        <th className="p-2 font-medium">Metric 2</th>
                        <th className="p-2 font-medium">Value</th>
                        <th className="p-2 font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      <tr><td className="p-2">Sample A</td><td className="p-2">Group 1</td><td className="p-2">85%</td><td className="p-2 text-[#137333]">+5%</td></tr>
                      <tr><td className="p-2">Sample B</td><td className="p-2">Group 1</td><td className="p-2">92%</td><td className="p-2 text-[#137333]">+2%</td></tr>
                      <tr><td className="p-2">Sample C</td><td className="p-2">Group 2</td><td className="p-2">78%</td><td className="p-2 text-error">-1%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Close Preview
                </button>
                <button onClick={handleExportPDF} className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> Download Full Report
                </button>
              </div>
            </div>
      </AnimatedModal>
    </PageContainer>
  );
};

export default ReportsManagement;
