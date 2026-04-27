import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, List, Grid3X3, Plus, MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType = "practice" | "game" | "scrimmage" | "off";

interface CalEvent {
  id: string; date: string; title: string; type: EventType;
  time?: string; location?: string; opponent?: string; playerCount?: number;
}

const EVENTS: CalEvent[] = [
  { id: "e1", date: "2026-04-27", title: "Fielding Focus",     type: "practice",  time: "4:00 PM", location: "Field A",              playerCount: 18 },
  { id: "e2", date: "2026-04-29", title: "vs. River Hawks",    type: "game",      time: "5:30 PM", location: "Central Park Diamond", opponent: "River Hawks" },
  { id: "e3", date: "2026-05-01", title: "Hitting Session",    type: "practice",  time: "4:00 PM", location: "Cage B",               playerCount: 16 },
  { id: "e4", date: "2026-05-03", title: "vs. Storm Chasers",  type: "scrimmage", time: "10:00 AM",location: "Field B",              opponent: "Storm Chasers" },
  { id: "e5", date: "2026-05-06", title: "Base Running",       type: "practice",  time: "4:30 PM", location: "Field A",              playerCount: 20 },
  { id: "e6", date: "2026-05-08", title: "vs. Blue Jays",      type: "game",      time: "6:00 PM", location: "East Diamond",         opponent: "Blue Jays" },
  { id: "e7", date: "2026-05-10", title: "Recovery Day",       type: "off",       time: "" },
  { id: "e8", date: "2026-05-12", title: "Pitching & Defense", type: "practice",  time: "4:00 PM", location: "Field A",              playerCount: 18 },
  { id: "e9", date: "2026-05-14", title: "vs. Thunder Eagles", type: "game",      time: "5:00 PM", location: "City Stadium",         opponent: "Thunder Eagles" },
];

const TYPE_PILL: Record<EventType, string> = {
  practice:  "bg-emerald-50 text-emerald-600 border-emerald-200",
  game:      "bg-blue-50 text-blue-600 border-blue-200",
  scrimmage: "bg-amber-50 text-amber-600 border-amber-200",
  off:       "bg-slate-50 text-slate-400 border-slate-200",
};

const TYPE_DOT: Record<EventType, string> = {
  practice:  "bg-emerald-500",
  game:      "bg-blue-500",
  scrimmage: "bg-amber-500",
  off:       "bg-slate-300",
};

const TYPE_CAL: Record<EventType, string> = {
  practice:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  game:      "bg-blue-50 text-blue-700 border border-blue-200",
  scrimmage: "bg-amber-50 text-amber-700 border border-amber-200",
  off:       "bg-slate-50 text-slate-400 border border-slate-100",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
type ViewMode = "month" | "list";

export function SeasonCalendar() {
  const [view,  setView]  = useState<ViewMode>("month");
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(4); // May (0-indexed)

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const eventsForDate = (d: number) => {
    const s = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return EVENTS.filter((e) => e.date === s);
  };

  const prev = () => month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1);
  const next = () => month === 11 ? (setMonth(0),  setYear((y) => y + 1)) : setMonth((m) => m + 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-foreground">Season Calendar</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Spring 2026 Schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
            {(["month","list"] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v === "month" ? <Grid3X3 className="h-3 w-3" /> : <List className="h-3 w-3" />}
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition-colors">
            <Plus className="h-3.5 w-3.5" />Add Event
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {(["practice","game","scrimmage","off"] as EventType[]).map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", TYPE_DOT[t])} />
            <span className="text-xs text-muted-foreground capitalize">{t}</span>
          </div>
        ))}
      </div>

      {/* Month view */}
      {view === "month" && (
        <div className="dos-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <button onClick={prev} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-heading font-bold text-base text-foreground">{MONTHS[month]} {year}</span>
            <button onClick={next} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b bg-muted/30">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} className="min-h-[88px] border-b border-r bg-slate-50/50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day      = i + 1;
              const dayEvs   = eventsForDate(day);
              const col      = (firstDay + i) % 7;
              const isToday  = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const weekend  = col === 0 || col === 6;
              return (
                <div key={day} className={cn("min-h-[88px] border-b border-r p-1.5 cursor-pointer hover:bg-slate-50 transition-colors", weekend && "bg-slate-50/60")}>
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1",
                    isToday ? "bg-emerald-600 text-white" : "text-muted-foreground"
                  )}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvs.map((ev) => (
                      <div key={ev.id} className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium truncate", TYPE_CAL[ev.type])} title={ev.title}>
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
            <motion.div key={ev.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="dos-card flex items-center gap-4 px-5 py-4"
            >
              <div className={cn("h-10 w-1 rounded-full flex-shrink-0", TYPE_DOT[ev.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{ev.title}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize", TYPE_PILL[ev.type])}>
                    {ev.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {ev.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>}
                  {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                  {ev.playerCount && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev.playerCount} players</span>}
                  {ev.opponent && <span>vs. {ev.opponent}</span>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">
                {new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
