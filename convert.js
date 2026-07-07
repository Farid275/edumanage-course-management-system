import fs from 'fs'
import path from 'path'
import HTMLtoJSX from 'htmltojsx'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const converter = new HTMLtoJSX({
  createClass: false,
})

const map = {
  'edumanage_landing_page': 'LandingPage',
  'edumanage_login': 'Login',
  'admin_dashboard': 'AdminDashboard',
  'lecturer_dashboard': 'LecturerDashboard',
  'student_dashboard': 'StudentDashboard',
  'courses_management': 'CoursesManagement',
  'student_management': 'StudentManagement',
  'lecturer_management': 'LecturerManagement'
}

const pagesDir = path.join(__dirname, 'src', 'pages')
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true })
}

for (const [folder, componentName] of Object.entries(map)) {
  const htmlPath = path.join(__dirname, folder, 'code.html')
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    
    // Extract everything between <body...> and </body>
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyContent = bodyMatch ? bodyMatch[1] : html
    
    // Check if it's the specific script logic that causes issues and strip them
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    let jsx = converter.convert(bodyContent)
    
    const componentCode = `import React from 'react';\n\nconst ${componentName} = () => {\n  return (\n    <>\n${jsx}\n    </>\n  );\n};\n\nexport default ${componentName};\n`
    
    fs.writeFileSync(path.join(pagesDir, `${componentName}.jsx`), componentCode)
    console.log(`Converted ${folder}/code.html to src/pages/${componentName}.jsx`)
  } else {
    console.warn(`File not found: ${htmlPath}`)
  }
}
