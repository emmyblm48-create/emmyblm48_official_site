// GET /api/views → { total, updated, source, views: { [youtubeId]: count }, meta: { [youtubeId]: { title, author } } }
// View counts for every clip in data.js (VIDEOS[].yt, MUSIC_VIDEOS[].yt); titles for MUSIC_VIDEOS.
// Uses the YouTube Data API when YOUTUBE_API_KEY is set (Vercel → Settings → Environment Variables),
// otherwise reads the public watch pages. Cached on Vercel's CDN for 1 hour.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const loadData = () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), "data.js"), "utf8"), sandbox);
  const mvIds = (sandbox.window.MUSIC_VIDEOS || []).map((v) => v.yt).filter(Boolean);
  const ids = [...new Set([...(sandbox.window.VIDEOS || []).map((v) => v.yt).filter(Boolean), ...mvIds])];
  return { ids, mvIds };
};

const fromApi = async (ids, key, meta) => {
  const views = {};
  for (let i = 0; i < ids.length; i += 50) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids.slice(i, i + 50).join(",")}&key=${key}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`YouTube API ${r.status}: ${(await r.json().catch(() => ({})))?.error?.message || r.statusText}`);
    for (const item of (await r.json()).items || []) {
      views[item.id] = Number(item.statistics.viewCount) || 0;
      meta[item.id] = { title: item.snippet.title, author: item.snippet.channelTitle };
    }
  }
  return views;
};

// title + channel name without an API key
const oembed = async (id) => {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if (!r.ok) return null;
    const d = await r.json();
    return { title: d.title, author: d.author_name };
  } catch { return null; }
};

// Without an API key: try several public YouTube endpoints per clip, a few at a time.
const num = (v) => (v != null && /^\d+$/.test(String(v)) ? Number(v) : null);
const fromWatchPage = async (id) => {
  const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en&gl=US`, {
    headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "accept-language": "en-US,en;q=0.9", cookie: "CONSENT=YES+1; SOCS=CAI" },
  });
  const html = await r.text();
  const m = html.match(/"videoDetails":\{[^]*?"viewCount":"(\d+)"/) || html.match(/itemprop="interactionCount" content="(\d+)"/) || html.match(/"viewCount":"(\d+)"/);
  return m ? Number(m[1]) : null;
};
const fromPlayer = (client) => async (id) => {
  const r = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": client.ua },
    body: JSON.stringify({ videoId: id, context: { client: { ...client.ctx, hl: "en", gl: "US" } } }),
  });
  if (!r.ok) return null;
  return num((await r.json())?.videoDetails?.viewCount);
};
const STRATEGIES = [
  fromWatchPage,
  fromPlayer({ ua: "com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip", ctx: { clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30 } }),
  fromPlayer({ ua: "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)", ctx: { clientName: "IOS", clientVersion: "19.09.3", deviceModel: "iPhone14,3" } }),
  fromPlayer({ ua: "Mozilla/5.0", ctx: { clientName: "WEB", clientVersion: "2.20240304.00.00" } }),
];
const fromWatchPages = async (ids) => {
  const views = {};
  const queue = [...ids];
  const worker = async () => {
    for (let id; (id = queue.shift()); ) {
      for (const get of STRATEGIES) {
        try { const n = await get(id); if (n != null) { views[id] = n; break; } } catch {}
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return views;
};

module.exports = async (req, res) => {
  try {
    const { ids, mvIds } = loadData();
    const key = process.env.YOUTUBE_API_KEY;
    const allMeta = {};
    let source = key ? "youtube-api" : "youtube-page";
    let apiError;
    let views;
    try {
      views = key ? await fromApi(ids, key, allMeta) : await fromWatchPages(ids);
    } catch (e) {
      // key missing permissions / quota → still show counts without it
      apiError = String(e.message || e);
      source = "youtube-page";
      views = await fromWatchPages(ids);
    }
    const meta = {};
    await Promise.all(mvIds.map(async (id) => { const m = allMeta[id] || await oembed(id); if (m) meta[id] = m; }));
    const counted = Object.keys(views).length;
    if (!counted) throw new Error("no view counts");
    const complete = counted === ids.length;
    res.setHeader("Cache-Control", complete ? "public, s-maxage=3600, stale-while-revalidate=86400" : "public, s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json({
      total: Object.values(views).reduce((a, b) => a + b, 0),
      clips: counted,
      missing: ids.filter((id) => views[id] == null),
      updated: new Date().toISOString(),
      source,
      ...(apiError && { apiError }),
      views,
      meta,
    });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ error: String(e.message || e) });
  }
};
