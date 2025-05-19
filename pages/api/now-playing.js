// pages/api/now-playing.js
import fetch from 'node-fetch';

const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = 'nugehood';

export default async function handler(req, res) {
  const url =
    `https://ws.audioscrobbler.com/2.0/` +
    `?method=user.getrecenttracks` +
    `&user=${USERNAME}` +
    `&api_key=${API_KEY}` +
    `&format=json&limit=1`;

  const { recenttracks } = await fetch(url).then(r => r.json());
  const track = recenttracks.track[0];

  let message = 'Nothing playing';
  if (track['@attr']?.nowplaying === 'true') {
    const title = track.name;
    const artist = track.artist['#text'];
    message = `${title} – ${artist}`;
  }

  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate');
  res.json({
    schemaVersion: 1,
    label: '🎧 Listening',
    message
  });
}
