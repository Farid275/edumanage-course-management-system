export const latestCourses = [
  {
    id: 1,
    name: "Object-Oriented Programming",
    lecturer: "Dr. Farid Akbar",
    enrolled: "120 / 150",
    status: "Active",
    statusVariant: "secondary"
  },
  {
    id: 2,
    name: "Advanced Data Structures",
    lecturer: "Prof. Sarah Jenkins",
    enrolled: "85 / 100",
    status: "Active",
    statusVariant: "secondary"
  },
  {
    id: 3,
    name: "Introduction to Machine Learning",
    lecturer: "Dr. Alan Turing",
    enrolled: "200 / 200",
    status: "Full",
    statusVariant: "tertiary"
  },
  {
    id: 4,
    name: "Software Engineering Ethics",
    lecturer: "Dr. Emily Chen",
    enrolled: "45 / 50",
    status: "Draft",
    statusVariant: "surface"
  }
];

export const recentActivity = [
  {
    id: 1,
    time: "10 mins ago",
    title: "New assignment created",
    description: "Dr. Farid Akbar created \"Midterm Project\" for Object-Oriented Programming.",
    colorClass: "bg-secondary"
  },
  {
    id: 2,
    time: "2 hours ago",
    title: "Grade report submitted",
    description: "Prof. Jenkins submitted final grades for Data Structures.",
    colorClass: "bg-tertiary-container"
  },
  {
    id: 3,
    time: "Yesterday",
    title: "System Alert",
    description: "Failed login attempt detected from unknown IP address.",
    colorClass: "bg-error"
  },
  {
    id: 4,
    time: "2 days ago",
    title: "System Maintenance",
    description: "Routine database backup completed successfully.",
    colorClass: "bg-surface-variant"
  }
];

export const summaryStats = {
  admin: [
    { label: "Total Courses", icon: "school", value: "142", trend: "+12% this term", colorClass: "text-primary", bgClass: "bg-primary/5" },
    { label: "Total Students", icon: "group", value: "3,450", trend: "+5% this term", colorClass: "text-secondary", bgClass: "bg-secondary/5" },
    { label: "Lecturers", icon: "record_voice_over", value: "218", trend: "No change", trendIcon: "horizontal_rule", colorClass: "text-tertiary-container", bgClass: "bg-tertiary-container/10" },
    { label: "Active Assignments", icon: "assignment", value: "45", trend: "12 due today", trendIcon: "info", colorClass: "text-error", bgClass: "bg-error/5" },
    { label: "Avg Attendance", icon: "calendar_today", value: "92%", trend: "+2% this week", colorClass: "text-primary", bgClass: "bg-primary/5" }
  ],
  lecturer: [
    { label: "Active Courses", icon: "school", value: "4", trend: "This semester", trendIcon: "info", colorClass: "text-primary", bgClass: "bg-primary/5" },
    { label: "Total Students", icon: "group", value: "324", trend: "Across all courses", trendIcon: "group", colorClass: "text-secondary", bgClass: "bg-secondary/5" },
    { label: "Assignments to Grade", icon: "assignment", value: "28", trend: "Due within 48h", trendIcon: "warning", colorClass: "text-tertiary-container", bgClass: "bg-tertiary-container/10" },
    { label: "Avg Attendance", icon: "calendar_today", value: "88%", trend: "+1.5% this week", trendIcon: "trending_up", colorClass: "text-primary", bgClass: "bg-primary/5" },
  ],
  student: [
    { label: "Enrolled Courses", icon: "school", value: "5", trend: "Current semester", trendIcon: "info", colorClass: "text-primary", bgClass: "bg-primary/5" },
    { label: "Pending Assignments", icon: "assignment", value: "3", trend: "Due this week", trendIcon: "warning", colorClass: "text-tertiary-container", bgClass: "bg-tertiary-container/10" },
    { label: "Overall Attendance", icon: "calendar_today", value: "95%", trend: "Good standing", trendIcon: "check_circle", colorClass: "text-secondary", bgClass: "bg-secondary/5" },
    { label: "Current GPA", icon: "grade", value: "3.8", trend: "Top 15%", trendIcon: "trending_up", colorClass: "text-primary", bgClass: "bg-primary/5" },
  ]
};

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

export const assignmentsData = [
  { id: 1, title: "Advanced Algorithms Project Part 1", course: "CS401", lecturer: "Prof. Davis", due_date: "2024-11-15", submissions: 42, status: "Published" },
  { id: 2, title: "Database Systems Normalization Quiz", course: "CS350", lecturer: "Prof. Miller", due_date: "2024-11-10", submissions: 120, status: "Closed" },
  { id: 3, title: "Ethics in AI Essay", course: "PHIL205", lecturer: "Dr. Chen", due_date: "2024-11-20", submissions: 0, status: "Draft" },
  { id: 4, title: "SQL Optimization Project", course: "CS301", lecturer: "Prof. Miller", due_date: "2024-11-25", submissions: 5, status: "Published" },
  { id: 5, title: "UML Diagram HW", course: "CS305", lecturer: "Dr. Farid Akbar", due_date: "2024-11-18", submissions: 85, status: "Published" }
];

export const attendanceData = [
  { id: 1, student_name: "Ahmad Rizky", student_id: "STU-2023-001", course: "CS401", status: "Present", notes: "" },
  { id: 2, student_name: "Siti Nurhaliza", student_id: "STU-2022-045", course: "CS401", status: "Late", notes: "15 mins late" },
  { id: 3, student_name: "Budi Santoso", student_id: "STU-2019-112", course: "CS401", status: "Absent", notes: "" },
  { id: 4, student_name: "Daniel Tan", student_id: "STU-2023-088", course: "CS401", status: "Excused", notes: "Medical leave" },
  { id: 5, student_name: "Alice Smith", student_id: "STU-2023-099", course: "CS401", status: "Present", notes: "" }
];

export const gradesData = [
  { id: 1, student_name: "Ahmad Rizky", student_id: "STU-2023-001", assignment_score: 85, midterm_score: 78, final_exam: 88, final_grade: 84.5, letter_grade: "B+", status: "Published" },
  { id: 2, student_name: "Siti Nurhaliza", student_id: "STU-2022-045", assignment_score: 92, midterm_score: 95, final_exam: 90, final_grade: 91.8, letter_grade: "A", status: "Published" },
  { id: 3, student_name: "Daniel Tan", student_id: "STU-2023-088", assignment_score: 65, midterm_score: 70, final_exam: 75, final_grade: 71.0, letter_grade: "C", status: "Published" },
  { id: 4, student_name: "Alice Smith", student_id: "STU-2023-099", assignment_score: null, midterm_score: 85, final_exam: null, final_grade: null, letter_grade: "-", status: "Draft" }
];

export const learningMaterialsData = [
  { id: 1, title: "Dynamic_Prog_Lecture_Slides.pdf", course: "CS401", type: "PDF", uploaded_by: "Prof. Davis", upload_date: "2024-10-01" },
  { id: 2, title: "Normalization Tutorial Recording", course: "CS350", type: "Video", uploaded_by: "Prof. Miller", upload_date: "2024-10-05" },
  { id: 3, title: "Essay Guidelines & Rubric.docx", course: "PHIL205", type: "Slide", uploaded_by: "Dr. Chen", upload_date: "2024-10-12" },
  { id: 4, title: "React Official Documentation", course: "CS305", type: "Link", uploaded_by: "Dr. Farid Akbar", upload_date: "2024-10-15" }
];

export const reportsData = [
  { id: 1, title: "Fall 2023 Enrollment Summary", type: "Course Report", date: "2024-01-10", author: "System Auto-Generated" },
  { id: 2, title: "CS401 Midterm Analytics", type: "Grade Report", date: "2024-10-25", author: "Prof. Davis" },
  { id: 3, title: "Weekly Absenteeism Alert", type: "Attendance Report", date: "2024-11-01", author: "System Auto-Generated" }
];

export const attendance = [
  { id: 1, isLecturer: true, isStudent: false, time: '09:00 AM', endTime: '11:00 AM', title: 'Software Engineering', location: 'Room 302', active: false },
  { id: 2, isLecturer: true, isStudent: false, time: '01:00 PM', endTime: '02:30 PM', title: 'Data Structures', location: 'Lab 4', active: false },
  { id: 3, isLecturer: false, isStudent: true, time: '09:00 AM', endTime: '11:00 AM', title: 'Advanced Mathematics', location: 'Room 101', active: true },
  { id: 4, isLecturer: false, isStudent: true, time: '11:30 AM', endTime: '01:00 PM', title: 'Computer Networks', location: 'Lab 2', active: false }
];

export const assignments = [
  { id: 1, isLecturer: true, isStudent: false, bgClass: 'bg-primary-container text-primary', initials: 'JS', student: 'John Smith', course: 'Software Engineering', title: 'Sprint 1 Report' },
  { id: 2, isLecturer: true, isStudent: false, bgClass: 'bg-secondary-container text-secondary', initials: 'AD', student: 'Alice Doe', course: 'Data Structures', title: 'Graph Traversal' },
  { id: 3, isLecturer: false, isStudent: true, status: 'urgent', date: { month: 'Nov', day: '15' }, title: 'Network Topology Design', course: 'Computer Networks', lecturer: 'Dr. Alan', due: 'Tomorrow' },
  { id: 4, isLecturer: false, isStudent: true, status: '', date: { month: 'Nov', day: '20' }, title: 'Calculus Quiz', course: 'Advanced Mathematics', lecturer: 'Prof. Sarah', due: 'Next Week' }
];

export const grades = [
  { id: 1, isLecturer: true, isStudent: false, course: 'Software Engineering', progress: 85, colorClass: 'bg-primary' },
  { id: 2, isLecturer: true, isStudent: false, course: 'Data Structures', progress: 60, colorClass: 'bg-secondary' },
  { id: 3, isLecturer: false, isStudent: true, course: 'Advanced Mathematics', module: 'Midterm', progress: 92, colorClass: 'bg-primary' },
  { id: 4, isLecturer: false, isStudent: true, course: 'Computer Networks', module: 'Quiz 1', progress: 88, colorClass: 'bg-secondary' }
];

export const learningMaterials = [
  { id: 1, bgClass: 'bg-error-container', iconColor: 'text-error', icon: 'picture_as_pdf', title: 'Lecture 4 Slides', meta: 'PDF • 2.4 MB' },
  { id: 2, bgClass: 'bg-primary-container', iconColor: 'text-primary', icon: 'play_circle', title: 'Network Basics Recording', meta: 'Video • 45 mins' }
];
