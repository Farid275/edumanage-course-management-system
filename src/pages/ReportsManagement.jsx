import React, { useState } from 'react';
import { reportsData as initialReports } from '../data/dummyData';

const ReportsManagement = () => {
  const [reports, setReports] = useState(initialReports);
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [courseFilter, setCourseFilter] = useState('All Courses');

  const handleExportPDF = () => {
    alert('Exporting report as PDF...');
  };

  const handleExportExcel = () => {
    alert('Exporting report as Excel spreadsheet...');
  };

  const filteredReports = reports.filter(r => {
    // Basic mock filtering, assumes all reports are returned unless we add specific logic
    return true; 
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-section-margin relative">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-card-gap">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary">Reports & Analytics</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Generate insights and overview metrics across all modules.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportExcel}
              className="bg-surface border border-outline text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">table_chart</span>
              Export Excel
            </button>
            <button 
              onClick={handleExportPDF}
              className="bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-card-gap shadow-[0px_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant block mb-1">Date Range</label>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Semester">This Semester</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant block mb-1">Select Course</label>
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
              >
                <option value="All Courses">All Courses (Institution Wide)</option>
                <option value="CS401">CS401 - Advanced Algorithms</option>
                <option value="CS350">CS350 - Database Systems</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">school</span>
              </div>
              <h3 className="font-headline-sm text-primary">Course Report</h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">Enrollment stats, curriculum progress, and course feedback.</p>
            <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
              Generate Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">calendar_today</span>
              </div>
              <h3 className="font-headline-sm text-primary">Attendance</h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">Overall attendance rates, absenteeism alerts, and tardiness.</p>
            <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
              Generate Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">grade</span>
              </div>
              <h3 className="font-headline-sm text-primary">Grade Report</h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">Class averages, highest/lowest scores, and grade distributions.</p>
            <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
              Generate Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">assignment</span>
              </div>
              <h3 className="font-headline-sm text-primary">Assignments</h3>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">Submission rates, pending grading, and deadline tracking.</p>
            <div className="text-secondary font-label-sm flex items-center gap-1 group-hover:underline">
              Generate Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Placeholder Area */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
          <h3 className="font-headline-md text-primary mb-6">Performance Overview</h3>
          <div className="h-64 w-full bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">bar_chart</span>
              <p className="font-body-md text-on-surface-variant">Chart Visualization Component (Pending Integration)</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.02)] relative min-h-[300px]">
          <div className="p-4 border-b border-surface-container-highest">
            <h3 className="font-headline-sm text-primary">Recently Generated Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Report Title</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Type</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Generated Date</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Generated By</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-4 font-body-md text-body-md font-medium text-primary">{report.title}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">{report.type}</span>
                    </td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{report.date}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{report.author}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Download PDF"><span className="material-symbols-outlined text-[20px]">picture_as_pdf</span></button>
                        <button className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Download Excel"><span className="material-symbols-outlined text-[20px]">table_chart</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default ReportsManagement;
