import React, { useState } from 'react';
import { courses as initialCourses } from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const CoursesManagement = () => {
  const [courses, setCourses] = useState(() => initialCourses.map(c => ({
    id: c.id,
    course_name: c.name,
    course_code: c.code,
    lecturer: c.lecturer,
    semester: c.semester,
    student_count: c.students,
    status: c.status,
    description: ''
  })));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    lecturer: '',
    semester: '',
    student_count: 0,
    status: 'Active',
    description: ''
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'Active': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Archived': return 'bg-surface-container-high text-on-surface-variant';
      case 'Full': return 'bg-error-container text-on-error-container';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_name: course.course_name,
        course_code: course.course_code,
        lecturer: course.lecturer,
        semester: course.semester,
        student_count: course.student_count,
        status: course.status,
        description: course.description || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_name: '',
        course_code: '',
        lecturer: '',
        semester: '',
        student_count: 0,
        status: 'Active',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'student_count' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newCourse = {
        id: Date.now(),
        ...formData
      };
      setCourses([newCourse, ...courses]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter;
    const matchesSemester = semesterFilter === 'All Semesters' || c.semester === semesterFilter;
    
    return matchesSearch && matchesStatus && matchesSemester;
  });

  const uniqueSemesters = [...new Set(courses.map(c => c.semester))];

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Courses</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage curriculum, assignments, and course offerings.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
            Add Course
          </button>
        </div>
      </div>
      
      <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
        <SelectField
          label="Semester"
          wrapperClassName="lg:w-[220px]"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="All Semesters">All Semesters</option>
          {uniqueSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
        </SelectField>
        <SelectField
          label="Status"
          wrapperClassName="lg:w-[220px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
          <option value="Full">Full</option>
        </SelectField>

        <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
            placeholder="Search courses..." 
            type="text" 
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
        <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-surface-container-highest">
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course Name</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Code</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Lecturer</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Semester</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Students</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                      <p>No courses found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-4 font-body-md text-body-md font-medium text-primary">{course.course_name}</td>
                    <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{course.course_code}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{course.lecturer}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{course.semester}</td>
                    <td className="p-4 font-body-md text-body-md text-on-surface">{course.student_count}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(course.status)}`}>{course.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                        <button onClick={() => handleOpenModal(course)} className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                        <button onClick={() => handleDelete(course.id)} className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
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
              <h3 className="font-headline-md text-primary">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Course Name</label>
                <input required type="text" name="course_name" value={formData.course_name} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Data Structures" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Course Code</label>
                  <input required type="text" name="course_code" value={formData.course_code} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. CS201" />
                </div>
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Semester</label>
                  <input required type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Fall 2024" />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Lecturer</label>
                <input required type="text" name="lecturer" value={formData.lecturer} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Dr. Alan Turing" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Students Enrolled</label>
                  <input type="number" name="student_count" value={formData.student_count} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
                <SelectField
                  label="Status"
                  wrapperClassName="flex-1"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Full">Full</option>
                </SelectField>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none resize-none" placeholder="Brief description of the course..." />
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2">
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default CoursesManagement;
