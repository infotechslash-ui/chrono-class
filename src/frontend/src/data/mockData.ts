// Mock data for Chrono Class frontend demo

export type UserRole = "Admin" | "HOD" | "Teacher" | "Student";

export interface DemoUser {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  departmentId?: number;
  teacherId?: string;
  year?: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    username: "admin",
    password: "admin123",
    role: "Admin",
    name: "Administrator",
  },
  {
    username: "hod_cs",
    password: "hod123",
    role: "HOD",
    name: "Dr. Sharma",
    departmentId: 1,
  },
  {
    username: "hod_ec",
    password: "hod123",
    role: "HOD",
    name: "Dr. Patel",
    departmentId: 2,
  },
  {
    username: "teacher_1",
    password: "teacher123",
    role: "Teacher",
    name: "Prof. Ramesh",
    teacherId: "t1",
    departmentId: 1,
  },
  {
    username: "teacher_2",
    password: "teacher123",
    role: "Teacher",
    name: "Prof. Priya",
    teacherId: "t2",
    departmentId: 1,
  },
  {
    username: "teacher_3",
    password: "teacher123",
    role: "Teacher",
    name: "Prof. Anand",
    teacherId: "t3",
    departmentId: 2,
  },
  {
    username: "teacher_4",
    password: "teacher123",
    role: "Teacher",
    name: "Prof. Meena",
    teacherId: "t4",
    departmentId: 2,
  },
  {
    username: "student_1",
    password: "student123",
    role: "Student",
    name: "Arjun Kumar",
    departmentId: 1,
    year: "2nd Year",
  },
  {
    username: "student_2",
    password: "student123",
    role: "Student",
    name: "Neha Singh",
    departmentId: 1,
    year: "3rd Year",
  },
  {
    username: "student_3",
    password: "student123",
    role: "Student",
    name: "Ravi Verma",
    departmentId: 1,
    year: "1st Year",
  },
  {
    username: "student_4",
    password: "student123",
    role: "Student",
    name: "Deepa Nair",
    departmentId: 2,
    year: "2nd Year",
  },
  {
    username: "student_5",
    password: "student123",
    role: "Student",
    name: "Amit Shah",
    departmentId: 2,
    year: "1st Year",
  },
];

export interface Department {
  id: number;
  name: string;
  fullName: string;
  hodName: string;
  hodUsername: string;
  coursesCount: number;
}

export const DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: "CS",
    fullName: "Computer Science",
    hodName: "Dr. Sharma",
    hodUsername: "hod_cs",
    coursesCount: 6,
  },
  {
    id: 2,
    name: "EC",
    fullName: "Electronics & Communication",
    hodName: "Dr. Patel",
    hodUsername: "hod_ec",
    coursesCount: 4,
  },
];

export interface Course {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  teacherId: string;
  teacherName: string;
  weeklyHours: number;
  color: string;
}

export const COURSES: Course[] = [
  {
    id: 1,
    code: "DS",
    name: "Data Structures",
    departmentId: 1,
    teacherId: "t1",
    teacherName: "Prof. Ramesh",
    weeklyHours: 4,
    color: "#6366f1",
  },
  {
    id: 2,
    code: "ALGO",
    name: "Algorithms",
    departmentId: 1,
    teacherId: "t1",
    teacherName: "Prof. Ramesh",
    weeklyHours: 3,
    color: "#8b5cf6",
  },
  {
    id: 3,
    code: "DBMS",
    name: "Database Systems",
    departmentId: 1,
    teacherId: "t2",
    teacherName: "Prof. Priya",
    weeklyHours: 4,
    color: "#06b6d4",
  },
  {
    id: 4,
    code: "OS",
    name: "Operating Systems",
    departmentId: 1,
    teacherId: "t2",
    teacherName: "Prof. Priya",
    weeklyHours: 3,
    color: "#10b981",
  },
  {
    id: 5,
    code: "CN",
    name: "Computer Networks",
    departmentId: 1,
    teacherId: "t1",
    teacherName: "Prof. Ramesh",
    weeklyHours: 3,
    color: "#f59e0b",
  },
  {
    id: 6,
    code: "SE",
    name: "Software Engineering",
    departmentId: 1,
    teacherId: "t2",
    teacherName: "Prof. Priya",
    weeklyHours: 3,
    color: "#ef4444",
  },
  {
    id: 7,
    code: "SP",
    name: "Signal Processing",
    departmentId: 2,
    teacherId: "t3",
    teacherName: "Prof. Anand",
    weeklyHours: 4,
    color: "#7c3aed",
  },
  {
    id: 8,
    code: "EMT",
    name: "Electromagnetics",
    departmentId: 2,
    teacherId: "t3",
    teacherName: "Prof. Anand",
    weeklyHours: 3,
    color: "#db2777",
  },
  {
    id: 9,
    code: "VLSI",
    name: "VLSI Design",
    departmentId: 2,
    teacherId: "t4",
    teacherName: "Prof. Meena",
    weeklyHours: 4,
    color: "#0891b2",
  },
  {
    id: 10,
    code: "ES",
    name: "Embedded Systems",
    departmentId: 2,
    teacherId: "t4",
    teacherName: "Prof. Meena",
    weeklyHours: 3,
    color: "#059669",
  },
];

export interface Teacher {
  id: string;
  name: string;
  username: string;
  specialization: string;
  departmentId: number;
  courses: number[];
  maxLoad: number;
  currentLoad: number;
}

export const TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Prof. Ramesh",
    username: "teacher_1",
    specialization: "Algorithms & Networks",
    departmentId: 1,
    courses: [1, 2, 5],
    maxLoad: 12,
    currentLoad: 10,
  },
  {
    id: "t2",
    name: "Prof. Priya",
    username: "teacher_2",
    specialization: "Systems & Databases",
    departmentId: 1,
    courses: [3, 4, 6],
    maxLoad: 12,
    currentLoad: 10,
  },
  {
    id: "t3",
    name: "Prof. Anand",
    username: "teacher_3",
    specialization: "Signal Processing",
    departmentId: 2,
    courses: [7, 8],
    maxLoad: 12,
    currentLoad: 8,
  },
  {
    id: "t4",
    name: "Prof. Meena",
    username: "teacher_4",
    specialization: "VLSI & Embedded",
    departmentId: 2,
    courses: [9, 10],
    maxLoad: 12,
    currentLoad: 8,
  },
];

export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: "Lecture" | "Lab" | "Seminar";
}

export const ROOMS: Room[] = [
  { id: 1, name: "Room 101", capacity: 60, type: "Lecture" },
  { id: 2, name: "Room 102", capacity: 60, type: "Lecture" },
  { id: 3, name: "Lab 201", capacity: 30, type: "Lab" },
];

export const TIME_SLOTS = [
  { id: "p1", label: "P1", time: "09:00 – 09:50", isBreak: false },
  { id: "p2", label: "P2", time: "09:50 – 10:40", isBreak: false },
  {
    id: "break1",
    label: "Break",
    time: "10:40 – 10:55",
    isBreak: true,
    breakType: "short",
  },
  { id: "p3", label: "P3", time: "10:55 – 11:45", isBreak: false },
  { id: "p4", label: "P4", time: "11:45 – 12:35", isBreak: false },
  {
    id: "lunch",
    label: "Lunch Break",
    time: "12:35 – 13:25",
    isBreak: true,
    breakType: "lunch",
  },
  { id: "p5", label: "P5", time: "13:25 – 14:15", isBreak: false },
  { id: "p6", label: "P6", time: "14:15 – 15:05", isBreak: false },
  {
    id: "break2",
    label: "Break",
    time: "15:05 – 15:15",
    isBreak: true,
    breakType: "short",
  },
  { id: "p7", label: "P7", time: "15:15 – 16:00", isBreak: false },
  { id: "p8", label: "P8", time: "16:00 – 16:40", isBreak: false },
];

export const DAYS = [
  { id: "mon", label: "Monday", short: "Mon" },
  { id: "tue", label: "Tuesday", short: "Tue" },
  { id: "wed", label: "Wednesday", short: "Wed" },
  { id: "thu", label: "Thursday", short: "Thu" },
  { id: "fri", label: "Friday", short: "Fri" },
  { id: "sat", label: "Saturday", short: "Sat" },
];

export interface TimetableCell {
  day: string;
  period: string;
  courseId: number | null;
  roomId: number | null;
  teacherId: string | null;
}

// Pre-generated conflict-free timetable for CS dept
export const MOCK_TIMETABLE: TimetableCell[] = [
  // Monday
  { day: "mon", period: "p1", courseId: 1, roomId: 1, teacherId: "t1" }, // DS
  { day: "mon", period: "p2", courseId: 3, roomId: 2, teacherId: "t2" }, // DBMS
  { day: "mon", period: "p3", courseId: 2, roomId: 1, teacherId: "t1" }, // ALGO
  { day: "mon", period: "p4", courseId: 4, roomId: 2, teacherId: "t2" }, // OS
  { day: "mon", period: "p5", courseId: 5, roomId: 1, teacherId: "t1" }, // CN
  { day: "mon", period: "p6", courseId: 6, roomId: 2, teacherId: "t2" }, // SE
  { day: "mon", period: "p7", courseId: null, roomId: null, teacherId: null },
  { day: "mon", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Tuesday
  { day: "tue", period: "p1", courseId: 3, roomId: 1, teacherId: "t2" }, // DBMS
  { day: "tue", period: "p2", courseId: 1, roomId: 2, teacherId: "t1" }, // DS
  { day: "tue", period: "p3", courseId: 6, roomId: 1, teacherId: "t2" }, // SE
  { day: "tue", period: "p4", courseId: 5, roomId: 2, teacherId: "t1" }, // CN
  { day: "tue", period: "p5", courseId: 4, roomId: 3, teacherId: "t2" }, // OS Lab
  { day: "tue", period: "p6", courseId: 4, roomId: 3, teacherId: "t2" }, // OS Lab cont.
  { day: "tue", period: "p7", courseId: 2, roomId: 1, teacherId: "t1" }, // ALGO
  { day: "tue", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Wednesday
  { day: "wed", period: "p1", courseId: 2, roomId: 2, teacherId: "t1" }, // ALGO
  { day: "wed", period: "p2", courseId: 4, roomId: 1, teacherId: "t2" }, // OS
  { day: "wed", period: "p3", courseId: 1, roomId: 3, teacherId: "t1" }, // DS Lab
  { day: "wed", period: "p4", courseId: 1, roomId: 3, teacherId: "t1" }, // DS Lab cont.
  { day: "wed", period: "p5", courseId: 6, roomId: 2, teacherId: "t2" }, // SE
  { day: "wed", period: "p6", courseId: 3, roomId: 1, teacherId: "t2" }, // DBMS
  { day: "wed", period: "p7", courseId: 5, roomId: 2, teacherId: "t1" }, // CN
  { day: "wed", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Thursday
  { day: "thu", period: "p1", courseId: 5, roomId: 1, teacherId: "t1" }, // CN
  { day: "thu", period: "p2", courseId: 6, roomId: 2, teacherId: "t2" }, // SE
  { day: "thu", period: "p3", courseId: 3, roomId: 3, teacherId: "t2" }, // DBMS Lab
  { day: "thu", period: "p4", courseId: 3, roomId: 3, teacherId: "t2" }, // DBMS Lab cont.
  { day: "thu", period: "p5", courseId: 1, roomId: 1, teacherId: "t1" }, // DS
  { day: "thu", period: "p6", courseId: 2, roomId: 2, teacherId: "t1" }, // ALGO
  { day: "thu", period: "p7", courseId: 4, roomId: 1, teacherId: "t2" }, // OS
  { day: "thu", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Friday
  { day: "fri", period: "p1", courseId: 4, roomId: 2, teacherId: "t2" }, // OS
  { day: "fri", period: "p2", courseId: 2, roomId: 1, teacherId: "t1" }, // ALGO
  { day: "fri", period: "p3", courseId: 5, roomId: 3, teacherId: "t1" }, // CN Lab
  { day: "fri", period: "p4", courseId: 5, roomId: 3, teacherId: "t1" }, // CN Lab cont.
  { day: "fri", period: "p5", courseId: 3, roomId: 1, teacherId: "t2" }, // DBMS
  { day: "fri", period: "p6", courseId: 1, roomId: 2, teacherId: "t1" }, // DS
  { day: "fri", period: "p7", courseId: 6, roomId: 1, teacherId: "t2" }, // SE
  { day: "fri", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Saturday
  { day: "sat", period: "p1", courseId: 6, roomId: 1, teacherId: "t2" }, // SE
  { day: "sat", period: "p2", courseId: 5, roomId: 2, teacherId: "t1" }, // CN
  { day: "sat", period: "p3", courseId: 2, roomId: 1, teacherId: "t1" }, // ALGO
  { day: "sat", period: "p4", courseId: 3, roomId: 2, teacherId: "t2" }, // DBMS
  { day: "sat", period: "p5", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p6", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p7", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p8", courseId: null, roomId: null, teacherId: null },
];

// Pre-generated conflict-free timetable for EC dept
export const MOCK_TIMETABLE_EC: TimetableCell[] = [
  // Monday
  { day: "mon", period: "p1", courseId: 7, roomId: 1, teacherId: "t3" }, // SP
  { day: "mon", period: "p2", courseId: 9, roomId: 2, teacherId: "t4" }, // VLSI
  { day: "mon", period: "p3", courseId: 8, roomId: 1, teacherId: "t3" }, // EMT
  { day: "mon", period: "p4", courseId: 10, roomId: 2, teacherId: "t4" }, // ES
  { day: "mon", period: "p5", courseId: 7, roomId: 1, teacherId: "t3" }, // SP
  { day: "mon", period: "p6", courseId: 9, roomId: 2, teacherId: "t4" }, // VLSI
  { day: "mon", period: "p7", courseId: null, roomId: null, teacherId: null },
  { day: "mon", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Tuesday
  { day: "tue", period: "p1", courseId: 9, roomId: 1, teacherId: "t4" }, // VLSI
  { day: "tue", period: "p2", courseId: 7, roomId: 2, teacherId: "t3" }, // SP
  { day: "tue", period: "p3", courseId: 10, roomId: 1, teacherId: "t4" }, // ES
  { day: "tue", period: "p4", courseId: 8, roomId: 2, teacherId: "t3" }, // EMT
  { day: "tue", period: "p5", courseId: 9, roomId: 3, teacherId: "t4" }, // VLSI Lab
  { day: "tue", period: "p6", courseId: 9, roomId: 3, teacherId: "t4" }, // VLSI Lab cont.
  { day: "tue", period: "p7", courseId: 7, roomId: 1, teacherId: "t3" }, // SP
  { day: "tue", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Wednesday
  { day: "wed", period: "p1", courseId: 8, roomId: 2, teacherId: "t3" }, // EMT
  { day: "wed", period: "p2", courseId: 10, roomId: 1, teacherId: "t4" }, // ES
  { day: "wed", period: "p3", courseId: 7, roomId: 3, teacherId: "t3" }, // SP Lab
  { day: "wed", period: "p4", courseId: 7, roomId: 3, teacherId: "t3" }, // SP Lab cont.
  { day: "wed", period: "p5", courseId: 10, roomId: 2, teacherId: "t4" }, // ES
  { day: "wed", period: "p6", courseId: 9, roomId: 1, teacherId: "t4" }, // VLSI
  { day: "wed", period: "p7", courseId: 8, roomId: 2, teacherId: "t3" }, // EMT
  { day: "wed", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Thursday
  { day: "thu", period: "p1", courseId: 8, roomId: 1, teacherId: "t3" }, // EMT
  { day: "thu", period: "p2", courseId: 10, roomId: 2, teacherId: "t4" }, // ES
  { day: "thu", period: "p3", courseId: 9, roomId: 3, teacherId: "t4" }, // VLSI Lab
  { day: "thu", period: "p4", courseId: 9, roomId: 3, teacherId: "t4" }, // VLSI Lab cont.
  { day: "thu", period: "p5", courseId: 7, roomId: 1, teacherId: "t3" }, // SP
  { day: "thu", period: "p6", courseId: 8, roomId: 2, teacherId: "t3" }, // EMT
  { day: "thu", period: "p7", courseId: 10, roomId: 1, teacherId: "t4" }, // ES
  { day: "thu", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Friday
  { day: "fri", period: "p1", courseId: 10, roomId: 2, teacherId: "t4" }, // ES
  { day: "fri", period: "p2", courseId: 8, roomId: 1, teacherId: "t3" }, // EMT
  { day: "fri", period: "p3", courseId: 8, roomId: 3, teacherId: "t3" }, // EMT Lab
  { day: "fri", period: "p4", courseId: 8, roomId: 3, teacherId: "t3" }, // EMT Lab cont.
  { day: "fri", period: "p5", courseId: 9, roomId: 1, teacherId: "t4" }, // VLSI
  { day: "fri", period: "p6", courseId: 7, roomId: 2, teacherId: "t3" }, // SP
  { day: "fri", period: "p7", courseId: 10, roomId: 1, teacherId: "t4" }, // ES
  { day: "fri", period: "p8", courseId: null, roomId: null, teacherId: null },

  // Saturday
  { day: "sat", period: "p1", courseId: 10, roomId: 1, teacherId: "t4" }, // ES
  { day: "sat", period: "p2", courseId: 8, roomId: 2, teacherId: "t3" }, // EMT
  { day: "sat", period: "p3", courseId: 7, roomId: 1, teacherId: "t3" }, // SP
  { day: "sat", period: "p4", courseId: 9, roomId: 2, teacherId: "t4" }, // VLSI
  { day: "sat", period: "p5", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p6", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p7", courseId: null, roomId: null, teacherId: null },
  { day: "sat", period: "p8", courseId: null, roomId: null, teacherId: null },
];

export interface MockUser {
  password?: string;
  id: number;
  name: string;
  username: string;
  role: string;
  department: string;
  email: string;
  year?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "Administrator",
    username: "admin",
    password: "admin123",
    role: "Admin",
    department: "—",
    email: "admin@chronoclass.edu",
  },
  {
    id: 2,
    name: "Dr. Sharma",
    username: "hod_cs",
    password: "hod123",
    role: "HOD",
    department: "CS",
    email: "sharma@chronoclass.edu",
  },
  {
    id: 3,
    name: "Prof. Ramesh",
    username: "teacher_1",
    password: "teacher123",
    role: "Teacher",
    department: "CS",
    email: "ramesh@chronoclass.edu",
  },
  {
    id: 4,
    name: "Prof. Priya",
    username: "teacher_2",
    password: "teacher123",
    role: "Teacher",
    department: "CS",
    email: "priya@chronoclass.edu",
  },
  {
    id: 5,
    name: "Arjun Kumar",
    username: "student_1",
    password: "student123",
    role: "Student",
    department: "CS",
    email: "arjun@chronoclass.edu",
    year: "2nd Year",
  },
  {
    id: 6,
    name: "Neha Singh",
    username: "student_2",
    password: "student123",
    role: "Student",
    department: "CS",
    email: "neha@chronoclass.edu",
    year: "3rd Year",
  },
  {
    id: 7,
    name: "Dr. Patel",
    username: "hod_ec",
    password: "hod123",
    role: "HOD",
    department: "EC",
    email: "patel@chronoclass.edu",
  },
  {
    id: 8,
    name: "Prof. Anand",
    username: "teacher_3",
    password: "teacher123",
    role: "Teacher",
    department: "EC",
    email: "anand@chronoclass.edu",
  },
  {
    id: 9,
    name: "Prof. Meena",
    username: "teacher_4",
    password: "teacher123",
    role: "Teacher",
    department: "EC",
    email: "meena@chronoclass.edu",
  },
  {
    id: 10,
    name: "Ravi Verma",
    username: "student_3",
    password: "student123",
    role: "Student",
    department: "CS",
    email: "ravi@chronoclass.edu",
    year: "1st Year",
  },
  {
    id: 11,
    name: "Deepa Nair",
    username: "student_4",
    password: "student123",
    role: "Student",
    department: "EC",
    email: "deepa@chronoclass.edu",
    year: "2nd Year",
  },
  {
    id: 12,
    name: "Amit Shah",
    username: "student_5",
    password: "student123",
    role: "Student",
    department: "EC",
    email: "amit@chronoclass.edu",
    year: "1st Year",
  },
];
