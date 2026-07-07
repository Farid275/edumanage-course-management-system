const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');
const read = (file) => fs.readFileSync(path.join(srcDir, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(srcDir, file), content);

let lecturerDash = read('LecturerDashboard.jsx');
lecturerDash = lecturerDash.replace(
  /import \{ latestCourses, recentActivity, summaryStats \} from '\.\.\/data\/dummyData';/,
  `import { attendance, assignments, grades } from '../data/dummyData';`
);

// replace schedule
lecturerDash = lecturerDash.replace(
  /<div className="space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Recent Submissions \*\/\}/,
  `<div className="space-y-4">
              {attendance.filter(a => a.isLecturer).map(a => (
              <div key={a.id} className="flex gap-4 p-4 rounded-lg border border-outline-variant/30 hover:border-secondary-container transition-colors items-center">
                <div className="text-center min-w-[80px]">
                  <p className="font-label-md text-label-md text-on-surface-variant">{a.time}</p>
                  <p className="font-label-sm text-label-sm text-outline">{a.endTime}</p>
                </div>
                <div className={\`w-1 h-12 rounded-full \${a.title.includes('Software') ? 'bg-tertiary' : 'bg-secondary'}\`} />
                <div className="flex-1">
                  <h4 className="font-headline-md text-headline-md text-on-surface">{a.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {a.location}
                  </p>
                </div>
                <div>
                  <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors" title="Record Attendance">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </button>
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Recent Submissions */}`
);

// replace submissions
lecturerDash = lecturerDash.replace(
  /<tbody>[\s\S]*?<\/tbody>/,
  `<tbody>
                  {assignments.filter(a => a.isLecturer).map(a => (
                  <tr key={a.id} className="border-b border-surface-container-highest/50 hover:bg-surface-container-low transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md \${a.bgClass}\`}>{a.initials}</div>
                        <span className="font-body-md text-body-md text-on-surface">{a.student}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.title}</td>
                    <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{a.course}</td>
                    <td className="py-4 pl-4">
                      <button className="text-secondary font-label-sm text-label-sm hover:underline">Grade</button>
                    </td>
                  </tr>
                  ))}
                </tbody>`
);

// replace grading progress
lecturerDash = lecturerDash.replace(
  /<div className="space-y-6">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Average Attendance \*\/\}/,
  `<div className="space-y-6">
              {grades.filter(g => g.isLecturer).map(g => (
              <div key={g.id}>
                <div className="flex justify-between mb-2">
                  <span className="font-label-md text-label-md text-on-surface">{g.course}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">{g.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2">
                  <div className={\`\${g.colorClass} h-2 rounded-full\`} style={{width: \`\${g.progress}%\`}} />
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Average Attendance */}`
);

write('LecturerDashboard.jsx', lecturerDash);

