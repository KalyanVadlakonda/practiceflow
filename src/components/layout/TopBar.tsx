import { Link, useLocation } from "react-router-dom";
import { Bell, PlayCircle, FileDown, Share2, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore, usePracticeStore } from "@/store";
import { cn } from "@/lib/utils";

// ─── Route metadata ────────────────────────────────────────────────────────────

interface RouteInfo {
  label: string;
  context?: string[];   // context breadcrumb tags
  actions?: "practice" | "library" | "none";
}

const ROUTE_MAP: Record<string, RouteInfo> = {
  "/app/dashboard":   { label: "Dashboard",       actions: "none" },
  "/app/generate":    { label: "Generate Practice", context: ["Wizard"], actions: "none" },
  "/app/library":     { label: "Drill Library",    context: ["Baseball", "Softball"], actions: "library" },
  "/app/teams":       { label: "Roster",           context: ["Team"], actions: "none" },
  "/app/analytics":   { label: "Analytics",        context: ["Team"], actions: "none" },
  "/app/templates":   { label: "Templates",        actions: "none" },
  "/app/calendar":    { label: "Season Planning",  context: ["Season"], actions: "none" },
  "/app/diagram-studio": { label: "Diagram Studio", actions: "none" },
  "/app/notifications":  { label: "Notifications", actions: "none" },
  "/app/settings":    { label: "Settings",         actions: "none" },
  "/app/platform/entity": { label: "Entity Data Model", context: ["Platform"], actions: "none" },
  "/app/platform/org":    { label: "Organization",      context: ["Platform"], actions: "none" },
  "/app/platform/cms":    { label: "Drill CMS",         context: ["Platform"], actions: "none" },
};

function getRouteInfo(pathname: string): RouteInfo {
  if (pathname.startsWith("/app/practices/")) {
    return { label: "Practice Plan", context: ["Practice"], actions: "practice" };
  }
  return ROUTE_MAP[pathname] ?? { label: "DiamondOS", actions: "none" };
}

// ─── TopBar ────────────────────────────────────────────────────────────────────

export function TopBar() {
  const { toggleSidebar } = useUIStore();
  const location = useLocation();
  const info = getRouteInfo(location.pathname);

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/8 backdrop-blur-md px-4 gap-4"
      style={{ background: "hsl(var(--topbar-bg) / 0.85)" }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-heading font-bold text-base text-white truncate">
            {info.label}
          </h1>
          {info.context?.map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-flex items-center rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[11px] font-medium text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: context actions */}
      <div className="flex items-center gap-2 shrink-0">
        {info.actions === "practice" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="hidden sm:flex gap-1.5 text-white/60 hover:text-white border border-white/12"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hidden sm:flex gap-1.5 text-white/60 hover:text-white border border-white/12"
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </Button>
            <Link to="/app/run/current">
              <Button size="sm" className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <PlayCircle className="h-3.5 w-3.5" />
                Run Mode
              </Button>
            </Link>
          </>
        )}

        {info.actions === "none" && (
          <Link to="/app/generate">
            <Button size="sm" className="hidden sm:flex gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              <Zap className="h-3.5 w-3.5" />
              New Practice
            </Button>
          </Link>
        )}

        {/* Notifications bell */}
        <Link to="/app/notifications">
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[hsl(var(--topbar-bg))]" />
          </button>
        </Link>
      </div>
    </header>
  );
}
