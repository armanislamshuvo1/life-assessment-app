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
}
