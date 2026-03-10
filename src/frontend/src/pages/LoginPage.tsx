import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  BrainCircuit,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

const DEMO_CREDS = [
  { role: "Admin", username: "admin", password: "admin123", color: "#ef4444" },
  { role: "HOD", username: "hod_cs", password: "hod123", color: "#8b5cf6" },
  {
    role: "Teacher",
    username: "teacher_1",
    password: "teacher123",
    color: "#3b82f6",
  },
  {
    role: "Student",
    username: "student_1",
    password: "student123",
    color: "#10b981",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const success = login(username.trim(), password);
    if (!success) {
      setError("Invalid username or password. Try the demo credentials below.");
    }
    setLoading(false);
  };

  const fillCreds = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-slate-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo & branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 ring-1 ring-white/20">
            <img
              src="/assets/generated/chrono-class-logo-transparent.dim_200x200.png"
              alt="Chrono Class"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Chrono Class
          </h1>
          <p className="text-white/60 text-sm">
            AI-Powered Intelligent Timetable Scheduling
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <BrainCircuit className="w-3 h-3 text-teal/80" />
            <span className="text-[11px] text-teal/80 font-medium">
              Powered by Metaheuristic Algorithms
            </span>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            Sign In
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Access your role-based dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                data-ocid="login.input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-ocid="login.input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="py-2"
                data-ocid="login.error_state"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              data-ocid="login.submit_button"
              className="w-full h-10 bg-navy hover:bg-navy-light font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="flex items-center gap-1 px-2 whitespace-nowrap">
                  Demo Credentials
                  <ChevronDown className="w-3 h-3" />
                </span>
                <div className="flex-1 h-px bg-border" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {DEMO_CREDS.map((cred) => (
                    <button
                      key={cred.role}
                      type="button"
                      onClick={() => fillCreds(cred.username, cred.password)}
                      className="text-left p-2.5 rounded-lg border border-border hover:border-teal hover:bg-teal/5 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cred.color }}
                        />
                        <span className="text-xs font-semibold text-foreground">
                          {cred.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {cred.username} / {cred.password}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/70 text-center mt-2">
                  Click any card to auto-fill credentials
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-[11px] mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-teal/70 hover:text-teal underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
