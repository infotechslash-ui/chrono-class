import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Department {
    id: bigint;
    hodUserId?: Principal;
    name: string;
}
export interface CreateDepartmentRequest {
    hodUserId?: Principal;
    name: string;
}
export interface CreateRoomRequest {
    name: string;
    capacity: bigint;
    roomType: RoomType;
}
export interface CreateCourseRequest {
    code: string;
    name: string;
    color: string;
    weeklyHours: bigint;
    departmentId: bigint;
}
export interface TimetableEntry {
    id: bigint;
    day: Day;
    period: Period;
    teacherId?: Principal;
    roomId: bigint;
    courseId: bigint;
    departmentId: bigint;
}
export interface Room {
    id: bigint;
    name: string;
    capacity: bigint;
    roomType: RoomType;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    departmentId?: bigint;
}
export interface Course {
    id: bigint;
    code: string;
    name: string;
    color: string;
    weeklyHours: bigint;
    teacherId?: Principal;
    departmentId: bigint;
}
export enum Day {
    fri = "fri",
    mon = "mon",
    sat = "sat",
    thu = "thu",
    tue = "tue",
    wed = "wed"
}
export enum Period {
    p1 = "p1",
    p2 = "p2",
    p3 = "p3",
    p4 = "p4",
    p5 = "p5",
    p6 = "p6",
    p7 = "p7",
    p8 = "p8"
}
export enum RoomType {
    lab = "lab",
    seminar = "seminar",
    lecture = "lecture"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTeacherToCourse(courseId: bigint, teacherId: Principal): Promise<void>;
    createCourse(request: CreateCourseRequest): Promise<void>;
    createDepartment(request: CreateDepartmentRequest): Promise<void>;
    createRoom(request: CreateRoomRequest): Promise<void>;
    getAllDepartments(): Promise<Array<Department>>;
    getAllRooms(): Promise<Array<Room>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoursesByDepartment(departmentId: bigint): Promise<Array<Course>>;
    getCoursesByTeacher(teacherId: Principal): Promise<Array<Course>>;
    getTimetableByDepartment(departmentId: bigint): Promise<Array<TimetableEntry>>;
    getTimetableByTeacher(teacherId: Principal): Promise<Array<TimetableEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
