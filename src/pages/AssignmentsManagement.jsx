import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { courses as dummyCourses, lecturers as dummyLecturers } from '../data/dummyData'; // Will be removed, fetching live courses now
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const AssignmentsManagement = () => {
  const { user, role } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    assignment_title: '',
    course_code: '',
    course_name: '',
    description: '',
    due_date: '',
    total_points: 100,
    status: 'Draft'
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('course_code, course_name')
        .order('course_code', { ascending: true });

      if (error) {
        console.error('Supabase courses fetch error:', error);
        return;
      }
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAssignments = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Closed': return 'bg-surface-container-high text-on-surface-variant';
      case 'Draft': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({ ...assignment });
    } else {
      setEditingAssignment(null);
      setFormData({
        assignment_title: '',
        course_code: '',
        course_name: '',
        description: '',
        due_date: '',
        total_points: 100,
        status: 'Draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
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
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const assignmentTitle = String(formData.assignment_title || formData.assignmentTitle || '').trim();
    const courseCode = String(formData.course_code || formData.courseCode || '').trim();
    const courseName = String(formData.course_name || formData.courseName || '').trim();
    const description = String(formData.description || '').trim();
    const dueDate = formData.due_date || formData.dueDate || '';
    const totalPoints = Number(formData.total_points || formData.totalPoints || 100);
    const status = formData.status || 'Draft';

    if (!assignmentTitle) {
      alert('Assignment title is required');
      return;
    }

    if (!courseCode || courseCode === '-') {
      alert('Course code is required');
      return;
    }

    if (!dueDate) {
      alert('Due date is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        assignment_title: assignmentTitle,
        course_code: courseCode,
        course_name: courseName,
        description,
        due_date: dueDate,
        total_points: totalPoints,
        status,
        created_by: user.id
      };

      if (editingAssignment) {
        const { error } = await supabase
          .from('assignments')
          .update(payload)
          .eq('id', editingAssignment.id);
          
        if (error) {
          console.error('Supabase assignment update error:', error);
          alert(error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert([payload]);
          
        if (error) {
          console.error('Supabase assignment insert error:', error);
          alert(error.message);
          return;
        }
      }
      
      await fetchAssignments();
      handleCloseModal();
    } catch (err) {
      console.error('Supabase assignment save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const { error } = await supabase
          .from('assignments')
          .delete()
          .eq('id', id);
        if (error) {
          console.error('Supabase assignment delete error:', error);
          alert(error.message);
          return;
        }
        await fetchAssignments();
      } catch (err) {
        console.error('Supabase assignment delete error:', err);
        alert(err.message);
      }
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = 
      (a.assignment_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    const matchesCourse = courseFilter === 'All Courses' || a.course_code === courseFilter;
    const matchesDate = dateFilter === '' || a.due_date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesDate;
  });

  const uniqueCourses = [...new Set(assignments.map(a => a.course_code))].filter(Boolean);

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Assignments</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and track student assignments and tasks.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {role !== 'student' && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-tertiary-fixed-dim"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
              Create Assignment
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
        <SelectField
          label="Status"
          wrapperClassName="lg:w-[220px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Closed">Closed</option>
        </SelectField>
        <div className="w-full lg:w-[180px] relative">
          <label className="font-label-sm text-on-surface-variant block mb-1">Due Date</label>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
            title="Filter by Due Date"
          />
        </div>

        <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
            placeholder="Search assignments..." 
            type="text" 
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-surface-container-highest">
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Assignment Title</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Description</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Due Date</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Points</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
                      <p>Loading assignments from Supabase...</p>
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
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                      <p>No assignments found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map(assignment => (
                  <tr key={assignment.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-4 font-body-md text-body-md font-medium text-primary">{assignment.assignment_title}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface-variant">{assignment.course_code}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface truncate max-w-[200px]">{assignment.description}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : '-'}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{assignment.total_points}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(assignment.status)}`}>{assignment.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                        {role !== 'student' && (
                          <>
                            <button onClick={() => handleOpenModal(assignment)} className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                            <button onClick={() => handleDelete(assignment.id)} className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
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
              <h3 className="font-headline-md text-primary">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Assignment Title</label>
                <input required type="text" name="assignment_title" value={formData.assignment_title} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Midterm Essay" />
              </div>
              
              <div className="flex gap-4">
                <SelectField
                  label="Course Code"
                  wrapperClassName="flex-1"
                  required
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_code} - {c.course_name}</option>)}
                </SelectField>
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Total Points</label>
                  <input required type="number" name="total_points" min="0" value={formData.total_points} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="Enter assignment description..." />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Due Date</label>
                  <input required type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
                <SelectField
                  label="Status"
                  wrapperClassName="flex-1"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Closed">Closed</option>
                </SelectField>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button disabled={isSaving} type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? 'Saving...' : editingAssignment ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default AssignmentsManagement;
