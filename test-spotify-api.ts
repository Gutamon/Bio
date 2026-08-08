import fs from 'fs';
import https from 'https';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) env[parts[0].trim()] = parts[1].trim();
});

const client_id = env['SPOTIFY_CLIENT_ID'];
const client_secret = env['SPOTIFY_CLIENT_SECRET'];
const refresh_token = env['SPOTIFY_REFRESH_TOKEN'];
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

async function test() {
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  });
  
  const tokenData = await tokenRes.json();
  const accToken = tokenData.access_token;
  if (!accToken) {
    console.error("Failed to get access token", tokenData);
    return;
  }
  
  const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50', {
    headers: { Authorization: `Bearer ${accToken}` }
  });
  
  const data = await topTracksRes.json();
  
  if (!data || !data.items) {
    console.log("No items returned");
    return;
  }
  
  console.log("Found tracks:", data.items.length);
  
  let albumsMap = new Map();
  data.items.forEach((item: any) => {
    if (item.album) {
      if (item.album.album_type === 'ALBUM' || item.album.album_type === 'SINGLE') {
        albumsMap.set(item.album.id, item.album.name);
      }
    }
  });
  
  console.log("Found unique albums:", albumsMap.size);
  console.log(Array.from(albumsMap.entries()).slice(0, 5));
}
test();
