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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  CATEGORY_COLORS,
  INTENSITY_COLORS,
  SKILL_LABELS,
  AGE_GROUP_LABELS,
  formatMinutes,
} from "@/lib/utils";
import type { DrillCategory, Drill } from "@/types";

// ─── Drill Card ───────────────────────────────────────────────────────────────

function DrillCard({ drill }: { drill: Drill }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[drill.category] ?? "bg-gray-100 text-gray-700";
  const intensityColor = INTENSITY_COLORS[drill.intensity] ?? "";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-base leading-snug">{drill.name}</h3>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  catColor
                )}
              >
                {CATEGORY_LABELS[drill.category]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {drill.description}
            </p>
          </div>
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
              drill.difficulty <= 2
                ? "bg-green-100 text-green-700"
                : drill.difficulty <= 3
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {"★".repeat(drill.difficulty)}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatMinutes(drill.durationMin)}–{formatMinutes(drill.durationMax)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {drill.playersMin}–{drill.playersMax} players
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0 text-xs font-medium",
              intensityColor
            )}
          >
            <Zap className="h-3 w-3 mr-1" />
            {drill.intensity}
          </span>
          {drill.indoorFriendly && (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Home className="h-3 w-3" />
              Indoor OK
            </span>
          )}
          <span className="capitalize">{drill.sport === "both" ? "⚾/🥎" : drill.sport}</span>
        </div>

        {/* Equipment tags */}
        {drill.equipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {drill.equipment.map((e) => (
              <span key={e} className="rounded-full border bg-muted px-2 py-0.5 text-xs">
                {e}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      {/* Expand/Collapse */}
      <CardContent className="pt-0 space-y-3">
        {/* Diagram preview */}
        {drill.diagram && (
          <div className="rounded-lg overflow-hidden border bg-muted/30">
            <DrillDiagramPreview diagram={drill.diagram} />
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              View Full Drill
            </>
          )}
        </Button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Setup */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Setup
                </p>
                <p className="text-sm">{drill.setupInstructions}</p>
              </div>

              {/* Steps */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Steps
                </p>
                <ol className="space-y-1">
                  {drill.stepByStep.map((step, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="shrink-0 font-semibold text-primary text-xs mt-0.5">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Teaching points */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Teaching Points
                </p>
                <ul className="space-y-1">
                  {drill.teachingPoints.map((tp, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common errors */}
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3">
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1.5 uppercase tracking-wide">
                  Common Errors
                </p>
                <ul className="space-y-1">
                  {drill.commonErrors.map((e, i) => (
                    <li key={i} className="text-xs text-yellow-700 dark:text-yellow-300 flex gap-2">
                      <span>•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Age/Skill */}
              <div className="flex flex-wrap gap-2">
                {drill.ageBands.map((a) => (
                  <Badge key={a} variant="outline" className="text-xs">
                    {AGE_GROUP_LABELS[a]}
                  </Badge>
                ))}
                {drill.skillLevels.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs capitalize">
                    {SKILL_LABELS[s]}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
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
      return (
        matchSearch &&
        matchSport &&
        matchCategory &&
        matchSkill &&
        matchIntensity &&
        matchIndoor
      );
    });
  }, [search, sportFilter, categoryFilter, skillFilter, intensityFilter, indoorOnly]);

  const categories = Array.from(new Set(DRILLS.map((d) => d.category)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Drill Library</h1>
        <p className="text-muted-foreground mt-1">
          {DRILLS.length} drills across baseball and softball — search, filter, and add to your plan.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drills by name, tag, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />

          {/* Sport */}
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

          {/* Category */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c] ?? c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Skill */}
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

          {/* Intensity */}
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

          {/* Indoor toggle */}
          <button
            onClick={() => setIndoorOnly(!indoorOnly)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              indoorOnly
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:border-primary/40"
            )}
          >
            <Home className="h-3.5 w-3.5" />
            Indoor Only
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {DRILLS.length} drills
        </p>
        {(search || sportFilter !== "all" || categoryFilter !== "all" || skillFilter !== "all" || indoorOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setSportFilter("all");
              setCategoryFilter("all");
              setSkillFilter("all");
              setIntensityFilter("all");
              setIndoorOnly(false);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Drill grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold">No drills found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((drill, i) => (
              <motion.div
                key={drill.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <DrillCard drill={drill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
