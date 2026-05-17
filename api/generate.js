export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { input, tone, format } = req.body;

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
      system: `Tu es un expert en copywriting LinkedIn francophone. Génère des posts LinkedIn viraux en français. 150-280 mots. Accroche percutante. Sauts de ligne fréquents. CTA final. Max 3 hashtags. Pas de markdown. Ton : ${tone}. Format : ${format}. Génère UNIQUEMENT le post.`,
      messages: [{ role: 'user', content: `Génère un post LinkedIn à partir de : "${input}"` }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(b => b.text || '').join('').trim();
  res.status(200).json({ text });
}
