import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if present
let GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDbml3_H1bFih1s3ZR_2l0reJQdRJt9QfQ';
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && v.length) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (k === 'GEMINI_API_KEY') GEMINI_API_KEY = val;
    }
  });
}

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to call Gemini API
async function callGemini(contents, systemInstruction = '', responseSchema = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const body = {
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (responseSchema) {
    body.generationConfig.responseMimeType = "application/json";
    body.generationConfig.responseSchema = responseSchema;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('No response text returned by Gemini');
  }
  textOutput = textOutput.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return textOutput;
}

const server = http.createServer(async (req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const cleanUrl = req.url.split('?')[0];

  // API Route: Generate AI Assessment
  if (req.method === 'POST' && cleanUrl === '/api/ai-assess') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyData);
        const { pillarResults, overallScore, answersSummary, notes } = payload;

        const systemPrompt = `You are a world-class holistic executive and life balance coach, trained in positive psychology, performance science, and somatic well-being.
Analyze this user's 6-pillar assessment data (Career, Health, Mind, Finance, Relationships, Lifestyle) and generate a deep, empathetic, sharp, and highly tailored diagnostic assessment report.
Be perceptive, constructive, and realistic. Avoid fluff or generic motivational clichés. Focus on root cause interplay (e.g. how work boundaries or financial worries impact nervous system resilience and relational presence).`;

        const userPrompt = `Here is the user's assessment profile:
- Holistic Life Score: ${overallScore}/100
- Category Scores:
  * Career & Ambition: ${pillarResults.career.score}% (${pillarResults.career.status})
  * Health & Vitality: ${pillarResults.health.score}% (${pillarResults.health.status})
  * Mind & Emotional State: ${pillarResults.mental.score}% (${pillarResults.mental.status})
  * Finance & Wealth: ${pillarResults.finance.score}% (${pillarResults.finance.status})
  * Relationships & Community: ${pillarResults.relationships.score}% (${pillarResults.relationships.status})
  * Lifestyle, Growth & Joy: ${pillarResults.lifestyle.score}% (${pillarResults.lifestyle.status})

- Specific Question Breakdown:
${answersSummary}

${notes ? `- User's Personal Notes & Context: "${notes}"` : ''}

Generate a comprehensive assessment JSON response matching the required schema.`;

        const responseSchema = {
          type: "OBJECT",
          properties: {
            archetypeTitle: { type: "STRING" },
            archetypeBadge: { type: "STRING" },
            executiveSummary: { type: "STRING" },
            rootCauseInterplay: { type: "STRING" },
            superpowers: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  pillar: { type: "STRING" },
                  strength: { type: "STRING" },
                  leverageAdvice: { type: "STRING" }
                },
                required: ["pillar", "strength", "leverageAdvice"]
              }
            },
            blindspots: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  area: { type: "STRING" },
                  frictionPoint: { type: "STRING" },
                  solution: { type: "STRING" }
                },
                required: ["area", "frictionPoint", "solution"]
              }
            },
            weeklyRoadmap: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  week: { type: "STRING" },
                  focus: { type: "STRING" },
                  microHabit: { type: "STRING" },
                  expectedOutcome: { type: "STRING" }
                },
                required: ["week", "focus", "microHabit", "expectedOutcome"]
              }
            },
            coachingQuestion: { type: "STRING" }
          },
          required: [
            "archetypeTitle",
            "archetypeBadge",
            "executiveSummary",
            "rootCauseInterplay",
            "superpowers",
            "blindspots",
            "weeklyRoadmap",
            "coachingQuestion"
          ]
        };

        const resultJsonString = await callGemini(
          [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemPrompt,
          responseSchema
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(resultJsonString);
      } catch (err) {
        console.error('Error generating AI assessment:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Route: Chat with AI Coach
  if (req.method === 'POST' && cleanUrl === '/api/ai-chat') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyData);
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
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

export default server;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`LifeSync AI Assessment Server is running at http://localhost:${PORT}`);
  });
}
