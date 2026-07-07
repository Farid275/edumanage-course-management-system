import React from 'react';
import SummaryCard from '../components/SummaryCard';
import { attendance, assignments, grades } from '../data/dummyData';
import { Link, useNavigate } from 'react-router-dom';

const LecturerDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
{/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-section-margin gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Lecturer Dashboard</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Welcome back, Dr. Smith. Here's your overview for today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-tertiary-fixed transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 1'}}>add</span>
            Create Assignment
          </button>
          <button className="border-2 border-primary text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined">upload</span>
            Upload Material
          </button>
        </div>
      </div>
      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-card-gap mb-section-margin">
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">My Courses</h3>
          <p className="font-headline-lg text-headline-lg text-primary">4</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Active this semester</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/30 rounded-lg text-primary">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-1 rounded-full">3 Due soon</span>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Active Assignments</h3>
          <p className="font-headline-lg text-headline-lg text-primary">7</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container/30 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">inbox</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Pending Submissions</h3>
          <p className="font-headline-lg text-headline-lg text-primary">15</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Requires grading</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Today's Classes</h3>
          <p className="font-headline-lg text-headline-lg text-primary">3</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">First at 09:00 AM</p>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
        {/* Left Column (Schedule & Submissions) */}
        <div className="lg:col-span-2 space-y-card-gap">
          {/* Today's Schedule */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md text-primary">Today's Schedule</h2>
              <button className="text-secondary font-label-md text-label-md hover:underline">View Full Calendar</button>
            </div>
            <div className="space-y-4">
              {attendance.filter(a => a.isLecturer).map(a => (
              <div key={a.id} className="flex gap-4 p-4 rounded-lg border border-outline-variant/30 hover:border-secondary-container transition-colors items-center">
                <div className="text-center min-w-[80px]">
                  <p className="font-label-md text-label-md text-on-surface-variant">{a.time}</p>
                  <p className="font-label-sm text-label-sm text-outline">{a.endTime}</p>
                </div>
                <div className={`w-1 h-12 rounded-full ${a.title.includes('Software') ? 'bg-tertiary' : 'bg-secondary'}`} />
                <div className="flex-1">
                  <h4 className="font-headline-md text-headline-md text-on-surface">{a.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {a.location}
                  </p>
                </div>
                <div>
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors" title="Record Attendance">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </button>
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Recent Submissions */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Submissions</h2>
              <button className="text-secondary font-label-md text-label-md hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-highest">
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 pr-4 font-semibold">Student</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 px-4 font-semibold">Assignment</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 px-4 font-semibold">Course</th>
                    <th className="font-label-md text-label-md text-on-surface-variant pb-3 pl-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.filter(a => a.isLecturer).map(a => (
                  <tr key={a.id} className="border-b border-surface-container-highest/50 hover:bg-surface-container-low transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md ${a.bgClass}`}>{a.initials}</div>
                        <span className="font-body-md text-body-md text-on-surface">{a.student}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.title}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.course}</td>
                    <td className="py-4 pl-4">
                      <button className="text-secondary font-label-sm text-label-sm hover:underline">Grade</button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Column (Stats) */}
        <div className="space-y-card-gap">
          {/* Grade Completion Chart (Placeholder) */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Grading Progress</h2>
            <div className="space-y-6">
              {grades.filter(g => g.isLecturer).map(g => (
              <div key={g.id}>
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
          </div>
          {/* Average Attendance */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Average Attendance</h2>
            <div className="flex items-end gap-4 mb-2">
              <span className="font-headline-xl text-headline-xl text-primary">92%</span>
              <span className="text-secondary flex items-center font-label-md text-label-md mb-2">
                <span className="material-symbols-outlined text-[18px]">trending_up</span> +2% this week
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Across all active courses</p>
          </div>
        </div>
      </div>

    </>
  );
};

export default LecturerDashboard;
