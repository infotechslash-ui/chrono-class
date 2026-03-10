import { type ReactNode, createContext, useContext, useState } from "react";
import {
  COURSES,
  DAYS,
  MOCK_TIMETABLE,
  MOCK_TIMETABLE_EC,
  TEACHERS,
  type TimetableCell,
} from "../data/mockData";

interface TimetableContextType {
  timetable: TimetableCell[];
  timetableEC: TimetableCell[];
  updateCell: (cell: TimetableCell) => void;
  updateCellEC: (cell: TimetableCell) => void;
  resetTimetable: () => void;
  resetTimetableEC: () => void;
  generateForTeacher: (teacherId: string, departmentId: number) => void;
  getTimetableForDept: (departmentId: number) => TimetableCell[];
}

const TimetableContext = createContext<TimetableContextType | undefined>(
  undefined,
);

const PERIODS = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];

// Shuffle an array using Fisher-Yates
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function TimetableProvider({ children }: { children: ReactNode }) {
  const [timetable, setTimetable] = useState<TimetableCell[]>(MOCK_TIMETABLE);
  const [timetableEC, setTimetableEC] =
    useState<TimetableCell[]>(MOCK_TIMETABLE_EC);

  const updateCell = (updated: TimetableCell) => {
    setTimetable((prev) =>
      prev.map((cell) =>
        cell.day === updated.day && cell.period === updated.period
          ? updated
          : cell,
      ),
    );
  };

  const updateCellEC = (updated: TimetableCell) => {
    setTimetableEC((prev) =>
      prev.map((cell) =>
        cell.day === updated.day && cell.period === updated.period
          ? updated
          : cell,
      ),
    );
  };

  const resetTimetable = () => {
    setTimetable(MOCK_TIMETABLE);
  };

  const resetTimetableEC = () => {
    setTimetableEC(MOCK_TIMETABLE_EC);
  };

  // Simulates AI-based teacher schedule generation by redistributing
  // the teacher's course slots across days evenly while keeping other slots intact
  const generateForTeacher = (teacherId: string, departmentId: number) => {
    const teacher = TEACHERS.find((t) => t.id === teacherId);
    if (!teacher) return;

    const teacherCourses = COURSES.filter(
      (c) => c.teacherId === teacherId && c.departmentId === departmentId,
    );

    const setFn = departmentId === 1 ? setTimetable : setTimetableEC;
    const baseTimetable =
      departmentId === 1 ? MOCK_TIMETABLE : MOCK_TIMETABLE_EC;

    setFn((prevTimetable) => {
      // Collect existing teacher slots (for reference — not used directly)

      // Build an expanded list of course instances matching weekly hours
      const courseInstances: { courseId: number; roomId: number }[] = [];
      for (const course of teacherCourses) {
        // Use weeklyHours as number of occurrences per week
        for (let i = 0; i < course.weeklyHours; i++) {
          courseInstances.push({
            courseId: course.id,
            roomId: course.id % 2 === 0 ? 2 : 1,
          });
        }
      }

      // Create available slot pool: all days × PERIODS minus slots occupied by other teachers
      const allSlots: { day: string; period: string }[] = [];
      for (const day of DAYS) {
        for (const period of PERIODS) {
          const cell = prevTimetable.find(
            (c) => c.day === day.id && c.period === period,
          );
          // Slot is available if it belongs to this teacher OR is free
          if (!cell || cell.teacherId === teacherId || !cell.courseId) {
            allSlots.push({ day: day.id, period });
          }
        }
      }

      // Shuffle available slots for random redistribution
      const shuffledSlots = shuffleArray(allSlots);

      // Clear teacher's old slots from timetable base
      let newTimetable = prevTimetable.map((cell) => {
        if (cell.teacherId === teacherId) {
          return {
            ...cell,
            courseId: null,
            roomId: null,
            teacherId: null,
          };
        }
        return cell;
      });

      // Assign course instances to shuffled slots
      const assignedCount = Math.min(
        courseInstances.length,
        shuffledSlots.length,
      );
      for (let i = 0; i < assignedCount; i++) {
        const { day, period } = shuffledSlots[i];
        const { courseId, roomId } = courseInstances[i];

        // Find if cell exists, update it; otherwise skip (shouldn't happen with full grid)
        const existsIdx = newTimetable.findIndex(
          (c) => c.day === day && c.period === period,
        );
        if (existsIdx >= 0) {
          newTimetable = newTimetable.map((cell, idx) =>
            idx === existsIdx ? { ...cell, courseId, roomId, teacherId } : cell,
          );
        } else {
          newTimetable = [
            ...newTimetable,
            { day, period, courseId, roomId, teacherId },
          ];
        }
      }

      // Ensure all day×period combos exist in timetable
      for (const day of DAYS) {
        for (const p of PERIODS) {
          if (!newTimetable.find((c) => c.day === day.id && c.period === p)) {
            newTimetable = [
              ...newTimetable,
              {
                day: day.id,
                period: p,
                courseId: null,
                roomId: null,
                teacherId: null,
              },
            ];
          }
        }
      }

      // Suppress unused warning
      void baseTimetable;

      return newTimetable;
    });
  };

  const getTimetableForDept = (departmentId: number): TimetableCell[] => {
    if (departmentId === 1) return timetable;
    if (departmentId === 2) return timetableEC;
    return timetable;
  };

  return (
    <TimetableContext.Provider
      value={{
        timetable,
        timetableEC,
        updateCell,
        updateCellEC,
        resetTimetable,
        resetTimetableEC,
        generateForTeacher,
        getTimetableForDept,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const ctx = useContext(TimetableContext);
  if (!ctx)
    throw new Error("useTimetable must be used within TimetableProvider");
  return ctx;
}
