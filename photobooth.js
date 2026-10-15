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
  const FRAMES = [
    { id: "choco", name: "CHOCO 4 CUT", th: "เฟรมช็อกโกแลต 2×2", layout: "grid", bg: "#4a2311", ink: "#fbf6ec", star: "#714026" },
    { id: "cream", name: "CREAM 4 CUT", th: "เฟรมครีม 2×2", layout: "grid", bg: "#fbf6ec", ink: "#4a2311", star: "#e9dcc6" },
    { id: "strip", name: "CLASSIC STRIP", th: "แถบยาว 4 รูป", layout: "strip", bg: "#4a2311", ink: "#fbf6ec", star: "#714026" },
    { id: "emmy", name: "WITH EMMY", th: "ถ่าย 3 รูป + รูปเอ็มมี่ 1 ช่อง", layout: "grid", bg: "#4a2311", ink: "#fbf6ec", star: "#714026", emmySlot: 3 },
  ];
  // EMMY photos for the WITH EMMY frame (latest profiles first, one per image)
  const EMMY_PICS = [...new Set((window.ERAS || []).slice().reverse().map((e) => e.img))].slice(0, 8);

  const S = 1.5; // print resolution multiplier
  let frame = FRAMES[0];
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
  const star = (ctx, x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.stroke();
  };
  const HEART = new Path2D("M12 21.2s-8.6-5.3-8.6-11.4C3.4 6.9 5.6 4.8 8.2 4.8c1.6 0 3 .8 3.8 2.1.8-1.3 2.2-2.1 3.8-2.1 2.6 0 4.8 2.1 4.8 5 0 6.1-8.6 11.4-8.6 11.4z");
  const icon24 = (ctx, x, y, size, draw) => { ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24); draw(); ctx.restore(); };
  const heart = (ctx, x, y, size, color) => icon24(ctx, x, y, size, () => { ctx.fillStyle = color; ctx.fill(HEART); });
  const clover = (ctx, x, y, size, color) => icon24(ctx, x, y, size, () => {
    ctx.fillStyle = color;
    [[8.6, 8.6], [15.4, 8.6], [8.6, 15.4], [15.4, 15.4]].forEach(([cx, cy]) => { ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(12, 12); ctx.quadraticCurveTo(14.5, 17.5, 18.5, 21); ctx.stroke();
  });
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
  const drawPrint = (cnv, fr, cuts, { scale = S, caption = "", date = new Date() } = {}) => {
    const L = LAYOUTS[fr.layout];
    cnv.width = L.W * scale; cnv.height = L.H * scale;
    const ctx = cnv.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = fr.bg;
    ctx.fillRect(0, 0, L.W, L.H);
    // outlined stars (same pattern as the site background)
    const T = 150;
    ctx.strokeStyle = fr.star; ctx.lineWidth = 2; ctx.lineJoin = "round";
    for (let ty = -T; ty < L.H + T; ty += T) for (let tx = -T; tx < L.W + T; tx += T) {
      star(ctx, tx + T * 0.21, ty + T * 0.23, 13);
      star(ctx, tx + T * 0.71, ty + T * 0.73, 13);
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
    if (fr.layout === "grid") {
      heart(ctx, 42, 34, 60, fr.ink);
      clover(ctx, L.W - 102, 34, 60, fr.ink);
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
      heart(ctx, 22, 20, 36, fr.ink);
      clover(ctx, L.W - 58, 20, 36, fr.ink);
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

  // frame cards — previews drawn with EMMY photos
  const framesBox = $("pb-frames");
  framesBox.innerHTML = FRAMES.map((f) => `
    <button class="pb-frame" data-frame="${f.id}" aria-label="${f.name} — ${f.th}">
      <canvas class="pb-frame-img pb-${f.layout}"></canvas>
      <span class="pb-frame-name">${f.name}<small>${f.th}</small></span>
    </button>`).join("");
  Promise.all([fontsReady, ...EMMY_PICS.slice(0, 4).map((p) => loadImg(`images/profiles/${p}`).catch(() => null))]).then(([, ...pics]) => {
    framesBox.querySelectorAll(".pb-frame").forEach((btn) => {
      const f = FRAMES.find((x) => x.id === btn.dataset.frame);
      drawPrint(btn.querySelector("canvas"), f, pics, { scale: 0.4, caption: f.id === "emmy" ? "with EMMY" : "" });
    });
  });
  framesBox.addEventListener("click", (e) => {
    const b = e.target.closest("[data-frame]");
    if (!b) return;
    frame = FRAMES.find((x) => x.id === b.dataset.frame);
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
  const slotsToShoot = () => [0, 1, 2, 3].filter((i) => i !== frame.emmySlot);

  const openCamera = async () => {
    const L = LAYOUTS[frame.layout];
    view.style.aspectRatio = `${L.cw} / ${L.ch}`;
    $("pb-frame-name").textContent = frame.name;
    $("pb-emmy").hidden = frame.emmySlot == null;
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
    const L = LAYOUTS[frame.layout];
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
    const L = LAYOUTS[frame.layout];
    shotsBox.style.setProperty("--ar", `${L.cw} / ${L.ch}`);
    shotsBox.innerHTML = shots.map((s, i) => `<li class="${i === just ? "is-new" : ""}${frame.emmySlot === i ? " is-emmy" : ""}" aria-label="ช่อง ${i + 1}${s ? " ถ่ายแล้ว" : ""}">${
      frame.emmySlot === i ? `<img src="images/profiles/${emmyPic}" alt="">` : s ? "" : `<span>${i + 1}</span>`}</li>`).join("");
    shots.forEach((s, i) => { if (s && frame.emmySlot !== i) { const c = cutCanvas(); c.getContext("2d").drawImage(s, 0, 0); shotsBox.children[i].append(c); } });
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
    if (frame.emmySlot != null) {
      const im = await loadImg(`images/profiles/${emmyPic}`).catch(() => null);
      if (im) {
        const c = cutCanvas();
        drawCover(c.getContext("2d"), im, 0, 0, c.width, c.height, { fy: 0.25 });
        cuts[frame.emmySlot] = filtered(c);
      }
    }
    drawPrint(print, frame, cuts, { caption: caption.value.trim(), date: printDate });
    print.className = `pb-print pb-${frame.layout}`;
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
