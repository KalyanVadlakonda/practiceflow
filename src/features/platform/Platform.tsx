import { useParams, NavLink, Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Database,
  Building2,
  FileEdit,
  ChevronRight,
  Layers,
  Tag,
  GitBranch,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Entity Model page ────────────────────────────────────────────────────────

const ENTITY_TIERS = [
  {
    tier: 1,
    name: "Practice Plan",
    description: "Top-level container for a session's complete structure",
    children: 1,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    tier: 2,
    name: "Session",
    description: "A time-boxed unit within a practice (e.g., Morning block)",
    children: 1,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    tier: 3,
    name: "Group",
    description: "A subset of players sharing drills (by position, skill, etc.)",
    children: 1,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    tier: 4,
    name: "Station",
    description: "A physical location or equipment setup (e.g., Cage 1, Outfield)",
    children: 1,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    tier: 5,
    name: "Circuit",
    description: "A repeating rotation of drills with defined rep counts",
    children: 1,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
  {
    tier: 6,
    name: "Circuit Drill",
    description: "A single drill within a circuit — has duration, coaching note, diagram",
    children: 0,
    color: "text-white/60",
    bg: "bg-white/8",
  },
];

function EntityModel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-white">Entity Data Model</h3>
        <p className="text-sm text-white/40 mt-1">
          Six-tier hierarchy that structures every DiamondOS practice plan.
        </p>
      </div>

      {/* Hierarchy visualization */}
      <div className="dos-card p-6 space-y-2">
        {ENTITY_TIERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ paddingLeft: `${(t.tier - 1) * 28}px` }}
            className="flex items-start gap-3"
          >
            {/* Connector lines */}
            {t.tier > 1 && (
              <div className="flex items-center shrink-0">
                <div className="w-4 border-b border-white/15" />
              </div>
            )}

            <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3 flex-1", t.bg)}>
              <div className={cn("text-xs font-bold w-5 text-center shrink-0 opacity-60", t.color)}>
                T{t.tier}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn("font-medium text-sm", t.color)}>{t.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{t.description}</div>
              </div>
              {t.children > 0 && (
                <div className="text-[10px] text-white/30 shrink-0 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  contains {t.tier + 1 <= 6 ? ENTITY_TIERS[t.tier].name : ""}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Field reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Core Fields",    icon: Database, items: ["id", "name", "duration_minutes", "sport", "skill_level", "age_group"] },
          { title: "Relationships",  icon: GitBranch, items: ["parent_id", "children[]", "assigned_coaches[]", "players[]"] },
          { title: "Metadata",       icon: Tag, items: ["created_at", "updated_at", "tags[]", "ai_notes", "diagram_id"] },
        ].map((section) => (
          <div key={section.title} className="dos-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="h-4 w-4 text-white/40" />
              <span className="text-sm font-medium text-white">{section.title}</span>
            </div>
            <div className="space-y-1.5">
              {section.items.map((field) => (
                <div key={field} className="rounded-lg bg-white/5 px-3 py-1.5 text-[12px] font-mono text-white/60">
                  {field}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Organization page ────────────────────────────────────────────────────────

const ORG_MEMBERS = [
  { name: "Coach Rivera",    email: "rivera@team.com",  role: "Head Coach", status: "active" },
  { name: "Coach Williams",  email: "cwill@team.com",   role: "Pitching",   status: "active" },
  { name: "Assistant Zhao",  email: "zhao@team.com",    role: "Fielding",   status: "active" },
  { name: "Trainer Patel",   email: "patel@team.com",   role: "Trainer",    status: "invited" },
];

function Organization() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg text-white">Organization</h3>
          <p className="text-sm text-white/40 mt-1">Manage coaches, roles, and team access.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Invite member
        </button>
      </div>

      <div className="dos-card divide-y divide-white/8">
        {ORG_MEMBERS.map((m, i) => (
          <div key={m.email} className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-semibold text-white/70 shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{m.name}</div>
              <div className="text-xs text-white/40">{m.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">{m.role}</span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                m.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
              )}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Drill CMS page ───────────────────────────────────────────────────────────

const CMS_DRILLS = [
  { id: "D-001", name: "Four-Corner Fielding",  cat: "Fielding",  sport: "Both",    status: "published" },
  { id: "D-002", name: "Soft Toss Hitting",     cat: "Hitting",   sport: "Both",    status: "published" },
  { id: "D-003", name: "Partner Throws",        cat: "Throwing",  sport: "Both",    status: "published" },
  { id: "D-004", name: "Live At-Bat Sim",       cat: "Hitting",   sport: "Baseball", status: "draft" },
  { id: "D-005", name: "Pitcher Fielding PFP",  cat: "Fielding",  sport: "Baseball", status: "published" },
  { id: "D-006", name: "Slap Hitting Drill",    cat: "Hitting",   sport: "Softball", status: "published" },
];

function DrillCMS() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg text-white">Drill CMS</h3>
          <p className="text-sm text-white/40 mt-1">Manage and publish drills to the library.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          New drill
        </button>
      </div>

      {/* Search/filter bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
          <Search className="h-3.5 w-3.5 text-white/30" />
          <input
            placeholder="Search drills..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      <div className="dos-card divide-y divide-white/8">
        <div className="grid grid-cols-[80px_1fr_100px_100px_80px_48px] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          <span>ID</span><span>Name</span><span>Category</span><span>Sport</span><span>Status</span><span />
        </div>
        {CMS_DRILLS.map((drill, i) => (
          <motion.div
            key={drill.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[80px_1fr_100px_100px_80px_48px] items-center px-5 py-3.5 hover:bg-white/4 cursor-pointer transition-colors"
          >
            <span className="font-mono text-xs text-white/40">{drill.id}</span>
            <span className="text-sm font-medium text-white">{drill.name}</span>
            <span className="text-xs text-white/50">{drill.cat}</span>
            <span className="text-xs text-white/50">{drill.sport}</span>
            <span className={cn(
              "text-[10px] font-medium rounded-full px-2 py-0.5 w-fit",
              drill.status === "published"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-amber-500/15 text-amber-400"
            )}>
              {drill.status}
            </span>
            <button className="flex items-center justify-center h-7 w-7 rounded-lg text-white/30 hover:bg-white/8 hover:text-white/70 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Router-aware Platform wrapper ────────────────────────────────────────────

interface PlatformProps {
  page?: "entity" | "org" | "cms";
}

export function Platform({ page }: PlatformProps) {
  const SUB_NAV = [
    { to: "/app/platform/entity", label: "Entity Model", icon: Database },
    { to: "/app/platform/org",    label: "Organization", icon: Building2 },
    { to: "/app/platform/cms",    label: "Drill CMS",    icon: FileEdit },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-nav pills */}
      <div className="flex gap-1 border-b border-white/8 pb-4">
        {SUB_NAV.map((n) => {
          const isActive = page === n.to.split("/").pop();
          return (
            <NavLink
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-white/40 hover:bg-white/6 hover:text-white/70"
              )}
            >
              <n.icon className="h-3.5 w-3.5" />
              {n.label}
            </NavLink>
          );
        })}
      </div>

      {/* Page content */}
      {page === "entity" && <EntityModel />}
      {page === "org"    && <Organization />}
      {page === "cms"    && <DrillCMS />}
    </div>
  );
}
