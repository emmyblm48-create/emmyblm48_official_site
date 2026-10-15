// Fav Songs: album covers stacked in 3D (like Apple Music's album stack) — each cover tilts by where it sits on screen.
(() => {
  const list = document.getElementById("fav-list");
  if (!list) return;
  const SONGS = window.FAV_SONGS || [];
  document.getElementById("fav-count").textContent = `${SONGS.length} SONGS`;
  list.innerHTML = SONGS.map((s, i) => `
    <li class="fav" style="z-index:${SONGS.length - i}">
      <a class="fav-card" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.title)} · ${esc(s.artist)} — เปิดใน Apple Music">
        <img class="fav-cover" src="${esc(s.cover)}" alt="" width="600" height="600" loading="${i < 4 ? "eager" : "lazy"}" referrerpolicy="no-referrer">
        <span class="fav-label"><b>${esc(s.title)}</b> ${esc(s.artist)}</span>
      </a>
    </li>`).join("");

  if (reduceMotion) return;
  const cards = [...list.querySelectorAll(".fav-card")];
  let ticking = false;
  const tilt = () => {
    ticking = false;
    const vh = innerHeight;
    cards.forEach((c) => {
      const r = c.parentNode.getBoundingClientRect();
      // -1 at the top of the screen, 0 in the middle, +1 at the bottom
      const t = Math.max(-1.4, Math.min(1.4, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
      const angle = Math.max(8, Math.min(80, 38 - t * 42));  // top of screen: nearly flat (edge on) · middle: tilted back · bottom: almost upright
      const scale = 1 - Math.abs(t) * .04;
      c.style.transform = `perspective(1000px) rotateX(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      c.style.filter = t > 1 ? `blur(${((t - 1) * 8).toFixed(1)}px)` : "";
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tilt); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  tilt();
})();
