import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const LecturerManagement = () => {
  const { user, role } = useAuth();
  const [lecturersList, setLecturersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    lecturer_name: '',
    lecturer_id: '',
    email: '',
    department: '',
    assigned_courses: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('lecturers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLecturersList(data || []);
    } catch (err) {
      console.error('Error fetching lecturers:', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Active': return 'bg-primary-fixed/20 text-on-primary-fixed border border-primary-fixed';
      case 'Inactive': return 'bg-error-container text-on-error-container border border-error-container';
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

  const handleOpenModal = (lecturer = null) => {
    if (lecturer) {
      setEditingLecturer(lecturer);
      setFormData({
        ...lecturer,
        assigned_courses: Array.isArray(lecturer.assigned_courses) ? lecturer.assigned_courses.join(', ') : (lecturer.assigned_courses || '')
      });
    } else {
      setEditingLecturer(null);
      setFormData({
        lecturer_name: '',
        lecturer_id: `LEC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        department: '',
        assigned_courses: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLecturer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        lecturer_name: formData.lecturer_name.trim(),
        lecturer_id: formData.lecturer_id.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        assigned_courses: Array.isArray(formData.assigned_courses)
          ? formData.assigned_courses
          : String(formData.assigned_courses || '')
              .split(',')
              .map(item => item.trim())
              .filter(Boolean),
        status: formData.status || 'Active',
        created_by: user.id
      };

      if (editingLecturer) {
        const { error } = await supabase
          .from('lecturers')
          .update(payload)
          .eq('id', editingLecturer.id);
          
        if (error) {
          console.error('Supabase lecturer update error:', error);
          alert(error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('lecturers')
          .insert([payload]);
          
        if (error) {
          console.error('Supabase lecturer insert error:', error);
          alert(error.message);
          return;
        }
      }
      
      await fetchLecturers();
      handleCloseModal();
    } catch (err) {
      console.error('Supabase lecturer save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      try {
        const { error } = await supabase
          .from('lecturers')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Supabase lecturer delete error:', error);
          alert(error.message);
          return;
        }
        await fetchLecturers();
      } catch (err) {
        console.error('Supabase lecturer delete error:', err);
        alert(err.message);
      }
    }
  };

  const filteredLecturers = lecturersList.filter(l => {
    const matchesSearch = 
      l.lecturer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.lecturer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || l.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(lecturersList.map(l => l.department))].filter(Boolean);

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Lecturers Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage faculty members, assignments, and departmental roles.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {role === 'admin' && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-tertiary-fixed-dim"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add Lecturer
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end border border-surface-container-highest">
        {/* Filters */}
        <SelectField
          label="Department"
          wrapperClassName="lg:w-[220px]"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="All Departments">All Departments</option>
          {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
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
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Lecturer Name</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Lecturer ID</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Courses</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Joined Date</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest bg-surface-container-lowest">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
                      <p>Loading lecturers from Supabase...</p>
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
              ) : filteredLecturers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-surface-container-highest">person_off</span>
                      <p>No lecturers found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLecturers.map(lecturer => (
                  <tr key={lecturer.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-label-md font-bold shrink-0">
                          {getInitials(lecturer.lecturer_name)}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-medium text-primary">{lecturer.lecturer_name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{lecturer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{lecturer.lecturer_id}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{lecturer.department}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(lecturer.assigned_courses) ? lecturer.assigned_courses : []).map((course, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-label-sm whitespace-nowrap">
                            {course.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">
                      {lecturer.created_at ? new Date(lecturer.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm ${getStatusClass(lecturer.status)}`}>
                        {lecturer.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {role === 'admin' && (
                          <>
                            <button onClick={() => handleOpenModal(lecturer)} className="text-on-surface-variant hover:text-secondary-container transition-colors p-1" title="Edit">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button onClick={() => handleDelete(lecturer.id)} className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
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

      {/* Form Modal */}
      <AnimatedModal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-lg">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-primary">{editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}</h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Lecturer Name</label>
                <input required type="text" name="lecturer_name" value={formData.lecturer_name} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Dr. Jane Smith" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Lecturer ID</label>
                  <input required type="text" name="lecturer_id" value={formData.lecturer_id} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. LEC-2023-001" />
                </div>
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. jane.smith@edumanage.edu" />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Department</label>
                <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Computer Science" />
              </div>
              
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Assigned Courses (Comma separated)</label>
                <input type="text" name="assigned_courses" value={formData.assigned_courses} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. CS101, CS202" />
              </div>

              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SelectField>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button disabled={isSaving} type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? 'Saving...' : editingLecturer ? 'Save Changes' : 'Create Lecturer'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default LecturerManagement;
