// Fav Songs: CD cases standing in a row (like Apple Music's album shelf) — each CD turns by how far it is from the middle.
// Tap a CD → album sheet with its tracklist (from the iTunes lookup API) and 30-second previews.
(() => {
  const shelf = document.getElementById("fav-list");
  if (!shelf) return;
  const SONGS = window.FAV_SONGS || [];
  const albumUrl = (s) => `https://music.apple.com/${s.store}/album/${s.id}`;
  document.getElementById("fav-count").textContent = `${SONGS.length} ALBUMS`;
  shelf.innerHTML = SONGS.map((s, i) => `
    <div class="cd-slot" role="listitem">
      <button class="cd" type="button" data-i="${i}" aria-label="${esc(s.title)} · ${esc(s.artist)} — ดูรายชื่อเพลง">
        <img class="cd-cover" src="${esc(s.cover)}" alt="" width="600" height="600" loading="${i < 5 ? "eager" : "lazy"}" referrerpolicy="no-referrer">
        <span class="cd-spine"><b>${esc(s.title)}</b> ${esc(s.artist)}</span>
      </button>
    </div>`).join("");

  // ---------- shelf: turn each CD by its distance from the middle ----------
  const slots = [...shelf.querySelectorAll(".cd-slot")];
  let ticking = false;
  const turn = () => {
    ticking = false;
    const box = shelf.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    const reach = Math.min(box.width / 2, 520);
    slots.forEach((slot) => {
      const r = slot.getBoundingClientRect();
      const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / reach)); // -1 left · 0 middle · +1 right
      // middle: almost edge-on (just the spine) · towards the sides: opens up to face you
      const angle = reduceMotion ? 0 : -Math.sign(d || 1) * (78 - Math.abs(d) * 50);
      slot.style.setProperty("--ry", `${angle.toFixed(1)}deg`);
      slot.style.zIndex = Math.round(Math.abs(d) * 100);
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(turn); } };
  shelf.addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  // start in the middle of the row
  requestAnimationFrame(() => {
    const mid = slots[Math.floor(slots.length / 2)];
    if (mid) shelf.scrollLeft = mid.offsetLeft + mid.offsetWidth / 2 - shelf.clientWidth / 2;
    turn();
  });
  // mouse wheel scrolls the row sideways on desktop
  shelf.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    shelf.scrollLeft += e.deltaY;
  }, { passive: false });

  // ---------- album sheet ----------
  const sheet = document.getElementById("fav-detail");
  const $ = (sel) => sheet.querySelector(sel);
  const tracksEl = $(".fd-tracks");
  const audio = new Audio();
  let tracks = [];
  let playing = -1;
  let opener = null;
  $(".fd-close").innerHTML = icon("close");
  const mmss = (ms) => `${Math.floor(ms / 60000)}'${String(Math.round(ms / 1000) % 60).padStart(2, "0")}"`;
  const markPlaying = () => tracksEl.querySelectorAll(".fd-track").forEach((li, i) => {
    li.classList.toggle("is-playing", i === playing);
    li.querySelector("button")?.setAttribute("aria-pressed", String(i === playing));
  });
  const play = (i) => {
    if (i === playing) { audio.pause(); playing = -1; markPlaying(); return; }
    if (!tracks[i]?.previewUrl) return;
    audio.src = tracks[i].previewUrl;
    audio.play().catch(() => {});
    playing = i;
    markPlaying();
  };
  audio.addEventListener("ended", () => { playing = -1; markPlaying(); });

  const open = async (i, btn) => {
    const s = SONGS[i];
    opener = btn;
    $(".fd-cover").src = s.cover;
    $(".fd-title").textContent = s.title;
    $(".fd-artist").textContent = s.artist;
    $(".fd-meta").textContent = "";
    $(".fd-open").href = albumUrl(s);
    $(".fd-total").textContent = "";
    tracksEl.innerHTML = '<li class="fd-note">กำลังโหลดรายชื่อเพลง…</li>';
    tracks = [];
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    $(".fd-close").focus();
    try {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${s.id}&entity=song&country=${s.store}`);
      const [album, ...songs] = (await res.json()).results;
      if (SONGS[i] !== s || sheet.hidden) return;
      tracks = songs.filter((t) => t.wrapperType === "track").sort((a, b) => (a.discNumber - b.discNumber) || (a.trackNumber - b.trackNumber));
      $(".fd-meta").textContent = [album.primaryGenreName, album.releaseDate?.slice(0, 4)].filter(Boolean).join(" · ");
      tracksEl.innerHTML = tracks.map((t, n) => `
        <li class="fd-track">
          <button type="button" aria-pressed="false" ${t.previewUrl ? "" : "disabled"}>
            <span class="fd-no">${String(t.trackNumber).padStart(2, "0")}</span>
            <span class="fd-name">${esc(t.trackName)}</span>
            <span class="fd-time">${mmss(t.trackTimeMillis)}</span>
          </button>
        </li>`).join("");
      const total = tracks.reduce((sum, t) => sum + t.trackTimeMillis, 0);
      $(".fd-total").textContent = `${tracks.length} SONGS, ${Math.floor(total / 60000)} MIN, ${Math.round(total / 1000) % 60} SECS`;
    } catch {
      tracksEl.innerHTML = '<li class="fd-note">โหลดรายชื่อเพลงไม่ได้ · ลองเปิดใน Apple Music</li>';
    }
  };
  const close = () => {
    audio.pause();
    playing = -1;
    sheet.hidden = true;
    document.body.style.overflow = "";
    opener?.focus();
  };

  shelf.addEventListener("click", (e) => {
    const btn = e.target.closest(".cd");
    if (btn) open(Number(btn.dataset.i), btn);
  });
  tracksEl.addEventListener("click", (e) => {
    const li = e.target.closest(".fd-track");
    if (li) play([...tracksEl.children].indexOf(li));
  });
  $(".fd-play").addEventListener("click", () => play(playing === -1 ? 0 : playing));
  $(".fd-close").addEventListener("click", close);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) close(); });
})();
