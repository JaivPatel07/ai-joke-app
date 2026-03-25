import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const FALLBACK_JOKES = [
  {
    joke: "I cleaned my room for once, and now I keep losing things because nothing is in its natural habitat anymore."
  },
  {
    joke: "My phone battery lasts all day when I do not touch it, which is exactly how my motivation works too."
  },
  {
    joke: "I told myself I would go to bed early, then I started one quick video and accidentally enrolled in a two-hour documentary about octopuses."
  },
  {
    joke: "I bought a planner to organize my life, and now my chaos is just neatly scheduled."
  },
  {
    joke: "I made a healthy salad for lunch and rewarded myself with a cookie for making good choices, so we are back to balance."
  }
];

function getFallbackJoke() {
  const jokes = FALLBACK_JOKES;
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function extractJokeFromText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Model returned empty content");
  }

  // Remove markdown fences when models wrap JSON in ```json blocks.
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const parsed = JSON.parse(stripped);
  if (!parsed.joke) {
    throw new Error("Model response missing joke");
  }

  return {
    joke: String(parsed.joke).trim()
  };
}

app.post("/joke", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json(getFallbackJoke());
    }

    const prompt = `Tell me a very funny, natural-sounding joke.

  Rules:
  - Not question-answer style
  - Can be storytelling or one-liner
  - Should feel like a real comedian said it
  - Keep it short and clean
  - Make it actually funny (not boring)

  Return ONLY JSON:
  {"joke":"..."}
  `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "joke_response",
            schema: {
              type: "object",
              properties: {
                joke: { type: "string" }
              },
              required: ["joke"],
              additionalProperties: false
            }
          }
        }
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    const joke = extractJokeFromText(text);
    return res.status(200).json(joke);

  } catch (err) {
    console.error("/joke error:", err?.message || err);
    return res.status(200).json(getFallbackJoke());
  }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));