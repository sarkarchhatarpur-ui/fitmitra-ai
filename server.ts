import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isApiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
}

function getGenAIClient(): GoogleGenAI | null {
  if (!isApiKeyConfigured()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/status', (_req, res) => {
    res.json({
      aiConfigured: isApiKeyConfigured(),
      mode: isApiKeyConfigured() ? 'live' : 'demo',
    });
  });

  app.post('/api/chat', async (req, res) => {
    const { message, profileContext, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Please provide a valid question or message.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.status(200).json({
        mode: 'demo',
        error: 'Live AI credentials are not configured on the server. Using clearly labelled Demo Mode response.',
      });
      return;
    }

    try {
      const systemInstruction = [
        'You are FitMitra AI, an evidence-based, supportive personal fitness and nutrition coach.',
        'Provide practical, safe, and clear guidance on exercise form, workout programming, Indian and global whole-food nutrition, food substitutions, and sustainable habits.',
        'SAFETY RULES:',
        '1. Never diagnose medical conditions, prescribe medication, or replace a qualified physician, physiotherapist, or registered dietitian.',
        '2. Never recommend crash diets, extreme calorie deficits (below 1400 kcal for women or 1600 kcal for men), dehydration tactics, or unregulated supplements.',
        '3. If the user mentions sharp pain, dizziness, chest pain, or a specific injury, advise stopping the aggravating movement and consulting a qualified healthcare professional.',
        '4. Remind users that calorie and macro figures are approximate estimates.',
        profileContext ? `USER PROFILE CONTEXT:\n${JSON.stringify(profileContext)}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const recentHistory = Array.isArray(history)
        ? history.slice(-6).map((m: { role: string; text: string }) => `${m.role === 'user' ? 'User' : 'FitMitra Coach'}: ${m.text}`).join('\n')
        : '';

      const fullPrompt = recentHistory
        ? `Previous conversation:\n${recentHistory}\n\nUser question: ${message}`
        : message;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const replyText = response.text || 'I could not generate a response right now. Please try rephrasing your question.';
      res.json({
        mode: 'live',
        reply: replyText,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error communicating with AI service.';
      res.status(502).json({
        mode: 'demo',
        error: errorMessage,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitMitra AI server running at http://localhost:${PORT}`);
  });
}

startServer();
