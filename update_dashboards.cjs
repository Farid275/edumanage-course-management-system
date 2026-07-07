const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const read = (file) => fs.readFileSync(path.join(srcDir, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(srcDir, file), content);

// StudentDashboard.jsx
let studentDash = read('StudentDashboard.jsx');
studentDash = studentDash.replace(
  /import \{ latestCourses, recentActivity, summaryStats \} from '\.\.\/data\/dummyData';/,
  `import { assignments, grades, learningMaterials, attendance } from '../data/dummyData';`
);

// replace assignments
studentDash = studentDash.replace(
  /<div className="p-0">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Course Progress \*\/\}/,
  `<div className="p-0">
              {assignments.filter(a => a.isStudent).map(a => (
              <div key={a.id} className={\`p-4 border-b border-surface-container-highest flex items-center justify-between hover:bg-surface-container-lowest/50 transition-colors \${a.status === 'urgent' ? 'bg-[#E67E22]/5' : ''}\`}>
                <div className="flex items-center gap-4">
                  <div className={\`w-12 h-12 rounded-lg flex flex-col items-center justify-center border \${a.status === 'urgent' ? 'bg-[#E67E22]/10 border-[#E67E22]/20 text-[#E67E22]' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'}\`}>
                    <span className="font-label-sm text-[10px] uppercase font-bold">{a.date.month}</span>
                    <span className="font-headline-md text-[18px] leading-tight font-bold">{a.date.day}</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-primary mb-1">{a.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">school</span> {a.course} • {a.lecturer}</p>
                  </div>
                </div>
                <div className="text-right">
                  {a.status === 'urgent' ? (
                    <span className="inline-block px-2 py-1 bg-[#E67E22] text-white rounded font-label-sm text-[10px] font-bold uppercase tracking-wider mb-1">{a.due}</span>
                  ) : (
                    <button className="px-3 py-1.5 border border-outline-variant rounded text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">Submit</button>
                  )}
                </div>
              </div>
              ))}
            </div>
          </div>
          {/* Course Progress */}`
);

// replace course progress
studentDash = studentDash.replace(
  /<div className="space-y-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Right Column/g,
  `<div className="space-y-6">
              {grades.filter(g => !g.isLecturer).map(g => (
              <div key={g.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-label-md text-label-md text-primary">{g.course}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{g.module}</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-bold">{g.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className={\`\${g.colorClass} h-full rounded-full\`} style={{width: \`\${g.progress}%\`}} />
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Column`
);

// replace new materials
studentDash = studentDash.replace(
  /<div className="p-0">\s*<Link[\s\S]*?<\/div>\s*<div className="p-3 border-t border-surface-container-highest bg-surface-container-lowest text-center">/,
  `<div className="p-0">
              {learningMaterials.map(m => (
              <Link key={m.id} className="flex items-start gap-3 p-4 border-b border-surface-container-highest hover:bg-surface-container-lowest/50 transition-colors" to="/">
                <div className={\`w-8 h-8 rounded \${m.bgClass} flex items-center justify-center shrink-0 mt-0.5\`}>
                  <span className={\`material-symbols-outlined \${m.iconColor} text-[16px]\`}>{m.icon}</span>
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-primary mb-0.5 leading-snug">{m.title}</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{m.meta}</p>
                </div>
              </Link>
              ))}
            </div>
            <div className="p-3 border-t border-surface-container-highest bg-surface-container-lowest text-center">`
);

// replace today's schedule
studentDash = studentDash.replace(
  /<div className="relative pl-4 border-l-2 border-surface-container-highest space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="relative pl-4 border-l-2 border-surface-container-highest space-y-4">
              {attendance.filter(a => !a.isLecturer).map(a => (
              <div key={a.id} className="relative">
                <div className={\`absolute w-2.5 h-2.5 rounded-full -left-[21px] top-1 \${a.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline'}\`} />
                <p className={\`font-label-sm text-[12px] mb-0.5 \${a.active ? 'text-primary font-bold' : 'text-on-surface-variant'}\`}>{a.time}</p>
                <p className="font-label-md text-label-md text-primary">{a.title}</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">{a.location}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>`
);

write('StudentDashboard.jsx', studentDash);

