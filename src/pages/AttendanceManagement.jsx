import React, { useState } from 'react';
import { attendanceData as initialAttendance, courses } from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendance);
  const [courseFilter, setCourseFilter] = useState(courses.length > 0 ? courses[0].courseCode : '');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Present': return 'bg-[#E6F4EA] text-[#137333] border border-[#E6F4EA] focus:border-[#137333]';
      case 'Absent': return 'bg-error-container text-on-error-container border border-error-container focus:border-error';
      case 'Late': return 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container focus:border-tertiary';
      case 'Excused': return 'bg-surface-variant text-on-surface-variant border border-surface-variant focus:border-outline-variant';
      default: return 'bg-surface-variant text-on-surface-variant border border-surface-variant';
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

  // Filter records by course first to calculate correct stats for the session
  const courseRecords = attendanceRecords.filter(r => r.course === courseFilter);

  // Then apply search and status filters for the table view
  const filteredRecords = courseRecords.filter(r => {
    const matchesSearch = 
      r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats based on the courseRecords (not the searched records)
  const totalStudents = courseRecords.length;
  const presentCount = courseRecords.filter(r => r.status === 'Present').length;
  const absentCount = courseRecords.filter(r => r.status === 'Absent').length;
  const lateCount = courseRecords.filter(r => r.status === 'Late').length;
  const excusedCount = courseRecords.filter(r => r.status === 'Excused').length;
  
  const attendancePercentage = totalStudents > 0 
    ? Math.round((presentCount / totalStudents) * 100) 
    : 0;

  return (
      <PageContainer>
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="font-headline-xl text-headline-xl text-primary">Attendance</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track student presence, absences, and tardiness.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSaveAttendance}
              className="flex items-center justify-center gap-2 bg-primary text-white font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
              Save Attendance
            </button>
          </div>
        </div>
        
        <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
          {/* Course Selector */}
          <SelectField
            label="Course"
            wrapperClassName="lg:w-[220px]"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {courses.map(c => <option key={c.id} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>)}
          </SelectField>
          
          {/* Meeting Date Selector */}
          <div className="w-full lg:w-[180px] relative">
            <label className="font-label-sm text-on-surface-variant block mb-1">Meeting Date</label>
            <input 
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <SelectField
            label="Filter Status"
            wrapperClassName="lg:w-[220px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Excused">Excused</option>
          </SelectField>

          {/* Search Box */}
          <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
              placeholder="Search students..." 
              type="text" 
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col justify-center items-center md:items-start relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10" />
             <span className="font-label-md text-on-surface-variant mb-1">Attendance Rate</span>
             <div className="flex items-end gap-1">
               <span className="font-headline-lg text-primary">{attendancePercentage}%</span>
             </div>
          </div>
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

        <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student ID</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface w-1/3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest">person_off</span>
                        <p>No students found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="p-4 font-body-md text-body-md font-medium text-primary">{record.student_name}</td>
                      <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{record.student_id}</td>
                      <td className="p-4">
                        <select 
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, e.target.value)}
                          className={`bg-transparent rounded-full px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 transition-colors cursor-pointer appearance-none text-center ${getStatusClass(record.status)}`}
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="Present" className="text-on-surface bg-surface">Present</option>
                          <option value="Absent" className="text-on-surface bg-surface">Absent</option>
                          <option value="Late" className="text-on-surface bg-surface">Late</option>
                          <option value="Excused" className="text-on-surface bg-surface">Excused</option>
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
      </PageContainer>
  );
};

export default AttendanceManagement;
