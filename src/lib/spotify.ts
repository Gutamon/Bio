import { MusicData, MusicItem } from './data';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
  // 為了防止開發時還沒設定完整的 ENV 而報錯，保留退路
  if (!refresh_token || !client_id || !client_secret) {
    return process.env.SPOTIFY_ACCESS_TOKEN || 'BQA8pV8cYv_myGCtOUXvQea17YL0GibSOhxFCbTS4sp6Cu5dbeFdD3Jfhif1qVWljUHmSLGKyN-PvZ9SFn9DssSgGpdiXeIh5m0dR3xR8VcCU4Rrn82YbemwbdSSJArPgGUVcz86AZ5Ad9i-EFw1_xXnu0lCVhEuuCu7xHJ7LAUo_mh4HeJg3BVN83TQr_cPtmCCRfuSgy7PG-uO5ccOHpnD499X2CUedf-xstFTtV4U159TRlXjuXdREweZEZYDAp8Hyl7KoGyARlUz89C4G-54rh0ZNrIRTFvk6gEashub-jQi07sZyOkak3mdxHSHbL5SUtfong';
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    next: { revalidate: 3500 } // Token 有效期是 3600 秒
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const access_token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
    // 移除快取讓它每次重整都拿最新內容 (因為在 page.tsx 已經有控制快取了)
    cache: 'no-store'
  });
  
  if (!res.ok) {
    console.error(`Spotify API fetched failed with status: ${res.status}`);
    return null;
  }
  
  return await res.json();
}

/**
 * Fetch Top Tracks from Spotify and map them to our MusicData format
 */
export async function getSpotifyTopData(): Promise<Omit<MusicData, 'weeklyRecaps'>> {
  // Fetch top tracks (medium_term = roughly last 6 months, matching 2026-01-01 to now)
  const data = await fetchWebApi('v1/me/top/tracks?time_range=medium_term&limit=50', 'GET');
  
  if (!data || !data.items) {
    return { tracks: [], albums: [] };
  }

  const tracks: MusicItem[] = [];
  const albumsMap = new Map<string, MusicItem>();

  data.items.forEach((item: any) => {
    // Collect Top Tracks
    if (tracks.length < 10) {
      tracks.push({
        id: item.id,
        title: item.name,
        artist: item.artists.map((a: any) => a.name).join(', '),
        spotifyUrl: item.external_urls.spotify,
      });
    }

    // Collect Unique Top Albums derived from all 50 top tracks
    if (item.album && albumsMap.size < 10 && !albumsMap.has(item.album.id)) {
      const type = item.album.album_type?.toLowerCase();
      const trackCount = item.album.total_tracks || 0;
      
      // 只允許「正式專輯 (album)」或是「曲目數量大於等於4首的迷你專輯/EP」
      if (type === 'album' || (type === 'single' && trackCount >= 4)) {
        albumsMap.set(item.album.id, {
          id: item.album.id,
          title: item.album.name,
          artist: item.album.artists.map((a: any) => a.name).join(', '),
          spotifyUrl: item.album.external_urls.spotify,
        });
      }
    }
  });

  return {
    tracks,
    albums: Array.from(albumsMap.values()).slice(0, 10),
  };
}
