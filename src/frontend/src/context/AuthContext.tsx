import { type ReactNode, createContext, useContext, useState } from "react";
import type { UserRole } from "../data/mockData";
import { useUserStore } from "./UserStoreContext";

export interface DemoUser {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  departmentId?: number;
  teacherId?: string;
  year?: string;
}

interface AuthContextType {
  currentUser: DemoUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Department name -> id mapping
const DEPT_ID: Record<string, number> = { CS: 1, EC: 2 };
// teacher username -> teacherId
const TEACHER_ID: Record<string, string> = {
  teacher_1: "t1",
  teacher_2: "t2",
  teacher_3: "t3",
  teacher_4: "t4",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { findUser } = useUserStore();
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  const login = (username: string, password: string): boolean => {
    const mockUser = findUser(username.trim(), password);
    if (mockUser) {
      const demoUser: DemoUser = {
        username: mockUser.username,
        password: mockUser.password ?? "",
        role: mockUser.role as UserRole,
        name: mockUser.name,
        departmentId: DEPT_ID[mockUser.department],
        teacherId: TEACHER_ID[mockUser.username],
        year: mockUser.year,
      };
      setCurrentUser(demoUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
