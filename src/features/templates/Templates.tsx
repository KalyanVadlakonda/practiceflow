import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Layout,
  Clock,
  Target,
  Users,
  ArrowRight,
  Search,
  Home,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TEMPLATES } from "@/data/templates";
import { usePracticeStore, useGeneratorStore, useUIStore } from "@/store";
import { generatePracticePlan } from "@/services/practiceGenerator";
import {
  AGE_GROUP_LABELS,
  SKILL_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatMinutes,
  cn,
} from "@/lib/utils";
import type { Template } from "@/types";

function TemplateCard({ template }: { template: Template }) {
  const navigate = useNavigate();
  const addPractice = usePracticeStore((s) => s.addPractice);
  const addNotification = useUIStore((s) => s.addNotification);
  const { input } = useGeneratorStore();

  const handleUseTemplate = () => {
    // Generate a practice plan from the template's parameters
    const plan = generatePracticePlan({
      sport: template.sport === "both" ? "baseball" : template.sport,
      ageGroup: template.ageGroup,
      skillLevel: template.skillLevel,
      competitiveLevel: "travel",
      environment: template.environment === "both" ? "outdoor" : template.environment,
      rosterSize: input.rosterSize ?? 12,
      coachCount: input.coachCount ?? 2,
      durationMinutes: template.durationMinutes,
      primaryGoals: template.focusAreas.slice(0, 2) as never,
      secondaryGoals: template.focusAreas.slice(2) as never,
      equipment: ["baseballs", "gloves", "bases", "fungo-bat"],
      practiceStyle: "balanced",
      stationPreference: "many-stations",
      blockDuration: "mixed",
      includeWarmup: true,
      includeCooldown: true,
      includeMentalCoaching: false,
      emphasisMode: "repetition",
    });

    plan.title = template.name;
    addPractice(plan);
    addNotification({
      type: "success",
      title: "Template applied!",
      message: `${plan.blocks.length} drills, ${plan.totalMinutes} minutes`,
    });
    navigate(`/app/practices/${plan.id}`);
  };

  const sportLabel =
    template.sport === "both" ? "Baseball & Softball" : template.sport;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all group cursor-pointer">
      {/* Header accent */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-green-400" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layout className="h-5 w-5" />
          </div>
          {template.usageCount && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {template.usageCount.toLocaleString()} uses
            </div>
          )}
        </div>
        <CardTitle className="text-base mt-2">{template.name}</CardTitle>
        <CardDescription className="text-sm">{template.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatMinutes(template.durationMinutes)}
          </span>
          <Badge variant="outline" className="text-xs capitalize">
            {sportLabel}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {AGE_GROUP_LABELS[template.ageGroup]}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {SKILL_LABELS[template.skillLevel]}
          </Badge>
          {template.environment !== "both" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
              <Home className="h-3 w-3" />
              {template.environment}
            </span>
          )}
        </div>

        {/* Focus areas */}
        <div className="flex flex-wrap gap-1.5">
          {template.focusAreas.map((area) => (
            <span
              key={area}
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                CATEGORY_COLORS[area] ?? "bg-muted text-muted-foreground"
              )}
            >
              {CATEGORY_LABELS[area] ?? area}
            </span>
          ))}
        </div>

        {/* Preview blocks */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Includes
          </p>
          <ul className="space-y-1">
            {template.previewBlocks.map((block, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                {block}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Button
          variant="brand"
          className="w-full gap-2"
          onClick={handleUseTemplate}
        >
          Use This Template
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function Templates() {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");

  const filtered = TEMPLATES.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q));
    const matchSport =
      sportFilter === "all" || t.sport === sportFilter || t.sport === "both";
    const matchDuration =
      durationFilter === "all" ||
      (durationFilter === "short" && t.durationMinutes <= 45) ||
      (durationFilter === "medium" && t.durationMinutes > 45 && t.durationMinutes <= 75) ||
      (durationFilter === "long" && t.durationMinutes > 75);
    return matchSearch && matchSport && matchDuration;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Practice Templates</h1>
        <p className="text-muted-foreground mt-1">
          Start from a proven structure and customize to your team's needs.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {/* Sport */}
          <div className="flex gap-1">
            {["all", "baseball", "softball"].map((s) => (
              <button
                key={s}
                onClick={() => setSportFilter(s)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all",
                  sportFilter === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:border-primary/40"
                )}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Duration */}
          <div className="flex gap-1">
            {[
              { id: "all", label: "Any Length" },
              { id: "short", label: "< 45m" },
              { id: "medium", label: "45–75m" },
              { id: "long", label: "> 75m" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDurationFilter(d.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs font-medium transition-all whitespace-nowrap",
                  durationFilter === d.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:border-primary/40"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Layout className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold">No templates found</p>
          <p className="text-sm text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
