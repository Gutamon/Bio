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
    cache: 'no-store'
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
    // 為相容 GitHub Pages 的純靜態匯出功能，此處移除 cache: 'no-store'，
    // 讓 Next.js 在 build 的當下把結果快取起來編成純靜態網頁
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
  // Fetch top tracks (short_term = roughly last 4 weeks)
  const data = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=50', 'GET');

  if (!data || !data.items) {
    return { tracks: [], albums: [] };
  }

  const tracks: MusicItem[] = [];
  const seenTrackKeys = new Set<string>();
  const albumsMap = new Map<string, MusicItem>();
  const seenAlbumKeys = new Set<string>();

  data.items.forEach((item: any) => {
    // Collect Top Tracks，跳過重複的曲目（同曲名+歌手），遞補下一筆
    const trackKey = `${item.name.toLowerCase()}::${item.artists.map((a: any) => a.name).join(', ').toLowerCase()}`;
    if (tracks.length < 10 && !seenTrackKeys.has(trackKey)) {
      seenTrackKeys.add(trackKey);
      tracks.push({
        id: item.id,
        title: item.name,
        artist: item.artists.map((a: any) => a.name).join(', '),
        spotifyUrl: item.external_urls.spotify,
        coverImage: item.album?.images?.[0]?.url || '',
      });
    }

    // Collect Unique Top Albums derived from all 50 top tracks，跳過重複的專輯（同專輯名+歌手），遞補下一筆
    if (item.album && albumsMap.size < 10) {
      const albumArtist = item.album.artists.map((a: any) => a.name).join(', ');
      const albumKey = `${item.album.name.toLowerCase()}::${albumArtist.toLowerCase()}`;
      const type = item.album.album_type?.toLowerCase();
      const trackCount = item.album.total_tracks || 0;

      // 只允許「正式專輯 (album)」或是「曲目數量大於等於4首的迷你專輯/EP」
      if (!seenAlbumKeys.has(albumKey) && (type === 'album' || (type === 'single' && trackCount >= 4))) {
        seenAlbumKeys.add(albumKey);
        albumsMap.set(item.album.id, {
          id: item.album.id,
          title: item.album.name,
          artist: albumArtist,
          spotifyUrl: item.album.external_urls.spotify,
          coverImage: item.album.images?.[0]?.url || '',
        });
      }
    }
  });

  return {
    tracks,
    albums: Array.from(albumsMap.values()).slice(0, 10),
  };
}
