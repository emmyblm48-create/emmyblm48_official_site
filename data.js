// ข้อมูลโปรไฟล์ทุกช่วงของเอ็มมี่ — เพิ่มช่วงใหม่ได้โดยเพิ่ม 1 บรรทัดท้ายรายการ
// tags: "center" | "senbatsu" | "under" | "cw" | "event"
// release: ใส่เมื่อเป็นผลงานเพลง (จะแสดงในตาราง Discography ด้วย)
window.ERAS = [
  { date: "2024-03-26", img: "2024-03-26-debut.jpg", title: "Debut", jp: "打ち上げ日", sub: "เปิดตัวสมาชิก BLM48 รุ่นที่ 3", tags: ["event"] },
  { date: "2024-07-21", img: "2024-07-21-reborn.jpg", title: "Reborn", sub: "เพลงเดบิวต์รุ่นที่ 3", tags: ["cw"], release: "5th Single · c/w" },
  { date: "2024-08-25", img: "2024-08-25-love-trip.jpg", title: "Love Trip", jp: "ラブトリップ", sub: "Main Song", tags: ["under"], release: "5th Single" },
  { date: "2024-12-06", img: "2024-12-06-blm-festival.jpg", title: "BLM Festival", sub: "Main Song", tags: ["under"], release: "6th Single" },
  { date: "2024-12-15", img: "2024-12-15-general-election.png", title: "1st General Election", jp: "選抜総選挙", sub: "อันดับ 5", tags: ["event"] },
  { date: "2025-01-31", img: "2025-01-31-koi-tsunjatta.jpg", title: "恋 詰んじゃった", jp: "Koi Tsunjatta", sub: "First Time Senbatsu", tags: ["senbatsu"], release: "7th Single" },
  { date: "2025-03-08", img: "2025-03-08-green-flash.jpg", title: "Green Flash", jp: "グリーンフラッシュ", sub: "Main Song", tags: ["senbatsu"], release: "2nd Album" },
  { date: "2025-06-01", img: "2025-06-01-pride-month.jpg", title: "Pride Month 2025", sub: "Special Profile", tags: ["event"] },
  { date: "2025-07-26", img: "2025-07-26-flying-get.jpg", title: "Flying Get", jp: "フライングゲット", sub: "Main Song · Thai ver.", tags: ["senbatsu"], release: "8th Single" },
  { date: "2025-09-28", img: "2025-09-28-borderless.jpg", title: "BORDERLESS", sub: "Coupling Song", tags: ["cw"], release: "8th Single · c/w" },
  { date: "2025-11-08", img: "2025-11-08-fortune-cookie.jpg", title: "Koisuru Fortune Cookie", jp: "恋するフォーチュンクッキー", sub: "Main Song", tags: ["senbatsu"], release: "1st Special Album · RHYTHM:YOU" },
  { date: "2025-12-25", img: "2025-12-25-noel-no-yoru.jpg", title: "Noel no Yoru", jp: "ノエルの夜", sub: "Christmas Project 2025", tags: ["cw"], release: "Special Single · c/w" },
  { date: "2026-01-30", img: "2026-01-30-bingo.jpg", title: "BINGO!", sub: "Center Position · Thai ver.", tags: ["center", "senbatsu"], release: "9th Single" },
  { date: "2026-04-04", img: "2026-04-04-celebration.jpg", title: "Celebration", sub: "3rd Generation Special Single", tags: ["senbatsu"], release: "3rd Gen Special Single" },
  { date: "2026-04-24", img: "2026-04-24-sustainable.jpg", title: "Sustainable", jp: "サステナブル", sub: "Main Song · Thai ver.", tags: ["senbatsu"], release: "10th Single" },
  { date: "2026-06-01", img: "2026-06-01-pride-month.jpg", title: "Pride Month 2026", sub: "Special Profile", tags: ["event"] },
];

// คลิปผลงานบน YouTube — yt คือรหัสคลิป (ส่วนหลัง youtu.be/) ใส่ null ถ้ายังไม่มีลิงก์
// kind: "song" | "teaser" | "appeal" · mv: true ถ้าเป็น MV · ver: "Thai ver." | "Male ver." · center: true ถ้าเป็นเซ็นเตอร์
window.VIDEOS = [
  { date: "2024-07-21", yt: "Lbgi8-PD7zw", kind: "song", title: "Reborn", release: "5th Single · c/w" },
  { date: "2024-10-30", yt: "2AODcS5Wwsw", kind: "song", title: "Idol Nanka Janakattara", th: "หากไม่ใช่ไอดอล", ver: "Thai ver.", release: "BLM48 Special Single" },
  { date: "2024-11-12", yt: "oCO9EBfzSJg", kind: "appeal", title: "Appeal Comment", th: "Nattawat Wongsarat · Team Trainee", release: "7th Single Senbatsu General Election" },
  { date: "2025-01-19", yt: "zNjpZ5IzYBw", kind: "song", title: "มะลิ", release: "6th Single · c/w" },
  { date: "2025-02-01", yt: "OB6GmAuFGQ8", kind: "song", mv: true, title: "Koi Tsunjatta", th: "หมดใจ...แล้วไง!", ver: "Thai ver.", release: "7th Single" },
  { date: "2025-03-01", yt: "kfi0ZN5wbj8", kind: "song", title: "Lucky Seven", th: "Unit Kami7", ver: "Thai ver.", release: "7th Single · c/w" },
  { date: "2025-03-02", yt: "xzvggy6TNkU", kind: "teaser", title: "Green Flash", th: "Emmy ver.", release: "2nd Album" },
  { date: "2025-03-08", yt: "W0TTMJ2gHDU", kind: "song", mv: true, title: "Green Flash", release: "2nd Album" },
  { date: "2025-04-06", yt: "fIA7CYU7jGA", kind: "song", title: "Oshibe to Meshibe to Yoru no Chouchou", th: "ทุ่งดอกไม้ยามรัตติกาล", ver: "Male ver.", release: "BLM48 Special Track" },
  { date: "2025-04-24", yt: "nBuTvRKQT8E", kind: "song", title: "Saikyou Twintail", th: "ทวินเทล สุดยอดเลย!", release: "1st Special Album · c/w" },
  { date: "2025-05-31", yt: "RKzTe7dMwBY", kind: "song", title: "Gingham Check", release: "1st Special Album · c/w" },
  { date: "2025-07-22", yt: "5hhzPUZlujg", kind: "teaser", title: "Flying Get", th: "Emmy ver.", ver: "Thai ver.", release: "8th Single" },
  { date: "2025-07-27", yt: "E46-9HcJjwg", kind: "song", mv: true, title: "Flying Get", ver: "Thai ver.", release: "8th Single" },
  { date: "2025-10-03", yt: "dyQvTF0V88s", kind: "song", title: "Zettai Idol Yamenaide", ver: "Thai ver.", release: "1st Special Album · c/w" },
  { date: "2025-10-10", yt: "TKGp8IPuxxQ", kind: "song", title: "Chain of Love", release: "1st Special Album · c/w" },
  { date: "2025-10-17", yt: "sdOtyw2zx_U", kind: "song", title: "Melon Juice", release: "1st Special Album · c/w" },
  { date: "2025-10-21", yt: "VQQ3ZUNRR8I", kind: "song", title: "Yobisute Fantasy", th: "เรียกอีกที...ให้Fantasy!", ver: "Thai ver.", release: "1st Special Album · c/w" },
  { date: "2025-10-24", yt: "NmsiNN9XwtI", kind: "song", title: "77 no Suteki na Machi e", th: "77ดินแดนแสนวิเศษ", release: "1st Special Album · c/w" },
  { date: "2025-10-28", yt: "VaKcFvNb52M", kind: "song", title: "Totsuzen Do love Me!", th: "โทษทีนะ…รักกันได้ไหม?", release: "1st Special Album · c/w" },
  { date: "2025-10-31", yt: "GWhGEdoQJb0", kind: "song", title: "Boku wa Inai", th: "หากวันนี้ไม่มีฉัน", release: "1st Special Album · c/w", center: true },
  { date: "2025-11-13", yt: "jnvfxdxkGjI", kind: "song", title: "Hokori no Oka", th: "เนินเขาแห่งความฝัน", release: "Team B 1st Stage · Party ga Hajimaru yo" },
  { date: "2025-12-06", yt: "wM3bgZQbSKM", kind: "song", mv: true, title: "Noel no Yoru", ver: "Thai ver.", release: "Christmas Project 2025 · Special Single" },
  { date: "2026-01-04", yt: "ec8Cysfl43o", kind: "song", title: "Seishun no Deadline", th: "青春のデッドライン", ver: "Thai ver.", release: "Pre-9th Single" },
  { date: "2026-01-30", yt: "oNqruqD7bKM", kind: "teaser", title: "BINGO!", th: "Emmy ver.", ver: "Thai ver.", release: "9th Single" },
  { date: "2026-01-31", yt: "QaxSjLIxcSE", kind: "song", mv: true, title: "BINGO!", ver: "Thai ver.", release: "9th Single", center: true },
  { date: "2026-02-28", yt: "-rhmBTZoZk0", kind: "song", title: "Eien Pressure", th: "ผูกพันนิรันดร์", ver: "Male ver.", release: "9th Single · c/w" },
  { date: "2026-03-09", yt: "QDCJ1g-m4Ws", kind: "song", title: "Seifuku Resistance", th: "ผู้ต่อต้านชุดนักเรียน", ver: "Male ver.", release: "Team M 1st Stage · RESET" },
  { date: "2026-03-21", yt: "tqFr0QPgqR0", kind: "song", title: "Sekai no Hito e", th: "ถึงบรรเลง..ถ้อยเพลงของเรา", ver: "Thai ver.", release: "9th Single · c/w · Hero Graduation Song" },
  { date: "2026-04-04", yt: "TAPlWWZMGFQ", kind: "song", title: "Celebration", release: "3rd Generation Special Single" },
  { date: "2026-04-21", yt: "p_46emflLRE", kind: "teaser", title: "Sustainable", th: "Emmy ver.", ver: "Thai ver.", release: "10th Single" },
  { date: "2026-04-25", yt: "1Vwg1iQUDtc", kind: "song", mv: true, title: "Sustainable", ver: "Thai ver.", release: "10th Single" },
  { date: "2026-05-22", yt: "k7tFnIXZhUM", kind: "song", title: "Candy", release: "Team L 1st Stage · Theater no Megami" },
  { date: "2026-06-14", yt: "n7kiEDLFtrI", kind: "song", title: "Hisashiburi no Lip Gloss", th: "Lip Gloss ที่คิดถึง", release: "BLM48 Special Track" },
  { date: "2026-06-18", yt: "HtMcEsAxAS0", kind: "song", title: "100 Meter Conbini", th: "ร้านสะดวกชื้อ 100 เมตร", ver: "Male ver.", release: "Team L 1st Stage · Theater no Megami" },
  { date: "2026-06-20", yt: "S_MkuLYvfZo", kind: "song", title: "Hotei Sokudo to Yuuetsukan", th: "ซิ่งให้สุด…หยุดที่เธอ", release: "BLM48 Special Track" },
  { date: "2026-06-22", yt: "9D-jmrcCGw4", kind: "song", title: "Wink wa 3 Ka", th: "วิ้งค์ 3 ครั้ง", release: "BLM48 Special Track" },
  { date: "2026-06-25", yt: "bhbjo1UWOwU", kind: "song", title: "Nagiichi", ver: "Thai ver.", release: "BLM48 Special Track" },
  { date: "2026-07-20", yt: "0DkFC-oB6Mw", kind: "song", title: "Shiokaze no Shoutaijou", th: "อ้อมกอดของยาย", release: "BLM48 Tanabata 2026" },
  { date: "2026-08-10", yt: "EDNEaF8ujLw", kind: "song", title: "Kimi wa Motto Dekiru", ver: "Thai ver.", release: "10th Single · c/w" },
  { date: "2026-09-26", yt: "g-IiXvDfBRg", kind: "song", title: "Rapsodi", ver: "Thai ver.", release: "Special Song & 3rd Album · c/w", center: true },
  { date: "2026-10-04", yt: "gxRNWB1iBJA", kind: "song", title: "มปร. (It’s OK.)", release: "BLM48 Special Tracks" },
  { date: "2026-10-05", yt: "_g2qLVLhYTw", kind: "song", title: "Kibouteki Refrain", th: "แค่นี้ก็พอใจแล้ว", release: "BLM48 Special Tracks" },
  { date: "2026-10-05", yt: "c--2Xf_8k3k", kind: "song", title: "High Tension", release: "BLM48 Special Tracks" },
  { date: "2026-10-05", yt: "I48dsMiwhVs", kind: "song", title: "Anata ga Ite Kureta Kara", th: "บ้านแห่งหัวใจ", release: "BLM48 Special Tracks" },
];

// 1st Special Album — ลำดับตามเพลย์ลิสต์ YouTube
window.ALBUM = {
  title: "RHYTHM:YOU",
  label: "BLM48 1st Special Album · RIDE THE RHYTHM",
  playlist: "PLIZN3HRIc9-BTerMvI4G1Yj6sNOt7GQwI",
  tracks: [
    { yt: "oU3M3o604ao", title: "Koisuru Fortune Cookie", th: "คุกกี้เสี่ยงทาย", note: "Main Song" },
    { yt: "QNG34XXJOsA", title: "Hoshizora wo Kimi ni", th: "ทุ่งแสงดาว" },
    { yt: "nBuTvRKQT8E", title: "Saikyou Twintail", th: "ทวินเทล สุดยอดเลย!" },
    { yt: "dyQvTF0V88s", title: "Zettai Idol Yamenaide", note: "Thai ver." },
    { yt: "VQQ3ZUNRR8I", title: "Yobisute Fantasy", th: "เรียกอีกที...ให้Fantasy!", note: "Thai ver." },
    { yt: "GWhGEdoQJb0", title: "Boku wa Inai", th: "หากวันนี้ไม่มีฉัน" },
    { yt: "RKzTe7dMwBY", title: "Gingham Check" },
    { yt: "sdOtyw2zx_U", title: "Melon Juice" },
    { yt: "NmsiNN9XwtI", title: "77 no Suteki na Machi e", th: "77ดินแดนแสนวิเศษ" },
    { yt: "bnnez4ZxHWs", title: "Zankoku na Ame", th: "ฝนราคะ" },
    { yt: "w5gQ3egjqas", title: "Skirt, Hirari", th: "พลิ้ว" },
    { yt: "VaKcFvNb52M", title: "Totsuzen Do love Me!", th: "โทษทีนะ…รักกันได้ไหม?" },
    { yt: "TKGp8IPuxxQ", title: "Chain of Love" },
  ],
};

// เหตุการณ์สำคัญ (ทีม ตำแหน่ง คอนเสิร์ต) — แสดงในส่วน HISTORY
// tag: "team" | "role" | "live"
window.EVENTS = [
  { date: "2025-07-26", tag: "live", title: "BLM48 1st Solo Concert「RIDE THE RHYTHM」", sub: "26–27.07.2025 · Roblox Game · Producer: Emmy & Hero" },
  { date: "2025-10-11", tag: "team", title: "ได้รับคัดเลือกเข้า Team B", sub: "BLM48 Team B 1st Stage「Party ga Hajimaru yo – ปาร์ตี้ในฝัน」" },
  { date: "2025-10-18", tag: "role", title: "ได้รับแต่งตั้งเป็น BLM48 Vice Shihainin", sub: "รองผู้จัดการทั่วไปวง BLM48" },
  { date: "2026-04-25", tag: "live", title: "Co-Producer · BLM48 & NPT48 Concert「This Letter Says “Marry Me”」" },
  { date: "2026-04-25", tag: "team", title: "ก่อตั้ง Team Bloom · ได้รับคัดเลือกเป็นสมาชิก Team Bloom", sub: "ยกเลิกระบบ Team B, Team L และ Team M" },
];
