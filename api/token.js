export default async function handler(req, res) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

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
      res.status(200).json({ token: data.access_token });
    } else {
      res.status(500).json({ error: 'Erreur: aucun token', details: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne', details: err.message });
  }
}
