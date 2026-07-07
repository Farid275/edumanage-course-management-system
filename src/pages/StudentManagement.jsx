import React, { useState } from 'react';
import { students as initialStudents } from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const StudentManagement = () => {
  const [studentsList, setStudentsList] = useState(() => initialStudents.map(s => ({
    id: s.id,
    student_name: s.name,
    student_id: s.studentId,
    email: s.email,
    program: s.program,
    enrolled_courses: s.courses === '-' ? 0 : parseInt(s.courses),
    status: s.status,
    created_at: new Date().toISOString().split('T')[0]
  })));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All Programs');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [formData, setFormData] = useState({
    student_name: '',
    student_id: '',
    email: '',
    program: '',
    enrolled_courses: 0,
    status: 'Active',
    created_at: new Date().toISOString().split('T')[0]
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'Active': return 'bg-primary-fixed/20 text-on-primary-fixed border border-primary-fixed';
      case 'Inactive': return 'bg-error-container text-on-error-container border border-error-container';
      case 'Graduated': return 'bg-surface-variant text-on-surface-variant border border-outline-variant';
      default: return 'bg-surface-variant text-on-surface-variant border border-outline-variant';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({ ...student });
    } else {
      setEditingStudent(null);
      setFormData({
        student_name: '',
        student_id: `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        program: '',
        enrolled_courses: 0,
        status: 'Active',
        created_at: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'enrolled_courses' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudentsList(studentsList.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData
      };
      setStudentsList([newStudent, ...studentsList]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudentsList(studentsList.filter(s => s.id !== id));
    }
  };

  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = 
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.program.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesProgram = programFilter === 'All Programs' || s.program === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const uniquePrograms = [...new Set(studentsList.map(s => s.program))].filter(Boolean);

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Students Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage enrollments, academic records, and student profiles.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-tertiary-fixed-dim"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add Student
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
        {/* Filters */}
        <SelectField
          label="Program"
          wrapperClassName="lg:w-[220px]"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="All Programs">All Programs</option>
          {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
        </SelectField>
        <SelectField
          label="Status"
          wrapperClassName="lg:w-[220px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
        </SelectField>
        {/* Table Search */}
        <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
            placeholder="Search by name, ID, email..." 
            type="text" 
          />
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-surface-container-highest">
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Student Name</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Student ID</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Program</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold text-center">Courses</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Joined</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest bg-surface-container-lowest">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-surface-container-highest">person_off</span>
                      <p>No students found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md font-bold shrink-0">
                          {getInitials(student.student_name)}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-medium text-primary">{student.student_name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{student.student_id}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{student.program}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-center font-medium text-primary">{student.enrolled_courses}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{student.created_at}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm ${getStatusClass(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(student)} className="text-on-surface-variant hover:text-secondary-container transition-colors p-1" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Form Modal */}
      <AnimatedModal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-lg">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-primary">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Student Name</label>
                <input required type="text" name="student_name" value={formData.student_name} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. John Doe" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Student ID</label>
                  <input required type="text" name="student_id" value={formData.student_id} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. STU-2023-001" />
                </div>
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Join Date</label>
                  <input required type="date" name="created_at" value={formData.created_at} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. john@student.edu" />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Program / Major</label>
                <input required type="text" name="program" value={formData.program} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Computer Science" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Enrolled Courses</label>
                  <input type="number" name="enrolled_courses" min="0" value={formData.enrolled_courses} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
                </div>
                <div className="flex-1">
                  <SelectField
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                  </SelectField>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2">
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default StudentManagement;
