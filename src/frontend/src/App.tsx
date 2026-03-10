import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataStoreProvider } from "./context/DataStoreContext";
import { SemesterProvider } from "./context/SemesterContext";
import { TimetableProvider } from "./context/TimetableContext";
import { UserStoreProvider } from "./context/UserStoreContext";
import AdminDashboard from "./pages/AdminDashboard";
import HODDashboard from "./pages/HODDashboard";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

function RoleRouter() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  switch (currentUser.role) {
    case "Admin":
      return <AdminDashboard />;
    case "HOD":
      return <HODDashboard />;
    case "Teacher":
      return <TeacherDashboard />;
    case "Student":
      return <StudentDashboard />;
    default:
      return <LoginPage />;
  }
}

export default function App() {
  return (
    <UserStoreProvider>
      <DataStoreProvider>
        <AuthProvider>
          <SemesterProvider>
            <TimetableProvider>
              <RoleRouter />
              <Toaster richColors position="top-right" />
            </TimetableProvider>
          </SemesterProvider>
        </AuthProvider>
      </DataStoreProvider>
    </UserStoreProvider>
  );
}
