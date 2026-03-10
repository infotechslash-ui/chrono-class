import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Calendar, Download, GraduationCap, Sun } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import TimetableGrid from "../components/TimetableGrid";
import { useAuth } from "../context/AuthContext";
import { useDataStore } from "../context/DataStoreContext";
import { useSemester } from "../context/SemesterContext";
import { useTimetable } from "../context/TimetableContext";
import { TIME_SLOTS } from "../data/mockData";
import { printTimetable } from "../utils/printTimetable";

function getTodayId() {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[new Date().getDay()];
}

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

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { semesterLabel } = useSemester();
  const { timetable, timetableEC } = useTimetable();
  const { courses } = useDataStore();
  const todayId = getTodayId();
  const todayLabel = getTodayLabel();

  const studentDeptId = currentUser?.departmentId ?? 1;
  const activeTimetable = studentDeptId === 2 ? timetableEC : timetable;
  const deptLabel = studentDeptId === 2 ? "EC" : "CS";

  const handleDownload = () => {
    toast.success("Opening timetable PDF...");
    printTimetable({
      timetable: activeTimetable,
      title: `${deptLabel} Department — Class Timetable`,
      subtitle: `Student: ${currentUser?.name ?? "Student"} • ${currentUser?.year ?? "Student"} • ${semesterLabel}`,
    });
  };

  const deptCourses = courses.filter((c) => c.departmentId === studentDeptId);

  // Today's schedule
  const todaySchedule = TIME_SLOTS.filter((s) => !s.isBreak)
    .map((slot) => {
      const cell = activeTimetable.find(
        (c) => c.day === todayId && c.period === slot.id && c.courseId !== null,
      );
      const course = cell?.courseId
        ? courses.find((c) => c.id === cell.courseId)
        : null;
      return { slot, course };
    })
    .filter((item) => item.course !== null);

  // Total weekly periods
  const totalPeriods = activeTimetable.filter(
    (c) => c.courseId !== null,
  ).length;

  return (
    <AppLayout title={`Class Timetable — ${currentUser?.name ?? "Student"}`}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">
                {deptLabel} Department Timetable
              </h2>
              <p className="text-white/60 text-sm mt-0.5">
                Student: {currentUser?.name} • {currentUser?.year ?? "Student"}{" "}
                • {semesterLabel}
              </p>
            </div>
            <Button
              size="sm"
              data-ocid="student.download_button"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-1.5 w-fit"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Subjects",
              value: deptCourses.length,
              icon: BookOpen,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Periods/Week",
              value: totalPeriods,
              icon: Calendar,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Year",
              value: currentUser?.year ?? "—",
              icon: GraduationCap,
              color: "text-purple-600",
              bg: "bg-purple-50",
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
                  <p className="text-xl font-display font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Today's Schedule */}
        {todaySchedule.length > 0 ? (
          <Card className="shadow-card border-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-base">
                  Today — {todayLabel}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {todaySchedule.map(({ slot, course }) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: course!.color }}
                    >
                      {course!.code}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">
                        {course!.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
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
            <CardContent className="p-6 text-center">
              <Sun className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-medium">
                No classes today ({todayLabel})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Check the full schedule below for upcoming classes.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Course Legend */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Subject Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {deptCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-muted-foreground">— {c.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {c.teacherName.split(" ")[1]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Timetable */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base">
                  Full Weekly Timetable
                </CardTitle>
                <CardDescription>
                  {deptLabel} Department • {todayLabel} is highlighted
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                data-ocid="student.download_button"
                className="gap-1.5 no-print"
                onClick={handleDownload}
              >
                <Download className="w-3.5 h-3.5" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TimetableGrid
              timetable={activeTimetable}
              editable={false}
              highlightToday={true}
            />
          </CardContent>
        </Card>

        {/* Footer branding */}
        <footer className="text-center py-4 text-xs text-muted-foreground no-print">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </AppLayout>
  );
}
