import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  AlertCircle,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Download,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import TimetableGrid from "../components/TimetableGrid";
import { useAuth } from "../context/AuthContext";
import { useDataStore } from "../context/DataStoreContext";
import { useSemester } from "../context/SemesterContext";
import { useTimetable } from "../context/TimetableContext";
import type { Teacher } from "../data/mockData";
import { printTimetable } from "../utils/printTimetable";

function getCourseById(
  courses: import("../data/mockData").Course[],
  id: number,
  deptId: number,
) {
  return courses.find((c) => c.id === id && c.departmentId === deptId);
}

interface AddTeacherForm {
  name: string;
  username: string;
  specialization: string;
  maxLoad: string;
  courses: number[];
}

interface EditTeacherForm {
  name: string;
  specialization: string;
  maxLoad: string;
}

export default function HODDashboard() {
  const { currentUser } = useAuth();
  const { semesterLabel } = useSemester();
  const {
    departments,
    courses,
    rooms,
    teachers: allTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  } = useDataStore();
  const {
    timetable,
    timetableEC,
    updateCell,
    updateCellEC,
    resetTimetable,
    resetTimetableEC,
    generateForTeacher,
  } = useTimetable();

  const deptId = currentUser?.departmentId ?? 1;
  const dept = departments.find((d) => d.id === deptId);
  const deptName = dept?.fullName ?? "Department";

  // Local teachers state derived from context
  const teachers = allTeachers.filter((t) => t.departmentId === deptId);

  // Tab state
  const [activeTab, setActiveTab] = useState<"staff" | "timetable">("staff");

  // Selected teacher for targeted generation
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);

  // Add teacher dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddTeacherForm>({
    name: "",
    username: "",
    specialization: "",
    maxLoad: "12",
    courses: [],
  });

  // Edit teacher dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editForm, setEditForm] = useState<EditTeacherForm>({
    name: "",
    specialization: "",
    maxLoad: "12",
  });

  // Delete confirm dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  const deptCourses = courses.filter((c) => c.departmentId === deptId);
  const currentTimetable = deptId === 1 ? timetable : timetableEC;
  const currentUpdateCell = deptId === 1 ? updateCell : updateCellEC;
  const currentResetTimetable =
    deptId === 1 ? resetTimetable : resetTimetableEC;

  // ── Generation handlers ──────────────────────────────────────────────────

  const runGeneration = async (forTeacherId?: string) => {
    setGenerating(true);
    setGenerateProgress(0);

    const steps = [
      { progress: 15, msg: "Analyzing constraints..." },
      { progress: 35, msg: "Running Genetic Algorithm..." },
      { progress: 55, msg: "Applying Simulated Annealing..." },
      { progress: 75, msg: "Optimizing with OptaPlanner..." },
      { progress: 90, msg: "Validating conflict-free schedule..." },
      { progress: 100, msg: "Finalizing timetable..." },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 350));
      setGenerateProgress(step.progress);
    }

    await new Promise((r) => setTimeout(r, 400));

    if (forTeacherId) {
      generateForTeacher(forTeacherId, deptId);
      const teacher = teachers.find((t) => t.id === forTeacherId);
      setGeneratedFor(teacher?.name ?? forTeacherId);
      toast.success(`Timetable generated for ${teacher?.name ?? "teacher"}!`, {
        duration: 4000,
      });
    } else {
      currentResetTimetable();
      setGeneratedFor("full-dept");
      toast.success(
        "AI timetable generated successfully! Conflict-free schedule ready.",
        { duration: 4000 },
      );
    }

    setGenerating(false);
  };

  const handleFullGenerate = () => runGeneration();
  const handleGenerateForTeacher = () => {
    if (selectedTeacher) runGeneration(selectedTeacher.id);
  };

  const handleExportPDF = () => {
    toast.success("Opening timetable PDF...");
    printTimetable({
      timetable: currentTimetable,
      title: selectedTeacher
        ? `${selectedTeacher.name} — Timetable`
        : `${deptName} — Department Timetable`,
      subtitle: selectedTeacher
        ? `${selectedTeacher.specialization} • ${deptName} • ${semesterLabel}`
        : `HOD: ${currentUser?.name} • ${semesterLabel}`,
      filterTeacherId: selectedTeacher?.id,
    });
  };

  // ── Teacher name click ────────────────────────────────────────────────────

  const handleTeacherNameClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setGeneratedFor(null);
    setActiveTab("timetable");
  };

  const handleClearSelection = () => {
    setSelectedTeacher(null);
    setGeneratedFor(null);
  };

  // ── Add Teacher ───────────────────────────────────────────────────────────

  const handleAddTeacher = () => {
    if (!addForm.name.trim() || !addForm.username.trim()) {
      toast.error("Name and username are required");
      return;
    }
    const newTeacher: Teacher = {
      id: `t_custom_${Date.now()}`,
      name: addForm.name.trim(),
      username: addForm.username.trim(),
      specialization: addForm.specialization.trim(),
      departmentId: deptId,
      courses: addForm.courses,
      maxLoad: Number.parseInt(addForm.maxLoad) || 12,
      currentLoad: 0,
    };
    addTeacher(newTeacher);
    setAddDialogOpen(false);
    setAddForm({
      name: "",
      username: "",
      specialization: "",
      maxLoad: "12",
      courses: [],
    });
    toast.success(`${newTeacher.name} added to the department`);
  };

  const toggleAddCourse = (courseId: number) => {
    setAddForm((prev) => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter((id) => id !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  // ── Edit Teacher ──────────────────────────────────────────────────────────

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditForm({
      name: teacher.name,
      specialization: teacher.specialization,
      maxLoad: teacher.maxLoad.toString(),
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTeacher || !editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    updateTeacher({
      ...editingTeacher,
      name: editForm.name.trim(),
      specialization: editForm.specialization.trim(),
      maxLoad: Number.parseInt(editForm.maxLoad) || 12,
    });
    // If this was the selected teacher, update selected too
    if (selectedTeacher?.id === editingTeacher.id) {
      setSelectedTeacher((prev) =>
        prev
          ? {
              ...prev,
              name: editForm.name.trim(),
              specialization: editForm.specialization.trim(),
              maxLoad: Number.parseInt(editForm.maxLoad) || 12,
            }
          : null,
      );
    }
    setEditDialogOpen(false);
    setEditingTeacher(null);
    toast.success("Teacher details updated");
  };

  // ── Delete Teacher ────────────────────────────────────────────────────────

  const openDeleteDialog = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTeacher) return;
    deleteTeacher(deletingTeacher.id);
    if (selectedTeacher?.id === deletingTeacher.id) {
      setSelectedTeacher(null);
      setActiveTab("staff");
    }
    setDeleteDialogOpen(false);
    toast.success(`${deletingTeacher.name} removed from the department`);
    setDeletingTeacher(null);
  };

  return (
    <AppLayout title={`HOD Dashboard — ${deptName}`}>
      <div className="space-y-5 animate-fade-in">
        {/* Header banner */}
        <div className="rounded-xl bg-gradient-to-r from-navy to-navy-light p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">{deptName}</h2>
              <p className="text-white/60 text-sm mt-0.5">
                HOD: {currentUser?.name} • {semesterLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-teal/20 text-teal-light border-teal/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/20">
                {deptCourses.length} Courses
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Teachers",
              value: teachers.length,
              icon: Users,
              color: "text-blue-600",
            },
            {
              label: "Courses",
              value: deptCourses.length,
              icon: BookOpen,
              color: "text-teal",
            },
            {
              label: "Rooms Avail.",
              value: rooms.length,
              icon: AlertCircle,
              color: "text-amber-500",
            },
            {
              label: "Periods/Week",
              value: 48,
              icon: CheckCircle2,
              color: "text-green-600",
            },
          ].map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="p-3 flex items-center gap-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <div>
                  <p className="text-lg font-display font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "staff" | "timetable")}
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-10">
            <TabsTrigger
              value="staff"
              data-ocid="hod.staff_tab"
              className="gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Staff Management
            </TabsTrigger>
            <TabsTrigger
              value="timetable"
              data-ocid="hod.timetable_tab"
              className="gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              Timetable Editor
            </TabsTrigger>
          </TabsList>

          {/* ── Staff Management Tab ─────────────────────────────────────── */}
          <TabsContent value="staff" className="mt-4 space-y-4">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">
                        {deptName} Faculty
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Click a teacher's name to allocate their timetable
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    data-ocid="hod.add_teacher_button"
                    className="gap-1.5 bg-teal hover:bg-teal/90 text-white"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Teacher
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {teachers.length === 0 ? (
                  <div
                    className="p-10 text-center text-muted-foreground"
                    data-ocid="hod.staff.empty_state"
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">
                      No teachers in this department yet.
                    </p>
                    <p className="text-xs mt-1">
                      Click "Add Teacher" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Assigned Courses</TableHead>
                          <TableHead>Load</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teachers.map((t, idx) => (
                          <TableRow
                            key={t.id}
                            data-ocid={`hod.teacher.item.${idx + 1}`}
                            className="group"
                          >
                            <TableCell>
                              <button
                                type="button"
                                className="text-left group/name"
                                onClick={() => handleTeacherNameClick(t)}
                              >
                                <div className="font-semibold text-sm text-primary hover:text-teal transition-colors cursor-pointer group-hover/name:underline">
                                  {t.name}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  @{t.username}
                                </div>
                              </button>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {t.specialization}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {t.courses.map((cId) => {
                                  const course = getCourseById(
                                    courses,
                                    cId,
                                    deptId,
                                  );
                                  if (!course) return null;
                                  return (
                                    <span
                                      key={cId}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                                      style={{
                                        backgroundColor: course.color,
                                      }}
                                    >
                                      {course.code}
                                    </span>
                                  );
                                })}
                                {t.courses.length === 0 && (
                                  <span className="text-xs text-muted-foreground/50">
                                    None
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={(t.currentLoad / t.maxLoad) * 100}
                                  className="w-20 h-1.5"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {t.currentLoad}/{t.maxLoad}h
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  data-ocid={`hod.teacher.edit_button.${idx + 1}`}
                                  className="w-7 h-7 text-muted-foreground hover:text-foreground"
                                  onClick={() => openEditDialog(t)}
                                  title={`Edit ${t.name}`}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  data-ocid={`hod.teacher.delete_button.${idx + 1}`}
                                  className="w-7 h-7 text-muted-foreground hover:text-red-500"
                                  onClick={() => openDeleteDialog(t)}
                                  title={`Remove ${t.name}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Assignments */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base">
                    Course Assignments
                  </CardTitle>
                </div>
                <CardDescription>
                  {deptName} course–teacher mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deptCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.code}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.teacherName} • {c.weeklyHours}h/week
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Timetable Editor Tab ─────────────────────────────────────── */}
          <TabsContent value="timetable" className="mt-4 space-y-4">
            {/* Selected teacher banner */}
            {selectedTeacher && (
              <div className="rounded-xl bg-gradient-to-r from-purple-600/10 to-teal/10 border border-purple-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Viewing timetable for{" "}
                      <span className="text-purple-700">
                        {selectedTeacher.name}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTeacher.specialization} • Click "Run AI
                      Allocation" to generate their schedule
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    data-ocid="hod.generate_for_teacher_button"
                    className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleGenerateForTeacher}
                    disabled={generating}
                  >
                    {generating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {generating ? "Generating..." : "Run AI Allocation"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid="hod.clear_selection_button"
                    className="gap-1.5"
                    onClick={handleClearSelection}
                    disabled={generating}
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear / View Full Dept
                  </Button>
                </div>
              </div>
            )}

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">
                        {selectedTeacher
                          ? `${selectedTeacher.name}'s Timetable`
                          : "Department Timetable"}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {selectedTeacher
                          ? `Showing ${selectedTeacher.name}'s slots • highlighted in grid`
                          : `${deptName} • Click any cell to edit`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!selectedTeacher && (
                      <Button
                        variant="outline"
                        size="sm"
                        data-ocid="hod.generate_button"
                        className="gap-1.5 border-teal/40 text-teal hover:bg-teal/10 hover:text-teal"
                        onClick={handleFullGenerate}
                        disabled={generating}
                      >
                        {generating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {generating ? "Generating..." : "AI Generate"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      data-ocid="hod.export_pdf_button"
                      className="gap-1.5 bg-navy hover:bg-navy-light"
                      onClick={handleExportPDF}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                {/* Generation progress */}
                {generating && (
                  <div
                    className="mt-3 space-y-1.5"
                    data-ocid="hod.generate.loading_state"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <BrainCircuit className="w-3 h-3 text-teal animate-pulse" />
                        Running metaheuristic optimization...
                      </span>
                      <span className="font-mono">{generateProgress}%</span>
                    </div>
                    <Progress value={generateProgress} className="h-1.5" />
                  </div>
                )}

                {generatedFor && !generating && (
                  <div
                    className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-md"
                    data-ocid="hod.generate.success_state"
                  >
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                    {generatedFor === "full-dept"
                      ? "Conflict-free timetable generated using Genetic Algorithm + Simulated Annealing"
                      : `Timetable generated for ${generatedFor} using AI allocation`}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {deptCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-muted-foreground">
                        {c.code} — {c.name}
                      </span>
                    </div>
                  ))}
                </div>
                <TimetableGrid
                  timetable={currentTimetable}
                  editable={!selectedTeacher}
                  onUpdateCell={selectedTeacher ? undefined : currentUpdateCell}
                  filterTeacherId={
                    selectedTeacher ? selectedTeacher.id : undefined
                  }
                  highlightToday={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Add Teacher Dialog ─────────────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          data-ocid="hod.add_teacher.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">Full Name *</Label>
              <Input
                id="teacher-name"
                data-ocid="hod.add_teacher.input"
                placeholder="e.g. Prof. Kavita Nair"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-username">Username *</Label>
              <Input
                id="teacher-username"
                placeholder="e.g. teacher_5"
                value={addForm.username}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, username: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-spec">Specialization</Label>
              <Input
                id="teacher-spec"
                placeholder="e.g. Machine Learning"
                value={addForm.specialization}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, specialization: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-load">Max Weekly Load (hours)</Label>
              <Input
                id="teacher-load"
                type="number"
                min={1}
                max={20}
                value={addForm.maxLoad}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, maxLoad: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Courses</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {deptCourses.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`course-${c.id}`}
                      checked={addForm.courses.includes(c.id)}
                      onCheckedChange={() => toggleAddCourse(c.id)}
                    />
                    <Label
                      htmlFor={`course-${c.id}`}
                      className="text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.code}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="hod.add_teacher.cancel_button"
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="hod.add_teacher.submit_button"
              className="bg-teal hover:bg-teal/90 text-white"
              onClick={handleAddTeacher}
            >
              Add Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Teacher Dialog ────────────────────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="hod.edit_teacher.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Teacher — {editingTeacher?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-spec">Specialization</Label>
              <Input
                id="edit-spec"
                value={editForm.specialization}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    specialization: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-load">Max Weekly Load (hours)</Label>
              <Input
                id="edit-load"
                type="number"
                min={1}
                max={20}
                value={editForm.maxLoad}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, maxLoad: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="hod.edit_teacher.cancel_button"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="hod.edit_teacher.save_button"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ──────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="hod.delete_teacher.dialog"
        >
          <DialogHeader>
            <DialogTitle>Remove Teacher</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              {deletingTeacher?.name}
            </span>{" "}
            from the department? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="hod.delete_teacher.cancel_button"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="hod.delete_teacher.confirm_button"
              onClick={handleConfirmDelete}
            >
              Remove Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
