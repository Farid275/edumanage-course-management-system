const fs = require('fs');

const newData = `
export const courses = [
  { id: 1, name: "Object-Oriented Programming", code: "CS201", lecturer: "Dr. Alan Turing", semester: "Fall 2023", students: 124, status: "Active", statusClass: "bg-[#E6F4EA] text-[#137333]" },
  { id: 2, name: "Human-Computer Interaction", code: "CS350", lecturer: "Prof. Grace Hopper", semester: "Spring 2024", students: 85, status: "Active", statusClass: "bg-[#E6F4EA] text-[#137333]" },
  { id: 3, name: "Database Systems", code: "CS410", lecturer: "Dr. E.F. Codd", semester: "Fall 2023", students: 150, status: "Archived", statusClass: "bg-surface-container-high text-on-surface-variant" }
];

export const students = [
  { id: 1, name: "Ahmad Rizky", email: "ahmad.rizky@student.edu", studentId: "STU-2023-001", program: "Computer Science", courses: "5", status: "Active", statusClass: "bg-primary-fixed/20 text-on-primary-fixed border border-primary-fixed", initials: "AR", avatar: null, bgClass: "bg-secondary-container text-on-secondary-container" },
  { id: 2, name: "Siti Nurhaliza", email: "siti.nurhaliza@student.edu", studentId: "STU-2022-045", program: "Business Administration", courses: "4", status: "Active", statusClass: "bg-primary-fixed/20 text-on-primary-fixed border border-primary-fixed", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvCIji4kP2itYakrIharb6HXHgzhmIDdSZ0u5hZKYK8HTrk_BeqdUOMY-KLzNxELGGFDivP3OgKpsWV4kRb3RXsJCPmPsr2Z3E4A4H2KIhgMvEdQPeUXPxDHGqNbBLthRunTapsYSRPGuL88-C8MZF0EaHQTlu9yu_BvHSn5fZa5DYLsk0kxI1vIqATReA88HC8A_lRe5MqnJLnPFNXwlUNCdcqiAPeK_ItkY-ake5wQoTPFMZiDX1AZHxCKrW5ztXFsYZW7IX_ro" },
  { id: 3, name: "Budi Santoso", email: "budi.s@alumni.edu", studentId: "STU-2019-112", program: "Mechanical Engineering", courses: "-", status: "Graduated", statusClass: "bg-surface-variant text-on-surface-variant border border-outline-variant", initials: "BS", avatar: null, bgClass: "bg-surface-variant text-on-surface-variant border border-outline-variant" },
  { id: 4, name: "Daniel Tan", email: "daniel.tan@student.edu", studentId: "STU-2023-088", program: "Graphic Design", courses: "6", status: "Active", statusClass: "bg-primary-fixed/20 text-on-primary-fixed border border-primary-fixed", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjkVIXLsTFtwc8n1nYVtetQHGLpbzunMOHtuXFgN1lgKjm3Fz3ZzwMlxiDyoISyyY_nQ2yyUjlAG9bCfoSkbfa3HxwZFe8Fp-0WONwpYeKujvDwinq5fcvSBSNy_LMBYZHZxKfSltD5CiNaWeiJCaN_fk4m3jJCytBz24pkQM8rJ1aeBF-c2AqKUqW-kC9r6S1lIPnCbc-pTcAHryTiAURMWDyL-Ulw-DTIVLzmj5CX5E3Vs-BB4LtrmD07ZGKkNlrJmjXOifCep4" }
];

export const lecturers = [
  { id: 1, name: "Dr. Farid Akbar", email: "farid.akbar@edumanage.edu", lecturerId: "LEC-2023-014", department: "Computer Science", courses: ["CS101", "CS305"], status: "Active", initials: "FA", avatar: null, bgClass: "bg-primary-container text-white" },
  { id: 2, name: "Dr. Anisa Rahma", email: "anisa.rahma@edumanage.edu", lecturerId: "LEC-2021-089", department: "Mathematics", courses: ["MATH201"], status: "Active", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkL-I7DesEhJUo8-dlVtiOAk4n2-FiuH4DYv412HuN7PNt_GPk23AQXo91g0yrub-g8CL4hYLiA0_KXNPTOL270x9XxbRcZmjX7wmFB5-Itr3COWzmfbvJK0t51uQQsenVkdACwf171mqiaQwh1tlE1zB1vaQqaStBsBBdegZFaRd7W6vYfjbYJOEoiVAo1ESEPX1f8ce6fxszGj0-untFpeY9fRUtHNptmcDOJSFH5Mu0YHAeRvO21WwEgV8dTK1aX3NB3YnsQzQ" },
  { id: 3, name: "Prof. Bima Prasetyo", email: "bima.p@edumanage.edu", lecturerId: "LEC-2015-002", department: "Physics", courses: ["PHY401", "PHY800", "+1"], status: "On Leave", initials: "BP", avatar: null, bgClass: "bg-primary-container text-white" }
];

export const assignments = [
  { id: 1, title: "Advanced Algorithms Project Part 1", course: "CS401", lecturer: "Prof. Davis", due: "Due in 2 days", date: { month: "Oct", day: "12" }, status: "urgent", isStudent: true },
  { id: 2, title: "Database Systems Normalization Quiz", course: "CS350", lecturer: "Prof. Miller", due: "", date: { month: "Oct", day: "15" }, status: "normal", isStudent: true },
  { id: 3, title: "Ethics in AI Essay", course: "PHIL205", lecturer: "Dr. Chen", due: "", date: { month: "Oct", day: "18" }, status: "normal", isStudent: true },
  { id: 4, student: "John Doe", title: "SQL Optimization Project", course: "CS301", initials: "JD", bgClass: "bg-primary-container text-on-primary-container", isLecturer: true },
  { id: 5, student: "Alice Smith", title: "UML Diagram HW", course: "CS305", initials: "AS", bgClass: "bg-secondary-container text-on-secondary-container", isLecturer: true }
];

export const attendance = [
  { id: 1, time: "09:00 AM - 10:30 AM", title: "CS401 Lecture", location: "Room 302, Sci-Tech Bldg", active: false },
  { id: 2, time: "11:00 AM - 12:30 PM (Current)", title: "CS350 Lab", location: "Computer Lab B", active: true },
  { id: 3, time: "02:00 PM - 03:30 PM", title: "PHIL205 Seminar", location: "Humanities Hall, R10", active: false },
  { id: 4, time: "09:00", endTime: "10:30", title: "Database Systems (CS301)", location: "Room 402, Building A", isLecturer: true, active: false },
  { id: 5, time: "11:00", endTime: "12:30", title: "Software Engineering (CS305)", location: "Lecture Hall B", isLecturer: true, active: false }
];

export const grades = [
  { id: 1, course: "Advanced Algorithms (CS401)", module: "Module 4: Dynamic Programming", progress: 65, colorClass: "bg-primary" },
  { id: 2, course: "Database Systems (CS350)", module: "Module 7: Concurrency Control", progress: 82, colorClass: "bg-primary" },
  { id: 3, course: "Software Engineering (CS380)", module: "Module 5: Agile Methodologies", progress: 45, colorClass: "bg-primary" },
  { id: 4, course: "Database Systems", progress: 80, colorClass: "bg-primary", isLecturer: true },
  { id: 5, course: "Software Engineering", progress: 45, colorClass: "bg-secondary", isLecturer: true }
];

export const learningMaterials = [
  { id: 1, title: "Dynamic_Prog_Lecture_Slides.pdf", meta: "Added 2 hours ago • CS401", icon: "picture_as_pdf", iconColor: "text-red-600", bgClass: "bg-red-100" },
  { id: 2, title: "Normalization Tutorial Recording", meta: "Added yesterday • CS350", icon: "play_circle", iconColor: "text-blue-600", bgClass: "bg-blue-100" },
  { id: 3, title: "Essay Guidelines & Rubric.docx", meta: "Added 2 days ago • PHIL205", icon: "description", iconColor: "text-green-600", bgClass: "bg-green-100" }
];

export const reports = [
];
`;

let content = fs.readFileSync('src/data/dummyData.js', 'utf8');
content += newData;
fs.writeFileSync('src/data/dummyData.js', content);
