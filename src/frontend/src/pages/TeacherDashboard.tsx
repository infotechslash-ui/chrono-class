import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Globe,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import TimetableGrid from "../components/TimetableGrid";
import { useAuth } from "../context/AuthContext";
import { useDataStore } from "../context/DataStoreContext";
import { useSemester } from "../context/SemesterContext";
import { useTimetable } from "../context/TimetableContext";
import { DAYS, TIME_SLOTS } from "../data/mockData";
import { printTimetable } from "../utils/printTimetable";

function getTodayLabel() {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[new Date().getDay()];
}

function getTodayId() {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[new Date().getDay()];
}

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { semesterLabel } = useSemester();
  const { getTimetableForDept } = useTimetable();
  const { departments, courses } = useDataStore();

  const teacherId = currentUser?.teacherId ?? "t1";
  const teacherDeptId = currentUser?.departmentId ?? 1;

  // Get teacher's own timetable
  const myTimetable = getTimetableForDept(teacherDeptId);

  // View toggle: "my" | "overall"
  const [view, setView] = useState<"my" | "overall">("my");
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    teacherDeptId.toString(),
  );

  const overallDeptId = Number.parseInt(selectedDeptId);
  const overallTimetable = getTimetableForDept(overallDeptId);
  const overallDept = departments.find((d) => d.id === overallDeptId);
  const overallCourses = courses.filter(
    (c) => c.departmentId === overallDeptId,
  );

  const handleDownload = () => {
    if (view === "my") {
      toast.success("Opening timetable PDF...");
      const dept = departments.find((d) => d.id === teacherDeptId);
      printTimetable({
        timetable: myTimetable,
        title: `${currentUser?.name ?? "Teacher"} — Weekly Timetable`,
        subtitle: `${dept?.fullName ?? "Department"} • ${semesterLabel}`,
        filterTeacherId: teacherId,
      });
    } else {
      toast.success("Opening department timetable PDF...");
      printTimetable({
        timetable: overallTimetable,
        title: `${overallDept?.fullName ?? "Department"} — Class Timetable`,
        subtitle: `HOD: ${overallDept?.hodName} • ${semesterLabel}`,
      });
    }
  };

  const todayId = getTodayId();
  const todayLabel = getTodayLabel();

  // Get today's schedule for this teacher
  const todaySchedule = TIME_SLOTS.filter((s) => !s.isBreak)
    .map((slot) => {
      const cell = myTimetable.find(
        (c) =>
          c.day === todayId &&
          c.period === slot.id &&
          c.teacherId === teacherId,
      );
      const course = cell?.courseId
        ? courses.find((c) => c.id === cell.courseId)
        : null;
      return { slot, course };
    })
    .filter((item) => item.course !== null);

  // Get this teacher's courses
  const myCourses = courses.filter((c) => c.teacherId === teacherId);

  // Count weekly periods for this teacher
  const weeklyPeriods = myTimetable.filter(
    (c) => c.teacherId === teacherId && c.courseId !== null,
  ).length;

  return (
    <AppLayout title={`My Timetable — ${currentUser?.name ?? "Teacher"}`}>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">
                {currentUser?.name}
              </h2>
              <p className="text-white/60 text-sm mt-0.5">
                {departments.find((d) => d.id === teacherDeptId)?.fullName ??
                  "Department"}{" "}
                • {semesterLabel}
              </p>
            </div>
            <Button
              size="sm"
              data-ocid="teacher.download_button"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5 w-fit"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* View Toggle + Dept Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "my" | "overall")}
          >
            <TabsList className="h-9">
              <TabsTrigger
                value="my"
                data-ocid="teacher.my_timetable_tab"
                className="gap-1.5 text-xs"
              >
                <User className="w-3.5 h-3.5" />
                My Timetable
              </TabsTrigger>
              <TabsTrigger
                value="overall"
                data-ocid="teacher.overall_timetable_tab"
                className="gap-1.5 text-xs"
              >
                <Globe className="w-3.5 h-3.5" />
                Overall Timetable
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {view === "overall" && (
            <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
              <SelectTrigger
                className="w-full sm:w-56 h-9 text-sm"
                data-ocid="teacher.dept_select"
              >
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name} — {d.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* ── MY TIMETABLE VIEW ─────────────────────────────────────────────── */}
        {view === "my" && (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Courses",
                  value: myCourses.length,
                  icon: BookOpen,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Periods/Week",
                  value: weeklyPeriods,
                  icon: Calendar,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Hours/Week",
                  value: myCourses.reduce((s, c) => s + c.weeklyHours, 0),
                  icon: Clock,
                  color: "text-teal",
                  bg: "bg-teal-50",
                },
                {
                  label: "Today's Classes",
                  value: todaySchedule.length,
                  icon: Sun,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((s) => (
                <Card key={s.label} className="shadow-card">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${s.bg}`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-display font-bold">
                        {s.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's Schedule */}
            {todaySchedule.length > 0 ? (
              <Card className="shadow-card border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <CardTitle className="text-base">
                      Today's Schedule — {todayLabel}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {todaySchedule.map(({ slot, course }) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: course!.color }}
                        >
                          {course!.code}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{course!.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {slot.label} • {slot.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <Sun className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    No classes today ({todayLabel})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enjoy your free day!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* My Courses */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Courses</CardTitle>
                <CardDescription>
                  Assigned subjects this semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {myCourses.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg border-l-4 border border-border"
                      style={{ borderLeftColor: c.color }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold text-white px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.code}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5">
                          {c.weeklyHours}h/week
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{c.name}</p>
                    </div>
                  ))}
                  {myCourses.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-3 py-4 text-center">
                      No courses assigned yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Full Timetable */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base">Weekly Schedule</CardTitle>
                    <CardDescription>
                      Your classes highlighted • {todayLabel} is today
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid="teacher.download_button"
                    className="gap-1.5 no-print"
                    onClick={handleDownload}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {myCourses.map((c) => (
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
                  timetable={myTimetable}
                  filterTeacherId={teacherId}
                  editable={false}
                  highlightToday={true}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── OVERALL TIMETABLE VIEW ────────────────────────────────────────── */}
        {view === "overall" && (
          <div className="space-y-5">
            {/* Dept header */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {overallDept?.fullName ?? "Department"} — Class Timetable
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    HOD: {overallDept?.hodName} • All teachers & courses visible
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="teacher.download_button"
                  className="gap-1.5 w-fit"
                  onClick={handleDownload}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download / Print
                </Button>
              </div>
            </div>

            {/* Overall Timetable */}
            <Card
              className="shadow-card"
              data-ocid="teacher.overall_timetable.table"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {overallDept?.name} Department — Full Weekly Schedule
                </CardTitle>
                <CardDescription>
                  {overallCourses.length} courses • {DAYS.length} teaching days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {overallCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-muted-foreground font-medium">
                        {c.code}
                      </span>
                      <span className="text-muted-foreground/60 hidden sm:inline">
                        — {c.name}
                      </span>
                    </div>
                  ))}
                </div>

                <TimetableGrid
                  timetable={overallTimetable}
                  editable={false}
                  highlightToday={true}
                />

                {/* Teachers legend */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Faculty
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {overallCourses
                      .reduce<{ teacherId: string; teacherName: string }[]>(
                        (acc, c) => {
                          if (!acc.find((a) => a.teacherId === c.teacherId)) {
                            acc.push({
                              teacherId: c.teacherId,
                              teacherName: c.teacherName,
                            });
                          }
                          return acc;
                        },
                        [],
                      )
                      .map(({ teacherId: tid, teacherName }) => (
                        <div
                          key={tid}
                          className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1 rounded-full"
                        >
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span>{teacherName}</span>
                          <span className="text-muted-foreground/60 font-mono">
                            ({tid})
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
