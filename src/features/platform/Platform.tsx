import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, Building2, FileEdit, ChevronRight, Layers, Tag, GitBranch, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Entity Model ─────────────────────────────────────────────────────────────

const ENTITY_TIERS = [
  { tier: 1, name: "Practice Plan",  description: "Top-level container for a session's complete structure",                     color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  { tier: 2, name: "Session",        description: "A time-boxed unit within a practice (e.g., Morning block)",                  color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200" },
  { tier: 3, name: "Group",          description: "A subset of players sharing drills (by position, skill, etc.)",              color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200" },
  { tier: 4, name: "Station",        description: "A physical location or equipment setup (e.g., Cage 1, Outfield)",            color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" },
  { tier: 5, name: "Circuit",        description: "A repeating rotation of drills with defined rep counts",                     color: "text-pink-700",    bg: "bg-pink-50",     border: "border-pink-200" },
  { tier: 6, name: "Circuit Drill",  description: "A single drill within a circuit — has duration, coaching note, diagram",     color: "text-slate-700",   bg: "bg-slate-50",    border: "border-slate-200" },
];

function EntityModel() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading text-lg text-foreground">Entity Data Model</h3>
        <p className="text-sm text-muted-foreground mt-1">Six-tier hierarchy that structures every DiamondOS practice plan.</p>
      </div>
      <div className="dos-card p-6 space-y-2">
        {ENTITY_TIERS.map((t, i) => (
          <motion.div key={t.name}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            style={{ paddingLeft: `${(t.tier - 1) * 28}px` }}
            className="flex items-start gap-3"
          >
            {t.tier > 1 && <div className="flex items-center shrink-0"><div className="w-4 border-b border-slate-200" /></div>}
            <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3 flex-1 border", t.bg, t.border)}>
              <div className={cn("text-xs font-bold w-5 text-center shrink-0 opacity-60", t.color)}>T{t.tier}</div>
              <div className="flex-1 min-w-0">
                <div className={cn("font-semibold text-sm", t.color)}>{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Core Fields",   icon: Database,   items: ["id", "name", "duration_minutes", "sport", "skill_level", "age_group"] },
          { title: "Relationships", icon: GitBranch,  items: ["parent_id", "children[]", "assigned_coaches[]", "players[]"] },
          { title: "Metadata",      icon: Tag,        items: ["created_at", "updated_at", "tags[]", "ai_notes", "diagram_id"] },
        ].map((s) => (
          <div key={s.title} className="dos-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{s.title}</span>
            </div>
            <div className="space-y-1.5">
              {s.items.map((f) => (
                <div key={f} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[12px] font-mono text-slate-600">{f}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Organization ─────────────────────────────────────────────────────────────

const ORG_MEMBERS = [
  { name: "Coach Rivera",   email: "rivera@team.com", role: "Head Coach", status: "active" },
  { name: "Coach Williams", email: "cwill@team.com",  role: "Pitching",   status: "active" },
  { name: "Assistant Zhao", email: "zhao@team.com",   role: "Fielding",   status: "active" },
  { name: "Trainer Patel",  email: "patel@team.com",  role: "Trainer",    status: "invited" },
];

function Organization() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg text-foreground">Organization</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage coaches, roles, and team access.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors">
          <Plus className="h-3.5 w-3.5" />Invite member
        </button>
      </div>
      <div className="dos-card divide-y">
        {ORG_MEMBERS.map((m) => (
          <div key={m.email} className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{m.role}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium",
                m.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
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

// ─── Drill CMS ────────────────────────────────────────────────────────────────

const CMS_DRILLS = [
  { id: "D-001", name: "Four-Corner Fielding",  cat: "Fielding",  sport: "Both",     status: "published" },
  { id: "D-002", name: "Soft Toss Hitting",     cat: "Hitting",   sport: "Both",     status: "published" },
  { id: "D-003", name: "Partner Throws",        cat: "Throwing",  sport: "Both",     status: "published" },
  { id: "D-004", name: "Live At-Bat Sim",       cat: "Hitting",   sport: "Baseball", status: "draft" },
  { id: "D-005", name: "Pitcher Fielding PFP",  cat: "Fielding",  sport: "Baseball", status: "published" },
  { id: "D-006", name: "Slap Hitting Drill",    cat: "Hitting",   sport: "Softball", status: "published" },
];

function DrillCMS() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg text-foreground">Drill CMS</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage and publish drills to the library.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors">
          <Plus className="h-3.5 w-3.5" />New drill
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 rounded-lg border bg-card px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input placeholder="Search drills…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Filter className="h-3.5 w-3.5" />Filter
        </button>
      </div>
      <div className="dos-card divide-y">
        <div className="grid grid-cols-[80px_1fr_100px_100px_80px_40px] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
          <span>ID</span><span>Name</span><span>Category</span><span>Sport</span><span>Status</span><span />
        </div>
        {CMS_DRILLS.map((drill, i) => (
          <motion.div key={drill.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[80px_1fr_100px_100px_80px_40px] items-center px-5 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <span className="font-mono text-xs text-muted-foreground">{drill.id}</span>
            <span className="text-sm font-medium text-foreground">{drill.name}</span>
            <span className="text-xs text-muted-foreground">{drill.cat}</span>
            <span className="text-xs text-muted-foreground">{drill.sport}</span>
            <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5 w-fit",
              drill.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              {drill.status}
            </span>
            <button className="flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Platform wrapper ─────────────────────────────────────────────────────────

export function Platform({ page }: { page?: "entity" | "org" | "cms" }) {
  const SUB_NAV = [
    { to: "/app/platform/entity", label: "Entity Model", icon: Database },
    { to: "/app/platform/org",    label: "Organization", icon: Building2 },
    { to: "/app/platform/cms",    label: "Drill CMS",    icon: FileEdit },
  ];
  return (
    <div className="space-y-5">
      <div className="flex gap-1 border-b pb-4">
        {SUB_NAV.map((n) => {
          const active = page === n.to.split("/").pop();
          return (
            <NavLink key={n.to} to={n.to}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                active ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <n.icon className="h-3.5 w-3.5" />{n.label}
            </NavLink>
          );
        })}
      </div>
      {page === "entity" && <EntityModel />}
      {page === "org"    && <Organization />}
      {page === "cms"    && <DrillCMS />}
    </div>
  );
}
