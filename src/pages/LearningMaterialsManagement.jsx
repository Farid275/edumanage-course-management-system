import React, { useState } from 'react';
import { learningMaterialsData as initialMaterials, courses as dummyCourses } from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const LearningMaterialsManagement = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    type: 'PDF',
    description: '',
    file_name: 'dummy_file.pdf',
    uploaded_by: '',
    upload_date: new Date().toISOString().split('T')[0],
    status: 'Draft'
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return { icon: 'picture_as_pdf', color: 'text-red-600', bg: 'bg-red-100' };
      case 'Video': return { icon: 'play_circle', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'Slide': return { icon: 'slideshow', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'Link': return { icon: 'link', color: 'text-green-600', bg: 'bg-green-100' };
      default: return { icon: 'description', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Draft': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const handleOpenModal = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({ 
        ...material,
        status: material.status || 'Draft',
        description: material.description || '',
        file_name: material.file_name || 'dummy_file.pdf'
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        title: '',
        course: dummyCourses.length > 0 ? dummyCourses[0].courseCode : '',
        type: 'PDF',
        description: '',
        file_name: 'dummy_file.pdf',
        uploaded_by: '',
        upload_date: new Date().toISOString().split('T')[0],
        status: 'Draft'
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id 
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMaterial = {
        id: Date.now(),
        ...formData
      };
      setMaterials([newMaterial, ...materials]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const handleView = (title) => {
    alert(`Viewing material details for: ${title}\n\n(Dummy Action)`);
  };

  const handleDownload = (fileName) => {
    alert(`Download feature will be connected later.\nAttempted to download: ${fileName}`);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.uploaded_by && m.uploaded_by.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = typeFilter === 'All Types' || m.type === typeFilter;
    const matchesCourse = courseFilter === 'All Courses' || m.course === courseFilter;
    
    return matchesSearch && matchesType && matchesCourse;
  });

  const uniqueCourses = [...new Set(materials.map(m => m.course))];

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline-xl text-headline-xl text-primary">Learning Materials</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and distribute course resources.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-tertiary-fixed-dim"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="upload">upload</span>
            Upload Material
          </button>
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
          <option value="PDF">PDF</option>
          <option value="Video">Video</option>
          <option value="Slide">Slide</option>
          <option value="Link">Link</option>
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
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Uploaded By</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {filteredMaterials.length === 0 ? (
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
                  const typeConfig = getTypeIcon(material.type);
                  const displayStatus = material.status || 'Published';
                  return (
                    <tr key={material.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      <td className="p-4 font-body-md text-body-md font-medium text-primary flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${typeConfig.bg}`}>
                          <span className={`material-symbols-outlined text-[18px] ${typeConfig.color}`}>{typeConfig.icon}</span>
                        </div>
                        {material.title}
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{material.course}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">{material.type}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">{material.uploaded_by}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(displayStatus)}`}>{displayStatus}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleView(material.title)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="View"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                          <button onClick={() => handleDownload(material.file_name || material.title)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Download"><span className="material-symbols-outlined text-[20px]" data-icon="download">download</span></button>
                          <button onClick={() => handleOpenModal(material)} className="text-on-surface-variant hover:text-secondary-container transition-colors" title="Edit"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                          <button onClick={() => handleDelete(material.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
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
              <h3 className="font-headline-md text-primary">{editingMaterial ? 'Edit Material' : 'Upload Material'}</h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              {!editingMaterial && (
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:bg-surface-variant/30 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[32px] text-primary">cloud_upload</span>
                  <span className="font-label-md text-on-surface-variant">Click or drag file to upload</span>
                  <span className="font-label-sm text-outline">Max size: 50MB (Dummy only)</span>
                </div>
              )}

              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Material Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Lecture 1 Slides" />
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
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Course</option>
                  {dummyCourses.map(c => <option key={c.id} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>)}
                </SelectField>
                <SelectField
                  label="Material Type"
                  wrapperClassName="flex-1"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Slide">Slide</option>
                  <option value="Link">Link</option>
                </SelectField>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-label-sm text-on-surface-variant block mb-1">Uploaded By</label>
                  <input required type="text" name="uploaded_by" value={formData.uploaded_by} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="e.g. Dr. Turing" />
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
                </SelectField>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2">
                  {editingMaterial ? 'Save Changes' : 'Upload Material'}
                </button>
              </div>
            </form>
      </AnimatedModal>
    </PageContainer>
  );
};

export default LearningMaterialsManagement;
