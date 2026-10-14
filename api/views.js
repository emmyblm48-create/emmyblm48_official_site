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
    if (!r.ok) throw new Error(`YouTube API ${r.status}`);
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

const fromWatchPages = async (ids) => {
  const views = {};
  await Promise.all(ids.map(async (id) => {
    try {
      const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
        headers: { "user-agent": "Mozilla/5.0", "accept-language": "en", cookie: "CONSENT=YES+1" },
      });
      const m = (await r.text()).match(/"viewCount":"(\d+)"/);
      if (m) views[id] = Number(m[1]);
    } catch {}
  }));
  return views;
};

module.exports = async (req, res) => {
  try {
    const { ids, mvIds } = loadData();
    const key = process.env.YOUTUBE_API_KEY;
    const allMeta = {};
    const views = key ? await fromApi(ids, key, allMeta) : await fromWatchPages(ids);
    const meta = {};
    await Promise.all(mvIds.map(async (id) => { const m = allMeta[id] || await oembed(id); if (m) meta[id] = m; }));
    const counted = Object.keys(views).length;
    if (!counted) throw new Error("no view counts");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      total: Object.values(views).reduce((a, b) => a + b, 0),
      clips: counted,
      updated: new Date().toISOString(),
      source: key ? "youtube-api" : "youtube-page",
      views,
      meta,
    });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ error: String(e.message || e) });
  }
};
