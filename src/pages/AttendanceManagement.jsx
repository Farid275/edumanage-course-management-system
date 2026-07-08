import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const AttendanceManagement = () => {
  const { user, role } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    attendance_date: new Date().toISOString().split('T')[0],
    course_code: '',
    course_name: '',
    student_id: '',
    student_name: '',
    status: 'Present',
    notes: ''
  });

  useEffect(() => {
    fetchAttendance();
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchAttendance = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('attendance_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('course_code, course_name')
        .order('course_code', { ascending: true });
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Supabase courses fetch error:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id, student_name, email, program, status')
        .order('student_name', { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Supabase students fetch error:', err);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Present': return 'bg-[#E6F4EA] text-[#137333] border border-[#E6F4EA]';
      case 'Absent': return 'bg-error-container text-on-error-container border border-error-container';
      case 'Late': return 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container';
      case 'Excused': return 'bg-surface-variant text-on-surface-variant border border-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant border border-surface-variant';
    }
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({ ...record });
    } else {
      setEditingRecord(null);
      setFormData({
        attendance_date: new Date().toISOString().split('T')[0],
        course_code: courses.length > 0 ? courses[0].course_code : '',
        course_name: courses.length > 0 ? courses[0].course_name : '',
        student_id: students.length > 0 ? students[0].student_id : '',
        student_name: students.length > 0 ? students[0].student_name : '',
        status: 'Present',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'course_code') {
        const selectedCourse = courses.find(c => c.course_code === value);
        if (selectedCourse) {
          updated.course_name = selectedCourse.course_name;
        }
      }
      if (name === 'student_id') {
        const selectedStudent = students.find(s => s.student_id === value);
        if (selectedStudent) {
          updated.student_name = selectedStudent.student_name;
        }
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const attendanceDate = formData.attendance_date || formData.attendanceDate || '';
    const courseCode = String(formData.course_code || formData.courseCode || '').trim();
    const courseName = String(formData.course_name || formData.courseName || '').trim();
    const studentId = String(formData.student_id || formData.studentId || '').trim();
    const studentName = String(formData.student_name || formData.studentName || '').trim();
    const status = formData.status || 'Present';
    const notes = String(formData.notes || '').trim();

    if (!attendanceDate) {
      alert('Attendance date is required');
      return;
    }

    if (!courseCode) {
      alert('Course is required');
      return;
    }

    if (!studentId) {
      alert('Student is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        attendance_date: attendanceDate,
        course_code: courseCode,
        course_name: courseName,
        student_id: studentId,
        student_name: studentName,
        status,
        notes,
        created_by: user.id
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('attendance')
          .update(payload)
          .eq('id', editingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([payload]);
        if (error) throw error;
      }
      
      await fetchAttendance();
      handleCloseModal();
    } catch (err) {
      console.error('Supabase attendance save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        const { error } = await supabase
          .from('attendance')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchAttendance();
      } catch (err) {
        console.error('Supabase attendance delete error:', err);
        alert(err.message);
      }
    }
  };

  const filteredRecords = attendanceRecords.filter(r => {
    const matchesSearch = 
      (r.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.student_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.course_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter;
    const matchesCourse = courseFilter === 'All Courses' || r.course_code === courseFilter;
    const matchesDate = dateFilter === '' || r.attendance_date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesDate;
  });

  const uniqueCourses = [...new Set(attendanceRecords.map(a => a.course_code))].filter(Boolean);

  const totalStudents = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'Present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'Absent').length;
  const lateCount = filteredRecords.filter(r => r.status === 'Late').length;
  const excusedCount = filteredRecords.filter(r => r.status === 'Excused').length;
  
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
            {role !== 'student' && (
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center justify-center gap-2 bg-primary text-white font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                Add Attendance
              </button>
            )}
          </div>
        </div>
        
        <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
          <SelectField
            label="Course"
            wrapperClassName="lg:w-[220px]"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="All Courses">All Courses</option>
            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectField>
          
          <div className="w-full lg:w-[180px] relative">
            <label className="font-label-sm text-on-surface-variant block mb-1">Date</label>
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
            />
          </div>

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

          <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
              placeholder="Search attendance..." 
              type="text" 
            />
          </div>
        </div>

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

        <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest mt-4">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Date</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student ID</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Notes</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
                        <p>Loading attendance from Supabase...</p>
                      </div>
                    </td>
                  </tr>
                ) : errorMsg ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-error font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px]">error</span>
                        <p>{errorMsg}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest">person_off</span>
                        <p>No attendance records found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{record.attendance_date ? new Date(record.attendance_date).toLocaleDateString() : '-'}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{record.course_code}</td>
                      <td className="p-4 font-body-md text-body-md font-medium text-primary">{record.student_name}</td>
                      <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{record.student_id}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(record.status)}`}>{record.status}</span>
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant truncate max-w-[200px]">{record.notes || '-'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                          {role !== 'student' && (
                            <>
                              <button onClick={() => handleOpenModal(record)} className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                              <button onClick={() => handleDelete(record.id)} className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        <AnimatedModal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-lg">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
            <h3 className="font-headline-md text-primary">{editingRecord ? 'Edit Attendance' : 'Add Attendance'}</h3>
            <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-label-sm text-on-surface-variant block mb-1">Date</label>
                <input required type="date" name="attendance_date" value={formData.attendance_date} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
              </div>
              <SelectField
                label="Status"
                wrapperClassName="flex-1"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Excused">Excused</option>
              </SelectField>
            </div>
            
            <SelectField
              label="Course"
              required
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
            >
              <option value="" disabled>Select Course</option>
              {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_code} - {c.course_name}</option>)}
            </SelectField>

            <SelectField
              label="Student"
              required
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
            >
              <option value="" disabled>Select Student</option>
              {students.map(s => <option key={s.student_id} value={s.student_id}>{s.student_id} - {s.student_name}</option>)}
            </SelectField>

            <div>
              <label className="font-label-sm text-on-surface-variant block mb-1">Notes</label>
              <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="Add a note..." />
            </div>

            <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
              <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button disabled={isSaving} type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSaving ? 'Saving...' : editingRecord ? 'Save Changes' : 'Add Attendance'}
              </button>
            </div>
          </form>
        </AnimatedModal>
      </PageContainer>
  );
};

export default AttendanceManagement;
