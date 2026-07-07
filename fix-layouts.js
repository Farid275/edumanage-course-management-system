const fs = require('fs');
const path = require('path');

const files = [
  'AdminDashboard.jsx',
  'LecturerDashboard.jsx',
  'StudentDashboard.jsx',
  'CoursesManagement.jsx',
  'StudentManagement.jsx',
  'LecturerManagement.jsx',
  'AssignmentsManagement.jsx',
  'AttendanceManagement.jsx',
  'GradesManagement.jsx',
  'LearningMaterialsManagement.jsx',
  'ReportsManagement.jsx',
  'SettingsManagement.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'pages', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove import
    content = content.replace(/import DashboardLayout from '..\/layouts\/DashboardLayout';\n?/g, '');
    
    // Remove <DashboardLayout ...>
    content = content.replace(/<DashboardLayout[^>]*>\s*/g, '');
    
    // Remove </DashboardLayout>
    content = content.replace(/\s*<\/DashboardLayout>/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});
