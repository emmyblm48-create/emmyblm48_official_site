// Fav Songs: CD cases standing in a row (like Apple Music's album shelf), sorted by cover colour (favsongs-data.js).
// Scroll → the CDs turn with a little easing · press and hold → that CD is pulled out of the row
// Tap → the case flies to the middle, opens, and the album sheet comes up (tracklist from the iTunes lookup API, Apple Music player).
(() => {
  const shelf = document.getElementById("fav-list");
  if (!shelf) return;
  const ALBUMS = window.FAV_ALBUMS || [];
  const albumUrl = (a) => `https://music.apple.com/th/album/${a.id}`;
  const songCount = ALBUMS.reduce((n, a) => n + a.fav.length, 0);
  document.getElementById("fav-count").textContent = `${songCount} SONGS · ${ALBUMS.length} ALBUMS`;
  // the whole playlist in Apple Music's web player under the shelf: plays on across albums
  const playlistPlayer = document.getElementById("fav-playlist-player");
  if (window.FAV_PLAYLIST) {
    document.getElementById("fav-playlist").href = window.FAV_PLAYLIST;
    playlistPlayer.src = window.FAV_PLAYLIST.replace("https://music.apple.com/", "https://embed.music.apple.com/");
  }
  const colours = (a) => `--bg:#${a.bg};--fg:#${a.fg};--fg2:#${a.fg2}`;
  // "Believers - EP" → "Believers" (printed inside the booklet in the opening)
  const parts = (a) => ({ name: a.title.replace(/\s+-\s+(Single|EP)$/i, "") });
  shelf.innerHTML = ALBUMS.map((a, i) => `
    <div class="cd-slot" role="listitem">
      <button class="cd" type="button" data-i="${i}" style="${colours(a)}" aria-label="${esc(a.title)} · ${esc(a.artist)} — ดูรายชื่อเพลง">
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
  // the Apple Music web player (embed.music.apple.com): full songs for anyone signed in to Apple Music, 30s previews otherwise
  const player = $(".fd-player iframe");
  let store = "th";
  let tracks = [];
  let playing = -1; // track loaded in the player
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
  const play = (i, { scroll = true } = {}) => {
    const t = tracks[i];
    if (!t?.trackId || !current) return;
    if (i !== playing) player.src = `https://embed.music.apple.com/${store}/album/${current.id}?i=${t.trackId}`;
    $(".fd-player").hidden = false;
    playing = i;
    markPlaying();
    if (scroll) $(".fd-player").scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  };
  const stop = () => { player.src = "about:blank"; $(".fd-player").hidden = true; playing = -1; markPlaying(); };

  const fill = async (a) => {
    current = a;
    sheet.setAttribute("style", `${colours(a)};--img:url("${a.cover}")`);
    $(".fd-cover").src = a.cover;
    $(".fd-title").textContent = a.title;
    $(".fd-artist").textContent = a.artist;
    $(".fd-meta").textContent = "";
    $(".fd-open").href = albumUrl(a);
    // only Emmy's songs from this album, in playlist order
    tracks = a.fav.map(([trackId, trackName, trackTimeMillis], n) => ({ trackId, trackName, trackTimeMillis, trackNumber: n + 1 }));
    tracksEl.innerHTML = tracks.map((t) => `
        <li class="fd-track">
          <button type="button" aria-pressed="false">
            <span class="fd-no">${String(t.trackNumber).padStart(2, "0")}</span>
            <span class="fd-name">${esc(t.trackName)}</span>
            <span class="fd-time">${t.trackTimeMillis ? mmss(t.trackTimeMillis) : ""}</span>
          </button>
        </li>`).join("");
    $(".fd-total").textContent = `${tracks.length} ${tracks.length === 1 ? "SONG" : "SONGS"} IN EMMY'S FAVORITE`;
    stop();
    store = "th";
    try {
      // the Thai store leaves out the songs of some Japanese releases; the same ids work in the Japan store
      let album = null;
      for (const country of ["th", "jp"]) {
        const [info, ...songs] = (await (await fetch(`https://itunes.apple.com/lookup?id=${a.id}&entity=song&country=${country}`)).json()).results;
        album = album || info;
        if (songs.some((t) => t.wrapperType === "track")) { store = country; break; }
      }
      if (current !== a) return;
      $(".fd-meta").textContent = album ? [album.primaryGenreName, album.releaseDate?.slice(0, 4)].filter(Boolean).join(" · ") : "";
    } catch {}
    // ready in the player: the first song (the store is known once the lookup is back)
    if (current === a) play(0, { scroll: false });
  };
  const showSheet = () => {
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    if (!reduceMotion) sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    if (!reduceMotion) $(".fd-box").animate([{ transform: "translateY(24px) scale(.97)" }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    $(".fd-close").focus();
  };

  // opening, like the real thing: the plastic case flies from the shelf to the middle, opens like a book
  // (booklet left, the disc with the cover printed on it right), the disc lifts → album sheet.
  // Tap anywhere during the animation to skip it.
  const fly = document.createElement("div");
  fly.className = "cd-fly";
  fly.hidden = true;
  fly.setAttribute("aria-hidden", "true");
  fly.innerHTML = '<div class="cf-stage"><div class="cf-jewel"><div class="cf-tray"><div class="disc cf-disc"></div></div><div class="cf-lid"></div></div></div>';
  document.body.append(fly);
  const stage = fly.querySelector(".cf-stage");
  const jewel = fly.querySelector(".cf-jewel");
  const lid = fly.querySelector(".cf-lid");
  const disc = fly.querySelector(".cf-disc");
  let flying = false;
  let skip = false;
  fly.addEventListener("click", () => { skip = true; fly.getAnimations({ subtree: true }).forEach((an) => an.playState === "running" && an.finish()); });
  const ease = "cubic-bezier(.2,.8,.2,1)";
  const run = (el, frames, ms, opts = {}) => el.animate(frames, { duration: skip ? 1 : ms, easing: ease, fill: "forwards", ...opts }).finished;
  const openCase = async (i, btn) => {
    const a = ALBUMS[i];
    if (flying) return;
    opener = btn;
    release();
    fill(a);
    if (reduceMotion) { showSheet(); return; }
    flying = true;
    skip = false;
    const from = btn.querySelector(".cd-cover").getBoundingClientRect();
    const size = Math.min(innerWidth * .7, innerHeight * .45, 380);
    const fit = Math.min(1, (innerWidth * .94) / (size * 2)); // the open case is twice as wide
    fly.setAttribute("style", `${colours(a)};--size:${size}px;--img:url("${a.cover}")`);
    lid.dataset.title = parts(a).name;
    fly.hidden = false;
    const dx = from.left + from.width / 2 - innerWidth / 2;
    const dy = from.top + from.height / 2 - innerHeight / 2;
    const side = btn.closest(".cd-slot").classList.contains("is-right") ? -1 : 1;
    run(fly, [{ backgroundColor: "#2a120800" }, { backgroundColor: "#2a1208e6" }], 420);
    // 1 · off the shelf, turning to face you, then a little lift towards you
    await run(stage, [
      { transform: `translate(${dx}px, ${dy}px) scale(${from.height / size}) rotateY(${side * 70}deg)` },
      { transform: "translateZ(60px) rotateX(8deg)", offset: .75 },
      { transform: "none" },
    ], 820);
    // 2 · open it like a book: the booklet swings to the left, the tray with the disc stays
    await Promise.all([
      run(stage, [{ transform: "none" }, { transform: `scale(${fit}) translateX(50%)` }], 720),
      run(lid, [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-178deg)" }], 720),
    ]);
    // 3 · the disc lifts out of the tray and spins
    await run(disc, [{ transform: "none" }, { transform: "translateZ(60px) scale(1.04) rotate(240deg)" }], 720, { easing: "ease-in-out" });
    showSheet();
    await run(fly, [{ opacity: 1 }, { opacity: 0 }], 240);
    fly.getAnimations({ subtree: true }).forEach((an) => an.cancel());
    fly.hidden = true;
    flying = false;
  };
  const close = () => {
    stop();
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
  // PLAYLIST: close the sheet and go to the playlist player under the shelf, which plays on across albums
  $(".fd-play").addEventListener("click", () => {
    close();
    playlistPlayer.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  });
  $(".fd-close").addEventListener("click", close);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) close(); });
})();
