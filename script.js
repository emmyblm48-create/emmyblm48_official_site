const ERAS = window.ERAS || [];
const VIDEOS = window.VIDEOS || [];
const TAG_LABEL = { center: "Center", senbatsu: "Senbatsu", under: "Under", cw: "c/w", event: "Event" };
const fmtDate = (iso) => iso.split("-").reverse().join(".");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- Stats ----------
const count = (tag) => ERAS.filter((e) => e.tags.includes(tag)).length;
const centerSongs = new Set([
  ...ERAS.filter((e) => e.tags.includes("center")).map((e) => e.title),
  ...VIDEOS.filter((v) => v.center).map((v) => v.title),
]);
const statValues = { senbatsu: count("senbatsu"), center: centerSongs.size, eras: ERAS.length, videos: VIDEOS.length };
document.querySelectorAll("[data-stat]").forEach((el) => { el.textContent = statValues[el.dataset.stat]; });

// ---------- Archive (grouped by year) ----------
const archive = document.getElementById("archive-list");
const years = [...new Set(ERAS.map((e) => e.date.slice(0, 4)))];
archive.innerHTML = years.map((y) => {
  const items = ERAS.filter((e) => e.date.startsWith(y));
  return `
    <section class="year" data-year="${y}">
      <h3 class="year-label">${y}</h3>
      <div class="year-grid">
        ${items.map((e) => `
          <article class="era" data-tags="${e.tags.join(" ")}">
            <button class="era-photo" data-lb data-caption="${esc(fmtDate(e.date) + " — " + e.title + (e.release ? " · " + e.release : ""))}">
              <img src="images/profiles/${e.img}" alt="โปรไฟล์ ${esc(e.title)}" loading="lazy" width="600" height="600">
              ${e.tags.includes("center") ? '<span class="era-star">★ CENTER</span>' : ""}
            </button>
            <div class="era-body">
              <time datetime="${e.date}">${fmtDate(e.date)}</time>
              <h4>${esc(e.title)}</h4>
              ${e.jp ? `<p class="era-jp">${esc(e.jp)}</p>` : ""}
              <p class="era-sub">${esc([e.release, e.sub].filter(Boolean).join(" · "))}</p>
              <p class="era-tags">${e.tags.map((t) => `<span class="tag ${t}">${TAG_LABEL[t]}</span>`).join("")}</p>
            </div>
          </article>`).join("")}
      </div>
    </section>`;
}).join("");

// Filters
document.querySelectorAll("[data-filter]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((c) => c.classList.toggle("is-on", c === chip));
    const f = chip.dataset.filter;
    archive.querySelectorAll(".era").forEach((el) => {
      el.hidden = f !== "all" && !el.dataset.tags.split(" ").includes(f);
    });
    archive.querySelectorAll(".year").forEach((y) => {
      y.hidden = !y.querySelector(".era:not([hidden])");
    });
  });
});

// ---------- Performances (newest first) ----------
const videoList = document.getElementById("video-list");
const videoMore = document.getElementById("video-more");
const VIDEO_LIMIT = 12;
let videoFilter = "all";
let videoExpanded = false;
const videoMatches = (v) => ({
  all: true,
  song: v.kind === "song",
  center: !!v.center,
  teaser: v.kind === "teaser",
  thai: v.ver === "Thai ver.",
  male: v.ver === "Male ver.",
}[videoFilter]);
const videoCard = (v) => {
  const label = v.kind === "teaser" ? "Teaser" : v.kind === "appeal" ? "Appeal" : "";
  const thumb = v.yt
    ? `<img src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="play" aria-hidden="true">▶</span>`
    : `<span class="no-link">ลิงก์เร็ว ๆ นี้</span>`;
  const inner = `
      <div class="v-thumb">${thumb}
        ${v.center ? '<span class="era-star">★ CENTER</span>' : ""}
        ${label ? `<span class="v-kind">${label}</span>` : ""}
      </div>
      <div class="v-body">
        <time datetime="${v.date}">${fmtDate(v.date)}</time>
        <h4>${esc(v.title)}</h4>
        ${v.th ? `<p class="v-th">${esc(v.th)}</p>` : ""}
        <p class="v-rel">${esc(v.release)}</p>
        ${v.ver ? `<p class="era-tags"><span class="tag ${v.ver.startsWith("Thai") ? "event" : "cw"}">${v.ver}</span></p>` : ""}
      </div>`;
  return v.yt
    ? `<button class="video" data-yt="${v.yt}" data-title="${esc(v.title + (v.kind === "teaser" ? " (Teaser)" : ""))}" aria-label="เล่น ${esc(v.title)}">${inner}</button>`
    : `<div class="video is-empty">${inner}</div>`;
};
const renderVideos = () => {
  const list = [...VIDEOS].reverse().filter(videoMatches);
  const shown = videoExpanded ? list : list.slice(0, VIDEO_LIMIT);
  videoList.innerHTML = shown.map(videoCard).join("");
  videoMore.hidden = videoExpanded || list.length <= VIDEO_LIMIT;
  videoMore.textContent = `แสดงทั้งหมด (${list.length})`;
};
document.querySelectorAll("[data-vfilter]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-vfilter]").forEach((c) => c.classList.toggle("is-on", c === chip));
    videoFilter = chip.dataset.vfilter;
    renderVideos();
  });
});
videoMore.addEventListener("click", () => { videoExpanded = true; renderVideos(); });
renderVideos();

// Player (YouTube embed, loaded only on click)
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
videoList.addEventListener("click", (e) => {
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

// ---------- Discography ----------
const posOf = (e) => e.tags.includes("center") ? ["center", "senbatsu"] : e.tags.filter((t) => t !== "event");
document.getElementById("disco-body").innerHTML = ERAS.filter((e) => e.release).map((e) => `
  <tr class="${e.tags.includes("center") ? "is-center" : ""}">
    <td class="d-date">${fmtDate(e.date)}</td>
    <td class="d-rel">${esc(e.release)}</td>
    <td class="d-title"><b>${esc(e.title)}</b>${e.jp ? `<small>${esc(e.jp)}</small>` : ""}</td>
    <td class="d-pos">${posOf(e).map((t) => `<span class="tag ${t}">${TAG_LABEL[t]}</span>`).join("")}</td>
  </tr>`).join("");

// ---------- Contents drawer ----------
const menuBtn = document.querySelector(".bar-menu");
const drawer = document.querySelector(".drawer");
const setDrawer = (open) => {
  drawer.hidden = !open;
  menuBtn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
menuBtn.addEventListener("click", () => setDrawer(drawer.hidden));
drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });

// ---------- Lightbox (per group, visible items only) ----------
const lb = document.querySelector(".lightbox");
const lbImg = lb.querySelector("img");
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
  const container = btn.closest("[data-lb-group]");
  group = [...container.querySelectorAll("[data-lb]")].filter((b) => !b.closest("[hidden]"));
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
  if (e.key === "Escape") { if (!player.hidden) closePlayer(); else if (!lb.hidden) closeLb(); else if (!drawer.hidden) setDrawer(false); }
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
document.querySelectorAll(".stat, .contents-list li, .ch-head, .idcard, .letter blockquote, .why, .election, .glossary > div, .era, .disco, .ticket, .album, .pc, .roster")
  .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
