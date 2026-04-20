import { Link, useLocation } from "react-router-dom";
import { Bell, Moon, Sun, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store";

const ROUTE_LABELS: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/generate": "Generate Practice",
  "/app/library": "Drill Library",
  "/app/teams": "Teams & Roster",
  "/app/templates": "Templates",
  "/app/diagram-studio": "Diagram Studio",
  "/app/settings": "Settings",
};

function getLabel(pathname: string): string {
  if (pathname.startsWith("/app/practices/")) return "Practice Plan";
  if (pathname.startsWith("/app/run/")) return "Running Practice";
  return ROUTE_LABELS[pathname] ?? "PracticeFlow";
}

export function TopBar() {
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
  const location = useLocation();
  const label = getLabel(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur px-4 gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="hidden md:flex"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="font-semibold text-base text-foreground">{label}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/app/generate">
          <Button size="sm" variant="brand" className="hidden sm:flex gap-1.5">
            <Plus className="h-4 w-4" />
            New Practice
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
