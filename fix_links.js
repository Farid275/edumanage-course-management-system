import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

  // Add Link and useNavigate
  if (!content.includes('react-router-dom')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link, useNavigate } from 'react-router-dom';");
  }

  // Add navigate hook inside the component
  const componentName = file.replace('.jsx', '');
  if (!content.includes('const navigate = useNavigate()')) {
    content = content.replace(`const ${componentName} = () => {`, `const ${componentName} = () => {\n  const navigate = useNavigate();`);
  }

  // LandingPage specific
  if (file === 'LandingPage.jsx') {
    content = content.replace(/<button([^>]*)>Log In<\/button>/g, '<button$1 onClick={() => navigate("/login")}>Log In</button>');
    content = content.replace(/<button([^>]*)>Get Started<\/button>/g, '<button$1 onClick={() => navigate("/login")}>Get Started</button>');
    content = content.replace(/<button([^>]*)>\s*Login\s*<span/g, '<button$1 onClick={() => navigate("/login")}>\n                Login\n                <span');
    content = content.replace(/<button([^>]*)>\s*View Demo\s*<\/button>/g, '<button$1 onClick={() => navigate("/admin/dashboard")}>\n                View Demo\n              </button>');
  }

  // Login specific
  if (file === 'Login.jsx') {
    content = content.replace(/<form([^>]*)>/g, '<form$1 onSubmit={(e) => { e.preventDefault(); navigate("/admin/dashboard"); }}>');
  }

  // Sidebar links mapping
  const routeMap = {
    'Courses': '/courses',
    'Students': '/students',
    'Lecturers': '/lecturers',
    'Assignments': '/assignments',
    'Attendance': '/attendance',
    'Grades': '/grades',
    'Materials': '/materials',
    'Reports': '/reports',
    'Settings': '/settings'
  };

  // Replace all <a ... href="#">...<span>MenuName</span>...</a>
  // Actually, we can use regex to replace <a> with <Link> and href="#" with to="..."
  // First, we find all <a> tags that have href="#"
  // Then we check if there's a <span> inside that matches our routes.
  
  // A simple way is to replace `<a ` with `<Link ` and `</a>` with `</Link>` for all href="#"
  // But wait, href="#features" should stay <a>.
  // We can do this with regex:
  
  const aTagRegex = /<a([^>]*)href="#"([^>]*)>([\s\S]*?)<\/a>/g;
  content = content.replace(aTagRegex, (match, before, after, inner) => {
    let to = '/';
    
    // Determine route from inner content
    if (inner.includes('Dashboard')) {
      if (file === 'LecturerDashboard.jsx') to = '/lecturer/dashboard';
      else if (file === 'StudentDashboard.jsx') to = '/student/dashboard';
      else to = '/admin/dashboard';
    } else {
      for (const [key, value] of Object.entries(routeMap)) {
        if (inner.includes(key)) {
          to = value;
          break;
        }
      }
    }
    
    // Also, there are links like "Forgot Password?" that can just route to "/login"
    if (inner.includes('Forgot Password?')) to = '/login';
    // "View All" in admin dashboard might be a button? Wait, it was a button in AdminDashboard.
    
    return `<Link${before}to="${to}"${after}>${inner}</Link>`;
  });

  fs.writeFileSync(path.join(pagesDir, file), content);
  console.log(`Updated navigation in ${file}`);
}
