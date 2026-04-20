import { motion } from "framer-motion";
import { Wand2, Clock, Users, Target, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneratorStore } from "@/store";
import {
  formatMinutes,
  AGE_GROUP_LABELS,
  SKILL_LABELS,
  CATEGORY_LABELS,
} from "@/lib/utils";

const LOADING_MESSAGES = [
  "Analyzing your team context...",
  "Selecting the best drill combinations...",
  "Calculating station assignments...",
  "Optimizing practice timing...",
  "Adding coaching notes...",
  "Building your practice plan...",
];

export function StepGenerate({ onGenerate }: { onGenerate: () => void }) {
  const { input, isGenerating } = useGeneratorStore();
  const goals = [
    ...(input.primaryGoals ?? []),
    ...(input.secondaryGoals ?? []),
  ].map((g) => CATEGORY_LABELS[g]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Ready to Generate</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your inputs and generate your complete practice plan.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Practice Summary
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sport</p>
              <p className="font-semibold capitalize">{input.sport ?? "–"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Team</p>
              <p className="font-semibold">
                {input.rosterSize ?? 12} players · {input.coachCount ?? 2} coaches
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">
                {formatMinutes(input.durationMinutes ?? 75)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="font-semibold">
                {AGE_GROUP_LABELS[input.ageGroup ?? "14u"]} ·{" "}
                {SKILL_LABELS[input.skillLevel ?? "intermediate"]}
              </p>
            </div>
          </div>
        </div>

        {goals.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Goals</p>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <span
                  key={g}
                  className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t pt-3">
          <span>Style: {input.practiceStyle}</span>
          <span>·</span>
          <span>{input.stationPreference === "many-stations" ? "Multi-station" : "Few stations"}</span>
          <span>·</span>
          <span>{input.blockDuration} blocks</span>
          {input.includeWarmup && <><span>·</span><span>Warmup ✓</span></>}
          {input.includeCooldown && <><span>·</span><span>Cooldown ✓</span></>}
          {input.includeMentalCoaching && <><span>·</span><span>Mental coaching ✓</span></>}
        </div>
      </div>

      {/* Loading state */}
      {isGenerating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">Building your practice plan...</p>
              <p className="text-sm text-muted-foreground">
                This takes just a moment
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {LOADING_MESSAGES.map((msg, i) => (
              <motion.div
                key={msg}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.25 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {msg}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={onGenerate}
            variant="brand"
            size="xl"
            className="w-full gap-2"
          >
            <Wand2 className="h-5 w-5" />
            Generate Practice Plan
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your plan will include timing, coach assignments, drill diagrams, and AI coaching notes.
          </p>
        </div>
      )}
    </div>
  );
}
