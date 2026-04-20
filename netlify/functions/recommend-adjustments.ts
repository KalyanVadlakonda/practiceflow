import type { Handler, HandlerEvent } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    // Mock recommendations
    const recommendations = [
      {
        id: "rec-1",
        type: "adjust-duration",
        title: "Consider extending infield work",
        description: "Adding 5 more minutes to ground ball reps could improve defensive efficiency.",
        rationale: "Based on similar teams at this age group, extended infield reps show strong retention.",
        confidence: 0.82,
      },
      {
        id: "rec-2",
        type: "sequence",
        title: "Move conditioning to the end",
        description: "Conditioning drills work best at the end of practice when athletes are warmed up.",
        rationale: "Players perform better technically when conditioning follows skill work.",
        confidence: 0.74,
      },
      {
        id: "rec-3",
        type: "add-drill",
        title: "Add a mental coaching moment",
        description: "A 5-minute mental reset circle before batting practice could improve focus.",
        rationale: "Mental preparation before hitting sessions correlates with higher contact rates.",
        drillId: "d-mental-focus",
        confidence: 0.65,
      },
    ];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ recommendations }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
