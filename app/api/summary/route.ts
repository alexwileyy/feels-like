import Anthropic from "@anthropic-ai/sdk";
import type { SummaryInput } from "@/lib/summary";

// Josie's AI weather report. The client always renders the template summary
// first; this route upgrades it when a key is configured (locally via
// .env.local, on Vercel via project env vars).

const SYSTEM = `You are the voice of "Feels", a weather app made for one person: Josie.
Write her a tiny spoken-style weather report for the day ahead.

Rules:
- Two short sentences, max ~45 words total.
- Warm, playful, British. Talk to Josie directly.
- Anchor on what to WEAR and how the day FEELS, not meteorology jargon.
- The feeling words provided (HOT, MILD, etc.) are calibrated to how Josie
  personally experiences temperature - trust them over the raw numbers.
- If it's rainy AND windy (30km/h+), an umbrella is useless - say hood up.
- Never use em-dashes. No emojis. No greeting like "Hi" - straight in.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  try {
    const data = (await req.json()) as SummaryInput;
    const digest = {
      now: {
        feeling: data.word,
        feelsLike: Math.round(data.feelsLike),
        windKmh: Math.round(data.windKmh),
        chanceOfRainPct: Math.round(data.rainPct),
      },
      restOfDay: data.hours.map((h) => ({
        time: h.label,
        feeling: h.word,
        feelsLike: Math.round(h.feelsLike),
        raining: h.isRaining,
      })),
    };

    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 150,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Today's data for Josie:\n${JSON.stringify(digest, null, 2)}`,
        },
      ],
    });

    const text = message.content.find((b) => b.type === "text")?.text.trim();
    if (!text) throw new Error("empty response");
    return Response.json({ summary: text });
  } catch (err) {
    console.error("summary route failed:", err);
    return Response.json({ error: "summary unavailable" }, { status: 502 });
  }
}
