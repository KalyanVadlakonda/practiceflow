import type { Handler, HandlerEvent } from "@netlify/functions";

// ─── Types (inline for serverless independence) ────────────────────────────────

interface GeneratorInput {
  sport: string;
  ageGroup: string;
  skillLevel: string;
  durationMinutes: number;
  primaryGoals: string[];
  secondaryGoals: string[];
  rosterSize: number;
  coachCount: number;
  practiceStyle: string;
  includeWarmup: boolean;
  includeCooldown: boolean;
}

// ─── Mock generator for when no AI key is present ─────────────────────────────

function generateMockPlan(input: GeneratorInput) {
  const id = Math.random().toString(36).slice(2, 10);

  const blocks = [];
  let startMinute = 0;

  if (input.includeWarmup) {
    blocks.push({
      id: `block-${id}-warmup`,
      drillId: "d-warmup-dynamic",
      name: "Dynamic Warmup",
      durationMinutes: 10,
      startMinute,
      endMinute: startMinute + 10,
      groupCount: 1,
      assignments: [],
      coachAssignments: [{ coachId: "c1", role: "Lead" }],
      order: blocks.length,
      aiNote: "Start with full team to build energy and cohesion.",
    });
    startMinute += 10;

    blocks.push({
      id: `block-${id}-throw`,
      drillId: "d-warmup-catch",
      name: "Throwing Progression",
      durationMinutes: 8,
      startMinute,
      endMinute: startMinute + 8,
      groupCount: 1,
      assignments: [],
      coachAssignments: [{ coachId: "c2", role: "Monitor" }],
      order: blocks.length,
    });
    startMinute += 8;
  }

  const remainingMinutes = input.durationMinutes - startMinute - (input.includeCooldown ? 8 : 0);
  const allGoals = [...(input.primaryGoals ?? []), ...(input.secondaryGoals ?? [])];
  const perGoal = allGoals.length > 0 ? Math.floor(remainingMinutes / allGoals.length) : remainingMinutes;

  const GOAL_DRILL_MAP: Record<string, string> = {
    hitting: "d-hit-tee",
    pitching: "d-pitch-command",
    fielding: "d-field-ground-balls",
    catching: "d-catch-blocking",
    baserunning: "d-run-first-to-third",
    defense: "d-def-cutoffs",
    conditioning: "d-cond-agility",
    mental: "d-mental-focus",
    fundamentals: "d-throw-accuracy",
  };

  const GOAL_NAMES: Record<string, string> = {
    hitting: "Hitting Station",
    pitching: "Pitching Bullpen",
    fielding: "Fielding Reps",
    catching: "Catcher Blocking",
    baserunning: "Baserunning Circuit",
    defense: "Cutoff & Relay",
    conditioning: "Agility Circuit",
    mental: "Mental Skills",
    fundamentals: "Throwing Accuracy",
  };

  for (const goal of allGoals) {
    const drillId = GOAL_DRILL_MAP[goal] ?? "d-field-ground-balls";
    const name = GOAL_NAMES[goal] ?? "Team Drill";
    blocks.push({
      id: `block-${id}-${goal}`,
      drillId,
      name,
      durationMinutes: perGoal,
      startMinute,
      endMinute: startMinute + perGoal,
      groupCount: input.rosterSize > 10 ? 2 : 1,
      assignments: [],
      coachAssignments: [{ coachId: "c1", role: "Lead" }],
      order: blocks.length,
      aiNote: `Focus drill for goal: ${goal}. Adjust rep count based on energy level.`,
    });
    startMinute += perGoal;
  }

  if (input.includeCooldown) {
    blocks.push({
      id: `block-${id}-cooldown`,
      drillId: "d-cooldown-stretch",
      name: "Cool Down & Stretch",
      durationMinutes: 8,
      startMinute,
      endMinute: startMinute + 8,
      groupCount: 1,
      assignments: [],
      coachAssignments: [{ coachId: "c1", role: "Lead" }],
      order: blocks.length,
      aiNote: "End with team debrief — one win, one growth area.",
    });
    startMinute += 8;
  }

  return {
    id: `plan-${id}`,
    title: `${input.sport === "baseball" ? "Baseball" : "Softball"} Practice · ${input.durationMinutes} Min`,
    sport: input.sport,
    ageGroup: input.ageGroup,
    skillLevel: input.skillLevel,
    totalMinutes: startMinute,
    goals: allGoals,
    blocks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    generatorInput: input,
    aiRationale: `Generated a ${input.durationMinutes}-minute ${input.practiceStyle} practice with ${blocks.length} drill blocks.`,
    warnings: [],
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const input: GeneratorInput = body.input ?? body;

    // Validate minimum required fields
    if (!input.sport || !input.ageGroup || !input.durationMinutes) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: sport, ageGroup, durationMinutes" }),
      };
    }

    const AI_KEY = process.env.OPENAI_API_KEY ?? process.env.ANTHROPIC_API_KEY;

    if (AI_KEY) {
      // Future: call OpenAI or Anthropic here
      // For now, fall through to mock
    }

    // Mock response
    const plan = generateMockPlan(input);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(plan),
    };
  } catch (err) {
    console.error("generate-practice error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
