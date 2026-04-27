import { Link, useLocation } from "react-router-dom";
import { Bell, PlayCircle, FileDown, Share2, Menu, Zap } from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

// ─── Route metadata ────────────────────────────────────────────────────────────

interface RouteInfo {
  label: string;
  context?: string[];
  actions?: "practice" | "library" | "none";
}

const ROUTE_MAP: Record<string, RouteInfo> = {
  "/app/dashboard":      { label: "Dashboard",       actions: "none" },
  "/app/generate":       { label: "Generate Practice", context: ["Wizard"], actions: "none" },
  "/app/library":        { label: "Drill Library",    context: ["Baseball", "Softball"], actions: "library" },
  "/app/teams":          { label: "Roster",           context: ["Team"], actions: "none" },
  "/app/analytics":      { label: "Analytics",        context: ["Team"], actions: "none" },
  "/app/templates":      { label: "Templates",        actions: "none" },
  "/app/calendar":       { label: "Season Planning",  context: ["Season"], actions: "none" },
  "/app/diagram-studio": { label: "Diagram Studio",   actions: "none" },
  "/app/notifications":  { label: "Notifications",    actions: "none" },
  "/app/settings":       { label: "Settings",         actions: "none" },
  "/app/platform/entity": { label: "Entity Data Model", context: ["Platform"], actions: "none" },
  "/app/platform/org":    { label: "Organization",    context: ["Platform"], actions: "none" },
  "/app/platform/cms":   { label: "Drill CMS",        context: ["Platform"], actions: "none" },
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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 gap-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-heading font-bold text-base text-foreground truncate">
            {info.label}
          </h1>
          {info.context?.map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-flex items-center rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
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
            <button className="hidden sm:flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button className="hidden sm:flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </button>
            <Link to="/app/run/current">
              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
                <PlayCircle className="h-3.5 w-3.5" />
                Run Mode
              </button>
            </Link>
          </>
        )}

        {info.actions !== "practice" && (
          <Link to="/app/generate">
            <button className="hidden sm:flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors">
              <Zap className="h-3.5 w-3.5" />
              New Practice
            </button>
          </Link>
        )}

        {/* Notifications bell */}
        <Link to="/app/notifications">
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>
        </Link>
      </div>
    </header>
  );
}
