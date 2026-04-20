import type { GeneratorInput, PracticePlan, Recommendation } from "@/types";
import { generatePracticePlan } from "./practiceGenerator";

// ─── Mock AI Service ──────────────────────────────────────────────────────────
// All functions fall back to mock logic when no API key is present.
// Replace the body of each function with a real API call to OpenAI/Anthropic.

const HAS_AI_KEY = Boolean(import.meta.env.VITE_AI_API_KEY);

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Simulate AI processing time
async function simulateAI() {
  await sleep(1500 + Math.random() * 1000);
}

export async function generatePracticePlanAI(
  input: GeneratorInput
): Promise<PracticePlan> {
  if (HAS_AI_KEY) {
    // Future: call /.netlify/functions/generate-practice
    const response = await fetch("/.netlify/functions/generate-practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!response.ok) throw new Error("AI generation failed");
    return response.json() as Promise<PracticePlan>;
  }

  // Mock: use local generator
  await simulateAI();
  return generatePracticePlan(input);
}

export async function regenerateDrill(
  planId: string,
  blockId: string,
  input: GeneratorInput
): Promise<PracticePlan> {
  await simulateAI();
  // In mock mode, just regenerate the full plan
  return generatePracticePlan(input);
}

export async function recommendAdjustments(
  plan: PracticePlan
): Promise<Recommendation[]> {
  await simulateAI();

  // Mock recommendations
  return [
    {
      id: "rec-1",
      type: "adjust-duration",
      title: "Consider extending infield work",
      description: "Adding 5 more minutes to ground ball reps could significantly improve defensive efficiency.",
      rationale: "Based on similar teams at this age group, extended infield reps show strong retention outcomes.",
      confidence: 0.82,
    },
    {
      id: "rec-2",
      type: "swap-drill",
      title: "Swap for a more age-appropriate drill",
      description: "The double-play feed may be advanced for this group. Consider the ground ball fundamentals drill instead.",
      rationale: "This drill has higher complexity ratings that may not match the skill level of this roster.",
      drillId: "d-field-ground-balls",
      confidence: 0.71,
    },
    {
      id: "rec-3",
      type: "add-drill",
      title: "Add a mental coaching moment",
      description: "A 5-minute mental reset circle before batting practice could improve focus and at-bat quality.",
      rationale: "Mental preparation before hitting sessions is correlated with higher contact rates.",
      drillId: "d-mental-focus",
      confidence: 0.65,
    },
  ];
}

export async function explainPlanRationale(plan: PracticePlan): Promise<string> {
  await simulateAI();
  return (
    plan.aiRationale ??
    `This practice plan was designed for a ${plan.ageGroup} ${plan.sport} team with a focus on ${plan.goals.join(", ")}. The sequence progresses from warmup through technical work to conditioning, following best practices for athletic development. Each drill was selected to maximize repetition within your time constraints.`
  );
}

export async function suggestNextPractice(
  completedPlan: PracticePlan
): Promise<Partial<GeneratorInput>> {
  await simulateAI();
  // Rotate goals to build on what was just practiced
  const nextGoals = completedPlan.goals.includes("hitting")
    ? ["defense", "baserunning"]
    : ["hitting", "fundamentals"];

  return {
    primaryGoals: nextGoals as GeneratorInput["primaryGoals"],
    durationMinutes: completedPlan.totalMinutes,
    sport: completedPlan.sport,
  };
}
