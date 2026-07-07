import React, { useState } from 'react';
import { gradesData as initialGrades, courses } from '../data/dummyData';
import PageContainer from '../components/layout/PageContainer';
import SelectField from '../components/ui/SelectField';

const GradesManagement = () => {
  const [grades, setGrades] = useState(initialGrades);
  const [courseFilter, setCourseFilter] = useState(courses.length > 0 ? courses[0].courseCode : '');
  const [searchQuery, setSearchQuery] = useState('');
  const [letterFilter, setLetterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'bg-[#E6F4EA] text-[#137333] border border-[#E6F4EA]';
      case 'Incomplete': return 'bg-tertiary-container text-on-tertiary-container border border-tertiary-container';
      default: return 'bg-surface-variant text-on-surface-variant border border-surface-variant';
    }
  };

  const getLetterClass = (letter) => {
    if (letter.startsWith('A')) return 'text-[#137333] font-bold';
    if (letter.startsWith('B')) return 'text-primary font-bold';
    if (letter.startsWith('C')) return 'text-tertiary font-bold';
    if (letter.startsWith('D') || letter === 'E') return 'text-error font-bold';
    return 'text-on-surface-variant';
  };

  const handleChange = (id, field, value) => {
    setGrades(prev => prev.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, [field]: value === '' ? null : parseFloat(value) };
      
      // Auto calculate final grade and letter grade if all components are present
      if (updated.assignment_score !== null && updated.midterm_score !== null && updated.final_exam !== null) {
        // Formula: 30% assignments, 30% midterm, 40% final
        updated.final_grade = (updated.assignment_score * 0.3) + (updated.midterm_score * 0.3) + (updated.final_exam * 0.4);
        updated.final_grade = parseFloat(updated.final_grade.toFixed(1));
        
        // Auto letter grade
        if (updated.final_grade >= 85) updated.letter_grade = 'A';
        else if (updated.final_grade >= 75) updated.letter_grade = 'B';
        else if (updated.final_grade >= 65) updated.letter_grade = 'C';
        else if (updated.final_grade >= 50) updated.letter_grade = 'D';
        else updated.letter_grade = 'E';
        
        updated.status = 'Completed';
      } else {
        updated.final_grade = null;
        updated.letter_grade = '-';
        updated.status = 'Incomplete';
      }
      
      return updated;
    }));
  };

  const handleSaveGrades = () => {
    alert('Grades saved successfully to local state!');
  };

  const handleExportGrades = () => {
    alert('Exporting grades to CSV... (Dummy Action)');
  };

  // Filter records by course first for stats
  const courseGrades = grades.filter(g => g.course_id === courseFilter || g.course === courseFilter);

  // Then apply search, letter, and status filters for the table
  const filteredGrades = courseGrades.filter(g => {
    const matchesSearch = 
      g.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = letterFilter === 'All' || g.letter_grade === letterFilter;
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    
    return matchesSearch && matchesLetter && matchesStatus;
  });

  // Calculate summary stats based on the course
  const completedGradesList = courseGrades.filter(g => g.final_grade !== null);
  const avgScore = completedGradesList.length ? (completedGradesList.reduce((acc, curr) => acc + curr.final_grade, 0) / completedGradesList.length).toFixed(1) : 0;
  const highestScore = completedGradesList.length ? Math.max(...completedGradesList.map(g => g.final_grade)).toFixed(1) : 0;
  const lowestScore = completedGradesList.length ? Math.min(...completedGradesList.map(g => g.final_grade)).toFixed(1) : 0;

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
            <button 
              onClick={handleSaveGrades}
              className="flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
              Save Grades
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

          {/* Letter Grade Filter */}
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

          {/* Status Filter */}
          <SelectField
            label="Status"
            wrapperClassName="lg:w-[160px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </SelectField>
          
          <div className="w-full lg:ml-auto lg:max-w-[320px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" 
              placeholder="Search student..." 
              type="text" 
            />
          </div>
        </div>

        {/* Summary Cards */}
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
            <span className="font-label-md text-on-surface-variant mb-1">Completed Grades</span>
            <span className="font-headline-lg text-primary">{completedGradesList.length} / {courseGrades.length}</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-surface-container-highest">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student ID</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Assignments<br/><span className="text-xs font-normal opacity-70">(30%)</span></th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Midterm<br/><span className="text-xs font-normal opacity-70">(30%)</span></th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Final Exam<br/><span className="text-xs font-normal opacity-70">(40%)</span></th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Final Grade</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface text-center">Letter</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-on-surface-variant font-label-md">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest">search_off</span>
                        <p>No students found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map(grade => (
                    <tr key={grade.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="p-4 font-body-md text-body-md font-medium text-primary">{grade.student_name}</td>
                      <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{grade.student_id}</td>
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.assignment_score === null ? '' : grade.assignment_score}
                          onChange={(e) => handleChange(grade.id, 'assignment_score', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1.5 text-body-md focus:border-secondary-container outline-none transition-colors"
                          placeholder="-"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.midterm_score === null ? '' : grade.midterm_score}
                          onChange={(e) => handleChange(grade.id, 'midterm_score', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1.5 text-body-md focus:border-secondary-container outline-none transition-colors"
                          placeholder="-"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.final_exam === null ? '' : grade.final_exam}
                          onChange={(e) => handleChange(grade.id, 'final_exam', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1.5 text-body-md focus:border-secondary-container outline-none transition-colors"
                          placeholder="-"
                        />
                      </td>
                      <td className="p-4 font-body-md text-body-md font-bold text-primary text-center">
                        {grade.final_grade !== null ? grade.final_grade : '-'}
                      </td>
                      <td className={`p-4 font-body-md text-body-lg text-center ${getLetterClass(grade.letter_grade)}`}>
                        {grade.letter_grade}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(grade.status)}`}>{grade.status}</span>
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

export default GradesManagement;
