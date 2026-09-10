import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initialize Gemini client
let geminiClient: any = null;
async function getGemini() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!geminiClient) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Could not load GoogleGenAI SDK:", e);
      return null;
    }
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    name: "BrainDump API"
  });
});

// Endpoint: AI Dump Generation from Natural Language Description & Photo Metadata
app.post("/api/generate-dump", async (req, res) => {
  try {
    const { prompt, photoCount, slideCount, aspect, aesthetic, photos, title } = req.body;
    const ai = await getGemini();

    if (ai) {
      const systemInstruction = `You are BrainDump's expert aesthetic photo carousel layout director.
You design stylish, Instagram-worthy multi-slide photo dumps (crsel.app style).
Given a user vibe/prompt, target number of slides (${slideCount || 5}), aspect ratio (${aspect || "4:5"}), and aesthetic (${aesthetic || "vintage film"}), output a structured JSON plan for each slide.
Each slide can have:
- layoutType: "full-bleed" | "collage-2" | "collage-3" | "polaroids" | "filmstrip" | "scrapbook" | "minimal-quote" | "split" | "grid-4"
- title or subtitle text
- caption or quote
- stickerTags (e.g. ["sparkle", "star", "tape", "film_stamp", "flower", "heart", "smiley"])
- backgroundStyle: "warm-cream" | "dark-charcoal" | "pastel-pink" | "pastel-lilac" | "film-grain" | "soft-olive"
- photoPlacements: array of target items with framing (e.g. "polaroid", "rounded", "film-border", "full", "torn") and slight rotation (-3 to 3 deg).

Output strictly valid JSON with no markdown wrapping or preamble:
{
  "dumpTitle": "string",
  "vibeSummary": "string",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "slides": [
    {
      "slideNumber": 1,
      "layoutType": "...",
      "headline": "...",
      "subheadline": "...",
      "photoCount": 2,
      "styleNotes": "...",
      "stickers": ["..."]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `User request: "${prompt}". Number of slides: ${slideCount || 5}. Photos available: ${photoCount || 10}. Aesthetic: ${aesthetic || "effortless"}. Title hint: ${title || ""}`
              }
            ]
          }
        ],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, plan: parsed, source: "gemini" });
        } catch (parseError) {
          console.error("JSON parse error from Gemini:", parseError);
        }
      }
    }

    // Fallback deterministic smart synthesis
    return res.json({
      success: true,
      source: "algorithmic",
      plan: {
        dumpTitle: title || "Summer Memories",
        vibeSummary: prompt || "Effortless aesthetic photo dump",
        colorPalette: ["#FAF8F5", "#E8E2D9", "#F3E8EE"],
        slides: Array.from({ length: Number(slideCount) || 5 }, (_, i) => ({
          slideNumber: i + 1,
          layoutType: i === 0 ? "full-bleed" : i === 1 ? "polaroids" : i === 2 ? "collage-3" : i === 3 ? "scrapbook" : "split",
          headline: i === 0 ? (title || "chapter one") : "",
          subheadline: i === 0 ? "golden moments & sunny days" : "",
          photoCount: i === 0 ? 1 : i === 1 ? 2 : i === 2 ? 3 : 2,
          stickers: i === 1 ? ["tape", "star"] : ["film_stamp"]
        }))
      }
    });
  } catch (error: any) {
    console.error("Error in /api/generate-dump:", error);
    res.status(500).json({ error: error.message || "Failed to generate layout" });
  }
});

// Endpoint: AI Slide Tweak Assistant
app.post("/api/tweak-slide", async (req, res) => {
  try {
    const { instruction, currentSlide, aesthetic } = req.body;
    const ai = await getGemini();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are an AI photo dump carousel stylist. The user wants to adjust a single slide.
User instruction: "${instruction}".
Current slide layout: ${JSON.stringify(currentSlide || {})}.
Aesthetic: ${aesthetic || "clean minimal"}.
Suggest layout change. Pick layoutType from: "full-bleed", "polaroids", "collage-2", "collage-3", "scrapbook", "minimal-quote", "split", "filmstrip".
Suggest headline, caption, and sticker recommendations.
Respond in valid JSON only:
{
  "layoutType": "string",
  "headline": "string",
  "caption": "string",
  "stickers": ["string"],
  "rotationStyle": "none" | "messy" | "gentle",
  "backgroundVariant": "string",
  "tip": "string"
}`
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.6
        }
      });

      if (response.text) {
        return res.json({ success: true, tweak: JSON.parse(response.text) });
      }
    }

    // Fallback tweak
    let layoutType = "polaroids";
    const lower = (instruction || "").toLowerCase();
    if (lower.includes("minimal")) layoutType = "minimal-quote";
    else if (lower.includes("mess") || lower.includes("chaotic")) layoutType = "scrapbook";
    else if (lower.includes("bleed") || lower.includes("full")) layoutType = "full-bleed";
    else if (lower.includes("3") || lower.includes("three")) layoutType = "collage-3";

    return res.json({
      success: true,
      tweak: {
        layoutType,
        headline: lower.includes("caption") ? "vibes on film" : "",
        caption: "captured in between moments",
        stickers: lower.includes("mess") ? ["tape", "star", "sparkle"] : ["star"],
        rotationStyle: lower.includes("mess") ? "messy" : "gentle",
        tip: `Updated layout to ${layoutType} based on "${instruction}"`
      }
    });
  } catch (error: any) {
    console.error("Error in /api/tweak-slide:", error);
    res.status(500).json({ error: error.message || "Failed to tweak slide" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BrainDump server running on http://localhost:${PORT}`);
  });
}

startServer();
