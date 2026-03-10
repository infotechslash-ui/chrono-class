import { type ReactNode, createContext, useContext, useState } from "react";
import { MOCK_USERS, type MockUser } from "../data/mockData";

interface UserStoreContextType {
  users: MockUser[];
  setUsers: React.Dispatch<React.SetStateAction<MockUser[]>>;
  findUser: (username: string, password: string) => MockUser | undefined;
  updatePassword: (id: number, newPassword: string) => void;
}

const UserStoreContext = createContext<UserStoreContextType | undefined>(
  undefined,
);

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);

  const findUser = (username: string, password: string) =>
    users.find((u) => u.username === username && u.password === password);

  const updatePassword = (id: number, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, password: newPassword } : u)),
    );
  };

  return (
    <UserStoreContext.Provider
      value={{ users, setUsers, findUser, updatePassword }}
    >
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUserStore() {
  const ctx = useContext(UserStoreContext);
  if (!ctx)
    throw new Error("useUserStore must be used within UserStoreProvider");
  return ctx;
}
