// Notifications — built from data.js, shared by the pages and the service worker (sw.js).
// buildNotifications() → [{ id, type: "anniv" | "new", icon, title, sub, url, at, days }]
//   days: 0 = วันนี้, < 0 = ผ่านมาแล้ว, > 0 = กำลังจะถึง
(function (g) {
  const BIRTHDAY = "2005-05-06";
  const DAY = 864e5;
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

  g.buildNotifications = (now = new Date(), { ahead = 30, back = 30 } = {}) => {
    const today = startOfDay(now);
    const daysFrom = (at) => Math.round((at - today) / DAY);
    const items = [];

    // anniversaries: same day/month every year, from the 1st year on
    const anniv = (iso, icon, title, sub, url) => {
      const [y, m, d] = iso.split("-").map(Number);
      for (let yr = today.getFullYear() - 1; yr <= today.getFullYear() + 1; yr++) {
        const at = new Date(yr, m - 1, d);
        const days = daysFrom(at);
        if (yr - y >= 1 && days >= -back && days <= ahead) {
          items.push({ id: `anniv:${iso}:${title(1)}:${yr}`, type: "anniv", icon, title: title(yr - y), sub, url, at, days });
        }
      }
    };
    anniv(BIRTHDAY, "heart", (n) => `Happy Birthday Emmy · อายุครบ ${n} ปี`, "06 May · วันเกิดเอ็มมี่", "/profile");
    (g.ERAS || []).filter((e) => !e.tags.includes("team")).forEach((e) => {
      if (e.title === "Debut") anniv(e.date, "bear", (n) => `ครบรอบ ${n} ปี เดบิวต์ BLM48`, e.sub, "/profile");
      else anniv(e.date, "ribbon", (n) => `ครบรอบ ${n} ปี「${e.title}」`, [e.release, e.sub].filter(Boolean).join(" · "), "/photo");
    });
    (g.EVENTS || []).forEach((ev) => anniv(ev.date, "ribbon", (n) => `ครบรอบ ${n} ปี ${ev.title}`, ev.sub, "/history"));

    // new content (past `back` days only)
    const fresh = (iso, id, icon, title, sub, url) => {
      const at = parse(iso);
      const days = daysFrom(at);
      if (days <= 0 && days >= -back) items.push({ id: `new:${id}`, type: "new", icon, title, sub, url, at, days });
    };
    (g.VIDEOS || []).filter((v) => v.yt).forEach((v) =>
      fresh(v.date, v.yt, "play", `คลิปใหม่「${v.title}${v.kind === "teaser" ? " (Teaser)" : ""}」`, [v.release, v.ver].filter(Boolean).join(" · "), "/discography"));
    (g.ERAS || []).forEach((e) => fresh(e.date, `era:${e.date}:${e.title}`, "bear", `โปรไฟล์ใหม่ · ${e.title}`, [e.release, e.sub].filter(Boolean).join(" · "), "/photo"));
    (g.EVENTS || []).forEach((ev) => fresh(ev.date, `event:${ev.date}:${ev.title}`, "pin", ev.title, ev.sub, "/history"));
    (g.CHAMPS || []).forEach((c) => fresh(`${c.month}-01`, `champ:${c.month}`, "heart", `Champ of the Month · ${c.label}`, "ข้อความใหม่จากเอ็มมี่ถึงคุณหมี", "/champ"));
    const galleryDays = new Map();
    (g.GALLERY || []).forEach((p) => { const iso = (p.img.match(/^\d{4}-\d{2}-\d{2}/) || [])[0]; if (iso) galleryDays.set(iso, (galleryDays.get(iso) || 0) + 1); });
    galleryDays.forEach((n, iso) => fresh(iso, `gallery:${iso}`, "smile", `รูปใหม่ในแกลเลอรี ${n} รูป`, iso.split("-").reverse().join("."), "/gallery"));

    return items.sort((a, b) => a.at - b.at);
  };

  // Show today's notifications on the device once each (state kept in Cache Storage so
  // the page and the service worker share it).
  const STORE = "emmy-notify";
  const readSent = async () => {
    try { const r = await (await caches.open(STORE)).match("/__sent"); return r ? await r.json() : []; } catch { return []; }
  };
  const writeSent = async (ids) => {
    try { await (await caches.open(STORE)).put("/__sent", new Response(JSON.stringify(ids.slice(-200)))); } catch {}
  };
  g.notifyToday = async (reg, now = new Date()) => {
    const due = g.buildNotifications(now, { ahead: 0, back: 0 });
    if (!due.length) return 0;
    const sent = await readSent();
    const fresh = due.filter((n) => !sent.includes(n.id));
    const shown = [];
    for (const n of fresh) {
      try {
        await reg.showNotification(n.title, { body: n.sub || "", icon: "/images/icon-512.png", badge: "/images/icon-192.png", tag: n.id, data: { url: n.url } });
        shown.push(n.id);
      } catch {}
    }
    if (shown.length) await writeSent([...sent, ...shown]);
    return shown.length;
  };
})(typeof window !== "undefined" ? window : self);
