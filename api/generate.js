export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { input, tone, format } = req.body;
    if (!input) return res.status(400).json({ error: 'Input manquant' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu es un expert en copywriting LinkedIn francophone. GÃ©nÃ¨re des posts LinkedIn viraux en franÃ§ais. 150-280 mots. Accroche percutante. Sauts de ligne frÃ©quents. CTA final. Max 3 hashtags. Pas de markdown. Ton : ${tone}. Format : ${format}. GÃ©nÃ¨re UNIQUEMENT le post.`,
        messages: [{ role: 'user', content: `GÃ©nÃ¨re un post LinkedIn Ã  partir de : "${input}"` }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.content?.map(b => b.text || '').join('').trim() || '';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
