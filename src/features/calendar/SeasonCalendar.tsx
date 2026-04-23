import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Grid3X3,
  Plus,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "practice" | "game" | "scrimmage" | "off";

interface CalendarEvent {
  id: string;
  date: string; // ISO yyyy-mm-dd
  title: string;
  type: EventType;
  time?: string;
  location?: string;
  opponent?: string;
  playerCount?: number;
}

// ─── Seed data ─────────────────────────────────────────────────────────────────

const EVENTS: CalendarEvent[] = [
  { id: "e1", date: "2026-04-13", title: "Fielding Focus",     type: "practice",  time: "4:00 PM", location: "Field A", playerCount: 18 },
  { id: "e2", date: "2026-04-15", title: "vs. River Hawks",    type: "game",      time: "5:30 PM", location: "Central Park Diamond", opponent: "River Hawks" },
  { id: "e3", date: "2026-04-17", title: "Hitting Session",    type: "practice",  time: "4:00 PM", location: "Cage B", playerCount: 16 },
  { id: "e4", date: "2026-04-19", title: "vs. Storm Chasers",  type: "scrimmage", time: "10:00 AM", location: "Field B", opponent: "Storm Chasers" },
  { id: "e5", date: "2026-04-22", title: "Base Running",       type: "practice",  time: "4:30 PM", location: "Field A", playerCount: 20 },
  { id: "e6", date: "2026-04-24", title: "vs. Blue Jays",      type: "game",      time: "6:00 PM", location: "East Diamond", opponent: "Blue Jays" },
  { id: "e7", date: "2026-04-26", title: "Recovery Day",       type: "off",       time: "" },
  { id: "e8", date: "2026-04-28", title: "Pitching & Defense", type: "practice",  time: "4:00 PM", location: "Field A", playerCount: 18 },
  { id: "e9", date: "2026-04-30", title: "vs. Thunder Eagles", type: "game",      time: "5:00 PM", location: "City Stadium", opponent: "Thunder Eagles" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<EventType, string> = {
  practice:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  game:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
  scrimmage: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  off:       "bg-white/5 text-white/30 border-white/10",
};

const TYPE_DOT: Record<EventType, string> = {
  practice:  "bg-emerald-500",
  game:      "bg-blue-400",
  scrimmage: "bg-amber-400",
  off:       "bg-white/20",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

type ViewMode = "month" | "week" | "list";

// ─── Component ────────────────────────────────────────────────────────────────

export function SeasonCalendar() {
  const [view, setView] = useState<ViewMode>("month");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // April (0-indexed)

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function eventsForDate(d: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return EVENTS.filter((e) => e.date === dateStr);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-white">Season Calendar</h2>
          <p className="text-sm text-white/40 mt-0.5">Spring 2026 Schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-white/12 p-0.5 bg-white/5">
            {(["month", "week", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                  view === v
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {v === "month" && <Grid3X3 className="h-3 w-3" />}
                {v === "week" && <CalendarDays className="h-3 w-3" />}
                {v === "list" && <List className="h-3 w-3" />}
                {v}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {(["practice", "game", "scrimmage", "off"] as EventType[]).map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", TYPE_DOT[t])} />
            <span className="text-xs text-white/40 capitalize">{t}</span>
          </div>
        ))}
      </div>

      {/* Month view */}
      {view === "month" && (
        <div className="dos-card overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-heading font-bold text-base text-white">
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-white/8">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[96px] border-b border-r border-white/6 bg-white/2" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsForDate(day);
              const isToday = new Date().getDate() === day &&
                              new Date().getMonth() === month &&
                              new Date().getFullYear() === year;
              const col = (firstDay + i) % 7;
              const isWeekend = col === 0 || col === 6;

              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-[96px] border-b border-r border-white/6 p-1.5 transition-colors cursor-pointer",
                    isWeekend ? "bg-white/2" : "",
                    "hover:bg-white/4"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1",
                    isToday ? "bg-emerald-500 text-white" : "text-white/50"
                  )}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium border truncate",
                          TYPE_STYLES[ev.type]
                        )}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="space-y-2">
          {EVENTS.sort((a, b) => a.date.localeCompare(b.date)).map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="dos-card flex items-center gap-4 px-5 py-4"
            >
              <div className={cn("h-10 w-1 rounded-full flex-shrink-0", TYPE_DOT[ev.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{ev.title}</span>
                  <span className={cn("pill-info text-[10px] capitalize px-1.5 py-0", TYPE_STYLES[ev.type])}>
                    {ev.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  {ev.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{ev.time}
                    </span>
                  )}
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{ev.location}
                    </span>
                  )}
                  {ev.playerCount && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />{ev.playerCount} players
                    </span>
                  )}
                  {ev.opponent && (
                    <span>vs. {ev.opponent}</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-white/30 shrink-0">
                {new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Week view — simplified */}
      {view === "week" && (
        <div className="dos-card p-6 text-center text-white/40 text-sm">
          <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
          Week view coming soon
        </div>
      )}
    </div>
  );
}
