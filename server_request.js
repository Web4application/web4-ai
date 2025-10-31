import express from "express";
import dotenv from "dotenv";
import { openai, defaultAIConfig } from "./config/ai.js";

dotenv.config();
const app = express();
app.use(express.json());

/**
 * GET /api/chat
 * Simple EventSource (useful for browsers)
 * Example: new EventSource("/api/chat?message=Hello")
 */
app.get("/api/chat", async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const promptMessages = [
      { role: "system", content: "You are GPT-5-mini, a helpful assistant." },
      { role: "developer", content: "Follow medium verbosity and reasoning effort." },
      { role: "user", content: message },
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.responses.stream({
      ...defaultAIConfig,
      input: promptMessages,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(`data: ${event.delta}\n\n`);
      } else if (event.type === "response.completed") {
        res.write("data: [END]\n\n");
        res.end();
      }
    }
  } catch (err) {
    console.error("❌ GET SSE error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI request failed." });
    } else {
      res.end();
    }
  }
});

/**
 * POST /api/chat
 * JSON body (supports variables, tools, dev messages)
 * Example:
 * {
 *   "message": "Explain blockchain",
 *   "variables": {"userId": "123"},
 *   "tools": []
 * }
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, variables = {}, tools = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const promptMessages = [
      { role: "system", content: "You are GPT-5-mini, a helpful assistant." },
      { role: "developer", content: `Use verbosity=${defaultAIConfig.text.verbosity}, reasoning effort=${defaultAIConfig.reasoning.effort}` },
      { role: "user", content: message },
      { role: "user", content: `Context: ${JSON.stringify(variables)}` },
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.responses.stream({
      ...defaultAIConfig,
      tools,
      input: promptMessages,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(`data: ${event.delta}\n\n`);
      } else if (event.type === "response.completed") {
        res.write("data: [END]\n\n");
        res.end();
      }
    }
  } catch (err) {
    console.error("❌ POST SSE error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI request failed." });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SSE server running at http://localhost:${PORT}`);
});
