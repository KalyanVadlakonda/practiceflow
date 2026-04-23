import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wand2,
  Clock,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  FileText,
  CalendarDays,
  AlertTriangle,
  TrendingDown,
  Bell,
  Zap,
  BarChart3,
  Star,
} from "lucide-react";
import { usePracticeStore, useTeamStore } from "@/store";
import { formatMinutes, AGE_GROUP_LABELS, CATEGORY_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.32 },
  }),
};

// ─── Quick notification items (pinned alerts) ──────────────────────────────────

const PINNED_ALERTS = [
  {
    type: "safety",
    message: "Marcus T. approaching pitch limit (82/85)",
    action: "View profile",
  },
  {
    type: "safety",
    message: "Jordan K. reported arm soreness today",
    action: "Review",
  },
  {
    type: "engagement",
    message: "Attendance dipped to 70% this week (-18%)",
    action: "See analytics",
  },
];

// ─── Upcoming events ───────────────────────────────────────────────────────────

const UPCOMING = [
  { date: "Apr 13", label: "Fielding Focus Practice",   type: "practice", time: "4:00 PM" },
  { date: "Apr 15", label: "vs. River Hawks",            type: "game",     time: "5:30 PM" },
  { date: "Apr 17", label: "Hitting Session",            type: "practice", time: "4:00 PM" },
  { date: "Apr 19", label: "vs. Storm Chasers (scrim.)", type: "scrimmage", time: "10:00 AM" },
];

const EVENT_DOT: Record<string, string> = {
  practice:  "bg-emerald-500",
  game:      "bg-blue-400",
  scrimmage: "bg-amber-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Dashboard() {
  const practices     = usePracticeStore((s) => s.practices);
  const teams         = useTeamStore((s) => s.teams);
  const activeTeamId  = useTeamStore((s) => s.activeTeamId);
  const activeTeam    = teams.find((t) => t.id === activeTeamId) ?? teams[0];
  const recentPractices = practices.slice(0, 4);
  const savedPlans    = practices.filter((p) => p.status === "saved").length;
  const avgDuration   = practices.length > 0
    ? Math.round(practices.reduce((a, p) => a + p.totalMinutes, 0) / practices.length)
    : 0;
  const totalDrills   = practices.reduce((a, p) => a + p.blocks.length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero row */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Good morning, Coach
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {activeTeam
              ? `${activeTeam.name} · ${AGE_GROUP_LABELS[activeTeam.ageGroup]} ${activeTeam.sport}`
              : "Spring 2026 Season"}
          </p>
        </div>
        <Link to="/app/generate">
          <button className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-emerald-500/20">
            <Zap className="h-4 w-4" />
            Generate Practice
          </button>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: FileText,   label: "Saved Plans",    value: savedPlans,              sub: "this season",   color: "text-blue-400",   bg: "bg-blue-500/15" },
          { icon: Users,      label: "Active Roster",  value: activeTeam?.players.length ?? 0, sub: "players", color: "text-violet-400", bg: "bg-violet-500/15" },
          { icon: Clock,      label: "Avg Practice",   value: avgDuration > 0 ? formatMinutes(avgDuration) : "–", sub: "per session", color: "text-emerald-400", bg: "bg-emerald-500/15" },
          { icon: TrendingUp, label: "Drills Used",    value: totalDrills,             sub: "total blocks",  color: "text-amber-400",  bg: "bg-amber-500/15" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="dos-card p-4"
          >
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg mb-3", s.bg)}>
              <s.icon className={cn("h-4 w-4", s.color)} />
            </div>
            <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main content: 2/3 + 1/3 layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left column: recent practices + quick actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent practices */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <span className="font-heading font-bold text-sm text-white">Recent Practices</span>
              <Link to="/app/practices" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View all
              </Link>
            </div>
            <div className="divide-y divide-white/6">
              {recentPractices.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Target className="h-8 w-8 mx-auto text-white/20 mb-2" />
                  <p className="text-sm text-white/40">No practices yet</p>
                  <Link to="/app/generate">
                    <button className="mt-3 rounded-lg bg-emerald-500/20 text-emerald-400 px-4 py-2 text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                      Generate First Practice
                    </button>
                  </Link>
                </div>
              ) : (
                recentPractices.map((p) => (
                  <Link key={p.id} to={`/app/practices/${p.id}`}>
                    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/4 transition-colors cursor-pointer">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                        <CalendarDays className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">{p.title}</p>
                        <p className="text-xs text-white/40">
                          {formatMinutes(p.totalMinutes)} · {p.blocks.length} drills
                          {p.goals.length > 0 && " · " + p.goals.slice(0, 2).map((g) => CATEGORY_LABELS[g] ?? g).join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          "text-[10px] font-medium rounded-full px-2 py-0.5",
                          p.status === "saved" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/50"
                        )}>
                          {p.status}
                        </span>
                        <Link to={`/app/run/${p.id}`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/80 transition-colors">
                            <Play className="h-3.5 w-3.5" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick start tiles */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Quick Start</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Wand2,     title: "Generate",     desc: "AI-powered practice in seconds", to: "/app/generate",  accent: true },
                { icon: FileText,  title: "Templates",    desc: "Start from a proven structure",   to: "/app/templates", accent: false },
                { icon: BarChart3, title: "Analytics",    desc: "Team performance at a glance",    to: "/app/analytics", accent: false },
              ].map((item, i) => (
                <Link key={item.to} to={item.to}>
                  <div className={cn(
                    "dos-card p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card-lg",
                    item.accent && "border-emerald-500/30 bg-emerald-500/8"
                  )}>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg mb-3",
                      item.accent ? "bg-emerald-500/20 text-emerald-400" : "bg-white/8 text-white/50"
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-sm text-white">{item.title}</div>
                    <div className="text-xs text-white/40 mt-0.5">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: notifications + upcoming */}
        <div className="space-y-4">
          {/* Safety & Engagement alerts */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-white/40" />
                <span className="font-heading font-bold text-xs text-white">Alerts</span>
              </div>
              <Link to="/app/notifications" className="text-[11px] text-emerald-400 hover:text-emerald-300">
                See all
              </Link>
            </div>
            <div className="divide-y divide-white/6">
              {PINNED_ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <div className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    a.type === "safety" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  )}>
                    {a.type === "safety"
                      ? <AlertTriangle className="h-2.5 w-2.5" />
                      : <TrendingDown className="h-2.5 w-2.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 leading-snug">{a.message}</p>
                    <button className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors">
                      {a.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming events */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-white/40" />
                <span className="font-heading font-bold text-xs text-white">Upcoming</span>
              </div>
              <Link to="/app/calendar" className="text-[11px] text-emerald-400 hover:text-emerald-300">
                Calendar
              </Link>
            </div>
            <div className="divide-y divide-white/6">
              {UPCOMING.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn("h-2 w-2 rounded-full shrink-0", EVENT_DOT[ev.type] ?? "bg-white/20")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{ev.label}</p>
                    <p className="text-[11px] text-white/40">{ev.time}</p>
                  </div>
                  <span className="text-[11px] text-white/30 shrink-0">{ev.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team snapshot */}
          {activeTeam && (
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} className="dos-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-xs text-white">
                  {activeTeam.name}
                </span>
                <Link to="/app/teams" className="text-[11px] text-emerald-400 hover:text-emerald-300">
                  Roster
                </Link>
              </div>
              <div className="flex gap-4 text-center mb-3">
                {[
                  { label: "Players", value: activeTeam.players.length },
                  { label: "Coaches", value: activeTeam.coaches.length },
                ].map((s) => (
                  <div key={s.label} className="flex-1 rounded-lg bg-white/5 py-2">
                    <div className="font-heading text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTeam.players.slice(0, 10).map((p) => (
                  <div
                    key={p.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/60"
                    title={p.name}
                  >
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                ))}
                {activeTeam.players.length > 10 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-[10px] text-white/30">
                    +{activeTeam.players.length - 10}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
