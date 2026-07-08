import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const LearningMaterialsManagement = () => {
  const { user, role } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    material_title: '',
    course_code: '',
    course_name: '',
    material_type: 'Document',
    description: '',
    material_url: '',
    upload_date: new Date().toISOString().split('T')[0],
    status: 'Published'
  });

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Document': return { icon: 'description', color: 'text-red-600', bg: 'bg-red-100' };
      case 'Video': return { icon: 'play_circle', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'Slide': return { icon: 'slideshow', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'Link': return { icon: 'link', color: 'text-green-600', bg: 'bg-green-100' };
      default: return { icon: 'file_present', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Draft': return 'bg-tertiary-container text-on-tertiary-container';
      case 'Archived': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const handleOpenModal = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({ 
        ...material,
        status: material.status || 'Published',
        description: material.description || '',
        material_url: material.material_url || ''
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        material_title: '',
        course_code: courses.length > 0 ? courses[0].course_code : '',
        course_name: courses.length > 0 ? courses[0].course_name : '',
        material_type: 'Document',
        description: '',
        material_url: '',
        upload_date: new Date().toISOString().split('T')[0],
        status: 'Published'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
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

    const materialTitle = String(formData.material_title || formData.materialTitle || '').trim();
    const courseCode = String(formData.course_code || formData.courseCode || '').trim();
    const courseName = String(formData.course_name || formData.courseName || '').trim();
    const materialType = formData.material_type || formData.materialType || 'Document';
    const description = String(formData.description || '').trim();
    const materialUrl = String(formData.material_url || formData.materialUrl || formData.url || '').trim();
    const uploadDate = formData.upload_date || formData.uploadDate || new Date().toISOString().split('T')[0];
    const status = formData.status || 'Published';

    if (!materialTitle) {
      alert('Material title is required');
      return;
    }

    if (!courseCode) {
      alert('Course is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        material_title: materialTitle,
        course_code: courseCode,
        course_name: courseName,
        material_type: materialType,
        description,
        material_url: materialUrl,
        upload_date: uploadDate,
        status,
        created_by: user.id
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('materials')
          .update(payload)
          .eq('id', editingMaterial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('materials')
          .insert([payload]);
        if (error) throw error;
      }
      
      await fetchMaterials();
      handleCloseModal();
    } catch (err) {
      console.error('Supabase material save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        const { error } = await supabase
          .from('materials')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchMaterials();
      } catch (err) {
        console.error('Supabase material delete error:', err);
        alert(err.message);
      }
    }
  };

  const handleView = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No URL provided for this material.');
    }
  };

  const handleDownload = (url) => {
    alert(`File download features rely on a file hosting API. Opening URL instead: ${url}`);
    if (url) window.open(url, '_blank');
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      (m.material_title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.material_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === 'All Types' || m.material_type === typeFilter;
    const matchesCourse = courseFilter === 'All Courses' || m.course_code === courseFilter;
    
    return matchesSearch && matchesType && matchesCourse;
  });

  const uniqueCourses = [...new Set(materials.map(m => m.course_code))].filter(Boolean);

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Learning Materials</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and distribute course resources.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {role !== 'student' && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-tertiary-fixed-dim"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="upload">upload</span>
              Add Material
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
          label="Type"
          wrapperClassName="lg:w-[180px]"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Document">Document</option>
          <option value="Video">Video</option>
          <option value="Slide">Slide</option>
          <option value="Link">Link</option>
          <option value="Other">Other</option>
        </SelectField>

        <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
            placeholder="Search materials..." 
            type="text" 
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface border-b border-surface-container-highest">
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Material Title</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Type</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Upload Date</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
                        <p>Loading materials from Supabase...</p>
                      </div>
                    </td>
                  </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-error font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px]">error</span>
                      <p>{errorMsg}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-on-surface-variant font-label-md">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                      <p>No materials found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMaterials.map(material => {
                  const typeConfig = getTypeIcon(material.material_type);
                  const displayStatus = material.status || 'Published';
                  return (
                    <tr key={material.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      <td className="p-4 font-body-md text-body-md font-medium text-primary flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${typeConfig.bg}`}>
                          <span className={`material-symbols-outlined text-[18px] ${typeConfig.color}`}>{typeConfig.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{material.material_title}</span>
                          <span className="text-xs font-normal text-on-surface-variant truncate max-w-[200px]">{material.description || ''}</span>
                        </div>
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{material.course_code}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">{material.material_type}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">{material.upload_date ? new Date(material.upload_date).toLocaleDateString() : '-'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(displayStatus)}`}>{displayStatus}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleView(material.material_url)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="View"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                          <button onClick={() => handleDownload(material.material_url)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Download"><span className="material-symbols-outlined text-[20px]" data-icon="download">download</span></button>
                          {role !== 'student' && (
                            <>
                              <button onClick={() => handleOpenModal(material)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Edit"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                              <button onClick={() => handleDelete(material.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      <AnimatedModal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-lg">
            <div className="p-6 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-md text-primary">{editingMaterial ? 'Edit Material' : 'Add Material'}</h3>
              <button type="button" onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Material URL (File Link)</label>
                <input type="url" name="material_url" value={formData.material_url} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="https://example.com/file.pdf" />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Material Title</label>
                <input required type="text" name="material_title" value={formData.material_title} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Lecture 1 Slides" />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Description</label>
                <textarea rows="2" name="description" value={formData.description} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none resize-none" placeholder="Brief description of the material" />
              </div>
              
              <div className="flex gap-4">
                <SelectField
                  label="Course"
                  wrapperClassName="flex-1"
                  required
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_code} - {c.course_name}</option>)}
                </SelectField>
                <SelectField
                  label="Material Type"
                  wrapperClassName="flex-1"
                  name="material_type"
                  value={formData.material_type}
                  onChange={handleChange}
                >
                  <option value="Document">Document</option>
                  <option value="Video">Video</option>
                  <option value="Slide">Slide</option>
                  <option value="Link">Link</option>
                  <option value="Other">Other</option>
                </SelectField>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Upload Date</label>
                  <input required type="date" name="upload_date" value={formData.upload_date} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
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
                  <option value="Archived">Archived</option>
                </SelectField>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button disabled={isSaving} type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? 'Saving...' : editingMaterial ? 'Save Changes' : 'Add Material'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default LearningMaterialsManagement;
