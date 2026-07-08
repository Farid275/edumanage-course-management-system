import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import AnimatedModal from '../components/animations/AnimatedModal';
import SelectField from '../components/ui/SelectField';

const GradesManagement = () => {
  const { user, role } = useAuth();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [letterFilter, setLetterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    assignment_title: '',
    student_id: '',
    student_name: '',
    grade_score: '',
    feedback: '',
    status: 'Draft'
  });

  useEffect(() => {
    fetchGrades();
    fetchCourses();
    fetchStudents();
    fetchAssignments();
  }, []);

  const fetchGrades = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      console.error('Error fetching grades:', err);
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

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('assignment_title, course_code, course_name, status')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error('Supabase assignments fetch error:', err);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#E6F4EA] text-[#137333] border border-[#E6F4EA]';
      case 'Draft': return 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container';
      default: return 'bg-surface-variant text-on-surface-variant border border-surface-variant';
    }
  };

  const getLetterClass = (letter) => {
    if (!letter) return 'text-on-surface-variant';
    if (letter.startsWith('A')) return 'text-[#137333] font-bold';
    if (letter.startsWith('B')) return 'text-primary font-bold';
    if (letter.startsWith('C')) return 'text-tertiary font-bold';
    if (letter.startsWith('D') || letter === 'E') return 'text-error font-bold';
    return 'text-on-surface-variant';
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({ ...record });
    } else {
      setEditingRecord(null);
      setFormData({
        course_code: courses.length > 0 ? courses[0].course_code : '',
        course_name: courses.length > 0 ? courses[0].course_name : '',
        assignment_title: '',
        student_id: students.length > 0 ? students[0].student_id : '',
        student_name: students.length > 0 ? students[0].student_name : '',
        grade_score: '',
        feedback: '',
        status: 'Draft'
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

  const getLetterGrade = (score) => {
    if (score >= 85) return 'A'
    if (score >= 75) return 'B'
    if (score >= 65) return 'C'
    if (score >= 50) return 'D'
    return 'E'
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const studentId = String(formData.student_id || formData.studentId || '').trim();
    const studentName = String(formData.student_name || formData.studentName || '').trim();
    const courseCode = String(formData.course_code || formData.courseCode || '').trim();
    const courseName = String(formData.course_name || formData.courseName || '').trim();
    const assignmentTitle = String(formData.assignment_title || formData.assignmentTitle || '').trim();
    const gradeScore = Number(formData.grade_score || formData.gradeScore || 0);
    const feedback = String(formData.feedback || '').trim();
    const status = formData.status || 'Draft';

    if (!studentId) {
      alert('Student is required');
      return;
    }

    if (!courseCode) {
      alert('Course is required');
      return;
    }

    if (gradeScore < 0 || gradeScore > 100) {
      alert('Grade score must be between 0 and 100');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        student_id: studentId,
        student_name: studentName,
        course_code: courseCode,
        course_name: courseName,
        assignment_title: assignmentTitle,
        grade_score: gradeScore,
        grade_letter: getLetterGrade(gradeScore),
        feedback,
        status,
        created_by: user.id
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('grades')
          .update(payload)
          .eq('id', editingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('grades')
          .insert([payload]);
        if (error) throw error;
      }
      
      await fetchGrades();
      handleCloseModal();
    } catch (err) {
      console.error('Supabase grade save error:', err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        const { error } = await supabase
          .from('grades')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchGrades();
      } catch (err) {
        console.error('Supabase grade delete error:', err);
        alert(err.message);
      }
    }
  };

  const handleExportGrades = () => {
    alert('Exporting grades to CSV... (Dummy Action)');
  };

  const filteredGrades = grades.filter(g => {
    const matchesSearch = 
      (g.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (g.student_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.assignment_title || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLetter = letterFilter === 'All' || g.grade_letter === letterFilter;
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesCourse = courseFilter === 'All Courses' || g.course_code === courseFilter;
    
    return matchesSearch && matchesLetter && matchesStatus && matchesCourse;
  });

  const uniqueCourses = [...new Set(grades.map(g => g.course_code))].filter(Boolean);

  const completedGradesList = filteredGrades.filter(g => g.status === 'Published');
  const avgScore = completedGradesList.length ? (completedGradesList.reduce((acc, curr) => acc + curr.grade_score, 0) / completedGradesList.length).toFixed(1) : 0;
  const highestScore = completedGradesList.length ? Math.max(...completedGradesList.map(g => g.grade_score)).toFixed(1) : 0;
  const lowestScore = completedGradesList.length ? Math.min(...completedGradesList.map(g => g.grade_score)).toFixed(1) : 0;

  return (
      <PageContainer>
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="font-headline-xl text-headline-xl text-primary">Grades</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and evaluate student academic performance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleExportGrades}
              className="flex items-center justify-center gap-2 bg-surface border border-outline text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
              Export
            </button>
            {role !== 'student' && (
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                Add Grade
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
            label="Letter Grade"
            wrapperClassName="lg:w-[140px]"
            value={letterFilter}
            onChange={(e) => setLetterFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </SelectField>

          <SelectField
            label="Status"
            wrapperClassName="lg:w-[160px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </SelectField>
          
          <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
              placeholder="Search grades..." 
              type="text" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10" />
            <span className="font-label-md text-on-surface-variant mb-1">Average Score</span>
            <span className="font-headline-lg text-primary">{avgScore}</span>
          </div>
          <div className="bg-surface-container-lowest border border-[#E6F4EA] rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
            <span className="font-label-md text-[#137333] mb-1">Highest Score</span>
            <span className="font-headline-lg text-[#137333]">{highestScore}</span>
          </div>
          <div className="bg-surface-container-lowest border border-error-container rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
            <span className="font-label-md text-on-error-container mb-1">Lowest Score</span>
            <span className="font-headline-lg text-error">{lowestScore}</span>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
            <span className="font-label-md text-on-surface-variant mb-1">Published Grades</span>
            <span className="font-headline-lg text-primary">{completedGradesList.length} / {filteredGrades.length}</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Course</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Assignment</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Score</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Letter</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface w-1/4">Feedback</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
                        <p>Loading grades from Supabase...</p>
                      </div>
                    </td>
                  </tr>
                ) : errorMsg ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-error font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px]">error</span>
                        <p>{errorMsg}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                        <p>No grades found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map(grade => (
                    <tr key={grade.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{grade.course_code}</td>
                      <td className="p-4 font-body-md text-body-md text-on-surface-variant">{grade.assignment_title || '-'}</td>
                      <td className="p-4 font-body-md text-body-md font-medium text-primary">
                        {grade.student_name}
                        <span className="block text-xs font-normal text-on-surface-variant mt-0.5">{grade.student_id}</span>
                      </td>
                      <td className="p-4 font-body-md text-body-md font-bold text-primary">
                        {grade.grade_score}
                      </td>
                      <td className={`p-4 font-body-md text-body-lg text-center ${getLetterClass(grade.grade_letter)}`}>
                        {grade.grade_letter}
                      </td>
                      <td className="p-4 font-body-md text-body-sm text-on-surface-variant truncate max-w-[200px]">
                        {grade.feedback || '-'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(grade.status)}`}>{grade.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                          {role !== 'student' && (
                            <>
                              <button onClick={() => handleOpenModal(grade)} className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                              <button onClick={() => handleDelete(grade.id)} className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
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
            <h3 className="font-headline-md text-primary">{editingRecord ? 'Edit Grade' : 'Add Grade'}</h3>
            <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            
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
                label="Assignment"
                wrapperClassName="flex-1"
                name="assignment_title"
                value={formData.assignment_title}
                onChange={handleChange}
              >
                <option value="">No Assignment / Custom</option>
                {assignments
                  .filter(a => formData.course_code ? a.course_code === formData.course_code : true)
                  .map(a => <option key={a.assignment_title} value={a.assignment_title}>{a.assignment_title}</option>)}
              </SelectField>
            </div>

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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-label-sm text-on-surface-variant block mb-1">Score (0-100)</label>
                <input required type="number" min="0" max="100" name="grade_score" value={formData.grade_score} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" />
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

            <div>
              <label className="font-label-sm text-on-surface-variant block mb-1">Feedback</label>
              <textarea rows="3" name="feedback" value={formData.feedback} onChange={handleChange} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-secondary-container outline-none" placeholder="Provide feedback..." />
            </div>

            <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-surface-container-highest">
              <button type="button" onClick={handleCloseModal} className="px-5 py-2 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button disabled={isSaving} type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-label-md hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSaving ? 'Saving...' : editingRecord ? 'Save Changes' : 'Add Grade'}
              </button>
            </div>
          </form>
        </AnimatedModal>
      </PageContainer>
  );
};

export default GradesManagement;
