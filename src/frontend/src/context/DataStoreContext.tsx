import { type ReactNode, createContext, useContext, useState } from "react";
import {
  COURSES,
  type Course,
  DEPARTMENTS,
  type Department,
  ROOMS,
  type Room,
  TEACHERS,
  type Teacher,
} from "../data/mockData";

interface DataStoreContextType {
  departments: Department[];
  courses: Course[];
  rooms: Room[];
  teachers: Teacher[];
  // Departments
  addDepartment: (d: Omit<Department, "id">) => Department;
  updateDepartment: (d: Department) => void;
  deleteDepartment: (id: number) => void;
  // Courses
  addCourse: (c: Omit<Course, "id">) => Course;
  updateCourse: (c: Course) => void;
  deleteCourse: (id: number) => void;
  // Rooms
  addRoom: (r: Omit<Room, "id">) => Room;
  updateRoom: (r: Room) => void;
  deleteRoom: (id: number) => void;
  // Teachers
  addTeacher: (t: Omit<Teacher, "id">) => Teacher;
  updateTeacher: (t: Teacher) => void;
  deleteTeacher: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(
  undefined,
);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);

  // -- Departments --
  const addDepartment = (d: Omit<Department, "id">) => {
    const nd: Department = {
      ...d,
      id: Math.max(0, ...departments.map((x) => x.id)) + 1,
    };
    setDepartments((p) => [...p, nd]);
    return nd;
  };
  const updateDepartment = (d: Department) =>
    setDepartments((p) => p.map((x) => (x.id === d.id ? d : x)));
  const deleteDepartment = (id: number) =>
    setDepartments((p) => p.filter((x) => x.id !== id));

  // -- Courses --
  const addCourse = (c: Omit<Course, "id">) => {
    const nc: Course = {
      ...c,
      id: Math.max(0, ...courses.map((x) => x.id)) + 1,
    };
    setCourses((p) => [...p, nc]);
    return nc;
  };
  const updateCourse = (c: Course) =>
    setCourses((p) => p.map((x) => (x.id === c.id ? c : x)));
  const deleteCourse = (id: number) =>
    setCourses((p) => p.filter((x) => x.id !== id));

  // -- Rooms --
  const addRoom = (r: Omit<Room, "id">) => {
    const nr: Room = { ...r, id: Math.max(0, ...rooms.map((x) => x.id)) + 1 };
    setRooms((p) => [...p, nr]);
    return nr;
  };
  const updateRoom = (r: Room) =>
    setRooms((p) => p.map((x) => (x.id === r.id ? r : x)));
  const deleteRoom = (id: number) =>
    setRooms((p) => p.filter((x) => x.id !== id));

  // -- Teachers --
  const addTeacher = (t: Omit<Teacher, "id">) => {
    const nt: Teacher = {
      ...t,
      id: `t${Math.max(0, ...teachers.map((x) => Number.parseInt(x.id.replace("t", "") || "0"))) + 1}`,
    };
    setTeachers((p) => [...p, nt]);
    return nt;
  };
  const updateTeacher = (t: Teacher) =>
    setTeachers((p) => p.map((x) => (x.id === t.id ? t : x)));
  const deleteTeacher = (id: string) =>
    setTeachers((p) => p.filter((x) => x.id !== id));

  return (
    <DataStoreContext.Provider
      value={{
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
        addTeacher,
        updateTeacher,
        deleteTeacher,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx)
    throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
