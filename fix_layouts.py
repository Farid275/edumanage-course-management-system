import os

files = [
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
]

for file in files:
    filepath = os.path.join('src', 'pages', file)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        import re
        content = re.sub(r"import DashboardLayout from '\.\./layouts/DashboardLayout';\n?", "", content)
        content = re.sub(r"<DashboardLayout[^>]*>\s*", "", content)
        content = re.sub(r"\s*</DashboardLayout>", "", content)
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {file}")
