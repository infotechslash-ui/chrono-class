import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Building2,
  CalendarDays,
  DoorOpen,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { useDataStore } from "../context/DataStoreContext";
import {
  ACADEMIC_YEARS,
  type SemesterType,
  useSemester,
} from "../context/SemesterContext";
import { useUserStore } from "../context/UserStoreContext";
import type { Course, Department, MockUser, Room } from "../data/mockData";

const roleColors: Record<string, string> = {
  Admin: "bg-red-100 text-red-700",
  HOD: "bg-purple-100 text-purple-700",
  Teacher: "bg-blue-100 text-blue-700",
  Student: "bg-green-100 text-green-700",
};

export default function AdminDashboard() {
  const {
    semester,
    academicYear,
    semesterLabel,
    setSemester,
    setAcademicYear,
  } = useSemester();
  const { users, setUsers } = useUserStore();
  const {
    departments,
    courses,
    rooms,
    teachers,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addCourse,
    updateCourse,
    deleteCourse,
    addRoom,
    updateRoom,
    deleteRoom,
  } = useDataStore();

  // Dialog states
  const [userDialog, setUserDialog] = useState(false);
  const [deptDialog, setDeptDialog] = useState(false);
  const [courseDialog, setCourseDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: string;
    id: number;
    name: string;
  } | null>(null);

  // Password dialog state
  const [pwDialog, setPwDialog] = useState(false);
  const [pwTarget, setPwTarget] = useState<MockUser | null>(null);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Edit states
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // Form fields - user
  const [uName, setUName] = useState("");
  const [uUsername, setUUsername] = useState("");
  const [uRole, setURole] = useState("Student");
  const [uDept, setUDept] = useState("CS");
  const [uEmail, setUEmail] = useState("");
  const [uYear, setUYear] = useState("1st Year");
  const [uPassword, setUPassword] = useState("");
  const [showUPassword, setShowUPassword] = useState(false);

  // Form fields - dept
  const [dName, setDName] = useState("");
  const [dFullName, setDFullName] = useState("");
  const [dHod, setDHod] = useState("");

  // Form fields - course
  const [cCode, setCCode] = useState("");
  const [cName, setCName] = useState("");
  const [cDept, setCDept] = useState("1");
  const [cTeacher, setCTeacher] = useState("t1");
  const [cHours, setCHours] = useState("3");
  const [cColor, setCColor] = useState("#6366f1");

  // Form fields - room
  const [rName, setRName] = useState("");
  const [rCapacity, setRCapacity] = useState("60");
  const [rType, setRType] = useState<"Lecture" | "Lab" | "Seminar">("Lecture");

  // ---- Users CRUD ----
  const openAddUser = () => {
    setEditUser(null);
    setUName("");
    setUUsername("");
    setURole("Student");
    setUDept("CS");
    setUEmail("");
    setUYear("1st Year");
    setUPassword("");
    setShowUPassword(false);
    setUserDialog(true);
  };
  const openEditUser = (u: MockUser) => {
    setEditUser(u);
    setUName(u.name);
    setUUsername(u.username);
    setURole(u.role);
    setUDept(u.department);
    setUEmail(u.email);
    setUYear(u.year ?? "1st Year");
    setUserDialog(true);
  };
  const saveUser = () => {
    if (editUser) {
      setUsers((p) =>
        p.map((u) =>
          u.id === editUser.id
            ? {
                ...u,
                name: uName,
                username: uUsername,
                role: uRole,
                department: uDept,
                email: uEmail,
                year: uRole === "Student" ? uYear : undefined,
              }
            : u,
        ),
      );
      toast.success("User updated successfully");
    } else {
      const newUser: MockUser = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: uName,
        username: uUsername,
        password: uPassword || "changeme",
        role: uRole,
        department: uDept,
        email: uEmail,
        year: uRole === "Student" ? uYear : undefined,
      };
      setUsers((p) => [...p, newUser]);
      toast.success("User added successfully");
    }
    setUserDialog(false);
  };

  // ---- Password Management ----
  const openPasswordDialog = (u: MockUser) => {
    setPwTarget(u);
    setNewPw("");
    setConfirmPw("");
    setPwError("");
    setShowNewPw(false);
    setShowConfirmPw(false);
    setPwDialog(true);
  };
  const savePassword = () => {
    if (newPw.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    setUsers((p) =>
      p.map((u) => (u.id === pwTarget?.id ? { ...u, password: newPw } : u)),
    );
    toast.success("Password updated successfully");
    setPwDialog(false);
  };

  // ---- Dept CRUD ----
  const openAddDept = () => {
    setEditDept(null);
    setDName("");
    setDFullName("");
    setDHod("");
    setDeptDialog(true);
  };
  const openEditDept = (d: Department) => {
    setEditDept(d);
    setDName(d.name);
    setDFullName(d.fullName);
    setDHod(d.hodName);
    setDeptDialog(true);
  };
  const saveDept = () => {
    if (editDept) {
      updateDepartment({
        ...editDept,
        name: dName,
        fullName: dFullName,
        hodName: dHod,
      });
      toast.success("Department updated");
    } else {
      addDepartment({
        name: dName,
        fullName: dFullName,
        hodName: dHod,
        hodUsername: "",
        coursesCount: 0,
      });
      toast.success("Department added");
    }
    setDeptDialog(false);
  };

  // ---- Course CRUD ----
  const openAddCourse = () => {
    setEditCourse(null);
    setCCode("");
    setCName("");
    setCDept("1");
    setCTeacher("t1");
    setCHours("3");
    setCColor("#6366f1");
    setCourseDialog(true);
  };
  const openEditCourse = (c: Course) => {
    setEditCourse(c);
    setCCode(c.code);
    setCName(c.name);
    setCDept(c.departmentId.toString());
    setCTeacher(c.teacherId);
    setCHours(c.weeklyHours.toString());
    setCColor(c.color);
    setCourseDialog(true);
  };
  const saveCourse = () => {
    const teacherObj = teachers.find((t) => t.id === cTeacher);
    const teacherName = teacherObj?.name ?? cTeacher;
    const courseData = {
      code: cCode,
      name: cName,
      departmentId: Number.parseInt(cDept),
      teacherId: cTeacher,
      teacherName,
      weeklyHours: Number.parseInt(cHours),
      color: cColor,
    };
    if (editCourse) {
      updateCourse({ ...editCourse, ...courseData });
      toast.success("Course updated");
    } else {
      addCourse(courseData);
      toast.success("Course added");
    }
    setCourseDialog(false);
  };

  // ---- Room CRUD ----
  const openAddRoom = () => {
    setEditRoom(null);
    setRName("");
    setRCapacity("60");
    setRType("Lecture");
    setRoomDialog(true);
  };
  const openEditRoom = (r: Room) => {
    setEditRoom(r);
    setRName(r.name);
    setRCapacity(r.capacity.toString());
    setRType(r.type);
    setRoomDialog(true);
  };
  const saveRoom = () => {
    const roomData = {
      name: rName,
      capacity: Number.parseInt(rCapacity),
      type: rType,
    };
    if (editRoom) {
      updateRoom({ ...editRoom, ...roomData });
      toast.success("Room updated");
    } else {
      addRoom(roomData);
      toast.success("Room added");
    }
    setRoomDialog(false);
  };

  // ---- Delete ----
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "user")
      setUsers((p) => p.filter((u) => u.id !== deleteConfirm.id));
    if (deleteConfirm.type === "dept") deleteDepartment(deleteConfirm.id);
    if (deleteConfirm.type === "course") deleteCourse(deleteConfirm.id);
    if (deleteConfirm.type === "room") deleteRoom(deleteConfirm.id);
    toast.success(`${deleteConfirm.name} deleted`);
    setDeleteConfirm(null);
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Courses",
      value: courses.length,
      icon: BookOpen,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Rooms",
      value: rooms.length,
      icon: DoorOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <AppLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.title} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger
              value="users"
              data-ocid="admin.users_tab"
              className="gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              data-ocid="admin.departments_tab"
              className="gap-2"
            >
              <Building2 className="w-3.5 h-3.5" />
              Departments
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              data-ocid="admin.courses_tab"
              className="gap-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="rooms"
              data-ocid="admin.rooms_tab"
              className="gap-2"
            >
              <DoorOpen className="w-3.5 h-3.5" />
              Rooms
            </TabsTrigger>
            <TabsTrigger
              value="semester"
              data-ocid="admin.semester_tab"
              className="gap-2"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Semester
            </TabsTrigger>
          </TabsList>

          {/* ---- USERS TAB ---- */}
          <TabsContent value="users">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">User Management</CardTitle>
                  <Button
                    size="sm"
                    data-ocid="admin.add_user_button"
                    className="gap-1.5 bg-navy hover:bg-navy-light"
                    onClick={openAddUser}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.users_table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u, idx) => (
                        <TableRow key={u.id} data-ocid={`user.item.${idx + 1}`}>
                          <TableCell className="font-medium">
                            {u.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {u.username}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-gray-100 text-gray-700"}`}
                            >
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell>{u.department}</TableCell>
                          <TableCell>
                            {u.role === "Student" && u.year ? (
                              <Badge
                                variant="outline"
                                className="text-xs font-medium text-emerald-700 border-emerald-200 bg-emerald-50"
                              >
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {u.year}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.email}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`user.edit_button.${idx + 1}`}
                                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                                onClick={() => openEditUser(u)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`admin.change_password_button.${idx + 1}`}
                                className="w-7 h-7 text-muted-foreground hover:text-amber-600"
                                title="Change Password"
                                onClick={() => openPasswordDialog(u)}
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`user.delete_button.${idx + 1}`}
                                className="w-7 h-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "user",
                                    id: u.id,
                                    name: u.name,
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- DEPARTMENTS TAB ---- */}
          <TabsContent value="departments">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Department Management
                  </CardTitle>
                  <Button
                    size="sm"
                    data-ocid="admin.add_department_button"
                    className="gap-1.5 bg-navy hover:bg-navy-light"
                    onClick={openAddDept}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Department
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>HOD</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((d, idx) => (
                        <TableRow key={d.id} data-ocid={`dept.item.${idx + 1}`}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {d.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {d.fullName}
                          </TableCell>
                          <TableCell>{d.hodName}</TableCell>
                          <TableCell>{d.coursesCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`dept.edit_button.${idx + 1}`}
                                className="w-7 h-7"
                                onClick={() => openEditDept(d)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`dept.delete_button.${idx + 1}`}
                                className="w-7 h-7 hover:text-destructive"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "dept",
                                    id: d.id,
                                    name: d.fullName,
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- COURSES TAB ---- */}
          <TabsContent value="courses">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Course Management</CardTitle>
                  <Button
                    size="sm"
                    data-ocid="admin.add_course_button"
                    className="gap-1.5 bg-navy hover:bg-navy-light"
                    onClick={openAddCourse}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Hrs/Week</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((c, idx) => (
                        <TableRow
                          key={c.id}
                          data-ocid={`course.item.${idx + 1}`}
                        >
                          <TableCell>
                            <span
                              className="px-2 py-0.5 rounded text-xs font-bold text-white"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.code}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {c.name}
                          </TableCell>
                          <TableCell>
                            {
                              departments.find((d) => d.id === c.departmentId)
                                ?.name
                            }
                          </TableCell>
                          <TableCell className="text-sm">
                            {c.teacherName}
                          </TableCell>
                          <TableCell>{c.weeklyHours}h</TableCell>
                          <TableCell>
                            <div
                              className="w-5 h-5 rounded-full border border-border"
                              style={{ backgroundColor: c.color }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`course.edit_button.${idx + 1}`}
                                className="w-7 h-7"
                                onClick={() => openEditCourse(c)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`course.delete_button.${idx + 1}`}
                                className="w-7 h-7 hover:text-destructive"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "course",
                                    id: c.id,
                                    name: c.name,
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- SEMESTER TAB ---- */}
          <TabsContent value="semester">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  Semester & Academic Year
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Active banner */}
                <div className="rounded-xl bg-gradient-to-r from-navy to-navy-light p-4 text-white flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider font-medium">
                      Currently Active
                    </p>
                    <p className="text-lg font-display font-bold mt-0.5">
                      {semesterLabel}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                    <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                    Active
                  </Badge>
                </div>

                {/* Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Semester</Label>
                    <Select
                      value={semester}
                      onValueChange={(v) => setSemester(v as SemesterType)}
                    >
                      <SelectTrigger data-ocid="admin.semester.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Odd">Odd Semester</SelectItem>
                        <SelectItem value="Even">Even Semester</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Odd: July–November • Even: January–June
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Academic Year
                    </Label>
                    <Select
                      value={academicYear}
                      onValueChange={setAcademicYear}
                    >
                      <SelectTrigger data-ocid="admin.year.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACADEMIC_YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select the academic year for this semester
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    Changing the semester and year will update the label shown
                    across all modules — HOD Dashboard, Teacher Dashboard, and
                    Student Dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- ROOMS TAB ---- */}
          <TabsContent value="rooms">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Room Management</CardTitle>
                  <Button
                    size="sm"
                    data-ocid="admin.add_room_button"
                    className="gap-1.5 bg-navy hover:bg-navy-light"
                    onClick={openAddRoom}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Room
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((r, idx) => (
                        <TableRow key={r.id} data-ocid={`room.item.${idx + 1}`}>
                          <TableCell className="font-medium">
                            {r.name}
                          </TableCell>
                          <TableCell>{r.capacity} seats</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {r.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`room.edit_button.${idx + 1}`}
                                className="w-7 h-7"
                                onClick={() => openEditRoom(r)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                data-ocid={`room.delete_button.${idx + 1}`}
                                className="w-7 h-7 hover:text-destructive"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "room",
                                    id: r.id,
                                    name: r.name,
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ---- User Dialog ---- */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent data-ocid="admin.user_dialog">
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                data-ocid="admin.user.input"
                value={uName}
                onChange={(e) => setUName(e.target.value)}
                placeholder="e.g. Dr. Smith"
              />
            </div>
            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                data-ocid="admin.user.input"
                value={uUsername}
                onChange={(e) => setUUsername(e.target.value)}
                placeholder="e.g. smith_j"
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                data-ocid="admin.user.input"
                type="email"
                value={uEmail}
                onChange={(e) => setUEmail(e.target.value)}
                placeholder="e.g. smith@edu.in"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={uRole} onValueChange={setURole}>
                  <SelectTrigger data-ocid="admin.user.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Department</Label>
                <Select value={uDept} onValueChange={setUDept}>
                  <SelectTrigger data-ocid="admin.user.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="—">—</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name} — {d.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {uRole === "Student" && (
              <div className="space-y-1">
                <Label>Year</Label>
                <Select value={uYear} onValueChange={setUYear}>
                  <SelectTrigger data-ocid="admin.user.year_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!editUser && (
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    data-ocid="admin.user_password_input"
                    type={showUPassword ? "text" : "password"}
                    value={uPassword}
                    onChange={(e) => setUPassword(e.target.value)}
                    placeholder="Set initial password"
                    className="pr-9"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                    onClick={() => setShowUPassword((v) => !v)}
                  >
                    {showUPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.user.cancel_button"
              onClick={() => setUserDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.user.submit_button"
              className="bg-navy hover:bg-navy-light"
              onClick={saveUser}
            >
              {editUser ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Password Dialog ---- */}
      <Dialog open={pwDialog} onOpenChange={setPwDialog}>
        <DialogContent data-ocid="admin.password_dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {pwTarget && (
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">User: </span>
                <span className="font-medium">{pwTarget.name}</span>
                <span className="text-muted-foreground ml-2">
                  (@{pwTarget.username})
                </span>
              </div>
            )}
            <div className="space-y-1">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  data-ocid="admin.new_password_input"
                  type={showNewPw ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                    setPwError("");
                  }}
                  placeholder="Min. 6 characters"
                  className="pr-9"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowNewPw((v) => !v)}
                >
                  {showNewPw ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  data-ocid="admin.confirm_password_input"
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => {
                    setConfirmPw(e.target.value);
                    setPwError("");
                  }}
                  placeholder="Re-enter password"
                  className="pr-9"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowConfirmPw((v) => !v)}
                >
                  {showConfirmPw ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
            {pwError && (
              <p
                data-ocid="admin.password.error_state"
                className="text-sm text-destructive"
              >
                {pwError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.password.cancel_button"
              onClick={() => setPwDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.save_password_button"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={savePassword}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Dept Dialog ---- */}
      <Dialog open={deptDialog} onOpenChange={setDeptDialog}>
        <DialogContent data-ocid="admin.dept_dialog">
          <DialogHeader>
            <DialogTitle>
              {editDept ? "Edit Department" : "Add Department"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input
                  data-ocid="admin.dept.input"
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                  placeholder="e.g. IT"
                />
              </div>
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input
                  data-ocid="admin.dept.input"
                  value={dFullName}
                  onChange={(e) => setDFullName(e.target.value)}
                  placeholder="e.g. Information Technology"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>HOD Name</Label>
              <Input
                data-ocid="admin.dept.input"
                value={dHod}
                onChange={(e) => setDHod(e.target.value)}
                placeholder="e.g. Dr. Mehta"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.dept.cancel_button"
              onClick={() => setDeptDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.dept.submit_button"
              className="bg-navy hover:bg-navy-light"
              onClick={saveDept}
            >
              {editDept ? "Save Changes" : "Add Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Course Dialog ---- */}
      <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
        <DialogContent data-ocid="admin.course_dialog">
          <DialogHeader>
            <DialogTitle>
              {editCourse ? "Edit Course" : "Add Course"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input
                  data-ocid="admin.course.input"
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  placeholder="e.g. ML"
                />
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  data-ocid="admin.course.input"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g. Machine Learning"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Department</Label>
                <Select
                  value={cDept}
                  onValueChange={(v) => {
                    setCDept(v);
                    setCTeacher("");
                  }}
                >
                  <SelectTrigger data-ocid="admin.course.select">
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Teacher</Label>
                <Select value={cTeacher} onValueChange={setCTeacher}>
                  <SelectTrigger data-ocid="admin.course.select">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers
                      .filter(
                        (t) => t.departmentId === Number.parseInt(cDept || "0"),
                      )
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    {teachers.filter(
                      (t) => t.departmentId === Number.parseInt(cDept || "0"),
                    ).length === 0 && (
                      <SelectItem value="" disabled>
                        No teachers in this dept
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Weekly Hours</Label>
                <Input
                  data-ocid="admin.course.input"
                  type="number"
                  min="1"
                  max="10"
                  value={cHours}
                  onChange={(e) => setCHours(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cColor}
                    onChange={(e) => setCColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-border"
                  />
                  <span className="text-sm font-mono text-muted-foreground">
                    {cColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.course.cancel_button"
              onClick={() => setCourseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.course.submit_button"
              className="bg-navy hover:bg-navy-light"
              onClick={saveCourse}
            >
              {editCourse ? "Save Changes" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Room Dialog ---- */}
      <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
        <DialogContent data-ocid="admin.room_dialog">
          <DialogHeader>
            <DialogTitle>{editRoom ? "Edit Room" : "Add Room"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Room Name</Label>
              <Input
                data-ocid="admin.room.input"
                value={rName}
                onChange={(e) => setRName(e.target.value)}
                placeholder="e.g. Room 103"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Capacity</Label>
                <Input
                  data-ocid="admin.room.input"
                  type="number"
                  min="1"
                  value={rCapacity}
                  onChange={(e) => setRCapacity(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select
                  value={rType}
                  onValueChange={(v) =>
                    setRType(v as "Lecture" | "Lab" | "Seminar")
                  }
                >
                  <SelectTrigger data-ocid="admin.room.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.room.cancel_button"
              onClick={() => setRoomDialog(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.room.submit_button"
              className="bg-navy hover:bg-navy-light"
              onClick={saveRoom}
            >
              {editRoom ? "Save Changes" : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Delete Confirm ---- */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <AlertDialogContent data-ocid="admin.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteConfirm?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete.confirm_button"
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
