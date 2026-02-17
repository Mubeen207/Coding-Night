import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY .env file mein nahi mili.");
  process.exit(1);
}
const ai = new GoogleGenAI({});

let chatSession = null;
let sessionInitialized = false;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

function initializeChat() {
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
  });
  sessionInitialized = true;
  console.log("[BACKEND] Naya Chat Session shuru hua.");
}

app.use((req, res, next) => {
  if (!sessionInitialized) {
    initializeChat();
  }
  next();
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt bhej na zaroori hai." });
  }

  try {
    const response = await chatSession.sendMessage({
      message: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error("[GEMINI API ERROR]:", error.message || error);
    res
      .status(500)
      .json({
        error: "Content generate karne mein masla hua. Server console dekhein.",
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
