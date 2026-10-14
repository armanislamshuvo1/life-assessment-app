import fs from 'fs';
import path from 'path';

let GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDbml3_H1bFih1s3ZR_2l0reJQdRJt9QfQ';

try {
  const envPath = path.join(process.cwd(), '.env');
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
} catch (e) {
  // Ignore in restricted environments
}

export async function callGemini(contents, systemInstruction = '', responseSchema = null) {
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

export async function parseBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const text = Buffer.concat(buffers).toString('utf-8');
  return text ? JSON.parse(text) : {};
}
