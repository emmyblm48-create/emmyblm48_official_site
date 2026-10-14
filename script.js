const ERAS = window.ERAS || [];
const TAG_LABEL = { center: "Center", senbatsu: "Senbatsu", under: "Under", cw: "c/w", event: "Event" };
const fmtDate = (iso) => iso.split("-").reverse().join(".");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- Stats ----------
const count = (tag) => ERAS.filter((e) => e.tags.includes(tag)).length;
const statValues = { senbatsu: count("senbatsu"), center: count("center"), eras: ERAS.length };
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
document.querySelectorAll(".filters .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filters .chip").forEach((c) => c.classList.toggle("is-on", c === chip));
    const f = chip.dataset.filter;
    archive.querySelectorAll(".era").forEach((el) => {
      el.hidden = f !== "all" && !el.dataset.tags.split(" ").includes(f);
    });
    archive.querySelectorAll(".year").forEach((y) => {
      y.hidden = !y.querySelector(".era:not([hidden])");
    });
  });
});

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
  if (e.key === "Escape") { if (!lb.hidden) closeLb(); else if (!drawer.hidden) setDrawer(false); }
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
