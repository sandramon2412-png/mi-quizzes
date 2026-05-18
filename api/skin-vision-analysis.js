const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_VISION_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-4.1-mini';

function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string') return data.output_text;
  const chunks = [];
  for (const item of data?.output || []) {
    for (const part of item?.content || []) {
      if (typeof part?.text === 'string') chunks.push(part.text);
      if (typeof part?.output_text === 'string') chunks.push(part.output_text);
    }
  }
  return chunks.join('\n').trim();
}

function parseJson(text) {
  try { return JSON.parse(text); } catch {}
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    try { return Promise.resolve(JSON.parse(req.body || '{}')); } catch { return Promise.reject(new Error('Invalid JSON payload')); }
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5_000_000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON payload')); }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed' });
    return;
  }
  if (!OPENAI_API_KEY) {
    send(res, 503, { error: 'OPENAI_API_KEY is not configured' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const image = String(body.image || '');
    if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(image)) {
      send(res, 400, { error: 'A base64 image data URL is required' });
      return;
    }
    if (image.length > 4_200_000) {
      send(res, 413, { error: 'Image is too large. Please upload a smaller image.' });
      return;
    }

    const metrics = body.metrics || {};
    const quizContext = body.quizContext || {};
    const prompt = `
Eres una especialista educativa en skincare para SkinGlow AI. Analiza la imagen como lectura visual, no como diagnostico medico.

Reglas:
- No diagnostiques enfermedades ni menciones condiciones como certeza clinica.
- Usa frases como "se observa", "parece", "conviene validar", "senal visible".
- Si ves lesiones severas, secrecion, herida, alergia fuerte o inflamacion intensa, recomienda consultar dermatologia.
- Devuelve SOLO JSON valido, sin markdown.

Contexto del producto: reto de 21 dias para entender senales de piel, ordenar rutina AM/PM, usar protector solar, registrar cambios y no mezclar activos por ansiedad.
Metricas locales ya calculadas: ${JSON.stringify(metrics).slice(0, 4000)}
Contexto de quiz/respuestas si existe: ${JSON.stringify(quizContext).slice(0, 4000)}

Formato exacto:
{
  "source": "openai-vision",
  "headline": "frase corta de prioridad",
  "confidence": 0-100,
  "photoQuality": {"score": 0-100, "label": "buena|aceptable|baja", "notes": ["..."]},
  "visibleSignals": [
    {"zone": "frente|mejillas|menton|nariz|general", "signal": "...", "level": "bajo|medio|alto", "explanation": "..."}
  ],
  "interpretation": "parrafo breve y responsable",
  "questions": ["pregunta 1 para completar contexto", "pregunta 2", "pregunta 3"],
  "routine": {
    "morning": ["paso seguro 1", "paso seguro 2", "paso seguro 3"],
    "night": ["paso seguro 1", "paso seguro 2", "paso seguro 3"],
    "avoid": ["activo o practica a pausar si aplica"]
  },
  "redFlags": ["cuando consultar dermatologia"],
  "nextStep": "accion concreta para hoy",
  "disclaimer": "texto corto educativo"
}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: image, detail: 'high' },
          ],
        }],
        temperature: 0.2,
        max_output_tokens: 1400,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      send(res, response.status, { error: data?.error?.message || 'OpenAI vision request failed' });
      return;
    }

    const text = extractOutputText(data);
    const analysis = parseJson(text);
    if (!analysis) {
      send(res, 502, { error: 'Vision model returned invalid JSON', raw: text.slice(0, 800) });
      return;
    }

    send(res, 200, { analysis, model: OPENAI_MODEL });
  } catch (error) {
    send(res, 500, { error: error?.message || 'Unexpected skin vision error' });
  }
};
