export default async function handler(req, res) {
  // CORS headers — needed for static site calling serverless function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, systemPrompt } = req.body || {};

  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide valid text to humanize.' });
  }

  if (text.length > 8000) {
    return res.status(400).json({ error: 'Text too long. Maximum 8000 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Service not configured. Contact the site owner.' });
  }

  const prompt = (systemPrompt || 'Rewrite the following AI-generated text to sound natural and human-written. Return only the rewritten text.') +
    '\n\nText to humanize:\n\n' + text.trim();

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || ('Gemini error ' + geminiRes.status);
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'Daily quota reached. Please try again tomorrow.' });
      }
      return res.status(geminiRes.status).json({ error: errMsg });
    }

    const data = await geminiRes.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!output) {
      return res.status(500).json({ error: 'Empty response from Gemini. Please try again.' });
    }

    return res.status(200).json({ result: output });

  } catch (err) {
    console.error('Humanizer error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
