const fs = require('fs');
const path = require('path');

const files = [
  'CoursesManagement.jsx',
  'LecturerManagement.jsx',
  'AssignmentsManagement.jsx',
  'StudentManagement.jsx',
  'ReportsManagement.jsx',
  'LearningMaterialsManagement.jsx'
];

const basePath = '/Users/faridakbar/Downloads/stitch_edumanage_course_management_system/src/pages';

files.forEach(file => {
  const filePath = path.join(basePath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('AnimatedModal')) {
    // Add import
    content = content.replace(
      "import PageContainer from '../components/layout/PageContainer';",
      "import PageContainer from '../components/layout/PageContainer';\nimport AnimatedModal from '../components/animations/AnimatedModal';"
    );

    // Replace modal start
    // Matches {isModalOpen && (\n <div className="fixed inset-0 ...">\n <div className="... max-w-lg ...">
    const modalStartRegex = /\{isModalOpen && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/40 backdrop-blur-sm">\s*<div className="bg-surface-container-lowest rounded-xl shadow-xl w-full (max-w-[a-z0-9]+) overflow-hidden border border-surface-container-highest animate-in fade-in zoom-in-95 duration-200">/m;
    
    const match = content.match(modalStartRegex);
    if (match) {
      const maxWidth = match[1];
      content = content.replace(modalStartRegex, `<AnimatedModal isOpen={isModalOpen} onClose={handleCloseModal} className="${maxWidth}">`);
      
      // Replace modal end
      const modalEndRegex = /          <\/div>\s*<\/div>\s*\)\}\s*<\/PageContainer>/m;
      content = content.replace(modalEndRegex, '      </AnimatedModal>\n    </PageContainer>');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`Could not find modal in ${file}`);
    }
  }
});
