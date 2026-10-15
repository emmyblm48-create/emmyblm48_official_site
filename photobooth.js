// Photobooth — booth → frame → camera (countdown, 4 shots) → print in EMMY's 4 cut photo frame.
// Everything happens in the browser: the camera stream and photos never leave the device.
(() => {
  const root = document.getElementById("photobooth");
  if (!root) return;

  // ---------- frames ----------
  // grid: 2×2 portrait cuts (3:4) like EMMY's own 4 cut photo · strip: classic 1×4 booth strip (4:3)
  const LAYOUTS = {
    grid: { W: 1080, H: 1620, cw: 446, ch: 595, cells: [[80, 180], [554, 180], [80, 803], [554, 803]] },
    strip: { W: 600, H: 1800, cw: 500, ch: 375, cells: [[50, 78], [50, 475], [50, 872], [50, 1269]] },
  };
  // a design = colours + background pattern (+ corner icons, decoration, default caption); works with either layout
  // pattern: motif name or [motif A, motif B] (A and B alternate) · corners: [left, right] · deco: "rainbow" | "lights" | "border"
  // season: "MM-DD/MM-DD" — shown first with a NOW badge while it's on (seasons may wrap the new year)
  const thisYear = new Date().getFullYear() + (new Date().getMonth() >= 6 ? 1 : 0); // the coming new year from July on
  const DESIGNS = [
    { id: "valentine", name: "VALENTINE", th: "วาเลนไทน์ · ก.พ.", season: "02-01/02-16", bg: "#f2bfce", ink: "#8e1f3a", pat: "#e99db3", pattern: "heart", corners: ["heart", "heart"], caption: "Be My Valentine" },
    { id: "debut", name: "DEBUT DAY", th: "ครบรอบเดบิวต์ · 26 มี.ค.", season: "03-16/04-02", bg: "#4a2311", ink: "#f0d28a", pat: "#6b3a1f", pattern: ["sparkle", "star"], corners: ["sparkle", "sparkle"], deco: "border", caption: "since 26.03.2024" },
    { id: "songkran", name: "SONGKRAN", th: "สงกรานต์ · เม.ย.", season: "04-06/04-20", bg: "#cfe9f6", ink: "#1f5b84", pat: "#a6d2ec", pat2: "#f4c3d1", pattern: ["drop", "flower"], corners: ["drop", "flower"], caption: "Happy Songkran" },
    { id: "birthday", name: "EMMY BIRTHDAY", th: "วันเกิดเอ็มมี่ · 6 พ.ค.", season: "04-26/05-12", bg: "#fbe3ea", ink: "#7b3b2a", pat: "#efc9bd", pattern: ["bear", "confetti"], confetti: ["#f4a6bd", "#f3cf6a", "#9fd0e6", "#b5dca2"], corners: ["bear", "heart"], caption: "Happy Birthday EMMY" },
    { id: "pride", name: "PRIDE", th: "Pride Month · มิ.ย.", season: "06-01/06-30", bg: "#fbf6ec", ink: "#4a2311", pat: "#ece2d2", pattern: "heart", corners: ["heart", "heart"], deco: "rainbow", caption: "LOVE IS LOVE" },
    { id: "halloween", name: "HALLOWEEN", th: "ฮาโลวีน · ต.ค.", season: "10-10/11-01", bg: "#1d1411", ink: "#f39a4a", pat: "#45322a", pat2: "#64381c", pattern: ["bat", "pumpkin"], corners: ["pumpkin", "bat"], caption: "Happy Halloween" },
    { id: "loykrathong", name: "LOY KRATHONG", th: "ลอยกระทง · พ.ย.", season: "11-05/11-30", bg: "#13244a", ink: "#f3dc9a", pat: "#23386b", pattern: ["moon", "sparkle"], corners: ["moon", "sparkle"], caption: "สุขสันต์วันลอยกระทง" },
    { id: "christmas", name: "CHRISTMAS", th: "คริสต์มาส · ธ.ค.", season: "12-01/12-26", bg: "#1f4a35", ink: "#fbf6ec", pat: "#2e5e46", pattern: ["snow", "star"], corners: ["tree", "snow"], deco: "lights", caption: "Merry Christmas" },
    { id: "newyear", name: "NEW YEAR", th: "ปีใหม่ · ม.ค.", season: "12-27/01-10", bg: "#111014", ink: "#e8cd84", pat: "#29262d", pattern: ["sparkle", "dot"], corners: ["sparkle", "sparkle"], deco: "border", caption: `Happy New Year ${thisYear}` },

    { id: "choco", name: "CHOCO", th: "ช็อกโกแลต", bg: "#4a2311", ink: "#fbf6ec", pat: "#714026" },
    { id: "cream", name: "CREAM", th: "ครีม", bg: "#fbf6ec", ink: "#4a2311", pat: "#e9dcc6" },
    { id: "strawberry", name: "STRAWBERRY MILK", th: "ชมพูนม", bg: "#f8dbe3", ink: "#8e3550", pat: "#f0bfcd", pattern: ["heart", "star"] },
    { id: "cherry", name: "CHERRY", th: "แดงม่าน", bg: "#8e1f24", ink: "#fbf6ec", pat: "#a8363c" },
    { id: "matcha", name: "MATCHA", th: "เขียวมัทฉะ", bg: "#dbe8d3", ink: "#3d5a3a", pat: "#c3d7b8", pattern: ["clover", "dot"], corners: ["clover", "clover"] },
    { id: "sky", name: "SODA SKY", th: "ฟ้าโซดา", bg: "#d5e6f6", ink: "#2c4a73", pat: "#b9d2ec", pattern: ["sparkle", "dot"] },
    { id: "lavender", name: "LAVENDER", th: "ม่วงลาเวนเดอร์", bg: "#e7ddf3", ink: "#5a4280", pat: "#d4c5e9" },
    { id: "butter", name: "BUTTER", th: "เหลืองเนย", bg: "#f8edc4", ink: "#7a5a1c", pat: "#eedc9f", pattern: ["dot", "heart"] },
    { id: "midnight", name: "MIDNIGHT", th: "น้ำเงินกลางคืน", bg: "#171b2e", ink: "#f3e9d2", pat: "#2d3556", pattern: ["sparkle", "star"] },
    { id: "noir", name: "NOIR", th: "ขาวดำ", bg: "#131010", ink: "#f8f0e3", pat: "#2b2422" },
  ];
  // seasons: in season first, then the next one coming up
  const mmdd = (d) => (d.getMonth() + 1) * 100 + d.getDate();
  const seasonRange = (d) => d.season.split("/").map((s) => Number(s.replace("-", "")));
  const inSeason = (d, now = new Date()) => {
    if (!d.season) return false;
    const [a, b] = seasonRange(d), x = mmdd(now);
    return a <= b ? x >= a && x <= b : x >= a || x <= b;
  };
  const daysUntil = (d, now = new Date()) => {
    const [a] = seasonRange(d);
    let next = new Date(now.getFullYear(), Math.floor(a / 100) - 1, a % 100);
    if (next < now) next = new Date(now.getFullYear() + 1, Math.floor(a / 100) - 1, a % 100);
    return (next - now) / 864e5;
  };
  const SEASONS = DESIGNS.filter((d) => d.season).sort((x, y) => (inSeason(y) - inSeason(x)) || daysUntil(x) - daysUntil(y));
  const COLORS = DESIGNS.filter((d) => !d.season);

  // EMMY photos for WITH EMMY (latest profiles first, one per image)
  const EMMY_PICS = [...new Set((window.ERAS || []).slice().reverse().map((e) => e.img))].slice(0, 8);

  const S = 1.5; // print resolution multiplier
  let design = SEASONS.find((d) => inSeason(d)) || COLORS[0];
  let layout = "grid";
  let withEmmy = false;
  const emmySlot = () => (withEmmy ? 3 : null);
  let shots = [null, null, null, null]; // canvases (already mirrored / cropped to the cut)
  let emmyPic = EMMY_PICS[0];
  let filter = "normal";
  let timer = 5;
  let stream = null;
  let running = false;
  let abort = false;

  const $ = (id) => document.getElementById(id);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const imgCache = new Map();
  const loadImg = (src) => {
    if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    }));
    return imgCache.get(src);
  };
  const fontsReady = Promise.all([
    '400 40px "Josefin Sans"', '300 40px "Josefin Sans"', '400 40px "Cormorant Garamond"', '500 40px "Zen Maru Gothic"', '400 40px "IBM Plex Sans Thai Looped"',
  ].map((f) => document.fonts.load(f).catch(() => {})));

  // ---------- drawing ----------
  // motifs in a 24×24 box (same grid as the site's SVG icons); line = outlined in the pattern, filled as a corner icon
  const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  const MOTIFS = {
    star: { d: "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z", line: true },
    heart: { d: "M12 21.2s-8.6-5.3-8.6-11.4C3.4 6.9 5.6 4.8 8.2 4.8c1.6 0 3 .8 3.8 2.1.8-1.3 2.2-2.1 3.8-2.1 2.6 0 4.8 2.1 4.8 5 0 6.1-8.6 11.4-8.6 11.4z", line: true },
    clover: { d: circle(8.6, 8.6, 4) + circle(15.4, 8.6, 4) + circle(8.6, 15.4, 4) + circle(15.4, 15.4, 4) + "M12 12q2.5 5.5 6.5 9l1-1q-4-3.5-6.3-8.6z" },
    snow: { d: "M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.8 3.8 12 6l2.2-2.2M9.8 20.2 12 18l2.2 2.2M3.6 10.1l3-.8-.8-3M20.4 13.9l-3 .8.8 3M3.6 13.9l3 .8-.8 3M20.4 10.1l-3-.8.8-3", line: true, lineOnly: true },
    drop: { d: "M12 2.5C9 7 6 10.6 6 14.5a6 6 0 0 0 12 0C18 10.6 15 7 12 2.5z" },
    sparkle: { d: "M12 1.5C12.8 8 16 11.2 22.5 12 16 12.8 12.8 16 12 22.5 11.2 16 8 12.8 1.5 12 8 11.2 11.2 8 12 1.5z" },
    dot: { d: circle(12, 12, 3.6) },
    flower: { d: [0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return circle(12 + 5.4 * Math.cos(a), 12 + 5.4 * Math.sin(a), 3.9); }).join("") + circle(12, 12, 2.6) },
    bear: { d: circle(12, 14, 7.2) + circle(6.2, 7.2, 2.9) + circle(17.8, 7.2, 2.9) },
    bat: { d: "M12 6.8c-.8 0-1.4.6-1.6 1.3L9.3 6.3l-.2 2.9C7.4 7.4 4.6 6.4 1 7.2c1.9 1.5 2.9 4 2.6 6.9 1.2-1.3 3-1.6 4.4-.8.4-1.7 1.6-2.4 2.8-2 .2 1.8.6 3.2 1.2 4.5.6-1.3 1-2.7 1.2-4.5 1.2-.4 2.4.3 2.8 2 1.4-.8 3.2-.5 4.4.8-.3-2.9.7-5.4 2.6-6.9-3.6-.8-6.4.2-8.1 2l-.2-2.9-1.1 1.8c-.2-.7-.8-1.3-1.6-1.3z" },
    pumpkin: { d: "M12 7.2c-1-.1-2 .2-2.8.7-.8-.4-1.8-.6-2.8-.3C3.8 8.5 2.6 11.2 3 14.2c.5 3.4 3 5.6 5.4 5.4 1.3.6 2.5.7 3.6.7s2.3-.1 3.6-.7c2.4.2 4.9-2 5.4-5.4.4-3-.8-5.7-3.4-6.6-1-.3-2-.1-2.8.3-.8-.5-1.8-.8-2.8-.7zM11.3 7.3c0-1.7.4-3.1 1.7-4.3l1.3 1c-1 .8-1.3 1.9-1.3 3.3z" },
    moon: { d: "M15.5 3.2A9 9 0 1 0 20.8 15 7 7 0 0 1 15.5 3.2z" },
    tree: { d: "M12 1.8l5 6.7h-2.8l4.6 6.3h-3.4l3.4 5H5.2l3.4-5H5.2l4.6-6.3H7zM10.6 19.8h2.8V23h-2.8z" },
    confetti: { d: "M9.2 5.5h5.6v13H9.2z" },
  };
  Object.values(MOTIFS).forEach((m) => { m.p = new Path2D(m.d); });
  const drawMotif = (ctx, name, cx, cy, size, color, { line = false, rot = 0, lw = 2 } = {}) => {
    const m = MOTIFS[name];
    if (!m) return;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(size / 24, size / 24); ctx.translate(-12, -12);
    if (line || m.lineOnly) {
      ctx.strokeStyle = color; ctx.lineWidth = (lw * 24) / size; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.stroke(m.p);
    } else { ctx.fillStyle = color; ctx.fill(m.p); }
    ctx.restore();
  };
  // letter-spaced text (canvas letterSpacing isn't everywhere yet)
  const spaced = (ctx, text, x, y, spacing, align = "center") => {
    const chars = [...text];
    const width = chars.reduce((w, c) => w + ctx.measureText(c).width, 0) + spacing * (chars.length - 1);
    let cx = align === "center" ? x - width / 2 : align === "right" ? x - width : x;
    ctx.textAlign = "left";
    chars.forEach((c) => { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + spacing; });
  };
  // object-fit: cover, optionally mirrored; fy = vertical focus (0 top … 1 bottom)
  const drawCover = (ctx, src, x, y, w, h, { mirror = false, fy = 0.5 } = {}) => {
    const sw = src.videoWidth || src.naturalWidth || src.width;
    const sh = src.videoHeight || src.naturalHeight || src.height;
    const k = Math.max(w / sw, h / sh);
    const cw = w / k, ch = h / k;
    const sx = (sw - cw) / 2, sy = (sh - ch) * fy;
    ctx.save();
    if (mirror) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(src, sx, sy, cw, ch, 0, 0, w, h); }
    else ctx.drawImage(src, sx, sy, cw, ch, x, y, w, h);
    ctx.restore();
  };
  const FILTERS = {
    normal: null,
    mono: (r, g, b) => { const l = (0.3 * r + 0.59 * g + 0.11 * b - 128) * 1.12 + 128; return [l, l, l]; },
    warm: (r, g, b) => [r * 1.07 + 10, g * 1.01 + 4, b * 0.88],
    soft: (r, g, b) => [r * 0.86 + 34, g * 0.84 + 26, b * 0.86 + 30],
  };
  const filtered = (cnv) => {
    const fn = FILTERS[filter];
    if (!fn) return cnv;
    const out = document.createElement("canvas");
    out.width = cnv.width; out.height = cnv.height;
    const c = out.getContext("2d");
    c.drawImage(cnv, 0, 0);
    const data = c.getImageData(0, 0, out.width, out.height);
    const d = data.data;
    for (let i = 0; i < d.length; i += 4) [d[i], d[i + 1], d[i + 2]] = fn(d[i], d[i + 1], d[i + 2]);
    c.putImageData(data, 0, 0);
    return out;
  };

  // the whole print; cuts = [canvas | image | null] ×4
  const RAINBOW = ["#e5484d", "#f59e3b", "#f3cd45", "#4cb876", "#3d8fd9", "#8a5bd0"];
  const BULBS = ["#e64b4b", "#f5c542", "#4bb3e6", "#7fd17f"];
  const drawPrint = (cnv, fr, layoutName, cuts, { scale = S, caption = "", date = new Date() } = {}) => {
    const L = LAYOUTS[layoutName];
    const grid = layoutName === "grid";
    cnv.width = L.W * scale; cnv.height = L.H * scale;
    const ctx = cnv.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = fr.bg;
    ctx.fillRect(0, 0, L.W, L.H);
    // background pattern: two motifs per tile (outlined stars = the site background)
    const T = 150;
    const [ma, mb] = [].concat(fr.pattern || "star", fr.pattern || "star");
    let n = 0;
    for (let ty = -T; ty < L.H + T; ty += T) for (let tx = -T; tx < L.W + T; tx += T) {
      [[ma, tx + T * 0.21, ty + T * 0.23, fr.pat], [mb, tx + T * 0.71, ty + T * 0.73, fr.pat2 || fr.pat]].forEach(([m, x, y, c]) => {
        n++;
        if (m === "confetti") drawMotif(ctx, m, x, y, 22, fr.confetti[n % fr.confetti.length], { rot: (n * 47) % 180 * Math.PI / 180 });
        else drawMotif(ctx, m, x, y, m === "dot" ? 22 : 28, c, { line: MOTIFS[m].line });
      });
    }
    // decorations behind the cuts
    if (fr.deco === "rainbow") {
      const w = grid ? 7 : 5;
      RAINBOW.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * w, 0, w, L.H); ctx.fillRect(L.W - (i + 1) * w, 0, w, L.H); });
    }
    if (fr.deco === "border") {
      ctx.strokeStyle = fr.ink; ctx.lineWidth = 2;
      const m = grid ? 22 : 16;
      ctx.strokeRect(m, m, L.W - 2 * m, L.H - 2 * m);
      ctx.lineWidth = 1; ctx.strokeRect(m + 7, m + 7, L.W - 2 * m - 14, L.H - 2 * m - 14);
    }
    if (fr.deco === "lights" && grid) {
      const [x0, x1, y0, cy] = [118, L.W - 118, 30, 98];
      ctx.strokeStyle = fr.ink; ctx.globalAlpha = 0.7; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(L.W / 2, cy, x1, y0); ctx.stroke(); ctx.globalAlpha = 1;
      for (let i = 1; i < 12; i++) {
        const t = i / 12, x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * (L.W / 2) + t ** 2 * x1, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y0;
        ctx.fillStyle = BULBS[i % BULBS.length];
        ctx.beginPath(); ctx.ellipse(x, y + 12, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    // cuts
    L.cells.forEach(([x, y], i) => {
      const cut = cuts[i];
      if (cut) drawCover(ctx, cut, x, y, L.cw, L.ch, { fy: 0.3 });
      else {
        ctx.fillStyle = fr.ink; ctx.globalAlpha = 0.12; ctx.fillRect(x, y, L.cw, L.ch); ctx.globalAlpha = 1;
      }
    });
    const dd = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    ctx.fillStyle = fr.ink;
    ctx.textBaseline = "alphabetic";
    const [cl, cr] = fr.corners || ["heart", "clover"];
    if (grid) {
      drawMotif(ctx, cl, 72, 64, 60, fr.ink, { lw: 3 });
      drawMotif(ctx, cr, L.W - 72, 64, 60, fr.ink, { lw: 3 });
      if (caption) { ctx.font = '500 44px "Zen Maru Gothic", "IBM Plex Sans Thai Looped", sans-serif'; spaced(ctx, caption, L.W / 2, 128, 2); }
      ctx.font = '400 54px "Cormorant Garamond", serif';
      spaced(ctx, "4 cut", 80, 1478, 0, "left");
      spaced(ctx, "photo", 80, 1534, 0, "left");
      ctx.font = '400 104px "Josefin Sans", sans-serif';
      spaced(ctx, "EMMY", L.W / 2, 1510, 10);
      ctx.font = '400 22px "Josefin Sans", sans-serif';
      spaced(ctx, "NATTAWAT WONGSARAT", L.W / 2, 1560, 7);
      ctx.font = '400 38px "Josefin Sans", sans-serif';
      spaced(ctx, dd, L.W - 80, 1548, 1, "right");
    } else {
      drawMotif(ctx, cl, 40, 38, 36, fr.ink, { lw: 2.4 });
      drawMotif(ctx, cr, L.W - 40, 38, 36, fr.ink, { lw: 2.4 });
      if (caption) { ctx.font = '500 26px "Zen Maru Gothic", "IBM Plex Sans Thai Looped", sans-serif'; spaced(ctx, caption, L.W / 2, 55, 1); }
      ctx.font = '400 72px "Josefin Sans", sans-serif';
      spaced(ctx, "EMMY", L.W / 2, 1720, 7);
      ctx.font = '400 15px "Josefin Sans", sans-serif';
      spaced(ctx, `NATTAWAT WONGSARAT · ${dd}`, L.W / 2, 1764, 5);
    }
  };

  // ---------- steps ----------
  const steps = [...root.querySelectorAll("[data-step]")];
  const go = (name) => {
    if (name !== "camera") stopCamera();
    steps.forEach((s) => { s.hidden = s.dataset.step !== name; });
    if (name === "camera") openCamera();
    if (name === "result") renderPrint();
    if (name !== "intro") root.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (!b) return;
    if (b.dataset.go === "frame" && b.classList.contains("pb-start") && !reduced) {
      // curtain opens before the frames show
      root.querySelector(".pb-booth").classList.add("is-open");
      setTimeout(() => { root.querySelector(".pb-booth").classList.remove("is-open"); go("frame"); }, 650);
    } else go(b.dataset.go);
  });
  const howto = $("pb-howto");
  root.querySelector("[data-howto]").addEventListener("click", () => howto.showModal());
  howto.addEventListener("click", (e) => { if (e.target === howto) howto.close(); });

  // frame cards (seasons, then colours) — previews drawn with EMMY photos in the chosen layout
  const card = (d) => `
    <button class="pb-frame" data-frame="${d.id}" aria-label="${d.name} — ${d.th}">
      ${inSeason(d) ? '<span class="pb-now">NOW</span>' : ""}<canvas class="pb-frame-img"></canvas>
      <span class="pb-frame-name">${d.name}<small>${d.th}</small></span>
    </button>`;
  $("pb-frames-season").innerHTML = SEASONS.map(card).join("");
  $("pb-frames-color").innerHTML = COLORS.map(card).join("");
  const previewPics = Promise.all([fontsReady, ...EMMY_PICS.slice(0, 4).map((p) => loadImg(`images/profiles/${p}`).catch(() => null))]).then(([, ...pics]) => pics);
  const renderPreviews = async () => {
    const pics = await previewPics;
    root.querySelectorAll(".pb-frames").forEach((box) => box.classList.toggle("is-strip", layout === "strip"));
    root.querySelectorAll(".pb-frame").forEach((btn) => {
      const d = DESIGNS.find((x) => x.id === btn.dataset.frame);
      drawPrint(btn.querySelector("canvas"), d, layout, pics, { scale: 0.4, caption: d.caption || "" });
    });
  };
  renderPreviews();
  root.querySelectorAll("[data-layout]").forEach((b) => b.addEventListener("click", () => {
    layout = b.dataset.layout;
    root.querySelectorAll("[data-layout]").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
    renderPreviews();
  }));
  $("pb-with-emmy").addEventListener("change", (e) => { withEmmy = e.target.checked; });
  // picking a design also fills in its caption, unless the caption was typed by hand
  let autoCaption = "";
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-frame]");
    if (!b) return;
    design = DESIGNS.find((x) => x.id === b.dataset.frame);
    const cap = $("pb-caption");
    if (!cap.value.trim() || cap.value === autoCaption) cap.value = autoCaption = design.caption || "";
    shots = [null, null, null, null];
    go("camera");
  });

  // WITH EMMY: pick which EMMY photo fills the last cut
  const emmyList = $("pb-emmy-list");
  emmyList.innerHTML = EMMY_PICS.map((p, i) => `
    <button class="pb-emmy-pic${i ? "" : " is-on"}" role="radio" aria-checked="${!i}" data-pic="${p}" aria-label="รูปเอ็มมี่ ${i + 1}">
      <img src="images/profiles/${p}" alt="" loading="lazy" width="120" height="160">
    </button>`).join("");
  emmyList.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pic]");
    if (!b) return;
    emmyPic = b.dataset.pic;
    emmyList.querySelectorAll("[data-pic]").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", x === b); });
    renderShots();
  });

  // ---------- camera ----------
  const video = $("pb-video");
  const view = $("pb-view");
  const camError = $("pb-cam-error");
  const shootBtn = $("pb-shoot");
  const slotsToShoot = () => [0, 1, 2, 3].filter((i) => i !== emmySlot());

  const openCamera = async () => {
    const L = LAYOUTS[layout];
    view.style.aspectRatio = `${L.cw} / ${L.ch}`;
    $("pb-frame-name").textContent = `${design.name} · ${layout === "grid" ? "2×2" : "STRIP"}`;
    $("pb-emmy").hidden = emmySlot() == null;
    $("pb-cam-hint").textContent = `ถ่าย ${slotsToShoot().length} รูปต่อกัน · วางกล้องให้มั่นคง แล้วกด SHOOT`;
    camError.hidden = true;
    shootBtn.disabled = true;
    renderShots();
    if (!navigator.mediaDevices?.getUserMedia) { camError.hidden = false; return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
      video.srcObject = stream;
      await video.play().catch(() => {});
      shootBtn.disabled = false;
    } catch {
      camError.hidden = false;
    }
  };
  function stopCamera() {
    abort = true;
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCamera();
    else if (!$("pb-video").closest("[data-step]").hidden && !stream) openCamera();
  });

  const cutCanvas = () => {
    const L = LAYOUTS[layout];
    const c = document.createElement("canvas");
    c.width = L.cw * S; c.height = L.ch * S;
    return c;
  };
  const capture = () => {
    const c = cutCanvas();
    drawCover(c.getContext("2d"), video, 0, 0, c.width, c.height, { mirror: true });
    return c;
  };
  const flash = () => {
    if (reduced) return;
    const f = document.createElement("div");
    f.className = "flash";
    document.body.append(f);
    f.addEventListener("animationend", () => f.remove());
  };
  const count = $("pb-count");
  const countdown = async (sec) => {
    for (let n = sec; n > 0; n--) {
      if (abort) return;
      count.textContent = n;
      count.classList.remove("tick"); void count.offsetWidth; count.classList.add("tick");
      await wait(1000);
    }
    count.textContent = "";
  };

  shootBtn.addEventListener("click", async () => {
    if (running || !stream) return;
    running = true; abort = false;
    shootBtn.disabled = true;
    root.querySelectorAll("[data-timer]").forEach((b) => { b.disabled = true; });
    shots = shots.map(() => null);
    renderShots();
    for (const i of slotsToShoot()) {
      await countdown(timer);
      if (abort) break;
      shots[i] = capture();
      flash();
      renderShots(i);
      await wait(900);
    }
    count.textContent = "";
    running = false;
    shootBtn.disabled = !stream;
    root.querySelectorAll("[data-timer]").forEach((b) => { b.disabled = false; });
    if (!abort && slotsToShoot().every((i) => shots[i])) go("result");
  });

  $("pb-retry").addEventListener("click", () => { stopCamera(); openCamera(); });

  // no camera: fill the cuts from photos on the device
  $("pb-upload").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    for (const file of files) {
      const i = slotsToShoot().find((s) => !shots[s]);
      if (i == null) break;
      const url = URL.createObjectURL(file);
      try {
        const im = await loadImg(url);
        const c = cutCanvas();
        drawCover(c.getContext("2d"), im, 0, 0, c.width, c.height, { fy: 0.35 });
        shots[i] = c;
      } catch {} finally { imgCache.delete(url); URL.revokeObjectURL(url); }
    }
    renderShots();
    const left = slotsToShoot().filter((s) => !shots[s]).length;
    if (!left) go("result");
    else $("pb-cam-hint").textContent = `เลือกรูปเพิ่มอีก ${left} รูป`;
  });

  // thumbnails of the cuts so far
  const shotsBox = $("pb-shots");
  function renderShots(just) {
    const L = LAYOUTS[layout];
    shotsBox.style.setProperty("--ar", `${L.cw} / ${L.ch}`);
    shotsBox.innerHTML = shots.map((s, i) => `<li class="${i === just ? "is-new" : ""}${emmySlot() === i ? " is-emmy" : ""}" aria-label="ช่อง ${i + 1}${s ? " ถ่ายแล้ว" : ""}">${
      emmySlot() === i ? `<img src="images/profiles/${emmyPic}" alt="">` : s ? "" : `<span>${i + 1}</span>`}</li>`).join("");
    shots.forEach((s, i) => { if (s && emmySlot() !== i) { const c = cutCanvas(); c.getContext("2d").drawImage(s, 0, 0); shotsBox.children[i].append(c); } });
  }

  root.querySelectorAll("[data-timer]").forEach((b) => b.addEventListener("click", () => {
    timer = Number(b.dataset.timer);
    root.querySelectorAll("[data-timer]").forEach((x) => x.classList.toggle("is-on", x === b));
  }));

  // ---------- result ----------
  const print = $("pb-print");
  const caption = $("pb-caption");
  let printDate = new Date();
  async function renderPrint() {
    await fontsReady;
    const cuts = shots.map((s) => s && filtered(s));
    if (emmySlot() != null) {
      const im = await loadImg(`images/profiles/${emmyPic}`).catch(() => null);
      if (im) {
        const c = cutCanvas();
        drawCover(c.getContext("2d"), im, 0, 0, c.width, c.height, { fy: 0.25 });
        cuts[emmySlot()] = filtered(c);
      }
    }
    drawPrint(print, design, layout, cuts, { caption: caption.value.trim(), date: printDate });
    print.className = `pb-print pb-${layout}`;
  }
  let typing;
  caption.addEventListener("input", () => { clearTimeout(typing); typing = setTimeout(renderPrint, 200); });
  root.querySelectorAll("[data-pbfilter]").forEach((b) => b.addEventListener("click", () => {
    filter = b.dataset.pbfilter;
    root.querySelectorAll("[data-pbfilter]").forEach((x) => x.classList.toggle("is-on", x === b));
    renderPrint();
  }));
  $("pb-retake").addEventListener("click", () => go("camera"));

  const fileName = () => {
    const d = printDate, p = (n) => String(n).padStart(2, "0");
    return `emmy-4cut-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.jpg`;
  };
  const printBlob = () => new Promise((r) => print.toBlob(r, "image/jpeg", 0.92));
  $("pb-save").addEventListener("click", async () => {
    const url = URL.createObjectURL(await printBlob());
    const a = Object.assign(document.createElement("a"), { href: url, download: fileName() });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
  const shareBtn = $("pb-share");
  shareBtn.hidden = !(navigator.canShare && navigator.canShare({ files: [new File([""], "x.jpg", { type: "image/jpeg" })] }));
  shareBtn.addEventListener("click", async () => {
    const file = new File([await printBlob()], fileName(), { type: "image/jpeg" });
    navigator.share({ files: [file], title: "EMMY 4 cut photo" }).catch(() => {});
  });

  // a fresh date for each new set of shots
  shootBtn.addEventListener("click", () => { printDate = new Date(); });
  window.addEventListener("pagehide", stopCamera);
})();
