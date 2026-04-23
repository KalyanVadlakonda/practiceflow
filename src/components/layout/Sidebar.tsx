import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wand2,
  BookOpen,
  Users,
  Layout,
  Shapes,
  Settings,
  ChevronLeft,
  Target,
  CalendarDays,
  Bell,
  BarChart3,
  Database,
  Building2,
  FileEdit,
  History,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import { useState } from "react";

// ─── Nav structure ─────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children?: NavItem[];
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "",
    items: [
      { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Practice",
    items: [
      {
        to: "/app/generate",
        icon: Wand2,
        label: "Generate",
        children: [],
      },
      { to: "/app/practices", icon: History, label: "Plan History" },
      { to: "/app/calendar", icon: CalendarDays, label: "Season Planning" },
      { to: "/app/library", icon: BookOpen, label: "Drill Library" },
    ],
  },
  {
    label: "Team",
    items: [
      { to: "/app/teams", icon: Users, label: "Roster" },
      { to: "/app/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/app/platform/entity", icon: Database, label: "Entity Model" },
      { to: "/app/platform/org", icon: Building2, label: "Organization" },
      { to: "/app/platform/cms", icon: FileEdit, label: "Drill CMS" },
    ],
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  { to: "/app/notifications", icon: Bell, label: "Notifications" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

// ─── NavItem component ─────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}

function SidebarNavItem({ item, collapsed, depth = 0 }: NavItemProps) {
  const location = useLocation();
  const isActive =
    location.pathname === item.to ||
    (item.to !== "/app/dashboard" && location.pathname.startsWith(item.to));
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <NavLink
        to={item.to}
        onClick={hasChildren ? (e) => { e.preventDefault(); setOpen((o) => !o); } : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all group relative",
          depth > 0 && "ml-3 text-[13px]",
          isActive
            ? "bg-emerald-500/20 text-emerald-400"
            : "text-white/50 hover:bg-white/5 hover:text-white/80",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? item.label : undefined}
      >
        {/* Active indicator bar */}
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-emerald-500" />
        )}

        <item.icon
          className={cn(
            "shrink-0",
            collapsed ? "h-5 w-5" : "h-4 w-4",
            isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
          )}
        />

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap flex-1"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {hasChildren && !collapsed && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronDown className="h-3 w-3 text-white/30" />
          </motion.div>
        )}
      </NavLink>

      {/* Children */}
      {hasChildren && !collapsed && open && (
        <div className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <SidebarNavItem key={child.to} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const collapsed = !sidebarOpen;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden"
      style={{ background: "hsl(var(--sidebar-bg))" }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-white/8",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <Target className="h-4 w-4" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="font-heading font-bold text-sm text-white whitespace-nowrap leading-tight">
                Diamond
                <span className="text-emerald-400">OS</span>
              </div>
              <div className="text-[10px] text-white/30 whitespace-nowrap">
                Practice Orchestration
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 flex flex-col overflow-y-auto scrollbar-none py-2">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className="mb-1">
            {section.label && !collapsed && (
              <div className="nav-section-label">{section.label}</div>
            )}
            {section.label && collapsed && si > 0 && (
              <div className="my-2 mx-3 border-t border-white/10" />
            )}
            <div className="flex flex-col gap-0.5 px-2">
              {section.items.map((item) => (
                <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-0.5 px-2 py-2 border-t border-white/8">
        {BOTTOM_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/30 hover:bg-white/5 hover:text-white/60 transition-all",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="collapse-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap text-xs"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
