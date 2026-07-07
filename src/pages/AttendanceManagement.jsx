import React, { useState } from 'react';
import { attendanceData as initialAttendance } from '../data/dummyData';

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendance);
  const [courseFilter, setCourseFilter] = useState('CS401');
  const [meetingDate, setMeetingDate] = useState('2024-11-05');
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Present': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Absent': return 'bg-error-container text-on-error-container';
      case 'Late': return 'bg-tertiary-container text-on-tertiary-container';
      case 'Excused': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAttendanceRecords(records => records.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  const handleNotesChange = (id, newNotes) => {
    setAttendanceRecords(records => records.map(r => 
      r.id === id ? { ...r, notes: newNotes } : r
    ));
  };

  const handleSaveAttendance = () => {
    // In a real app this would save to a database.
    alert(`Attendance for ${courseFilter} on ${meetingDate} saved successfully!`);
  };

  const filteredRecords = attendanceRecords.filter(r => r.course === courseFilter);

  // Calculate stats
  const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'Absent').length;
  const lateCount = filteredRecords.filter(r => r.status === 'Late').length;
  const excusedCount = filteredRecords.filter(r => r.status === 'Excused').length;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-section-margin relative">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-card-gap">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary">Attendance</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track student presence, absences, and tardiness.</p>
          </div>
          <button 
            onClick={handleSaveAttendance}
            className="bg-primary text-white font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
            Save Attendance
          </button>
        </div>
        
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-card-gap shadow-[0px_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant block mb-1">Select Course</label>
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
              >
                <option value="CS401">CS401 - Advanced Algorithms</option>
                <option value="CS350">CS350 - Database Systems</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant block mb-1">Meeting Date</label>
              <input 
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-[#E6F4EA] rounded-xl p-4 shadow-sm flex flex-col">
            <span className="font-label-md text-[#137333] mb-1">Present</span>
            <span className="font-headline-lg text-primary">{presentCount}</span>
          </div>
          <div className="bg-surface-container-lowest border border-error-container rounded-xl p-4 shadow-sm flex flex-col">
            <span className="font-label-md text-on-error-container mb-1">Absent</span>
            <span className="font-headline-lg text-primary">{absentCount}</span>
          </div>
          <div className="bg-surface-container-lowest border border-tertiary-container rounded-xl p-4 shadow-sm flex flex-col">
            <span className="font-label-md text-on-tertiary-container mb-1">Late</span>
            <span className="font-headline-lg text-primary">{lateCount}</span>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col">
            <span className="font-label-md text-on-surface-variant mb-1">Excused</span>
            <span className="font-headline-lg text-primary">{excusedCount}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.02)] relative min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student ID</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface w-1/3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest">person_off</span>
                        <p>No students enrolled in this course.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="p-4 font-body-md text-body-md font-medium text-primary">{record.student_name}</td>
                      <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{record.student_id}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">{record.course}</td>
                      <td className="p-4">
                        <select 
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, e.target.value)}
                          className={`bg-transparent border border-outline-variant rounded-full px-3 py-1 text-sm font-medium outline-none focus:ring-1 focus:ring-primary ${getStatusClass(record.status)}`}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Excused">Excused</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={record.notes}
                          onChange={(e) => handleNotesChange(record.id, e.target.value)}
                          placeholder="Add note..."
                          className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3 py-1.5 text-body-sm focus:border-secondary-container outline-none transition-colors"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default AttendanceManagement;
