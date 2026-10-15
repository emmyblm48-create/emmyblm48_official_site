// Fav Songs: CD cases standing in a row (like Apple Music's album shelf), sorted by cover colour (favsongs-data.js).
// Scroll → the CDs turn with a little easing · press and hold → that CD is pulled out of the row
// Tap → the case flies to the middle, opens, and the album sheet comes up (tracklist from the iTunes lookup API, 30s previews).
(() => {
  const shelf = document.getElementById("fav-list");
  if (!shelf) return;
  const ALBUMS = window.FAV_ALBUMS || [];
  const albumUrl = (a) => `https://music.apple.com/th/album/${a.id}`;
  const songCount = ALBUMS.reduce((n, a) => n + a.fav.length, 0);
  document.getElementById("fav-count").textContent = `${songCount} SONGS · ${ALBUMS.length} ALBUMS`;
  if (window.FAV_PLAYLIST) document.getElementById("fav-playlist").href = window.FAV_PLAYLIST;
  shelf.innerHTML = ALBUMS.map((a, i) => `
    <div class="cd-slot" role="listitem">
      <button class="cd" type="button" data-i="${i}" style="--bg:#${a.bg};--fg:#${a.fg};--fg2:#${a.fg2}" aria-label="${esc(a.title)} · ${esc(a.artist)} — ดูรายชื่อเพลง">
        <img class="cd-cover" src="${esc(a.cover)}" alt="" width="600" height="600" loading="lazy" decoding="async" referrerpolicy="no-referrer">
        <span class="cd-spine"><b>${esc(a.title)}</b> ${esc(a.artist)}</span>
      </button>
    </div>`).join("");

  // ---------- shelf motion ----------
  const slots = [...shelf.querySelectorAll(".cd-slot")];
  const state = slots.map(() => ({ angle: 80, lift: 0 }));
  let held = -1;     // CD being pressed (pulled out of the row)
  let hovered = -1;  // mouse over a CD (pulled out a little)
  let running = false;
  const frame = () => {
    const box = shelf.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    const reach = box.width / 2;
    const depth = box.height * 2.4; // camera distance: one shared vanishing point in the middle of the shelf
    let moving = false;
    slots.forEach((slot, i) => {
      const r = slot.getBoundingClientRect();
      if (r.right < box.left - 400 || r.left > box.right + 400) return; // off screen
      const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / reach)); // -1 left · 0 middle · +1 right
      const right = d > 0;
      // every CD stands on its outer edge with the inner edge turned away · middle: just the spine · sides: open a little more
      let target = 86 - Math.abs(d) * 22;
      let lift = 0;
      if (i === held) { target = 34; lift = 1; } else if (i === hovered) { target -= 10; lift = .35; }
      const s = state[i];
      const k = reduceMotion ? 1 : .22; // easing towards the target each frame
      s.angle += (target - s.angle) * k;
      s.lift += (lift - s.lift) * k;
      if (Math.abs(target - s.angle) > .05 || Math.abs(lift - s.lift) > .002) moving = true;
      slot.classList.toggle("is-right", right);
      // CDs nearer the middle stand in front of the outer CDs' receding sides; a pulled-out CD comes to the very front
      slot.style.zIndex = i === held ? 300 : 100 - Math.round(Math.abs(d) * 100) + (i === hovered ? 100 : 0);
      // move the perspective centre from the CD's pivot (its outer edge) to the middle of the shelf
      const vx = mid - (right ? r.right : r.left);
      slot.style.setProperty("--tf", `translateX(${vx.toFixed(1)}px) perspective(${depth.toFixed(0)}px) translateX(${(-vx).toFixed(1)}px) translateZ(${(s.lift * 60).toFixed(1)}px) rotateY(${(right ? -s.angle : s.angle).toFixed(2)}deg)`);
      slot.style.setProperty("--lift", s.lift.toFixed(3));
    });
    running = moving;
    if (running) requestAnimationFrame(frame);
  };
  const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
  shelf.addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  // start in the middle of the row
  requestAnimationFrame(() => {
    const m = slots[Math.floor(slots.length / 2)];
    if (m) shelf.scrollLeft = m.offsetLeft + m.offsetWidth / 2 - shelf.clientWidth / 2;
    state.forEach((s) => { s.angle = 86; });
    kick();
  });
  // mouse wheel scrolls the row sideways on desktop
  shelf.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    shelf.scrollLeft += e.deltaY;
  }, { passive: false });

  // press and hold: pull the CD out of the row (released when the finger lifts or starts scrolling)
  const indexOf = (el) => Number(el?.closest(".cd")?.dataset.i ?? -1);
  let holdTimer = 0;
  const release = () => { clearTimeout(holdTimer); if (held !== -1) { held = -1; kick(); } };
  shelf.addEventListener("pointerdown", (e) => {
    const i = indexOf(e.target);
    if (i < 0) return;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => { held = i; kick(); }, 140);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((t) => shelf.addEventListener(t, release));
  shelf.addEventListener("scroll", () => { if (held !== -1 || holdTimer) release(); }, { passive: true });
  shelf.addEventListener("contextmenu", (e) => { if (e.target.closest(".cd")) e.preventDefault(); }); // long-press menu on phones
  if (matchMedia("(hover: hover)").matches) {
    shelf.addEventListener("pointerover", (e) => { const i = indexOf(e.target); if (i !== hovered) { hovered = i; kick(); } });
    shelf.addEventListener("pointerleave", () => { hovered = -1; kick(); });
  }

  // ---------- album sheet ----------
  const sheet = document.getElementById("fav-detail");
  const $ = (sel) => sheet.querySelector(sel);
  const tracksEl = $(".fd-tracks");
  const audio = new Audio();
  let tracks = [];
  let playing = -1;
  let opener = null;
  let current = null;
  $(".fd-close").innerHTML = icon("close");
  const mmss = (ms) => `${Math.floor(ms / 60000)}'${String(Math.round(ms / 1000) % 60).padStart(2, "0")}"`;
  const markPlaying = () => {
    tracksEl.querySelectorAll(".fd-track").forEach((li, i) => {
      li.classList.toggle("is-playing", i === playing);
      li.querySelector("button")?.setAttribute("aria-pressed", String(i === playing));
    });
    sheet.classList.toggle("is-playing", playing !== -1);
  };
  const play = (i) => {
    if (i === playing) { audio.pause(); playing = -1; markPlaying(); return; }
    if (!tracks[i]?.previewUrl) return;
    audio.src = tracks[i].previewUrl;
    audio.play().catch(() => {});
    playing = i;
    markPlaying();
  };
  audio.addEventListener("ended", () => { playing = -1; markPlaying(); });

  const fill = async (a) => {
    current = a;
    sheet.style.setProperty("--bg", `#${a.bg}`);
    $(".fd-cover").src = a.cover;
    $(".fd-disc").style.backgroundImage = `url("${a.cover}")`;
    $(".fd-title").textContent = a.title;
    $(".fd-artist").textContent = a.artist;
    $(".fd-meta").textContent = "";
    $(".fd-open").href = albumUrl(a);
    $(".fd-total").textContent = "";
    tracksEl.innerHTML = '<li class="fd-note">กำลังโหลดรายชื่อเพลง…</li>';
    tracks = [];
    const favIds = a.fav.map(([id]) => id);
    try {
      // the Thai store leaves out the songs of some Japanese releases; the same ids work in the Japan store
      let album = null;
      for (const country of ["th", "jp"]) {
        const [info, ...songs] = (await (await fetch(`https://itunes.apple.com/lookup?id=${a.id}&entity=song&country=${country}`)).json()).results;
        album = album || info;
        tracks = songs.filter((t) => t.wrapperType === "track");
        if (tracks.length) break;
      }
      if (current !== a) return;
      tracks.sort((x, y) => (x.discNumber - y.discNumber) || (x.trackNumber - y.trackNumber));
      // not in the lookup at all: list the playlist's songs from this album
      if (!tracks.length) tracks = a.fav.map(([trackId, trackName, trackTimeMillis], n) => ({ trackId, trackName, trackTimeMillis, trackNumber: n + 1 }));
      $(".fd-meta").textContent = album ? [album.primaryGenreName, album.releaseDate?.slice(0, 4)].filter(Boolean).join(" · ") : "";
      tracksEl.innerHTML = tracks.map((t) => {
        const fav = favIds.includes(t.trackId);
        return `
        <li class="fd-track${fav ? " is-fav" : ""}">
          <button type="button" aria-pressed="false" ${t.previewUrl ? "" : "disabled"}>
            <span class="fd-no">${String(t.trackNumber).padStart(2, "0")}</span>
            <span class="fd-name">${esc(t.trackName)}${fav ? ` <span class="fd-heart" title="อยู่ในเพลย์ลิสต์ Emmy's Favorite">${icon("heart")}</span>` : ""}</span>
            <span class="fd-time">${mmss(t.trackTimeMillis)}</span>
          </button>
        </li>`;
      }).join("");
      const total = tracks.reduce((sum, t) => sum + t.trackTimeMillis, 0);
      $(".fd-total").textContent = `${tracks.length} SONGS, ${Math.floor(total / 60000)} MIN, ${Math.round(total / 1000) % 60} SECS`;
    } catch {
      if (current === a) tracksEl.innerHTML = '<li class="fd-note">โหลดรายชื่อเพลงไม่ได้ · ลองเปิดใน Apple Music</li>';
    }
  };
  const showSheet = () => {
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    if (!reduceMotion) sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    if (!reduceMotion) $(".fd-box").animate([{ transform: "translateY(24px) scale(.97)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    $(".fd-close").focus();
  };

  // the CD case flies from the shelf to the middle of the screen and opens; then the sheet comes up
  const fly = document.createElement("div");
  fly.className = "cd-fly";
  fly.hidden = true;
  fly.setAttribute("aria-hidden", "true");
  fly.innerHTML = '<div class="cf-case"><div class="cf-tray"><div class="cf-disc"></div></div><div class="cf-lid"></div></div>';
  document.body.append(fly);
  const flyCase = fly.querySelector(".cf-case");
  const lid = fly.querySelector(".cf-lid");
  const disc = fly.querySelector(".cf-disc");
  let flying = false;
  const openCase = async (i, btn) => {
    const a = ALBUMS[i];
    if (flying) return;
    opener = btn;
    release();
    fill(a);
    if (reduceMotion) { showSheet(); return; }
    flying = true;
    const from = btn.querySelector(".cd-cover").getBoundingClientRect();
    const size = Math.min(innerWidth * .72, innerHeight * .5, 380);
    lid.style.setProperty("--img", `url("${a.cover}")`);
    disc.style.backgroundImage = `url("${a.cover}")`;
    fly.style.setProperty("--size", `${size}px`);
    fly.style.setProperty("--bg", `#${a.bg}`);
    fly.hidden = false;
    const dx = from.left + from.width / 2 - innerWidth / 2;
    const dy = from.top + from.height / 2 - innerHeight / 2;
    const sc = from.height / size;
    const side = btn.closest(".cd-slot").classList.contains("is-right") ? -1 : 1;
    const ease = "cubic-bezier(.2,.8,.2,1)";
    fly.animate([{ backgroundColor: "#2a120800" }, { backgroundColor: "#2a1208e6" }], { duration: 420, fill: "forwards" });
    await flyCase.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${sc}) rotateY(${side * 70}deg)` },
      { transform: "none" },
    ], { duration: 520, easing: ease }).finished;
    // lid swings open on its hinge, the disc slides out and spins
    lid.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(-158deg)" }], { duration: 620, easing: ease, fill: "forwards" });
    await disc.animate([
      { transform: "translateX(0) rotate(0deg)" },
      { transform: "translateX(0) rotate(40deg)", offset: .35 },
      { transform: "translateX(26%) rotate(300deg)" },
    ], { duration: 820, easing: "ease-out", fill: "forwards" }).finished;
    showSheet();
    await fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: "forwards" }).finished;
    fly.getAnimations({ subtree: true }).forEach((an) => an.cancel());
    fly.hidden = true;
    flying = false;
  };
  const close = () => {
    audio.pause();
    playing = -1;
    markPlaying();
    current = null;
    sheet.hidden = true;
    document.body.style.overflow = "";
    opener?.focus({ preventScroll: true });
  };

  shelf.addEventListener("click", (e) => {
    const btn = e.target.closest(".cd");
    if (btn) openCase(Number(btn.dataset.i), btn);
  });
  tracksEl.addEventListener("click", (e) => {
    const li = e.target.closest(".fd-track");
    if (li) play([...tracksEl.children].indexOf(li));
  });
  $(".fd-play").addEventListener("click", () => {
    if (playing !== -1) return play(playing);
    const first = tracks.findIndex((t) => current?.fav.some(([id]) => id === t.trackId));
    play(first === -1 ? 0 : first);
  });
  $(".fd-close").addEventListener("click", close);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) close(); });
})();
