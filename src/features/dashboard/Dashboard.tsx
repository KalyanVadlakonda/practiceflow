import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wand2, Clock, Users, Target, TrendingUp, TrendingDown,
  ChevronRight, Play, FileText, CalendarDays, AlertTriangle,
  Bell, Zap, BarChart3,
} from "lucide-react";
import { usePracticeStore, useTeamStore } from "@/store";
import { formatMinutes, AGE_GROUP_LABELS, CATEGORY_LABELS, cn } from "@/lib/utils";

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

const PINNED_ALERTS = [
  { type: "safety",     message: "Marcus T. approaching pitch limit (82/85)",       action: "View profile" },
  { type: "safety",     message: "Jordan K. reported arm soreness today",           action: "Review" },
  { type: "engagement", message: "Attendance dipped to 70% this week (–18%)",       action: "See analytics" },
];

const UPCOMING = [
  { date: "Apr 27", label: "Fielding Focus Practice",    type: "practice",  time: "4:00 PM" },
  { date: "Apr 29", label: "vs. River Hawks",             type: "game",      time: "5:30 PM" },
  { date: "May 1",  label: "Hitting Session",             type: "practice",  time: "4:00 PM" },
  { date: "May 3",  label: "vs. Storm Chasers (scrim.)", type: "scrimmage", time: "10:00 AM" },
];

const EVENT_COLOR: Record<string, string> = {
  practice:  "bg-emerald-500",
  game:      "bg-blue-500",
  scrimmage: "bg-amber-500",
};

export function Dashboard() {
  const practices    = usePracticeStore((s) => s.practices);
  const teams        = useTeamStore((s) => s.teams);
  const activeTeamId = useTeamStore((s) => s.activeTeamId);
  const activeTeam   = teams.find((t) => t.id === activeTeamId) ?? teams[0];
  const recent       = practices.slice(0, 4);
  const saved        = practices.filter((p) => p.status === "saved").length;
  const avgMin       = practices.length
    ? Math.round(practices.reduce((a, p) => a + p.totalMinutes, 0) / practices.length)
    : 0;
  const totalDrills  = practices.reduce((a, p) => a + p.blocks.length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-2xl text-foreground">Good morning, Coach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTeam ? `${activeTeam.name} · ${AGE_GROUP_LABELS[activeTeam.ageGroup]} ${activeTeam.sport}` : "Spring 2026 Season"}
          </p>
        </div>
        <Link to="/app/generate">
          <button className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm">
            <Zap className="h-4 w-4" />Generate Practice
          </button>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: FileText,   label: "Saved Plans",   value: saved,                                           color: "text-blue-600",    bg: "bg-blue-50" },
          { icon: Users,      label: "Active Roster", value: activeTeam?.players.length ?? 0,                  color: "text-violet-600",  bg: "bg-violet-50" },
          { icon: Clock,      label: "Avg Practice",  value: avgMin > 0 ? formatMinutes(avgMin) : "–",         color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: TrendingUp, label: "Drills Used",   value: totalDrills,                                      color: "text-amber-600",   bg: "bg-amber-50" },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            className="dos-card p-4"
          >
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg mb-3", s.bg)}>
              <s.icon className={cn("h-4 w-4", s.color)} />
            </div>
            <div className="font-heading text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main 2/3 + 1/3 grid */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Left: recent practices + quick start */}
        <div className="lg:col-span-2 space-y-4">

          {/* Recent practices */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-5 py-3.5 border-b">
              <span className="font-heading font-bold text-sm text-foreground">Recent Practices</span>
              <Link to="/app/practices" className="text-xs text-emerald-600 hover:text-emerald-700">View all</Link>
            </div>
            <div className="divide-y">
              {recent.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Target className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No practices yet</p>
                  <Link to="/app/generate">
                    <button className="mt-3 rounded-lg bg-emerald-50 text-emerald-600 px-4 py-2 text-xs font-medium hover:bg-emerald-100 transition-colors">
                      Generate First Practice
                    </button>
                  </Link>
                </div>
              ) : recent.map((p) => (
                <Link key={p.id} to={`/app/practices/${p.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatMinutes(p.totalMinutes)} · {p.blocks.length} drills
                        {p.goals?.length > 0 && " · " + p.goals.slice(0, 2).map((g) => CATEGORY_LABELS[g] ?? g).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "text-[10px] font-medium rounded-full px-2 py-0.5",
                        p.status === "saved" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                      )}>
                        {p.status}
                      </span>
                      <Link to={`/app/run/${p.id}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Play className="h-3.5 w-3.5" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick start */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Start</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Wand2,     title: "Generate",  desc: "AI practice in seconds",     to: "/app/generate",  accent: true },
                { icon: FileText,  title: "Templates", desc: "Start from proven structure", to: "/app/templates", accent: false },
                { icon: BarChart3, title: "Analytics", desc: "Team performance overview",   to: "/app/analytics", accent: false },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <div className={cn(
                    "dos-card p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-card-lg",
                    item.accent && "border-emerald-200 bg-emerald-50/50"
                  )}>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg mb-3",
                      item.accent ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: alerts + upcoming + team */}
        <div className="space-y-4">

          {/* Safety & engagement alerts */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-heading font-bold text-xs text-foreground">Alerts</span>
              </div>
              <Link to="/app/notifications" className="text-[11px] text-emerald-600 hover:text-emerald-700">See all</Link>
            </div>
            <div className="divide-y">
              {PINNED_ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <div className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    a.type === "safety" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                  )}>
                    {a.type === "safety" ? <AlertTriangle className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{a.message}</p>
                    <button className="mt-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                      {a.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming events */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="dos-card">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-heading font-bold text-xs text-foreground">Upcoming</span>
              </div>
              <Link to="/app/calendar" className="text-[11px] text-emerald-600 hover:text-emerald-700">Calendar</Link>
            </div>
            <div className="divide-y">
              {UPCOMING.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn("h-2 w-2 rounded-full shrink-0", EVENT_COLOR[ev.type] ?? "bg-slate-300")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{ev.label}</p>
                    <p className="text-[11px] text-muted-foreground">{ev.time}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{ev.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team snapshot */}
          {activeTeam && (
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} className="dos-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-xs text-foreground">{activeTeam.name}</span>
                <Link to="/app/teams" className="text-[11px] text-emerald-600 hover:text-emerald-700">Roster</Link>
              </div>
              <div className="flex gap-3 mb-3">
                {[{ label: "Players", value: activeTeam.players.length }, { label: "Coaches", value: activeTeam.coaches.length }].map((s) => (
                  <div key={s.label} className="flex-1 rounded-lg bg-muted/50 py-2 text-center">
                    <div className="font-heading text-lg font-bold text-foreground">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTeam.players.slice(0, 10).map((p) => (
                  <div key={p.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600"
                    title={p.name}
                  >
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                ))}
                {activeTeam.players.length > 10 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-[10px] text-muted-foreground">
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
