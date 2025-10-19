// server.js (UPDATED for Chat History)

import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY .env file mein nahi mili.");
    process.exit(1);
}
const ai = new GoogleGenAI({}); 

// Chat Session ko server-side par store karne ke liye
// NOTE: Production mein, aapko sessions ko database ya Redis mein store karna padega.
// Filhal, yeh demo ke liye simple in-memory storage hai.
let chatSession = null; 
let sessionInitialized = false;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Chat session ko initialize (shuru) karein
function initializeChat() {
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        // Agar aap chahte hain ki chat koi initial instructions follow kare,
        // to yahan 'config' mein 'systemInstruction' add kar sakte hain.
    });
    sessionInitialized = true;
    console.log("[BACKEND] Naya Chat Session shuru hua.");
}

// Har request se pehle chat session check karein
app.use((req, res, next) => {
    if (!sessionInitialized) {
        initializeChat();
    }
    next();
});

// Prompt ko handle karne ke liye POST endpoint
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt bhej na zaroori hai.' });
    }

    try {
        // --- Gemini Chat API Call (History maintain hogi) ---
        const response = await chatSession.sendMessage({
            message: prompt,
        });

        // Result frontend ko bhej dein
        res.json({ result: response.text });
        
    } catch (error) {
        console.error('[GEMINI API ERROR]:', error.message || error);
        res.status(500).json({ error: 'Content generate karne mein masla hua. Server console dekhein.' });
    }
});

// Server start karein
app.listen(PORT, () => {
    console.log(`Server chal raha hai: http://localhost:${PORT}`);
});