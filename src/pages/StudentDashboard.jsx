import React from 'react';
import SummaryCard from '../components/SummaryCard';
import { assignments, grades, learningMaterials, attendance } from '../data/dummyData';
import { Link, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
{/* Welcome Banner */}
      <div className="mb-section-margin flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-1">Good Morning, Alex.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Here is an overview of your academic progress this week.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button className="px-6 py-2 rounded border border-primary text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors">Schedule Meeting</button>
          <button className="px-6 py-2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold hover:brightness-95 transition-all">Submit Assignment</button>
        </div>
      </div>
      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mb-section-margin">
        {/* Enrolled Courses */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">school</span>
            </div>
            <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">Fall 2024</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Enrolled Courses</p>
            <p className="font-headline-xl text-headline-xl text-primary">6</p>
          </div>
        </div>
        {/* Average Grade */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-fixed">grade</span>
            </div>
            <span className="font-label-sm text-label-sm text-green-700 bg-green-100 px-2 py-1 rounded flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> 0.2</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Current GPA</p>
            <p className="font-headline-xl text-headline-xl text-primary">3.84</p>
          </div>
        </div>
        {/* Attendance */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Overall Attendance</p>
            <div className="flex items-end gap-2">
              <p className="font-headline-xl text-headline-xl text-primary">94%</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant pb-1">Excellent</p>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{width: '94%'}} />
            </div>
          </div>
        </div>
        {/* Pending Tasks */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-[#E67E22]/30 border-l-4 border-l-[#E67E22] transition-colors bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded bg-[#E67E22]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#E67E22]">notification_important</span>
            </div>
            <span className="font-label-sm text-label-sm text-[#E67E22] bg-[#E67E22]/10 px-2 py-1 rounded font-bold">Action Required</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Due This Week</p>
            <p className="font-headline-xl text-headline-xl text-[#E67E22]">3</p>
          </div>
        </div>
      </div>
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left Column: Assignments & Tasks (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          {/* Upcoming Assignments */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">Upcoming Assignments</h3>
              <button className="text-secondary font-label-sm text-label-sm hover:underline">View All</button>
            </div>
            <div className="p-0">
              {assignments.filter(a => a.isStudent).map(a => (
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
                    <button className="px-3 py-1.5 border border-outline-variant rounded text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">Submit</button>
                  )}
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Course Progress */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">Course Progress</h3>
            <div className="space-y-6">
              {grades.filter(g => !g.isLecturer).map(g => (
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
          </div>
        </div>
        {/* Right Column: Materials & Summary */}
        <div className="flex flex-col gap-gutter">
          {/* New Materials */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-5 border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">New Materials</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">folder_special</span>
            </div>
            <div className="p-0">
              {learningMaterials.map(m => (
              <Link key={m.id} className="flex items-start gap-3 p-4 border-b border-surface-container-highest hover:bg-surface-container-lowest/50 transition-colors" to="/">
                <div className={`w-8 h-8 rounded ${m.bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className={`material-symbols-outlined ${m.iconColor} text-[16px]`}>{m.icon}</span>
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-primary mb-0.5 leading-snug">{m.title}</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{m.meta}</p>
                </div>
              </Link>
              ))}
            </div>
            <div className="p-3 border-t border-surface-container-highest bg-surface-container-lowest text-center">
              <button className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors">Browse Library</button>
            </div>
          </div>
          {/* Mini Calendar/Schedule Widget */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-4">Today's Schedule</h3>
            <div className="relative pl-4 border-l-2 border-surface-container-highest space-y-4">
              {attendance.filter(a => !a.isLecturer).map(a => (
              <div key={a.id} className="relative">
                <div className={`absolute w-2.5 h-2.5 rounded-full -left-[21px] top-1 ${a.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline'}`} />
                <p className={`font-label-sm text-[12px] mb-0.5 ${a.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{a.time}</p>
                <p className="font-label-md text-label-md text-primary">{a.title}</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">{a.location}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default StudentDashboard;
