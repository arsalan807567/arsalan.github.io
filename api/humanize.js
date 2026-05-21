export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic rate limit header check — blocks non-browser abuse
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  const allowed = ['arsalanportfolio.live', 'www.arsalanportfolio.live', 'localhost'];
  const isAllowed = allowed.some(d => origin.includes(d) || referer.includes(d));
  if (!isAllowed && origin !== '') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { text, systemPrompt } = req.body;
  if (!text || typeof text !== 'string' || text.length < 10) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  if (text.length > 8000) {
    return res.status(400).json({ error: 'Text too long. Maximum 8000 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt + '\n\nText to humanize:\n\n' + text }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || 'Gemini API error';
      return res.status(response.status).json({ error: msg });
    }

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!output) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    return res.status(200).json({ result: output });

  } catch (err) {
    console.error('Humanizer proxy error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
