// pages/api/now-playing.js

const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = 'nugehood';

export default async function handler(req, res) {
  try {
    if (!API_KEY) {
      throw new Error('Missing LASTFM_API_KEY env var');
    }

    const url =
      `https://ws.audioscrobbler.com/2.0/` +
      `?method=user.getrecenttracks` +
      `&user=${USERNAME}` +
      `&api_key=${API_KEY}` +
      `&format=json&limit=1`;

    // Use the built-in fetch
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Last.fm API responded ${response.status}`);
    }

    const data = await response.json();
    const track = data.recenttracks?.track?.[0];

    let message = 'Nothing playing';
    if (track && track['@attr']?.nowplaying === 'true') {
      message = `${track.name} – ${track.artist['#text']}`;
    }

    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate');
    res.json({
      schemaVersion: 1,
      label: '🎧 Listening',
      message
    });
  } catch (err) {
    console.error('🛑 /api/now-playing error:', err);
    res.status(500).json({ error: err.message });
  }
}
