/* script.js - Pastel Sürpriz (Geliştirilmiş) */

const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

// Views
const lockView = $("#lockView");
const introView = $("#introView");
const memoriesView = $("#memoriesView");

// Overlay
const overlay = $("#overlay");
const closeOverlayBtn = $("#closeOverlay");

// Lock
const lockForm = $("#lockForm");
const pwInput = $("#pw");
const hint = $("#hint");

// Buttons
const lockBtn = $("#lockBtn");
const goMemories = $("#goMemories");
const backToIntro = $("#backToIntro");
const partyHearts = $("#partyHearts");
const miniBurst = $("#miniBurst");
const confettiBtn = $("#confettiBtn");

const PASSWORD = "çarşamba";   // Şifren
const DEFAULT_DAYS = 803;  // Tanışma gün sayısı

// ====== CANVAS EFFECTS ======
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const parts = [];

function rand(min, max){
  return Math.random() * (max - min) + min;
}

function addHeartsBurst(x, y, count = 28){
  for(let i=0;i<count;i++){
    parts.push({
      type: "heart",
      x, y,
      vx: rand(-3.2, 3.2),
      vy: rand(-6.5, -2.0),
      life: rand(40, 90),
      rot: rand(-0.9, 0.9),
      vr: rand(-0.18, 0.18),
      size: rand(10, 18),
      a: 1
    });
  }
}

function addConfettiBurst(x, y, count = 140){
  for(let i=0;i<count;i++){
    parts.push({
      type: "confetti",
      x, y,
      vx: rand(-4.8, 4.8),
      vy: rand(-9.5, -3.0),
      g: rand(0.10, 0.22),
      life: rand(55, 110),
      rot: rand(0, Math.PI*2),
      vr: rand(-0.22, 0.22),
      w: rand(5, 10),
      h: rand(8, 14),
      a: 1
    });
  }
}

function drawHeart(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.a;

  const s = p.size;
  ctx.beginPath();
  ctx.moveTo(0, s*0.35);
  ctx.bezierCurveTo(0, 0, -s, 0, -s, s*0.5);
  ctx.bezierCurveTo(-s, s, 0, s*1.2, 0, s*1.55);
  ctx.bezierCurveTo(0, s*1.2, s, s, s, s*0.5);
  ctx.bezierCurveTo(s, 0, 0, 0, 0, s*0.35);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 60, 140, 0.75)";
  ctx.fill();

  ctx.restore();
}

function drawConfetti(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.a;

  // pastel renkler
  const palette = [
    "rgba(255, 80, 160, 0.85)",
    "rgba(255, 170, 210, 0.85)",
    "rgba(255, 210, 235, 0.85)",
    "rgba(255, 120, 190, 0.85)",
    "rgba(255, 200, 220, 0.85)"
  ];
  ctx.fillStyle = palette[(Math.random()*palette.length)|0];
  ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);

  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);

  for(let i=parts.length-1; i>=0; i--){
    const p = parts[i];
    p.x += p.vx;
    p.y += p.vy;

    if(p.type === "confetti"){
      p.vy += p.g;
      p.vx *= 0.99;
    }else{
      p.vy *= 0.985;
      p.vx *= 0.985;
    }

    p.rot += p.vr;
    p.life -= 1;
    p.a = Math.max(0, Math.min(1, p.life / 40));

    if(p.type === "heart") drawHeart(p);
    else drawConfetti(p);

    if(p.life <= 0) parts.splice(i,1);
  }

  requestAnimationFrame(tick);
}
tick();

// ====== VIEW HELPERS ======
function showLock(){
  lockView.classList.remove("hidden");
  introView.classList.add("hidden");
  memoriesView.classList.add("hidden");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function showIntro(){
  lockView.classList.add("hidden");
  introView.classList.remove("hidden");
  memoriesView.classList.add("hidden");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function showMemories(){
  lockView.classList.add("hidden");
  introView.classList.add("hidden");
  memoriesView.classList.remove("hidden");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

// ====== LOCK FORM ======
lockForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = pwInput.value.trim();

  if(val === PASSWORD){
    showIntro();
  }else{
    hint.textContent = "Şifre yanlış 😅";
    addHeartsBurst(window.innerWidth/2, 140, 14);
  }
});

// ====== BUTTONS ======
lockBtn?.addEventListener("click", showLock);

goMemories?.addEventListener("click", () => {
  showMemories();
});

backToIntro?.addEventListener("click", () => {
  showIntro();
});

partyHearts?.addEventListener("click", () => {
  addHeartsBurst(W * rand(0.25, 0.75), H * rand(0.18, 0.40), 36);
});

miniBurst?.addEventListener("click", () => {
  addHeartsBurst(W * rand(0.25, 0.75), H * rand(0.15, 0.35), 26);
});

// intro ekranında herhangi bir yere tıklayınca kalp
introView?.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  addHeartsBurst(x, y, 12);
});

// ====== OVERLAY / KART EKRANLARI ======
const screens = $$(".screen");
function openScreen(key){
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  screens.forEach(s => s.classList.add("hidden"));
  const el = $("#screen-" + key);
  if(el) el.classList.remove("hidden");

  // gün sayacı
  if(key === "daysTogether"){
    const daysNum = $("#daysNum");
    if(daysNum) daysNum.textContent = `Tam ${DEFAULT_DAYS} gündür tanışıyoruz`;
  }
}

function closeOverlay(){
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  screens.forEach(s => s.classList.add("hidden"));
}

closeOverlayBtn?.addEventListener("click", closeOverlay);
overlay?.addEventListener("click", (e) => {
  if(e.target === overlay) closeOverlay();
});

// Kartlara tıklama
$$(".card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-open");
    if(key) openScreen(key);
  });
});

// Overlay içindeki kalp patlat butonları
$$("[data-burst]").forEach(btn => {
  btn.addEventListener("click", () => {
    addHeartsBurst(W * rand(0.25, 0.75), H * rand(0.18, 0.40), 34);
  });
});

// Konfeti
confettiBtn?.addEventListener("click", () => {
  addConfettiBurst(W/2, H*0.25, 180);
});

// İlk yüklemede lock göster
showLock();
