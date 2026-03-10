import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  Clock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  onBack?: (() => void) | null;
  showBack?: boolean;
}

const roleConfig = {
  Admin: {
    color: "bg-red-500",
    icon: LayoutDashboard,
    nav: [
      { label: "Dashboard", href: "#dashboard" },
      { label: "Users", href: "#users" },
      { label: "Departments", href: "#departments" },
      { label: "Courses", href: "#courses" },
      { label: "Rooms", href: "#rooms" },
    ],
  },
  HOD: {
    color: "bg-purple-500",
    icon: BrainCircuit,
    nav: [
      { label: "Dashboard", href: "#dashboard" },
      { label: "Teachers", href: "#teachers" },
      { label: "Timetable", href: "#timetable" },
      { label: "Courses", href: "#courses" },
    ],
  },
  Teacher: {
    color: "bg-blue-500",
    icon: BookOpen,
    nav: [
      { label: "My Timetable", href: "#timetable" },
      { label: "My Courses", href: "#courses" },
    ],
  },
  Student: {
    color: "bg-green-500",
    icon: GraduationCap,
    nav: [
      { label: "Timetable", href: "#timetable" },
      { label: "Courses", href: "#courses" },
    ],
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AppLayout({
  children,
  title,
  onBack,
  showBack = false,
}: AppLayoutProps) {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const config = roleConfig[currentUser.role];
  const RoleIcon = config.icon;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col
          bg-navy text-sidebar-foreground
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal/20">
            <img
              src="/assets/generated/chrono-class-logo-transparent.dim_200x200.png"
              alt="Chrono Class"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white leading-tight">
              Chrono Class
            </div>
            <div className="text-[10px] text-sidebar-foreground/50 leading-tight">
              Smart Scheduling
            </div>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="text-xs font-bold bg-teal/30 text-teal-light">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-sidebar-foreground/50 truncate">
                @{currentUser.username}
              </div>
            </div>
          </div>
          <div className="mt-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${config.color}`}
            >
              <RoleIcon className="w-2.5 h-2.5" />
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {config.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-ocid="nav.link"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-teal/50" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          {(showBack || onBack) && (
            <Button
              variant="ghost"
              size="sm"
              data-ocid="nav.back_button"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
              onClick={onBack ?? undefined}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Page
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            data-ocid="nav.logout_button"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center gap-3 px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0 no-print">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-8 h-8"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>

          {(showBack || onBack) && (
            <Button
              variant="ghost"
              size="icon"
              data-ocid="nav.back_button"
              className="hidden lg:flex w-8 h-8 text-muted-foreground hover:text-foreground"
              onClick={onBack ?? undefined}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal" />
            <h1 className="font-display font-bold text-sm sm:text-base text-foreground truncate">
              {title}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex text-xs">
              {currentUser.role}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              data-ocid="nav.logout_button"
              className="w-8 h-8 text-muted-foreground hover:text-red-500"
              onClick={logout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
