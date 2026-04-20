import type { GeneratorInput, PracticePlan, PracticeBlock, Drill } from "@/types";
import { DRILLS } from "@/data/drills";
import { generateId } from "@/lib/utils";

// ─── Filtering Helpers ─────────────────────────────────────────────────────────

function filterDrills(input: GeneratorInput, category: string): Drill[] {
  return DRILLS.filter((d) => {
    const sportMatch = d.sport === "both" || d.sport === input.sport;
    const categoryMatch =
      d.category === category || d.focusAreas.includes(category as never);
    const playerMatch = d.playersMin <= input.rosterSize && d.playersMax >= Math.floor(input.rosterSize / 2);
    const coachMatch = d.coachesMin <= input.coachCount;
    const envMatch = input.environment === "indoor" ? d.indoorFriendly : true;
    const skillMatch =
      d.skillLevels.includes(input.skillLevel) ||
      d.skillLevels.length === 0;
    return sportMatch && categoryMatch && playerMatch && coachMatch && envMatch && skillMatch;
  });
}

function pickRandom<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDrill(input: GeneratorInput, category: string, exclude: Set<string>): Drill | undefined {
  const candidates = filterDrills(input, category).filter((d) => !exclude.has(d.id));
  return pickRandom(candidates);
}

// ─── Block Duration Logic ─────────────────────────────────────────────────────

function getBlockDuration(
  drill: Drill,
  input: GeneratorInput,
  availableMinutes: number
): number {
  const min = drill.durationMin;
  const max = Math.min(drill.durationMax, availableMinutes);
  if (max <= min) return min;

  switch (input.blockDuration) {
    case "short": return min + Math.floor((max - min) * 0.25);
    case "long": return min + Math.floor((max - min) * 0.75);
    default: return min + Math.floor((max - min) * 0.5);
  }
}

// ─── Auto-Assignment ──────────────────────────────────────────────────────────

function buildCoachAssignments(
  drill: Drill,
  coaches: { id: string; name: string; role: string }[]
): { coachId: string; role: string }[] {
  const needed = Math.min(drill.coachesMin, coaches.length);
  return coaches.slice(0, needed).map((c, i) => ({
    coachId: c.id,
    role: i === 0 ? "Lead" : i === 1 ? "Assistant" : "Support",
  }));
}

// ─── Core Generator ───────────────────────────────────────────────────────────

export function generatePracticePlan(input: GeneratorInput): PracticePlan {
  const usedDrillIds = new Set<string>();
  const blocks: PracticeBlock[] = [];
  let minutesLeft = input.durationMinutes;
  let currentMinute = 0;
  let order = 0;

  const coaches = [
    { id: "c1", name: "Coach 1", role: "head" },
    { id: "c2", name: "Coach 2", role: "assistant" },
    { id: "c3", name: "Coach 3", role: "volunteer" },
  ].slice(0, input.coachCount);

  function addBlock(drill: Drill, overrideDuration?: number): void {
    const duration = overrideDuration ?? getBlockDuration(drill, input, minutesLeft);
    if (minutesLeft <= 0 || duration <= 0) return;

    const actualDuration = Math.min(duration, minutesLeft);
    blocks.push({
      id: `block-${generateId()}`,
      drillId: drill.id,
      drill,
      name: drill.name,
      durationMinutes: actualDuration,
      startMinute: currentMinute,
      endMinute: currentMinute + actualDuration,
      groupCount: Math.ceil(input.rosterSize / Math.max(drill.playersMax, 1)),
      assignments: [],
      coachAssignments: buildCoachAssignments(drill, coaches),
      equipment: drill.equipment,
      order: order++,
      aiNote: drill.teachingPoints[0]
        ? `Key focus: ${drill.teachingPoints[0]}`
        : undefined,
    });

    usedDrillIds.add(drill.id);
    minutesLeft -= actualDuration;
    currentMinute += actualDuration;
  }

  // 1. Warmup
  if (input.includeWarmup) {
    const warmup = pickDrill(input, "warmup", usedDrillIds);
    if (warmup) addBlock(warmup, Math.min(12, Math.floor(minutesLeft * 0.15)));

    const throwWarmup = DRILLS.find((d) => d.id === "d-warmup-catch");
    if (throwWarmup && !usedDrillIds.has(throwWarmup.id)) {
      addBlock(throwWarmup, Math.min(8, Math.floor(minutesLeft * 0.1)));
    }
  }

  // 2. Mental coaching
  if (input.includeMentalCoaching && minutesLeft > 10) {
    const mental = pickDrill(input, "mental", usedDrillIds);
    if (mental) addBlock(mental, 7);
  }

  // 3. Primary goals
  const allGoals = [...input.primaryGoals, ...input.secondaryGoals];
  const goalBudget = input.includeCooldown
    ? minutesLeft - 8
    : minutesLeft;

  const perGoalMinutes = allGoals.length > 0
    ? Math.floor(goalBudget / allGoals.length)
    : goalBudget;

  for (const goal of allGoals) {
    if (minutesLeft <= (input.includeCooldown ? 8 : 0)) break;

    // Pick 1-2 drills per goal depending on block preference
    const numDrills = input.stationPreference === "many-stations" ? 2 : 1;
    const drillMinutes = Math.floor(perGoalMinutes / numDrills);

    for (let i = 0; i < numDrills; i++) {
      const drill = pickDrill(input, goal, usedDrillIds);
      if (drill) addBlock(drill, drillMinutes);
    }
  }

  // 4. Cooldown
  if (input.includeCooldown && minutesLeft > 0) {
    const cooldown = DRILLS.find((d) => d.id === "d-cooldown-stretch");
    if (cooldown) addBlock(cooldown, Math.min(8, minutesLeft));
  }

  // 5. Recalculate start/end minutes cleanly
  let runningMinute = 0;
  blocks.forEach((b) => {
    b.startMinute = runningMinute;
    b.endMinute = runningMinute + b.durationMinutes;
    runningMinute += b.durationMinutes;
  });

  const totalUsed = blocks.reduce((sum, b) => sum + b.durationMinutes, 0);

  // Warnings
  const warnings: string[] = [];
  if (totalUsed > input.durationMinutes) {
    warnings.push(`Plan is ${totalUsed - input.durationMinutes} minutes over budget. Consider trimming drills.`);
  }
  if (input.coachCount < 2 && blocks.some((b) => b.drill && b.drill.coachesMin > 1)) {
    warnings.push("Some drills recommend 2+ coaches. Adjust assignments as needed.");
  }

  const sportLabel = input.sport === "baseball" ? "Baseball" : "Softball";
  const goals = [...input.primaryGoals, ...input.secondaryGoals];

  return {
    id: `plan-${generateId()}`,
    title: `${sportLabel} Practice · ${input.durationMinutes} Min`,
    sport: input.sport,
    ageGroup: input.ageGroup,
    skillLevel: input.skillLevel,
    totalMinutes: totalUsed,
    goals,
    blocks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    generatorInput: input,
    warnings,
    aiRationale: buildRationale(input, blocks.length),
  };
}

function buildRationale(input: GeneratorInput, blockCount: number): string {
  const goals = [...input.primaryGoals, ...input.secondaryGoals].join(", ");
  return `Generated a ${input.durationMinutes}-minute ${input.practiceStyle} practice for ${input.rosterSize} players with ${input.coachCount} coach(es). Focused on ${goals || "general fundamentals"} with a ${input.blockDuration}-block structure. Warmup ${input.includeWarmup ? "included" : "excluded"}, cooldown ${input.includeCooldown ? "included" : "excluded"}. Total: ${blockCount} drill blocks.`;
}
