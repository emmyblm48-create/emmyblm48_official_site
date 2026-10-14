// GET /api/views → { total, updated, source, views: { [youtubeId]: count } }
// View counts for every clip in data.js (VIDEOS[].yt).
// Uses the YouTube Data API when YOUTUBE_API_KEY is set (Vercel → Settings → Environment Variables),
// otherwise reads the public watch pages. Cached on Vercel's CDN for 1 hour.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const loadIds = () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), "data.js"), "utf8"), sandbox);
  return [...new Set((sandbox.window.VIDEOS || []).map((v) => v.yt).filter(Boolean))];
};

const fromApi = async (ids, key) => {
  const views = {};
  for (let i = 0; i < ids.length; i += 50) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.slice(i, i + 50).join(",")}&key=${key}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`YouTube API ${r.status}`);
    for (const item of (await r.json()).items || []) views[item.id] = Number(item.statistics.viewCount) || 0;
  }
  return views;
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
    const ids = loadIds();
    const key = process.env.YOUTUBE_API_KEY;
    const views = key ? await fromApi(ids, key) : await fromWatchPages(ids);
    const counted = Object.keys(views).length;
    if (!counted) throw new Error("no view counts");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      total: Object.values(views).reduce((a, b) => a + b, 0),
      clips: counted,
      updated: new Date().toISOString(),
      source: key ? "youtube-api" : "youtube-page",
      views,
    });
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ error: String(e.message || e) });
  }
};
