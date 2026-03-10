import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useDataStore } from "../context/DataStoreContext";
import { DAYS, TIME_SLOTS, type TimetableCell } from "../data/mockData";

interface TimetableGridProps {
  timetable: TimetableCell[];
  editable?: boolean;
  filterTeacherId?: string;
  onUpdateCell?: (cell: TimetableCell) => void;
  highlightToday?: boolean;
  compact?: boolean;
}

function getTodayId() {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[new Date().getDay()];
}

export default function TimetableGrid({
  timetable,
  editable = false,
  filterTeacherId,
  onUpdateCell,
  highlightToday = true,
  compact = false,
}: TimetableGridProps) {
  const { courses, rooms } = useDataStore();
  const getCourseById = (id: number | null) => {
    if (!id) return null;
    return courses.find((c) => c.id === id) ?? null;
  };
  const getRoomById = (id: number | null) => {
    if (!id) return null;
    return rooms.find((r) => r.id === id) ?? null;
  };
  const [editingCell, setEditingCell] = useState<TimetableCell | null>(null);
  const [editCourseId, setEditCourseId] = useState<string>("");
  const [editRoomId, setEditRoomId] = useState<string>("");
  const [editTeacherId, setEditTeacherId] = useState<string>("");

  const todayId = getTodayId();

  const getCell = (day: string, period: string): TimetableCell | undefined => {
    return timetable.find((c) => c.day === day && c.period === period);
  };

  const handleCellClick = (day: string, period: string) => {
    if (!editable) return;
    const cell = getCell(day, period) ?? {
      day,
      period,
      courseId: null,
      roomId: null,
      teacherId: null,
    };
    setEditingCell(cell);
    setEditCourseId(cell.courseId?.toString() ?? "none");
    setEditRoomId(cell.roomId?.toString() ?? "none");
    setEditTeacherId(cell.teacherId ?? "none");
  };

  const handleSaveEdit = () => {
    if (!editingCell || !onUpdateCell) return;
    const cId = editCourseId !== "none" ? Number.parseInt(editCourseId) : null;
    const rId = editRoomId !== "none" ? Number.parseInt(editRoomId) : null;
    const tId = editTeacherId !== "none" ? editTeacherId : null;
    onUpdateCell({
      ...editingCell,
      courseId: cId,
      roomId: rId,
      teacherId: tId,
    });
    setEditingCell(null);
  };

  // For determining if a teacher cell should show
  const shouldShowCell = (cell: TimetableCell | undefined) => {
    if (!filterTeacherId) return true;
    if (!cell) return false;
    return cell.teacherId === filterTeacherId;
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px] border-collapse text-sm timetable-print">
          <thead>
            <tr className="bg-navy text-white">
              <th className="w-28 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-sidebar-border/50">
                Period
              </th>
              {DAYS.map((day) => (
                <th
                  key={day.id}
                  className={`px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    highlightToday && day.id === todayId
                      ? "bg-teal/80 text-white"
                      : ""
                  }`}
                >
                  <span className="hidden sm:block">{day.label}</span>
                  <span className="sm:hidden">{day.short}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, slotIdx) => {
              if (slot.isBreak) {
                return (
                  <tr
                    key={slot.id}
                    className={`${
                      slot.breakType === "lunch" ? "bg-amber-50" : "bg-gray-50"
                    }`}
                  >
                    <td
                      colSpan={7}
                      className="px-3 py-1.5 text-center text-xs font-medium text-muted-foreground border-b border-border"
                    >
                      <span className="font-semibold">{slot.label}</span>{" "}
                      <span className="text-muted-foreground/70">
                        {slot.time}
                      </span>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={slot.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2 border-r border-border bg-muted/20">
                    <div className="font-semibold text-xs text-foreground">
                      {slot.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {slot.time}
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const cell = getCell(day.id, slot.id);
                    const course = getCourseById(cell?.courseId ?? null);
                    const room = getRoomById(cell?.roomId ?? null);
                    const isToday = highlightToday && day.id === todayId;
                    const showForTeacher = shouldShowCell(cell);

                    const ocidIndex = slotIdx * 6 + DAYS.indexOf(day) + 1;

                    return (
                      <td
                        key={day.id}
                        data-ocid={`timetable.cell.${ocidIndex}`}
                        className={`px-1.5 py-1.5 text-center min-w-[90px] ${
                          isToday ? "bg-teal/5" : ""
                        } ${editable ? "cursor-pointer hover:bg-accent/20" : ""}`}
                        onClick={() =>
                          editable && handleCellClick(day.id, slot.id)
                        }
                        onKeyDown={(e) =>
                          editable &&
                          e.key === "Enter" &&
                          handleCellClick(day.id, slot.id)
                        }
                      >
                        {course && showForTeacher ? (
                          <div
                            className={`inline-flex flex-col items-center px-1.5 py-1 rounded-md text-white w-full ${
                              compact ? "gap-0" : "gap-0.5"
                            }`}
                            style={{ backgroundColor: course.color }}
                          >
                            <span className="text-[11px] font-bold leading-tight">
                              {course.code}
                            </span>
                            {!compact && room && (
                              <span className="text-[9px] opacity-80 leading-tight">
                                {room.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">
                            {filterTeacherId && cell?.courseId ? "—" : "Free"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {editable && (
        <Dialog
          open={!!editingCell}
          onOpenChange={(open) => !open && setEditingCell(null)}
        >
          <DialogContent className="sm:max-w-md" data-ocid="timetable.dialog">
            <DialogHeader>
              <DialogTitle>Edit Timetable Cell</DialogTitle>
            </DialogHeader>
            {editingCell && (
              <div className="space-y-4 py-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold capitalize">
                    {editingCell.day}
                  </span>{" "}
                  — {TIME_SLOTS.find((s) => s.id === editingCell.period)?.label}{" "}
                  ({TIME_SLOTS.find((s) => s.id === editingCell.period)?.time})
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={editCourseId} onValueChange={setEditCourseId}>
                    <SelectTrigger data-ocid="timetable.select">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Free —</SelectItem>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.code} — {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Room</Label>
                  <Select value={editRoomId} onValueChange={setEditRoomId}>
                    <SelectTrigger data-ocid="timetable.select">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— No Room —</SelectItem>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name} ({r.type}, Cap: {r.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select
                    value={editTeacherId}
                    onValueChange={setEditTeacherId}
                  >
                    <SelectTrigger data-ocid="timetable.select">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— No Teacher —</SelectItem>
                      <SelectItem value="t1">Prof. Ramesh (t1)</SelectItem>
                      <SelectItem value="t2">Prof. Priya (t2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                data-ocid="timetable.cancel_button"
                onClick={() => setEditingCell(null)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="timetable.save_button"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
