import React from 'react';
import SummaryCard from '../components/SummaryCard';
import { latestCourses, recentActivity, summaryStats } from '../data/dummyData';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
{/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Dashboard Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-tertiary-container hover:bg-tertiary text-on-tertiary-container font-label-md text-label-md px-4 py-2 rounded-lg shadow-sm transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined">add</span>
            Add Course
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg shadow-sm transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined">person_add</span>
            Add Student
          </button>
        </div>
      </div>
      {/* Summary Cards (Bento Grid Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-card-gap mb-section-margin">
        {summaryStats.admin.map((stat, i) => <SummaryCard key={i} item={stat} />)}
        {/* Pending Reports (Custom card) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-error-container bg-error-container/20 flex flex-col gap-3 relative overflow-hidden group transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-error-container">Pending Reports</span>
            <span className="material-symbols-outlined text-on-error-container">warning</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-on-error-container">8</div>
          <button className="mt-auto text-left font-label-sm text-label-sm text-on-error-container underline hover:opacity-80">Review Now</button>
        </div>
      </div>
      {/* Complex Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap mb-section-margin">
        {/* Latest Courses Table (Spans 8 cols on LG) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-surface-container-highest overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
            <h3 className="font-headline-md text-headline-md text-primary">Latest Courses</h3>
            <button className="text-secondary font-label-md text-label-md hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Course Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Lecturer</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface-container-lowest z-10">Enrolled</th>
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
          </div>
        </div>
        {/* Recent Activity (Spans 4 cols on LG) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-surface-container-highest flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-surface-container-highest bg-surface-bright">
            <h3 className="font-headline-md text-headline-md text-primary">Recent Activity</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="relative border-l border-surface-container-highest ml-3 space-y-6">
              {recentActivity.map(item => (
                <div key={item.id} className="relative pl-6">
                  <span className={`absolute -left-1.5 top-1 w-3 h-3 ${item.colorClass} rounded-full ring-4 ring-surface-container-lowest`} />
                  <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.time}</div>
                  <div className="font-body-md text-body-md text-primary font-medium">{item.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default AdminDashboard;
