// ข้อมูลโปรไฟล์ทุกช่วงของเอ็มมี่ — เพิ่มช่วงใหม่ได้โดยเพิ่ม 1 บรรทัดท้ายรายการ
// tags: "center" | "senbatsu" | "under" | "cw" | "event" | "team"
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
  { date: "2025-10-11", img: "team-b-bloom.webp", title: "Team B", sub: "ได้รับคัดเลือกเข้า Team B · BLM48 Team B 1st Stage「Party ga Hajimaru yo – ปาร์ตี้ในฝัน」", tags: ["team"] },
  { date: "2025-11-08", img: "2025-11-08-fortune-cookie.jpg", title: "Koisuru Fortune Cookie", jp: "恋するフォーチュンクッキー", sub: "Main Song", tags: ["senbatsu"], release: "1st Special Album · RHYTHM:YOU" },
  { date: "2025-12-25", img: "2025-12-25-noel-no-yoru.jpg", title: "Noel no Yoru", jp: "ノエルの夜", sub: "Christmas Project 2025", tags: ["cw"], release: "Special Single · c/w" },
  { date: "2026-01-30", img: "2026-01-30-bingo.jpg", title: "BINGO!", sub: "Center Position · Thai ver.", tags: ["center", "senbatsu"], release: "9th Single" },
  { date: "2026-04-04", img: "2026-04-04-celebration.jpg", title: "Celebration", sub: "3rd Generation Special Single · Center Position", tags: ["center", "senbatsu"], release: "3rd Gen Special Single" },
  { date: "2026-04-24", img: "2026-04-24-sustainable.jpg", title: "Sustainable", jp: "サステナブル", sub: "Main Song · Thai ver.", tags: ["senbatsu"], release: "10th Single" },
  { date: "2026-04-25", img: "team-b-bloom.webp", title: "Team Bloom", sub: "ได้รับคัดเลือกเป็นสมาชิก Team Bloom · Team Bloom 1st Stage「Dreaming Blossom」", tags: ["team"] },
  { date: "2026-06-01", img: "2026-06-01-pride-month.jpg", title: "Pride Month 2026", sub: "Special Profile", tags: ["event"] },
];

// คลิปผลงานบน YouTube — yt คือรหัสคลิป (ส่วนหลัง youtu.be/) ใส่ null ถ้ายังไม่มีลิงก์
// kind: "song" | "teaser" | "appeal" · mv: true ถ้าเป็น MV · ver: "Thai ver." | "Male ver." · center: true ถ้าเป็นเซ็นเตอร์
window.VIDEOS = [
  { date: "2024-07-21", yt: "Lbgi8-PD7zw", kind: "song", title: "Reborn", release: "5th Single · c/w" },
  { date: "2024-08-01", yt: "SxxtQacauhg", kind: "song", title: "Heavy Rotation", release: "“REBORN” BLM48 3rd Generation Debut Stage" },
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
  { date: "2026-04-04", yt: "TAPlWWZMGFQ", kind: "song", title: "Celebration", release: "3rd Generation Special Single", center: true },
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

// Discography · MUSIC VIDEO — MV ที่เอ็มมี่ร่วมแสดง (เรียงตามลำดับผลงาน)
// title / artist / date เว้นว่างได้ — ระบบจะดึงชื่อคลิปและชื่อช่องจาก YouTube ให้อัตโนมัติ
// imgs: รูปจาก MV (ไฟล์ใน images/mv/) — แสดงฝั่งขวาของคลิป กดดูรูปใหญ่ได้
window.MUSIC_VIDEOS = [
  { yt: "SBay1DGjsvU", title: "SAT48 - Masaka no Confession – ทำไมกันนะ? Confession", artist: "", date: "",
    imgs: ["confession-1.webp", "confession-2.webp", "confession-3.webp", "confession-4.webp"] },
  { yt: "5K3rURkf4-4", title: "HASHIRIZAKA46 - WHY NO LOVE? (Naze Koi wo Shite Konakattan darou?)", artist: "", date: "",
    imgs: ["why-no-love-1.webp", "why-no-love-2.webp", "why-no-love-3.webp", "why-no-love-4.webp"] },];

// Discography · MAGAZINE COVER — ใส่รูปไว้ที่ images/magazines/ (แสดงตามลำดับในรายการ)
// { img: "xxx.webp", title: "ชื่อปก", issue: "รายละเอียด / ฉบับ", date: "YYYY-MM-DD" (ไม่ใส่ก็ได้) }
window.MAGAZINES = [
  { img: "revolution.webp", title: "Revolution", issue: "Launch Day", date: "2024-03-26" },
  { img: "rhythm-pink.webp", title: "RHYTHM", issue: "RIDE THE RHYTHM" },
  { img: "teddy-bears.webp", title: "Teddy Bears", issue: "My Love 4ever" },
  { img: "rhythm-blue.webp", title: "RIDE THE RHYTHM AND YOU", issue: "July 2025" },
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

// Champ of the Month — ข้อความจากเอ็มมี่ (text: แยกย่อหน้าละ 1 รายการ)
window.CHAMPS = [
  {
    "month": "2025-10",
    "label": "October 2025",
    "count": 1,
    "img": "https://lh3.googleusercontent.com/d/17hUDuGDLp_uxXyrPVbDeWq_Ze5hyVZNF=s1000",
    "text": [
      "เป็นปีที่ได้โอกาสเยอะมาก ๆ อันดับ 5 BLM48 7th SINGLE SENBATSU GENERAL ELECTION มี่ดีใจกับอันดับ 5 มาก ๆ อันดับกำลังพอดี ไม่สูงมาก กลาง ๆ เพราะ GE เลยที่ทำให้มี่มีงานเยอะมากขึ้น ได้ส่องประกายมาก ๆ เป็นที่รู้จักของใครหลายๆคน สวัสดีครับ เอ็มมี่ BLM48 รุ่นที่ 3 (555) ฝากตัวด้วยนะครับ (ยิ้ม) หลังจบการเลือกตั้งมีโอกาสมากมายหลายอย่างให้ได้ทำ Produced คอนเสิร์ตครั้งแรกของวง บนเกมROBLOX ติดเซมบัตสึ GREEN FLASH > แถวหน้า FLYING GET > รองชิไฮนิน BLM48 > Boku wa Inai - หากวันนี้ไม่มีฉัน CENTER เพลงพิเศษในอัลบั้มพิเศษ อย่าง RHYTHM : YOU คู่กับนามิ > อนาคตอยากติดเซมบัตสึทุกซิงเกิลเลย และจะเป็นเซนเตอร์ให้ได้ (555) คือ ทุกคนชอบบอกว่าเป็นความพยายามของมี่เอง แต่ถ้าไม่มีทุก ๆ คนปีนี้คงไม่ได้สนุกขนาดนี้ ได้ทำอะไรเยอะแยะเลย ขอบคุณนะค้าบบ ขอบคุณที่ให้คำว่ารักแบบไม่มีเงื่อนไข อยู่ด้วยกันไปนาน ๆ นะ ฝากด้วยนะครับ อันดับที่ 1 ครั้งต่อไป BLM48 2nd General Election - {train}{pin}"
    ]
  },
  {
    "month": "2026-05",
    "label": "May 2026",
    "count": 2,
    "img": "https://lh3.googleusercontent.com/d/1MSAXdNaPRALUnECh2oRY7mPBW3GTEZSY=s1000",
    "text": [
      "{bear}{ribbon}Champ of the Month ครั้งที่2ของเอ็มมี่แย้ววว",
      "ขอบคุณทุกคนมากๆที่ช่วยกันมอบของขวัญชิ้นนี้ให้กับเอ็มมี่ เอ็มมี่ภูมิใจมากๆๆเลยนะ {teary} ปีนี้เอ็มมี่เองได้รู้จักทุกคนเยอะขึ้นมากๆๆๆ จะบอกว่ามี่ไม่เคยเบื่อเลย มี่แอบกลัวด้วยซ้ำว่าทุกคนจะเบื่อมี่มั้ย5565565 เอ็มมี่ดีใจนะ ที่ได้รู้จัก+ได้เจอทุกคน แล้วเอ็มมี่ก็ดีใจ ที่มี่ยังได้เจอทุกคนต่อไปอยู่… หวังว่าทุกคนจะยังคงเอนจอยกับการตามเอ็มมี่อยู่นะ55555 ( ปล.อาจจะมีบางครั้งที่นิ่งๆไปบ้าง ก็ให้รู้ไว้เลยนะ ว่ามี่ง่วงงงนอนน้อยย55555 ไม่ได้เป็นอะไรนะะ55555 ){sweat}",
      "วันเกิดปีนี้ เอ็มมี่ขอให้คำอวยพรจากทุกคน ส่งผลกลับไปหาทุกคนด้วยนะขอให้ทุกคนมีความสุขในทุกๆวัน ได้ใช้ชีวิตแบบที่ตัวเองชอบ เจอแต่คนที่น่ารักๆ ไม่มีคนมาทำให้หม่นหมอง อย่าคิดลบกับตัวเองเยอะล่ะ วันนี้เจออะไรมาบ้างก็เล่าให้ฟังได้เสมอ เอ็มมี่พร้อมรับฟังงง ตอนนี้เอ็มมี่ในวัย21ปี เอ็มมี่มีความสุขมากๆๆ ได้ทำอะไรใหม่ๆเยอะเลยย รู้สึกใช้ชีวิตคุ้มมากกก แล้วก็ได้รู้จักกับทุกคนเยอะเลยย ช่วงหลังๆมานี้อาจจะมี โฟกัสกับการเรียนบ้าง แต่ว่าทุกคนก็ไม่หายไปไหนเลย คอยให้กำลังใจตลอดเลยง่ะ น่าร้ากกกก {love}ขอบคุณที่รักเอ็มมี่ในแบบที่เป็นเอ็มมี่นะ เอ็มมี่อาจจะไม่ได้perfect100% มีดือบ้าง ทำผิดพลาดบ้าง แต่ยังไงทุกสิ่งที่เกิดขึ้น เอ็มมี่คิด ว่ามันย่อมมีเรื่องดีในนั้นเสมอ ถ้าเอ็มมี่ทำอะไรให้ทุกคนน้อยใจ หรือไม่สบายใจ มี่ต้องขอโทษด้วยนะครับ{sorry} มี่ไม่ได้มีเจตนาแบบนั้นเลยจริงๆนะ {cry}อ่ะๆๆมาจริงจังหน่อย... การที่เอ็มมี่ตัดสินใจอยู่ต่อ ส่วนนึงก็มาจากทุกคน ด้วยเหมือนกันนะ หลังจากที่มี่ตัดสินใจไปแล้ว เอาจริงๆก็มีแอบคิดนะ ว่าจะ ยังมีใครตามเอ็มมี่ต่อไปไหม55 แต่เอาเข้าจริง มีคนอีกเยอะแยะมากที่เขายังคอยsupportมี่ต่อไป ขอบคุณที่ทำให้มี่มั่นใจขึ้น..ว่าเอ็มมี่คิดไม่ผิด ในสิ่งที่มี่ได้ตัดสินใจไป ขอบคุณนะครับ{smile}",
      "คือแบบว่าเอ็มมี่อาจจะพูดบ่อยแล้วเรื่องนี้ แต่เอ็มมี่ก็จะพูดอีกว่า เอ็มมี่โครตรักทุกคนเลยนะ ไม่ว่าจะเป็นแฟนคลับ ครอบครัว เพื่อนๆทุกคน มี่ดีใจนะ เวลาไลฟ์แล้วมีคนมาให้กำลังใจเรา เอ็มมี่แบบมีความสุขไปด้วยเลยง่ะ{heart} เอ็มมี่ดีใจมากๆเลยนะ เวลาได้ออกงาน มันรู้สึกดีมากๆเลยนะ",
      "สุดท้ายนี้ ชีวิตไอดอลของเอ็มมี่ต่อไปหลังจากนี้จะเป็นยังไงไม่รู้ แต่มี่จะยังเป็นมี่คนเดิม ที่ตั้งใจทำทุกอย่าง/ทุกโอกาสอย่างดีที่สุด และที่สำคัญที่สุด การมีอยู่ของทุกคน มันทำให้มี่ได้มีแรงทำอะไรหลายๆอย่าง มีไฟมากขึ้น สนุกกับการทำตรงนี้มากขึ้น เพราะงั้นถ้าเลือกได้ เอ็มมี่ก็ไม่อยากให้ใครสักคนหายไปเลย..",
      "Thank you for making me feel that continuing on this path was the right choice. There were moments when I felt unsure of myself, when felt tired and questioned everything. But your support always reminded me why I started in the first place, and why I should keep going.",
      "Thank you for staying by my side, for believing in me, and for supporting me even when wasn't at my best. Every message, every kind word, and every bit of encouragement truly means more to me than I can put into words.",
      "Thank you for everything, truly..{heart}",
      "รักทุกคนสุดหัวใจ {bear}{heart}\nemmy\n01/06/2026"
    ]
  },
  {
    "month": "2026-09",
    "label": "September 2026",
    "count": 3,
    "img": "https://rqhwzbrcgnpxtuaeoxml.supabase.co/storage/v1/object/public/post-images/00-108_1790878214740_w3azc3.jpg",
    "text": [
      "ขอบคุณสำหรับ Champ of the Month รอบที่ 2 ของปีนะ ขอบคุณนะคับขอบคุณที่น่ารักกับมี่เสมอนะค้าบบ การได้มาถึงตรงนี้อีกครั้งทำให้มี่รู้เลยว่า ทุกคนรักนุมากกกและสนุกกับการตามนอุยู่ หวังว่าหลังจากนี้ทุกคนจะยังไม่เบื่อนุนะ นุก้อจะทำให้ทุกคนสนุกกับการตามนุนะะ นุมีเรื่องจาเล่าด้วย นุเคยคิดจะจบการศึกษา ร้องไห้หนักมากแบบรับไม่ไหวแล้ว จนผ่านมันมาได้แล้วเย่!!!! ขอท่ดน้าาา หนูอยากให้ทุกคนสนุกกับการฟังเพลงพวกหนูนะ หนูรักการได้ร้องเพลง48มากกก หนูขอบคุณมากๆทุกคนเลยยยที่ยังติดตามพวกเราตั้งแต่วันแรกจนถึงวันนี้ ขอบคุณมากเลยน้าาา  นุมีของขวัญให้ทุกคนด้วยยย เร้วๆนี้มาแน่",
      "ไม่รู้GEจะมาตอนไหน ฝากเด็กน้อยคนนี้ด้วยนะ",
      "รักคุณหมีน้าาา รู้ไว้ด้วยยนะ จุบบๆๆ"
    ]
  }
];

// GALLERY — รูปในโฟลเดอร์ images/gallery/ เรียงตามลำดับที่แสดง (ใส่ caption ได้ถ้าต้องการ)
window.GALLERY = [
  {
    "img": "2026-10-14-4cut.webp",
    "caption": "14.10.2026 — 私じゃなかったんだね。 4 cut photo"
  },
  {
    "img": "2026-10-14-1.webp",
    "caption": "14.10.2026 — 私じゃなかったんだね。"
  },
  {
    "img": "2026-10-14-2.webp",
    "caption": "14.10.2026 — 私じゃなかったんだね。"
  },
  {
    "img": "2026-10-14-3.webp",
    "caption": "14.10.2026 — 私じゃなかったんだね。"
  },
  {
    "img": "photo-01.webp"
  },
  {
    "img": "photo-02.webp"
  },
  {
    "img": "photo-03.webp"
  },
  {
    "img": "photo-04.webp"
  },
  {
    "img": "photo-05.webp"
  },
  {
    "img": "photo-06.webp"
  },
  {
    "img": "photo-07.webp"
  },
  {
    "img": "photo-08.webp"
  },
  {
    "img": "photo-09.webp"
  },
  {
    "img": "photo-10.webp"
  },
  {
    "img": "photo-11.webp"
  },
  {
    "img": "photo-12.jpg"
  },
  {
    "img": "photo-13.webp"
  },
  {
    "img": "photo-14.webp"
  },
  {
    "img": "photo-15.webp"
  },
  {
    "img": "photo-16.webp"
  },
  {
    "img": "photo-17.webp"
  },
  {
    "img": "photo-18.webp"
  }
];
