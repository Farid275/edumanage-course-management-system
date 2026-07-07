import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = [
  { name: 'AdminDashboard.jsx', role: 'admin' },
  { name: 'LecturerDashboard.jsx', role: 'lecturer' },
  { name: 'StudentDashboard.jsx', role: 'student' },
  { name: 'CoursesManagement.jsx', role: 'admin' },
  { name: 'StudentManagement.jsx', role: 'admin' },
  { name: 'LecturerManagement.jsx', role: 'admin' }
];

for (const { name, role } of files) {
  const filePath = path.join(pagesDir, name);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add imports
  if (!content.includes('DashboardLayout')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport DashboardLayout from '../layouts/DashboardLayout';\nimport SummaryCard from '../components/SummaryCard';\nimport { latestCourses, recentActivity, summaryStats } from '../data/dummyData';");
  }

  // Regex to match from <div> up to <main ...> (inclusive)
  const headerRegex = /<div>[\s\S]*?<main[^>]*>/;
  content = content.replace(headerRegex, `<DashboardLayout role="${role}">`);

  // Replace the closing tags
  const footerRegex = /<\/main>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
  content = content.replace(footerRegex, `</DashboardLayout>`);
  
  // Replace the hardcoded summary cards grid with mapping
  // Admin dashboard
  if (name === 'AdminDashboard.jsx') {
    const bentoRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-card-gap mb-section-margin">[\s\S]*?<\/div>\n      {\/\* Complex Layout Area \*\/}/;
    content = content.replace(bentoRegex, `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-card-gap mb-section-margin">
        {summaryStats.admin.map((stat, i) => <SummaryCard key={i} item={stat} />)}
        {/* Pending Reports (Custom card) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-error-container bg-error-container/20 flex flex-col gap-3 relative overflow-hidden group transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-error-container">Pending Reports</span>
            <span className="material-symbols-outlined text-on-error-container">warning</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-on-error-container">8</div>
          <button className="mt-auto text-left font-label-sm text-label-sm text-on-error-container underline hover:opacity-80">Review Now</button>
        </div>
      </div>\n      {/* Complex Layout Area */}`);

      // replace table tbody with mapping
      const tbodyRegex = /<tbody className="font-body-md text-body-md">[\s\S]*?<\/tbody>/;
      content = content.replace(tbodyRegex, `<tbody className="font-body-md text-body-md">
                {latestCourses.map(course => (
                  <tr key={course.id} className="border-b border-surface-container-highest/50 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-medium text-primary">{course.name}</td>
                    <td className="p-4 text-on-surface-variant">{course.lecturer}</td>
                    <td className="p-4 text-on-surface-variant">{course.enrolled}</td>
                    <td className="p-4">
                      <span className={\`inline-flex items-center px-2 py-1 rounded-full bg-\${course.statusVariant}-fixed/50 text-on-\${course.statusVariant}-fixed font-label-sm text-label-sm\`}>{course.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>`);

      // replace recent activity with mapping
      const activityRegex = /<div className="relative border-l border-surface-container-highest ml-3 space-y-6">[\s\S]*?<\/div>\n          <\/div>/;
      content = content.replace(activityRegex, `<div className="relative border-l border-surface-container-highest ml-3 space-y-6">
              {recentActivity.map(item => (
                <div key={item.id} className="relative pl-6">
                  <span className={\`absolute -left-1.5 top-1 w-3 h-3 \${item.colorClass} rounded-full ring-4 ring-surface-container-lowest\`} />
                  <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.time}</div>
                  <div className="font-body-md text-body-md text-primary font-medium">{item.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.description}</div>
                </div>
              ))}
            </div>\n          </div>`);
  }

  // Lecturer Dashboard
  if (name === 'LecturerDashboard.jsx') {
     const bentoRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-section-margin">[\s\S]*?<\/div>\n      {\/\* 2-Column Layout \*\/}/;
     content = content.replace(bentoRegex, `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-section-margin">
        {summaryStats.lecturer.map((stat, i) => <SummaryCard key={i} item={stat} />)}
      </div>\n      {/* 2-Column Layout */}`);
  }

  // Student Dashboard
  if (name === 'StudentDashboard.jsx') {
     const bentoRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-section-margin">[\s\S]*?<\/div>\n      {\/\* Main Content Grid \*\/}/;
     content = content.replace(bentoRegex, `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap mb-section-margin">
        {summaryStats.student.map((stat, i) => <SummaryCard key={i} item={stat} />)}
      </div>\n      {/* Main Content Grid */}`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Refactored layout for ${name}`);
}
