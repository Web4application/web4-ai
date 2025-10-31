import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import { getHistory, addMessage, resetHistory } from "./chatStore.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// --- Safe fetch helper ---
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} from ${url}: ${text.slice(0, 200)}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON from ${url}, got: ${text.slice(0, 200)}`);
  }

  try {
    return await res.json();
  } catch {
    const text = await res.text();
    throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 200)}`);
  }
}

// --- Define tools GPT-5-mini can call ---
const tools = [
  {
    name: "getWeather",
    description: "Fetch current weather for a city",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" }
      },
      required: ["location"]
    }
  },
  {
    name: "calculate",
    description: "Evaluate a mathematical expression safely",
    input_schema: {
      type: "object",
      properties: {
        expression: { type: "string", description: "Math expression in plain text" }
      },
      required: ["expression"]
    }
  }
];

// Dummy weather implementation (replace with real API)
async function getWeatherAPI(location) {
  // Example of using safe fetch if you later call a real API:
  // return await fetchJson(`https://api.weather.com?q=${encodeURIComponent(location)}`);
  return { location, temp: "21°C", condition: "Cloudy" };
}

// Safe math evaluation
function safeCalculate(expression) {
  try {
    const result = Function(`"use strict"; return (${expression})`)();
    return { expression, result };
  } catch {
    return { error: "Invalid expression" };
  }
}

// --- WebSocket handling ---
wss.on("connection", (ws) => {
  console.log("WebSocket client connected ✅");

  ws.on("message", async (msg) => {
    const { sessionId, content, reset } = JSON.parse(msg);

    if (reset) {
      resetHistory(sessionId);
      ws.send(JSON.stringify({ type: "system", data: "History reset." }));
      return;
    }

    addMessage(sessionId, "user", content);

    try {
      const stream = await openai.responses.stream({
        model: "gpt-5-mini",
        input: getHistory(sessionId),
        reasoning: { effort: "medium" },
        text: { format: { type: "text" }, verbosity: "medium" },
        tools,
        store: true
      });

      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          ws.send(JSON.stringify({ type: "message", data: event.delta }));
        }

        if (event.type === "response.tool_call") {
          const { name, arguments: args } = event;
          console.log(`🛠 Tool call: ${name}`, args);

          let result;
          if (name === "getWeather") {
            result = await getWeatherAPI(args.location);
          } else if (name === "calculate") {
            result = safeCalculate(args.expression);
          }

          addMessage(sessionId, "tool", JSON.stringify(result));
          ws.send(JSON.stringify({ type: "tool_result", data: result }));

          const followUp = await openai.responses.create({
            model: "gpt-5-mini",
            input: getHistory(sessionId),
            reasoning: { effort: "medium" },
            text: { format: { type: "text" }, verbosity: "medium" },
            store: true
          });

          const finalText = followUp.output[0].content
            .map((c) => c.text)
            .join("");

          addMessage(sessionId, "assistant", finalText);
          ws.send(JSON.stringify({ type: "message", data: finalText }));
        }

        if (event.type === "response.completed") {
          console.log("✅ GPT finished response");
          break;
        }
      }
    } catch (err) {
      console.error("Error:", err);
      ws.send(JSON.stringify({ type: "error", data: err.message }));
    }
  });
});

// --- SSE endpoint ---
app.post("/chat/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { content } = req.body;

  addMessage(sessionId, "user", content);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.responses.stream({
      model: "gpt-5-mini",
      input: getHistory(sessionId),
      reasoning: { effort: "medium" },
      text: { format: { type: "text" }, verbosity: "medium" },
      tools,
      store: true
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(`data: ${JSON.stringify(event.delta)}\n\n`);
      }
      if (event.type === "response.completed") {
        res.write("event: end\ndata: [DONE]\n\n");
        res.end();
        break;
      }
    }
  } catch (err) {
    console.error("Error:", err);
    res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
    res.end();
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 GPT-5-mini server running at http://localhost:${PORT}`)
);

