import React, { useState } from 'react';
import { gradesData as initialGrades } from '../data/dummyData';

const GradesManagement = () => {
  const [grades, setGrades] = useState(initialGrades);
  const [courseFilter, setCourseFilter] = useState('CS401');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'bg-[#E6F4EA] text-[#137333]';
      case 'Draft': return 'bg-surface-variant text-on-surface-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const getLetterClass = (letter) => {
    if (letter.startsWith('A')) return 'text-[#137333] font-bold';
    if (letter.startsWith('B')) return 'text-primary font-bold';
    if (letter.startsWith('C')) return 'text-tertiary font-bold';
    if (letter.startsWith('D') || letter === 'F') return 'text-error font-bold';
    return 'text-on-surface-variant';
  };

  const handleChange = (id, field, value) => {
    setGrades(prev => prev.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, [field]: value === '' ? null : parseFloat(value) };
      
      // Auto calculate final grade and letter grade if all components are present
      if (updated.assignment_score !== null && updated.midterm_score !== null && updated.final_exam !== null) {
        // Dummy weighting: 30% assignments, 30% midterm, 40% final
        updated.final_grade = (updated.assignment_score * 0.3) + (updated.midterm_score * 0.3) + (updated.final_exam * 0.4);
        updated.final_grade = parseFloat(updated.final_grade.toFixed(1));
        
        if (updated.final_grade >= 90) updated.letter_grade = 'A';
        else if (updated.final_grade >= 80) updated.letter_grade = 'B';
        else if (updated.final_grade >= 70) updated.letter_grade = 'C';
        else if (updated.final_grade >= 60) updated.letter_grade = 'D';
        else updated.letter_grade = 'F';
      } else {
        updated.final_grade = null;
        updated.letter_grade = '-';
      }
      
      return updated;
    }));
  };

  const handleSaveGrades = () => {
    alert('Grades saved successfully!');
  };

  const handleExportGrades = () => {
    alert('Exporting grades to CSV...');
  };

  const filteredGrades = grades.filter(g => {
    // We don't have course data strictly in the grades dummy data yet, we assume they belong to CS401 for this mock.
    // So we just filter by search.
    const matchesSearch = 
      g.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate summary stats
  const completedGrades = grades.filter(g => g.final_grade !== null);
  const avgScore = completedGrades.length ? (completedGrades.reduce((acc, curr) => acc + curr.final_grade, 0) / completedGrades.length).toFixed(1) : 0;
  const highestScore = completedGrades.length ? Math.max(...completedGrades.map(g => g.final_grade)) : 0;
  const lowestScore = completedGrades.length ? Math.min(...completedGrades.map(g => g.final_grade)) : 0;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-section-margin relative">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-card-gap">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary">Grades</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and evaluate student academic performance.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportGrades}
              className="bg-surface border border-outline text-primary font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
              Export
            </button>
            <button 
              onClick={handleSaveGrades}
              className="bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-tertiary-fixed-dim transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="save">save</span>
              Save Grades
            </button>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-card-gap shadow-[0px_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant block mb-1">Select Course</label>
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md focus:border-secondary-container focus:ring-1 focus:ring-secondary-container outline-none transition-all"
              >
                <option value="CS401">CS401 - Advanced Algorithms</option>
                <option value="CS350">CS350 - Database Systems</option>
              </select>
            </div>
          </div>
          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <label className="font-label-sm text-on-surface-variant block mb-1 opacity-0 hidden md:block">Search</label>
            <span className="material-symbols-outlined absolute left-3 top-[calc(50%+4px)] md:top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-secondary transition-colors" 
              placeholder="Search student..." 
              type="text" 
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
            <span className="font-label-md text-on-surface-variant mb-1">Class Average</span>
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
            <span className="font-label-md text-on-surface-variant mb-1">Graded</span>
            <span className="font-headline-lg text-primary">{completedGrades.length} / {grades.length}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.02)] relative min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student Name</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Student ID</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Assignments (30%)</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Midterm (30%)</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Final Exam (40%)</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Final Grade</th>
                  <th className="p-4 font-label-md text-label-md text-on-surface-variant sticky top-0 bg-surface">Letter</th>
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
                      <td className="p-4">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.assignment_score === null ? '' : grade.assignment_score}
                          onChange={(e) => handleChange(grade.id, 'assignment_score', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1 text-body-md focus:border-secondary-container outline-none transition-colors"
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.midterm_score === null ? '' : grade.midterm_score}
                          onChange={(e) => handleChange(grade.id, 'midterm_score', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1 text-body-md focus:border-secondary-container outline-none transition-colors"
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={grade.final_exam === null ? '' : grade.final_exam}
                          onChange={(e) => handleChange(grade.id, 'final_exam', e.target.value)}
                          className="w-20 bg-surface border border-outline-variant/50 rounded text-center px-2 py-1 text-body-md focus:border-secondary-container outline-none transition-colors"
                        />
                      </td>
                      <td className="p-4 font-body-md text-body-md font-bold text-primary">
                        {grade.final_grade !== null ? grade.final_grade : '-'}
                      </td>
                      <td className={`p-4 font-body-md text-body-lg ${getLetterClass(grade.letter_grade)}`}>
                        {grade.letter_grade}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(grade.status)}`}>{grade.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default GradesManagement;
