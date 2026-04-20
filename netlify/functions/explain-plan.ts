import type { Handler, HandlerEvent } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const { plan } = body;

    const rationale = plan?.aiRationale ??
      `This practice plan was designed for a ${plan?.ageGroup ?? "youth"} ${plan?.sport ?? "baseball"} team with a focus on ${(plan?.goals ?? []).join(", ") || "general fundamentals"}. The sequence progresses from warmup through technical work to conditioning, following best practices for athletic development. Each drill was selected to maximize repetition within your time constraints.`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ rationale }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
