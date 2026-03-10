import { type ReactNode, createContext, useContext, useState } from "react";

export type SemesterType = "Odd" | "Even";
export const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];

interface SemesterContextType {
  semester: SemesterType;
  academicYear: string;
  setSemester: (s: SemesterType) => void;
  setAcademicYear: (y: string) => void;
  semesterLabel: string;
}

const SemesterContext = createContext<SemesterContextType | undefined>(
  undefined,
);

export function SemesterProvider({ children }: { children: ReactNode }) {
  const [semester, setSemester] = useState<SemesterType>("Even");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const semesterLabel = `${semester} Semester ${academicYear}`;
  return (
    <SemesterContext.Provider
      value={{
        semester,
        academicYear,
        setSemester,
        setAcademicYear,
        semesterLabel,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
}

export function useSemester() {
  const ctx = useContext(SemesterContext);
  if (!ctx) throw new Error("useSemester must be used within SemesterProvider");
  return ctx;
}
