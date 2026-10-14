import { callGemini, parseBody } from './_gemini.js';

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const payload = await parseBody(req);
    const { message, assessmentContext, history } = payload;

    const systemPrompt = `You are LifeSync's dedicated AI Life & Career Coach. You have intimate knowledge of the user's completed assessment:
- Overall Score: ${assessmentContext.overallScore}/100
- Archetype: ${assessmentContext.archetypeTitle}
- Pillar Breakdown: ${JSON.stringify(assessmentContext.pillarScores)}
- Core Blindspots: ${JSON.stringify(assessmentContext.blindspots || [])}
- User Notes: ${assessmentContext.notes || 'None provided'}

Respond concisely, thoughtfully, and pragmatically in markdown. Give actionable steps, psychological clarity, and encouraging, compassionate guidance.`;

    const geminiHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    geminiHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const reply = await callGemini(geminiHistory, systemPrompt);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ reply }));
  } catch (err) {
    console.error('Error in coach chat:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
