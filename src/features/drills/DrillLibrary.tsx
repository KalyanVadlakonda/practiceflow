import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Users,
  Zap,
  Home,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Star,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DrillDiagramPreview } from "@/features/diagram-studio/DrillDiagramPreview";
import { DRILLS } from "@/data/drills";
import {
  cn,
  CATEGORY_LABELS,
  INTENSITY_COLORS,
  SKILL_LABELS,
  AGE_GROUP_LABELS,
  formatMinutes,
} from "@/lib/utils";
import type { DrillCategory, Drill } from "@/types";

// ─── Category badge colors (dark-theme) ───────────────────────────────────────

const CAT_DARK: Record<string, string> = {
  fielding:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  hitting:     "bg-blue-500/15 text-blue-400 border-blue-500/25",
  pitching:    "bg-red-500/15 text-red-400 border-red-500/25",
  baserunning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  conditioning:"bg-violet-500/15 text-violet-400 border-violet-500/25",
  warmup:      "bg-teal-500/15 text-teal-400 border-teal-500/25",
  catching:    "bg-pink-500/15 text-pink-400 border-pink-500/25",
  teamwork:    "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
};

// ─── Stars ────────────────────────────────────────────────────────────────────

function DifficultyStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "h-3 w-3",
            s <= value ? "text-amber-400 fill-amber-400" : "text-white/15"
          )}
        />
      ))}
    </div>
  );
}

// ─── Drill ID formatter ───────────────────────────────────────────────────────

function drillId(index: number) {
  return `D-${String(index + 1).padStart(3, "0")}`;
}

// ─── Drill Card ───────────────────────────────────────────────────────────────

function DrillCard({ drill, index }: { drill: Drill; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="dos-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-[10px] text-white/30">{drillId(index)}</span>
              <h3 className="font-heading font-bold text-sm text-white leading-snug">{drill.name}</h3>
              <span className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                CAT_DARK[drill.category] ?? "bg-white/10 text-white/50 border-white/15"
              )}>
                {CATEGORY_LABELS[drill.category]}
              </span>
            </div>
            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
              {drill.description}
            </p>
          </div>
          <DifficultyStars value={drill.difficulty} />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-[11px] text-white/40 mt-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatMinutes(drill.durationMin)}–{formatMinutes(drill.durationMax)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {drill.playersMin}–{drill.playersMax}
          </span>
          <span className="flex items-center gap-1">
            <Zap className={cn(
              "h-3 w-3",
              drill.intensity === "high" ? "text-red-400" :
              drill.intensity === "medium" ? "text-amber-400" : "text-emerald-400"
            )} />
            <span className={cn(
              "capitalize",
              drill.intensity === "high" ? "text-red-400" :
              drill.intensity === "medium" ? "text-amber-400" : "text-emerald-400"
            )}>
              {drill.intensity}
            </span>
          </span>
          {drill.indoorFriendly && (
            <span className="flex items-center gap-1 text-blue-400">
              <Home className="h-3 w-3" />
              Indoor OK
            </span>
          )}
          <span className="capitalize text-white/30">
            {drill.sport === "both" ? "⚾ / 🥎 Both" : drill.sport}
          </span>
        </div>

        {/* Equipment */}
        {drill.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {drill.equipment.map((e) => (
              <span key={e} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                {e}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Diagram preview */}
      {drill.diagram && (
        <div className="mx-4 mb-2 rounded-lg overflow-hidden border border-white/8 bg-white/4">
          <DrillDiagramPreview diagram={drill.diagram} />
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-white/8 text-xs text-white/40 hover:bg-white/4 hover:text-white/70 transition-colors"
      >
        {expanded ? (
          <><ChevronUp className="h-3.5 w-3.5" />Show less</>
        ) : (
          <><ChevronDown className="h-3.5 w-3.5" />View full drill</>
        )}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="p-4 space-y-4">
              {/* Setup */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Setup</p>
                <p className="text-xs text-white/60 leading-relaxed">{drill.setupInstructions}</p>
              </div>

              {/* Steps */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Steps</p>
                <ol className="space-y-1.5">
                  {drill.stepByStep.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/60">
                      <span className="shrink-0 font-bold text-emerald-400">{i + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Teaching points */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Teaching Points</p>
                <ul className="space-y-1">
                  {drill.teachingPoints.map((tp, i) => (
                    <li key={i} className="flex gap-2 text-xs text-white/60">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span className="leading-relaxed">{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common errors */}
              <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 p-3">
                <p className="text-[10px] font-semibold text-amber-400 mb-1.5 uppercase tracking-wider">
                  Common Errors
                </p>
                <ul className="space-y-1">
                  {drill.commonErrors.map((e, i) => (
                    <li key={i} className="text-[11px] text-amber-300/70 flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Age + skill badges */}
              <div className="flex flex-wrap gap-1.5">
                {drill.ageBands.map((a) => (
                  <span key={a} className="rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[10px] text-white/50">
                    {AGE_GROUP_LABELS[a]}
                  </span>
                ))}
                {drill.skillLevels.map((s) => (
                  <span key={s} className="rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[10px] text-white/50 capitalize">
                    {SKILL_LABELS[s]}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Library ──────────────────────────────────────────────────────────────────

export function DrillLibrary() {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [intensityFilter, setIntensityFilter] = useState<string>("all");
  const [indoorOnly, setIndoorOnly] = useState(false);

  const filtered = useMemo(() => {
    return DRILLS.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.includes(q));
      const matchSport =
        sportFilter === "all" || d.sport === sportFilter || d.sport === "both";
      const matchCategory =
        categoryFilter === "all" || d.category === categoryFilter;
      const matchSkill =
        skillFilter === "all" || d.skillLevels.includes(skillFilter as never);
      const matchIntensity =
        intensityFilter === "all" || d.intensity === intensityFilter;
      const matchIndoor = !indoorOnly || d.indoorFriendly;
      return matchSearch && matchSport && matchCategory && matchSkill && matchIntensity && matchIndoor;
    });
  }, [search, sportFilter, categoryFilter, skillFilter, intensityFilter, indoorOnly]);

  const categories = Array.from(new Set(DRILLS.map((d) => d.category)));
  const hasFilters = search || sportFilter !== "all" || categoryFilter !== "all" || skillFilter !== "all" || intensityFilter !== "all" || indoorOnly;

  function clearFilters() {
    setSearch(""); setSportFilter("all"); setCategoryFilter("all");
    setSkillFilter("all"); setIntensityFilter("all"); setIndoorOnly(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl text-white">Drill Library</h2>
        <p className="text-sm text-white/40 mt-0.5">
          {DRILLS.length} drills across baseball and softball
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            placeholder="Search drills by name, tag, or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/12 bg-white/6 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-3.5 w-3.5 text-white/30" />

          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="softball">Softball</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {Object.entries(SKILL_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={intensityFilter} onValueChange={setIntensityFilter}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intensities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => setIndoorOnly(!indoorOnly)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              indoorOnly
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                : "border-white/12 text-white/40 hover:border-white/25 hover:text-white/70"
            )}
          >
            <Home className="h-3 w-3" />
            Indoor Only
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-white/30">
        Showing {filtered.length} of {DRILLS.length} drills
      </div>

      {/* Drill grid */}
      {filtered.length === 0 ? (
        <div className="dos-card flex flex-col items-center py-20 gap-3">
          <BookOpen className="h-10 w-10 text-white/15" />
          <p className="font-heading text-base text-white/50">No drills found</p>
          <p className="text-sm text-white/30">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((drill, i) => (
              <motion.div
                key={drill.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <DrillCard drill={drill} index={DRILLS.indexOf(drill)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
