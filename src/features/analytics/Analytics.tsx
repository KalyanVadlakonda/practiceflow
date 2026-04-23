import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CalendarDays,
  Target,
  Award,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface PlayerStat {
  name: string;
  position: string;
  fielding: number;
  hitting: number;
  throwing: number;
  attendance: number;
  flagged?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  { label: "Practices This Month",    value: "8",     delta: "+2",   up: true,  icon: CalendarDays },
  { label: "Avg. Attendance",         value: "82%",   delta: "-6%",  up: false, icon: Users },
  { label: "Drills Completed",        value: "124",   delta: "+31",  up: true,  icon: Target },
  { label: "Skill Milestones Hit",    value: "17",    delta: "+5",   up: true,  icon: Award },
];

const PLAYERS: PlayerStat[] = [
  { name: "Marcus Thompson", position: "P / OF", fielding: 78, hitting: 65, throwing: 88, attendance: 90, flagged: true },
  { name: "Jordan Kim",      position: "C",      fielding: 82, hitting: 74, throwing: 80, attendance: 85, flagged: true },
  { name: "Alex Rivera",     position: "SS",     fielding: 90, hitting: 80, throwing: 85, attendance: 95 },
  { name: "Sam Park",        position: "1B",     fielding: 70, hitting: 88, throwing: 65, attendance: 80 },
  { name: "Chloe Washington", position: "2B",   fielding: 85, hitting: 72, throwing: 78, attendance: 100 },
  { name: "Taylor Brooks",   position: "3B",    fielding: 68, hitting: 60, throwing: 70, attendance: 75 },
  { name: "Morgan Lee",      position: "LF",    fielding: 75, hitting: 68, throwing: 72, attendance: 90 },
  { name: "Casey Nguyen",    position: "CF",    fielding: 88, hitting: 77, throwing: 82, attendance: 85 },
];

const WEEKLY_ATTENDANCE = [
  { week: "Mar 24", pct: 88 },
  { week: "Mar 31", pct: 92 },
  { week: "Apr 7",  pct: 85 },
  { week: "Apr 14", pct: 82 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkillBar({ value, color = "bg-emerald-500" }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-[11px] text-white/40 w-7 text-right">{value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl text-white">Team Analytics</h2>
        <p className="text-sm text-white/40 mt-0.5">Spring 2026 · April snapshot</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="dos-card p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8">
                <s.icon className="h-4 w-4 text-white/60" />
              </div>
              {s.delta && (
                <div className={cn(
                  "flex items-center gap-0.5 text-[11px] font-medium",
                  s.up ? "text-emerald-400" : "text-red-400"
                )}>
                  {s.up
                    ? <TrendingUp className="h-3 w-3" />
                    : <TrendingDown className="h-3 w-3" />}
                  {s.delta}
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendance trend + Player breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance chart */}
        <div className="dos-card p-5">
          <h3 className="font-heading text-sm font-bold text-white mb-4">Weekly Attendance</h3>
          <div className="flex items-end gap-2 h-28">
            {WEEKLY_ATTENDANCE.map((w) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                  <motion.div
                    className="w-full rounded-t-md bg-emerald-500/60"
                    initial={{ height: 0 }}
                    animate={{ height: `${w.pct * 0.8}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    style={{ minHeight: 4 }}
                  />
                </div>
                <span className="text-[10px] text-white/30">{w.week}</span>
                <span className="text-[10px] text-white/50 font-medium">{w.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Player skill breakdown */}
        <div className="lg:col-span-2 dos-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-bold text-white">Player Skill Breakdown</h3>
            <div className="flex items-center gap-3 text-[11px] text-white/30">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Fielding</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />Hitting</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />Throwing</span>
            </div>
          </div>

          <div className="space-y-3">
            {PLAYERS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {p.flagged && (
                    <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-white/30">{p.position}</div>
                  </div>
                </div>
                <SkillBar value={p.fielding} color="bg-emerald-500" />
                <SkillBar value={p.hitting}  color="bg-blue-400" />
                <SkillBar value={p.throwing} color="bg-amber-400" />
                <div className="text-[11px] text-white/40 text-right whitespace-nowrap">
                  {p.attendance}%
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/8 flex justify-between text-[10px] text-white/25">
            <span>Skills scored 0–100 · Updated after each practice</span>
            <span>Attendance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
