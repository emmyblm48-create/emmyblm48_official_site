// Shared page chrome (menu, footer, lightbox, video player), injected on every page.
// Edit links / SNS here once instead of in every .html file.
// SVG icon set (used instead of emoji). icon("heart") → inline <svg>.
const FACE = '<circle cx="12" cy="12" r="9"/>';
const EYES = '<circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>';
const SMILE = '<path d="M8.5 14.2c.9 1.3 2.1 1.9 3.5 1.9s2.6-.6 3.5-1.9"/>';
const DROP = (x, y) => `<path d="M${x} ${y}c.8 1.1 1.3 1.9 1.3 2.5a1.3 1.3 0 0 1-2.6 0c0-.6.5-1.4 1.3-2.5z" fill="currentColor" stroke="none"/>`;
window.ICONS = {
  heart: '<path fill="currentColor" stroke="none" d="M12 21.2s-8.6-5.3-8.6-11.4C3.4 6.9 5.6 4.8 8.2 4.8c1.6 0 3 .8 3.8 2.1.8-1.3 2.2-2.1 3.8-2.1 2.6 0 4.8 2.1 4.8 5 0 6.1-8.6 11.4-8.6 11.4z"/>',
  bear: '<circle cx="6.5" cy="6.5" r="2.6"/><circle cx="17.5" cy="6.5" r="2.6"/><circle cx="12" cy="13" r="7.4"/><ellipse cx="12" cy="15.6" rx="2.8" ry="2.1"/><circle cx="9.3" cy="11.4" r=".9" fill="currentColor" stroke="none"/><circle cx="14.7" cy="11.4" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="14.9" r=".8" fill="currentColor" stroke="none"/>',
  ribbon: '<path d="M12 11.5 4 7v9l8-4.5zm0 0 8-4.5v9l-8-4.5z"/><path d="m11 12.5-2.5 7.5M13 12.5l2.5 7.5"/><circle cx="12" cy="11.5" r="1.6" fill="currentColor"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="3.5"/><path d="M5 10.5h14M8.5 17 6.5 21M15.5 17l2 4"/><circle cx="9" cy="13.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="13.8" r=".9" fill="currentColor" stroke="none"/>',
  pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.2"/>',
  smile: FACE + EYES + SMILE,
  love: FACE + EYES + SMILE + '<path fill="currentColor" stroke="none" d="M19.5 6.6s-2.6-1.6-2.6-3.4c0-.9.7-1.5 1.4-1.5.5 0 .9.2 1.2.6.3-.4.7-.6 1.2-.6.8 0 1.4.6 1.4 1.5 0 1.8-2.6 3.4-2.6 3.4z"/>',
  teary: FACE + EYES + SMILE + DROP(16.5, 11.2),
  sweat: FACE + EYES + SMILE + DROP(18.6, 3.6),
  cry: FACE + EYES + '<path d="M8.5 16.4c.9-1.1 2.1-1.6 3.5-1.6s2.6.5 3.5 1.6"/>' + DROP(8.9, 11.6) + DROP(15.1, 11.6),
  sorry: FACE + '<path d="M7.8 10.2c.6.6 1.8.6 2.4 0M13.8 10.2c.6.6 1.8.6 2.4 0M10.5 15.5h3"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5.2v13.6L18.8 12z"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  prev: '<path d="M15 4.5 7.5 12l7.5 7.5"/>',
  next: '<path d="M9 4.5l7.5 7.5L9 19.5"/>',
  arrow: '<path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5"/>',
};
window.icon = (name, cls = "ico") => window.ICONS[name]
  ? `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${window.ICONS[name]}</svg>`
  : "";

(() => {
  const MENU = "<button class=\"menu-btn\" aria-label=\"เปิดเมนู\" aria-expanded=\"false\"><span></span><span></span></button>\n  <nav class=\"menu\" aria-label=\"เมนู\" hidden>\n    <img class=\"menu-badge\" src=\"images/logo.jpg\" alt=\"\" width=\"96\" height=\"96\">\n    <p class=\"menu-logo\">EMMY</p>\n    <ul>\n      <li><a href=\"/\" data-page=\"home\">HOME<small>หน้าแรก</small></a></li>\n      <li><a href=\"/profile\" data-page=\"profile\">PROFILE<small>โปรไฟล์</small></a></li>\n      <li><a href=\"/history\" data-page=\"history\">HISTORY<small>เส้นทางไอดอล</small></a></li>\n      <li><a href=\"/movie\" data-page=\"movie\">MOVIE<small>คลิปผลงาน</small></a></li>\n      <li><a href=\"/photo\" data-page=\"photo\">PHOTO<small>โปรไฟล์</small></a></li>\n      <li><a href=\"/gallery\" data-page=\"gallery\">GALLERY<small>แกลเลอรี</small></a></li>\n      <li><a href=\"/champ\" data-page=\"champ\">CHAMP<small>Champ of the Month</small></a></li>\n    </ul>\n  </nav>";
  const FOOTER = "<footer class=\"footer\">\n    <ul class=\"sns sns-footer\">\n      <li><a href=\"https://www.instagram.com/emmy.blm48official/\" target=\"_blank\" rel=\"noopener\" aria-label=\"Instagram @emmy.blm48official\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><circle cx=\"12\" cy=\"12\" r=\"4.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><circle cx=\"17.3\" cy=\"6.7\" r=\"1.1\" fill=\"currentColor\"/></svg></a></li>\n      <li><a href=\"https://www.tiktok.com/@emmy.blm48official\" target=\"_blank\" rel=\"noopener\" aria-label=\"TikTok @emmy.blm48official\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v2.9c-1.4.1-2.7-.3-3.9-1v6.4c0 3.3-2.4 5.8-5.7 5.8-3.1 0-5.6-2.4-5.6-5.5 0-3.4 2.9-5.9 6.4-5.4v3c-1.6-.4-3.4.6-3.4 2.4 0 1.4 1.1 2.6 2.6 2.6 1.6 0 2.7-1.1 2.7-3V3h3z\"/></svg></a></li>\n      <li><a href=\"https://x.com/emmy_blm48\" target=\"_blank\" rel=\"noopener\" aria-label=\"X @emmy_blm48\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z\"/></svg></a></li>\n    </ul>\n    <span class=\"corner corner-l\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M12 21.2s-8.6-5.3-8.6-11.4C3.4 6.9 5.6 4.8 8.2 4.8c1.6 0 3 .8 3.8 2.1.8-1.3 2.2-2.1 3.8-2.1 2.6 0 4.8 2.1 4.8 5 0 6.1-8.6 11.4-8.6 11.4z\"/></svg></span>\n    <span class=\"corner corner-r\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><g fill=\"currentColor\"><circle cx=\"8.6\" cy=\"8.6\" r=\"4\"/><circle cx=\"15.4\" cy=\"8.6\" r=\"4\"/><circle cx=\"8.6\" cy=\"15.4\" r=\"4\"/><circle cx=\"15.4\" cy=\"15.4\" r=\"4\"/></g><path d=\"M12 12c1.5 3.5 3.5 6.5 6.5 9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg></span>\n    <p class=\"footer-copy\">© 2026 Emmy Nattawat · Photos ©BLM48</p>\n  </footer>";
  const OVERLAYS = `<div class="lightbox" hidden role="dialog" aria-modal="true" aria-label="ดูรูปเต็มจอ">
    <button class="lb-btn lb-close" aria-label="ปิด">${icon("close")}</button>
    <button class="lb-btn lb-prev" aria-label="รูปก่อนหน้า">${icon("prev")}</button>
    <figure><figcaption></figcaption></figure>
    <button class="lb-btn lb-next" aria-label="รูปถัดไป">${icon("next")}</button>
  </div>

  <div class="player" hidden role="dialog" aria-modal="true" aria-label="เล่นวิดีโอ">
    <button class="lb-btn player-close" aria-label="ปิด">${icon("close")}</button>
    <div class="player-box">
      <div class="player-frame"></div>
      <p class="player-cap"><span></span><a target="_blank" rel="noopener">YOUTUBE ${icon("arrow")}</a></p>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("afterbegin", MENU);
  (document.querySelector(".booth") || document.body).insertAdjacentHTML("beforeend", FOOTER);
  document.body.insertAdjacentHTML("beforeend", OVERLAYS);

  // mark current page in the menu ( "/profile", "/profile.html", "/" )
  const page = location.pathname.replace(/\/+$/, "").split("/").pop().replace(/\.html$/, "") || "home";
  const current = page === "index" ? "home" : page;
  document.querySelectorAll(".menu a[data-page]").forEach((a) => {
    if (a.dataset.page === current) a.setAttribute("aria-current", "page");
  });
})();
