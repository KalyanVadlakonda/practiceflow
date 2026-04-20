import { cn, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils";
import { useGeneratorStore } from "@/store";
import type { DrillCategory } from "@/types";

const ALL_GOALS: { id: DrillCategory; description: string }[] = [
  { id: "hitting", description: "Mechanics, contact, approach" },
  { id: "pitching", description: "Command, mechanics, velocity" },
  { id: "fielding", description: "Ground balls, fly balls, reps" },
  { id: "catching", description: "Blocking, framing, receiving" },
  { id: "baserunning", description: "Leads, reads, routes, speed" },
  { id: "defense", description: "Cutoffs, double plays, situations" },
  { id: "offense", description: "Hit-and-run, sacrifice, approach" },
  { id: "fundamentals", description: "Throwing, catching, basics" },
  { id: "conditioning", description: "Agility, sprints, fitness" },
  { id: "mental", description: "Focus, process, pressure situations" },
];

function GoalCard({
  goal,
  isPrimary,
  isSecondary,
  onToggle,
}: {
  goal: { id: DrillCategory; description: string };
  isPrimary: boolean;
  isSecondary: boolean;
  onToggle: (type: "primary" | "secondary") => void;
}) {
  const colorClass = CATEGORY_COLORS[goal.id] ?? "bg-gray-100 text-gray-700";

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border p-4 transition-all",
        isPrimary
          ? "border-primary bg-primary/5"
          : isSecondary
          ? "border-muted bg-muted/30"
          : "border-input hover:border-primary/30"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            colorClass
          )}
        >
          {CATEGORY_LABELS[goal.id]}
        </span>
        {(isPrimary || isSecondary) && (
          <span className="text-xs font-medium text-muted-foreground">
            {isPrimary ? "Primary" : "Secondary"}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{goal.description}</p>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onToggle("primary")}
          className={cn(
            "flex-1 rounded-md py-1 text-xs font-medium border transition-all",
            isPrimary
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input hover:border-primary/50"
          )}
        >
          Primary
        </button>
        <button
          onClick={() => onToggle("secondary")}
          className={cn(
            "flex-1 rounded-md py-1 text-xs font-medium border transition-all",
            isSecondary
              ? "border-muted-foreground bg-muted text-foreground"
              : "border-input hover:border-muted"
          )}
        >
          Secondary
        </button>
      </div>
    </div>
  );
}

export function StepGoals() {
  const { input, setInput } = useGeneratorStore();
  const primaryGoals = input.primaryGoals ?? [];
  const secondaryGoals = input.secondaryGoals ?? [];

  const handleToggle = (goalId: DrillCategory, type: "primary" | "secondary") => {
    if (type === "primary") {
      if (primaryGoals.includes(goalId)) {
        setInput({ primaryGoals: primaryGoals.filter((g) => g !== goalId) });
      } else {
        setInput({
          primaryGoals: [...primaryGoals, goalId],
          secondaryGoals: secondaryGoals.filter((g) => g !== goalId),
        });
      }
    } else {
      if (secondaryGoals.includes(goalId)) {
        setInput({ secondaryGoals: secondaryGoals.filter((g) => g !== goalId) });
      } else {
        setInput({
          secondaryGoals: [...secondaryGoals, goalId],
          primaryGoals: primaryGoals.filter((g) => g !== goalId),
        });
      }
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Practice Goals</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select your primary focus areas first, then add secondary goals if time allows.
          Primary goals get more time and drill priority.
        </p>
      </div>

      {primaryGoals.length === 0 && (
        <div className="rounded-lg border border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-950 p-3 text-sm text-yellow-700 dark:text-yellow-300">
          Select at least one primary goal to continue.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {ALL_GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isPrimary={primaryGoals.includes(goal.id)}
            isSecondary={secondaryGoals.includes(goal.id)}
            onToggle={(type) => handleToggle(goal.id, type)}
          />
        ))}
      </div>

      {(primaryGoals.length > 0 || secondaryGoals.length > 0) && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <span className="font-medium">Selected: </span>
          {primaryGoals.length > 0 && (
            <span>
              Primary — {primaryGoals.map((g) => CATEGORY_LABELS[g]).join(", ")}
            </span>
          )}
          {primaryGoals.length > 0 && secondaryGoals.length > 0 && " · "}
          {secondaryGoals.length > 0 && (
            <span className="text-muted-foreground">
              Secondary — {secondaryGoals.map((g) => CATEGORY_LABELS[g]).join(", ")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
