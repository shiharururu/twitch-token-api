let cachedToken = null;
let expiry = 0;

export default async function handler(req, res) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const now = Date.now();

  // Si on a déjà un token valide en cache, on le renvoie
  if (cachedToken && now < expiry) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ access_token: cachedToken });
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });

    const data = await response.json();

    if (data.access_token) {
      cachedToken = data.access_token;
      expiry = now + (data.expires_in - 60) * 1000; // cache avec une marge
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({ access_token: cachedToken });
    } else {
      return res.status(500).json({ error: 'Erreur: aucun token', details: data });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne', details: err.message });
  }
}

