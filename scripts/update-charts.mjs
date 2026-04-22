/**
 * scripts/update-charts.mjs
 *
 * 在 `npm run build` 之前執行，從 Spotify 抓取最新的 top tracks / albums
 * 並更新 content/music/charts.json（只更新 tracks 和 albums，保留 weeklyRecaps）
 *
 * 用法：node scripts/update-charts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHARTS_PATH = path.join(__dirname, '..', 'content', 'music', 'charts.json');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// ── 驗證環境變數 ────────────────────────────────────────────────────────────
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('❌ 缺少必要的 Spotify 環境變數：');
  console.error(`   SPOTIFY_CLIENT_ID     : ${CLIENT_ID ? '✓' : '✗ 未設定'}`);
  console.error(`   SPOTIFY_CLIENT_SECRET : ${CLIENT_SECRET ? '✓' : '✗ 未設定'}`);
  console.error(`   SPOTIFY_REFRESH_TOKEN : ${REFRESH_TOKEN ? '✓' : '✗ 未設定'}`);
  process.exit(1);
}

// ── 取得 Access Token ────────────────────────────────────────────────────────
async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange 失敗 (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`回應中沒有 access_token：${JSON.stringify(data)}`);
  }

  console.log('✅ Access token 取得成功');
  return data.access_token;
}

// ── 呼叫 Spotify API ─────────────────────────────────────────────────────────
async function fetchTopTracks(accessToken) {
  const res = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Top tracks API 失敗 (${res.status}): ${text}`);
  }

  const data = await res.json();
  console.log(`✅ 取得 ${data.items?.length ?? 0} 首 top tracks`);
  return data.items || [];
}

// ── 整理資料 ─────────────────────────────────────────────────────────────────
function processItems(items) {
  const tracks = [];
  const albumsMap = new Map();

  for (const item of items) {
    // Top Tracks（前 10）
    if (tracks.length < 10) {
      tracks.push({
        id: item.id,
        title: item.name,
        artist: item.artists.map((a) => a.name).join(', '),
        spotifyUrl: item.external_urls.spotify,
      });
    }

    // Top Albums（從 50 首中推導，前 10 張）
    if (item.album && albumsMap.size < 10 && !albumsMap.has(item.album.id)) {
      const type = item.album.album_type?.toLowerCase();
      const trackCount = item.album.total_tracks || 0;

      if (type === 'album' || (type === 'single' && trackCount >= 4)) {
        albumsMap.set(item.album.id, {
          id: item.album.id,
          title: item.album.name,
          artist: item.album.artists.map((a) => a.name).join(', '),
          spotifyUrl: item.album.external_urls.spotify,
        });
      }
    }
  }

  return {
    tracks,
    albums: Array.from(albumsMap.values()).slice(0, 10),
  };
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎵 開始更新 Spotify 榜單...');

  // 讀取現有資料（保留 weeklyRecaps）
  let existing = { tracks: [], albums: [], weeklyRecaps: [] };
  if (fs.existsSync(CHARTS_PATH)) {
    existing = JSON.parse(fs.readFileSync(CHARTS_PATH, 'utf-8'));
  }

  try {
    const accessToken = await getAccessToken();
    const items = await fetchTopTracks(accessToken);
    const { tracks, albums } = processItems(items);

    if (tracks.length === 0) {
      throw new Error('Spotify 回傳 0 筆資料，放棄更新以免清空榜單');
    }

    const updated = {
      tracks,
      albums,
      weeklyRecaps: existing.weeklyRecaps || [],
    };

    fs.writeFileSync(CHARTS_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    console.log(`✅ charts.json 更新完成 — ${tracks.length} tracks, ${albums.length} albums`);
  } catch (err) {
    console.error(`❌ 更新失敗，保留現有 charts.json：${err.message}`);
    // 不用 process.exit(1)，讓 build 繼續用舊資料
  }
}

main();
