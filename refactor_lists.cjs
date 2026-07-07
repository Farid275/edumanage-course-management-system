const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const read = (file) => fs.readFileSync(path.join(srcDir, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(srcDir, file), content);

// 1. CoursesManagement.jsx
let courses = read('CoursesManagement.jsx');
courses = courses.replace(
  /import \{ latestCourses, recentActivity, summaryStats \} from '\.\.\/data\/dummyData';/,
  `import { courses } from '../data/dummyData';`
);
courses = courses.replace(
  /<tbody className="divide-y divide-surface-container-highest">[\s\S]*?<\/tbody>/,
  `<tbody className="divide-y divide-surface-container-highest">
                {courses.map(course => (
                <tr key={course.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="p-4 font-body-md text-body-md font-medium text-primary">{course.name}</td>
                  <td className="p-4 font-body-md text-body-sm text-on-surface-variant">{course.code}</td>
                  <td className="p-4 font-body-md text-body-md text-on-surface">{course.lecturer}</td>
                  <td className="p-4 font-body-md text-body-md text-on-surface">{course.semester}</td>
                  <td className="p-4 font-body-md text-body-md text-on-surface">{course.students}</td>
                  <td className="p-4">
                    <span className={\`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium \${course.statusClass}\`}>{course.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span></button>
                      <button className="text-on-surface-variant hover:text-secondary-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span></button>
                      <button className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>`
);
write('CoursesManagement.jsx', courses);

// 2. StudentManagement.jsx
let studentsPage = read('StudentManagement.jsx');
studentsPage = studentsPage.replace(
  /import \{ latestCourses, recentActivity, summaryStats \} from '\.\.\/data\/dummyData';/,
  `import { students } from '../data/dummyData';`
);
studentsPage = studentsPage.replace(
  /<tbody className="divide-y divide-surface-container-highest bg-surface-container-lowest">[\s\S]*?<\/tbody>/,
  `<tbody className="divide-y divide-surface-container-highest bg-surface-container-lowest">
              {students.map(student => (
              <tr key={student.id} className="hover:bg-surface-bright transition-colors group">
                <td className="py-4 px-4">
                  <input className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {student.avatar ? (
                      <img alt={student.name} className="w-8 h-8 rounded-full object-cover" src={student.avatar} />
                    ) : (
                      <div className={\`w-8 h-8 rounded-full \${student.bgClass} flex items-center justify-center font-label-md font-bold\`}>{student.initials}</div>
                    )}
                    <div>
                      <p className="font-body-md text-body-md font-medium text-on-surface">{student.name}</p>
                      <p className="font-label-sm text-label-sm text-outline">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{student.studentId}</td>
                <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{student.program}</td>
                <td className="py-4 px-4 font-body-sm text-body-sm text-center">{student.courses}</td>
                <td className="py-4 px-4">
                  <span className={\`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm \${student.statusClass}\`}>{student.status}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-outline hover:text-primary transition-colors p-1" title="View Details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                  <button className="text-outline hover:text-primary transition-colors p-1" title="Edit">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </td>
              </tr>
              ))}
            </tbody>`
);
write('StudentManagement.jsx', studentsPage);

// 3. LecturerManagement.jsx
let lecturersPage = read('LecturerManagement.jsx');
lecturersPage = lecturersPage.replace(
  /import \{ latestCourses, recentActivity, summaryStats \} from '\.\.\/data\/dummyData';/,
  `import { lecturers } from '../data/dummyData';`
);
lecturersPage = lecturersPage.replace(
  /<tbody className="divide-y divide-surface-container-highest">[\s\S]*?<\/tbody>/,
  `<tbody className="divide-y divide-surface-container-highest">
              {lecturers.map(lecturer => (
              <tr key={lecturer.id} className="hover:bg-surface-bright\/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {lecturer.avatar ? (
                      <img className="w-10 h-10 rounded-full object-cover" src={lecturer.avatar} />
                    ) : (
                      <div className={\`w-10 h-10 rounded-full \${lecturer.bgClass} flex items-center justify-center font-headline-md text-headline-md\`}>{lecturer.initials}</div>
                    )}
                    <div>
                      <div className="font-label-md text-label-md text-primary group-hover:text-secondary-container transition-colors">{lecturer.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{lecturer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">{lecturer.lecturerId}</td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface">{lecturer.department}</td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {lecturer.courses.map((c, i) => (
                      <span key={i} className={c.startsWith('+') ? "inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm" : "inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-fixed\/50 text-on-secondary-container font-label-sm text-label-sm"}>{c}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm \${lecturer.status === 'Active' ? 'bg-surface-tint\/10 text-surface-tint' : 'bg-error-container\/50 text-on-error-container'}\`}>
                    <span className={\`w-1.5 h-1.5 rounded-full \${lecturer.status === 'Active' ? 'bg-surface-tint' : 'bg-error'}\`} /> {lecturer.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
              ))}
            </tbody>`
);
write('LecturerManagement.jsx', lecturersPage);

