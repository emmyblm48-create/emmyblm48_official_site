const ERAS = window.ERAS || [];
const VIDEOS = (window.VIDEOS || []).slice().sort((a, b) => a.date.localeCompare(b.date));
const ALBUM = window.ALBUM;
const EVENTS = window.EVENTS || [];
const CHAMPS = window.CHAMPS || [];
const GALLERY = window.GALLERY || [];
const EVENT_LABEL = { team: "TEAM", role: "ROLE", live: "LIVE" };
const TAG_LABEL = { center: "CENTER", senbatsu: "SENBATSU", under: "UNDER", cw: "C/W", event: "EVENT", team: "TEAM" };
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const fmtDate = (iso) => iso.split("-").reverse().join(".");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pill = (cls, text) => `<span class="pill ${cls}">${esc(text)}</span>`;
const isNew = (iso) => (Date.now() - new Date(iso)) / 864e5 <= 30 && new Date(iso) <= Date.now();
const videoTitle = (v) => v.title + (v.kind === "teaser" ? " (Teaser)" : "");

// ---------- Stats ----------
const centerSongs = new Set([
  ...ERAS.filter((e) => e.tags.includes("center")).map((e) => e.title),
  ...VIDEOS.filter((v) => v.center).map((v) => v.title),
]);
const statValues = {
  senbatsu: ERAS.filter((e) => e.tags.includes("senbatsu")).length,
  center: centerSongs.size,
  eras: ERAS.length,
  videos: VIDEOS.length,
};
document.querySelectorAll("[data-stat]").forEach((el) => { el.textContent = statValues[el.dataset.stat]; });

// ---------- Hero (4 cut photo) — print date = today ----------
const now = new Date();
const printDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;
document.querySelectorAll(".hero-date").forEach((el) => { el.textContent = printDate; });
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Banners ----------
if (document.getElementById("banner-track")) {
  if (ALBUM) document.getElementById("banner-album").href = `https://www.youtube.com/playlist?list=${ALBUM.playlist}`;
  const latest = [...VIDEOS].reverse().find((v) => v.yt);
  if (latest) {
    document.getElementById("banner-latest").textContent = latest.title;
    document.getElementById("banner-latest-sub").textContent = `${fmtDate(latest.date)} · ${latest.release}`;
  }
  const track = document.getElementById("banner-track");
  const banners = [...track.children];
  const dots = document.getElementById("banner-dots");
  dots.innerHTML = banners.map((_, i) => `<button aria-label="แบนเนอร์ ${i + 1}"></button>`).join("");
  const dotBtns = [...dots.children];
  const bannerAt = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    banners.forEach((b, i) => { if (Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid) < Math.abs(banners[best].offsetLeft + banners[best].offsetWidth / 2 - mid)) best = i; });
    return best;
  };
  const goBanner = (i) => track.scrollTo({ left: banners[i].offsetLeft - (track.clientWidth - banners[i].offsetWidth) / 2, behavior: "smooth" });
  const syncDots = () => { const at = bannerAt(); dotBtns.forEach((d, i) => d.classList.toggle("is-on", i === at)); };
  dotBtns.forEach((d, i) => d.addEventListener("click", () => goBanner(i)));
  track.addEventListener("scroll", () => requestAnimationFrame(syncDots), { passive: true });
  syncDots();
  let bannerPaused = false;
  track.addEventListener("pointerenter", () => { bannerPaused = true; });
  track.addEventListener("pointerleave", () => { bannerPaused = false; });
  if (!reduceMotion) setInterval(() => { if (!bannerPaused) goBanner((bannerAt() + 1) % banners.length); }, 4500);
}

// ---------- History (schedule-style list, newest first) ----------
if (document.getElementById("sched")) {
  const sameSong = (v, e) => v.date === e.date && v.title === e.title && v.kind === "song";
  const historyItems = [
    ...ERAS.filter((e) => !e.tags.includes("team")).map((e) => ({ date: e.date, type: "era", e, v: VIDEOS.find((v) => sameSong(v, e)) })),
    ...VIDEOS.filter((v) => !ERAS.some((e) => sameSong(v, e))).map((v) => ({ date: v.date, type: "video", v })),
    ...EVENTS.map((ev) => ({ date: ev.date, type: "event", ev })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const historyRow = (it) => {
    const d = new Date(it.date);
    const [y, m, day] = it.date.split("-");
    let tags = "", title = "";
    if (it.type === "era") {
      const e = it.e;
      tags = e.tags.map((t) => pill(t, TAG_LABEL[t])).join("");
      const label = `${esc(e.release ? e.release + " " : "")}「${esc(e.title)}」${e.sub ? ` <small>${esc(e.sub)}</small>` : ""}`;
      title = it.v
        ? `<button data-yt="${it.v.yt}" data-title="${esc(videoTitle(it.v))}">${label}</button>`
        : `<a href="/photo">${label}</a>`;
    } else if (it.type === "video") {
      const v = it.v;
      tags = pill(v.kind === "teaser" ? "teaser" : "movie", v.kind === "teaser" ? "TEASER" : v.kind === "appeal" ? "APPEAL" : v.mv ? "MV" : "MOVIE")
        + (v.center ? pill("center", "CENTER") : "") + (v.ver ? pill("ver", v.ver.toUpperCase()) : "");
      const label = `${esc(v.release)}「${esc(v.title)}」${v.th ? ` <small>${esc(v.th)}</small>` : ""}`;
      title = v.yt ? `<button data-yt="${v.yt}" data-title="${esc(videoTitle(v))}">${label}</button>` : label;
    } else {
      const ev = it.ev;
      tags = pill(ev.tag, EVENT_LABEL[ev.tag] || ev.tag.toUpperCase());
      title = `${esc(ev.title)}${ev.sub ? ` <small>${esc(ev.sub)}</small>` : ""}`;
    }
    return `<li>
      <p class="sched-date"><b>${day}.${m}</b><span>${DAYS[d.getDay()]}.${y}</span></p>
      <div class="sched-body">
        <p class="sched-tags">${tags}${isNew(it.date) ? '<span class="sched-new">NEW</span>' : ""}</p>
        <p class="sched-title">${title}</p>
      </div>
    </li>`;
  };
  const sched = document.getElementById("sched");
  const schedMore = document.getElementById("sched-more");
  const SCHED_LIMIT = 10;
  let schedAll = false;
  const renderSched = () => {
    sched.innerHTML = (schedAll ? historyItems : historyItems.slice(0, SCHED_LIMIT)).map(historyRow).join("");
    schedMore.textContent = schedAll ? "CLOSE" : `VIEW MORE (${historyItems.length})`;
  };
  schedMore.addEventListener("click", () => {
    schedAll = !schedAll;
    renderSched();
    if (!schedAll) document.getElementById("history").scrollIntoView();
  });
  renderSched();
}

// ---------- Movie ----------
if (document.getElementById("video-list")) {
  const videoList = document.getElementById("video-list");
  const videoMore = document.getElementById("video-more");
  const VIDEO_LIMIT = 9;
  let videoFilter = "all";
  let videoExpanded = false;
  const videoMatches = (v) => ({
    all: true,
    song: v.kind === "song",
    mv: !!v.mv,
    center: !!v.center,
    teaser: v.kind === "teaser",
    thai: v.ver === "Thai ver.",
    male: v.ver === "Male ver.",
  }[videoFilter]);
  const movieCard = (v) => `
    <button class="movie" data-yt="${v.yt}" data-title="${esc(videoTitle(v))}" aria-label="เล่น ${esc(videoTitle(v))}">
      <div class="movie-thumb">
        <img src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
        <span class="play" aria-hidden="true">${icon("play")}</span>
      </div>
      <div class="movie-meta">
        <time datetime="${v.date}">${fmtDate(v.date)}</time>
        <h3>${esc(v.title)}${v.th ? ` <small>${esc(v.th)}</small>` : ""}</h3>
        <p>${esc(v.release)}</p>
      </div>
    </button>`;
  const renderVideos = () => {
    const list = [...VIDEOS].reverse().filter((v) => v.yt && videoMatches(v));
    videoList.innerHTML = (videoExpanded ? list : list.slice(0, VIDEO_LIMIT)).map(movieCard).join("");
    videoMore.hidden = videoExpanded || list.length <= VIDEO_LIMIT;
    videoMore.textContent = `VIEW MORE (${list.length})`;
  };
  document.querySelectorAll("[data-vfilter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-vfilter]").forEach((b) => b.classList.toggle("is-on", b === btn));
      videoFilter = btn.dataset.vfilter;
      renderVideos();
    });
  });
  videoMore.addEventListener("click", () => { videoExpanded = true; renderVideos(); });
  renderVideos();
}

// ---------- Gallery ----------
if (document.getElementById("gallery-grid")) {
  document.getElementById("gallery-grid").innerHTML = GALLERY.map((p, i) => `
    <button class="g-item" data-lb data-caption="${esc(p.caption || "EMMY · Gallery")}">
      <img src="images/gallery/${p.img}" alt="${esc(p.caption || `เอ็มมี่ แกลเลอรี ${i + 1}`)}" loading="lazy">
    </button>`).join("");
}

// ---------- Champ of the Month (newest first) ----------
const champList = document.getElementById("champ-list");
const champs = [...CHAMPS].sort((a, b) => b.month.localeCompare(a.month));
if (champs.length && document.getElementById("banner-champ")) {
  document.getElementById("banner-champ").textContent = `×${champs.length}`;
  document.getElementById("banner-champ-sub").textContent = `ล่าสุด ${champs[0].label}`;
}
if (champList) champList.innerHTML = champs.map((c, i) => `
  <article class="champ">
    <figure class="champ-img"><img src="${c.img}" alt="Champ of the Month ${esc(c.label)}" loading="lazy" referrerpolicy="no-referrer"></figure>
    <div class="champ-body">
      <p class="champ-no">No.${String(c.count).padStart(2, "0")}</p>
      <h3>${esc(c.label)}</h3>
      <div class="champ-text" id="champ-text-${i}">
        ${c.text.map((p) => `<p>${esc(p).replace(/\n/g, "<br>").replace(/\{(\w+)\}/g, (m, name) => icon(name) || m)}</p>`).join("")}
      </div>
      <button class="view-more champ-toggle" aria-expanded="false" aria-controls="champ-text-${i}">READ MORE</button>
    </div>
  </article>`).join("");
champList?.querySelectorAll(".champ-toggle").forEach((btn) => {
  const box = document.getElementById(btn.getAttribute("aria-controls"));
  btn.addEventListener("click", () => {
    const open = box.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "CLOSE" : "READ MORE";
  });
});

// ---------- Photo archive ----------
if (document.getElementById("archive-list")) {
  const archive = document.getElementById("archive-list");
  archive.innerHTML = [...ERAS].reverse().map((e) => `
    <button class="photo" data-lb data-tags="${e.tags.join(" ")}" data-caption="${esc(fmtDate(e.date) + " — " + e.title + (e.release ? " · " + e.release : ""))}">
      <div class="photo-img">
        <img src="images/profiles/${e.img}" alt="โปรไฟล์ ${esc(e.title)}" loading="lazy" width="600" height="600">
      </div>
      <div class="photo-meta">
        <time datetime="${e.date}">${fmtDate(e.date)}</time>
        <h3>${esc(e.title)}</h3>
        <p>${esc([e.release, e.sub].filter(Boolean).join(" · "))}</p>
      </div>
    </button>`).join("");
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-on", b === btn));
      const f = btn.dataset.filter;
      archive.querySelectorAll(".photo").forEach((el) => {
        el.hidden = f !== "all" && !el.dataset.tags.split(" ").includes(f);
      });
    });
  });
}

// ---------- Notifications page ----------
function notifWhen(n) {
  const dm = `${String(n.at.getDate()).padStart(2, "0")}.${String(n.at.getMonth() + 1).padStart(2, "0")}`;
  if (n.days === 0) return "TODAY · วันนี้";
  if (n.days > 0) return `อีก ${n.days} วัน · ${dm}`;
  if (n.days === -1) return `เมื่อวาน · ${dm}`;
  return `${-n.days} วันที่แล้ว · ${dm}`;
}
if (document.getElementById("notif-list")) {
  const all = window.buildNotifications?.() || [];
  let seen = Date.now() - 7 * 864e5;
  try { seen = Number(localStorage.getItem("notif-seen")) || seen; localStorage.setItem("notif-seen", Date.now()); } catch {}
  const groups = [
    ["TODAY", "วันนี้", all.filter((n) => n.days === 0)],
    ["UPCOMING", "วันครบรอบที่กำลังจะถึง · 30 วัน", all.filter((n) => n.days > 0)],
    ["EARLIER", "ย้อนหลัง 30 วัน", all.filter((n) => n.days < 0).reverse()],
  ];
  let filter = "all";
  const row = (n) => `
    <li class="notif ${n.days <= 0 && n.at.getTime() > seen ? "is-unread" : ""} ${n.days === 0 ? "is-today" : ""}">
      <a href="${n.url}">
        <span class="notif-ico notif-${n.type}">${icon(n.icon)}</span>
        <span class="notif-body">
          <span class="notif-meta">${n.type === "anniv" ? "ANNIVERSARY" : "NEW"} · ${notifWhen(n)}</span>
          <b>${esc(n.title)}</b>${n.sub ? `<small>${esc(n.sub)}</small>` : ""}
        </span>
      </a>
    </li>`;
  const render = () => {
    const html = groups.map(([en, th, list]) => {
      const shown = list.filter((n) => filter === "all" || n.type === filter);
      return shown.length ? `<h2 class="notif-group">${en}<small>${th}</small></h2><ul class="notif-ul">${shown.map(row).join("")}</ul>` : "";
    }).join("");
    document.getElementById("notif-list").innerHTML = html || `<p class="notif-empty">${icon("bell")}ยังไม่มีการแจ้งเตือนในช่วงนี้</p>`;
  };
  document.querySelectorAll("[data-nfilter]").forEach((btn) => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-nfilter]").forEach((b) => b.classList.toggle("is-on", b === btn));
    filter = btn.dataset.nfilter;
    render();
  }));
  render();

  // device notification switch
  const box = document.getElementById("push-box");
  const state = box.querySelector(".push-state");
  const btn = box.querySelector(".push-btn");
  const test = box.querySelector(".push-test");
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const sync = () => {
    btn.hidden = test.hidden = true;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      state.textContent = ios && !standalone
        ? "บน iPhone / iPad: กดปุ่มแชร์ แล้วเลือก “เพิ่มไปยังหน้าจอโฮม” จากนั้นเปิดเว็บจากไอคอน EMMY เพื่อเปิดการแจ้งเตือน"
        : "เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน";
    } else if (Notification.permission === "granted") {
      state.textContent = "เปิดการแจ้งเตือนอยู่ — จะแจ้งเตือนวันครบรอบและผลงานใหม่ของเอ็มมี่ในวันนั้น";
      box.classList.add("is-on");
      test.hidden = false;
    } else if (Notification.permission === "denied") {
      state.textContent = "การแจ้งเตือนถูกปิดไว้ — เปิดได้ที่การตั้งค่าเว็บไซต์ของเบราว์เซอร์";
    } else {
      state.textContent = "รับการแจ้งเตือนบนมือถือ / คอมพิวเตอร์ เมื่อถึงวันครบรอบและมีผลงานใหม่";
      btn.hidden = false;
    }
  };
  btn.addEventListener("click", async () => {
    if (await Notification.requestPermission() !== "granted") return sync();
    const reg = await navigator.serviceWorker.ready;
    try { await reg.periodicSync?.register("emmy-daily", { minInterval: 12 * 36e5 }); } catch {}
    sync();
    if (!(await window.notifyToday(reg))) reg.showNotification("EMMY · BLM48", { body: "เปิดการแจ้งเตือนเรียบร้อย แล้วเจอกันในวันครบรอบนะ", icon: "/images/icon-512.png", data: { url: "/notifications" } });
  });
  test.addEventListener("click", async () => {
    const reg = await navigator.serviceWorker.ready;
    const next = all.find((n) => n.days >= 0) || all[all.length - 1];
    reg.showNotification(next ? next.title : "EMMY · BLM48", { body: next ? `${notifWhen(next)}${next.sub ? " · " + next.sub : ""}` : "ทดสอบการแจ้งเตือน", icon: "/images/icon-512.png", tag: "test", data: { url: next ? next.url : "/notifications" } });
  });
  sync();
}

// ---------- Anniversary pop-up (today + next 7 days, once per day) ----------
{
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const annivs = (window.buildNotifications?.(today, { ahead: 7, back: 0 }) || []).filter((n) => n.type === "anniv");
  let dismissed = null;
  try { dismissed = localStorage.getItem("anniv-dismissed"); } catch {}
  if (annivs.length && dismissed !== todayKey && !document.getElementById("notif-list")) {
    document.body.insertAdjacentHTML("beforeend", `
      <aside class="anniv" role="status" aria-label="แจ้งเตือนวันครบรอบ">
        <p class="anniv-head">${icon(annivs.some((a) => a.days === 0) ? "heart" : "bell")}ANNIVERSARY</p>
        <ul>${annivs.map((a) => `
          <li class="${a.days === 0 ? "is-today" : ""}">
            <span class="anniv-when">${notifWhen(a)}</span>
            <b>${esc(a.title)}</b>${a.sub ? `<small>${esc(a.sub)}</small>` : ""}
          </li>`).join("")}
        </ul>
        <a class="anniv-all" href="/notifications">ดูการแจ้งเตือนทั้งหมด ${icon("arrow")}</a>
        <button class="anniv-close" aria-label="ปิดการแจ้งเตือน">${icon("close")}</button>
      </aside>`);
    const box = document.querySelector(".anniv");
    requestAnimationFrame(() => box.classList.add("in"));
    box.querySelector(".anniv-close").addEventListener("click", () => {
      box.remove();
      try { localStorage.setItem("anniv-dismissed", todayKey); } catch {}
    });
  }
}

// ---------- Menu ----------
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const setMenu = (open) => {
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
  document.body.style.overflow = open ? "hidden" : "";
};
menuBtn.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// ---------- Player (YouTube, loaded on click) ----------
const player = document.querySelector(".player");
const playerFrame = player.querySelector(".player-frame");
const playerCap = player.querySelector(".player-cap span");
const playerLink = player.querySelector(".player-cap a");
let playerOpener = null;
const closePlayer = () => {
  player.hidden = true;
  playerFrame.innerHTML = "";
  document.body.style.overflow = "";
  playerOpener?.focus();
};
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-yt]");
  if (!btn) return;
  playerOpener = btn;
  const id = btn.dataset.yt;
  playerFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${btn.dataset.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  playerCap.textContent = btn.dataset.title;
  playerLink.href = `https://youtu.be/${id}`;
  player.hidden = false;
  document.body.style.overflow = "hidden";
  player.querySelector(".player-close").focus();
});
player.querySelector(".player-close").addEventListener("click", closePlayer);
player.addEventListener("click", (e) => { if (e.target === player) closePlayer(); });

// ---------- Lightbox (per group, visible items only) ----------
const lb = document.querySelector(".lightbox");
const lbImg = document.createElement("img");
lb.querySelector("figure").prepend(lbImg);
const lbCap = lb.querySelector("figcaption");
let group = [];
let current = 0;
let opener = null;
const show = (i) => {
  current = (i + group.length) % group.length;
  const btn = group[current];
  const img = btn.querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = `${btn.dataset.caption || ""}  (${current + 1}/${group.length})`;
};
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; opener?.focus(); };
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-lb]");
  if (!btn) return;
  group = [...btn.closest("[data-lb-group]").querySelectorAll("[data-lb]")].filter((b) => !b.hidden);
  opener = btn;
  show(group.indexOf(btn));
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  lb.querySelector(".lb-close").focus();
});
lb.querySelector(".lb-close").addEventListener("click", closeLb);
lb.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
lb.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!player.hidden) closePlayer();
    else if (!lb.hidden) closeLb();
    else if (!menu.hidden) setMenu(false);
  }
  if (lb.hidden) return;
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".sec-tit, .profile, .message, .covers, .champ")
  .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
