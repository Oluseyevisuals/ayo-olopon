// ── Ayo Olopon — game.js ──────────────────────────────────────────────
// Board: indices 0-5 = player pits (bottom), 6-11 = opponent pits (top)
// Visual top row (L→R from player view): pit 11, 10, 9, 8, 7, 6
// Sowing: counter-clockwise → (i + 1) % 12
// ─────────────────────────────────────────────────────────────────────

const PLAYER   = 0;
const OPPONENT = 1;

const TITLES = [
  { name:"Omo Abule",  meaning:"Village Newcomer",      wins:2, depth:1 },
  { name:"Ode",        meaning:"The Hunter",             wins:3, depth:2 },
  { name:"Jagunjagun", meaning:"The Warrior",            wins:3, depth:3 },
  { name:"Balogun",    meaning:"War General",            wins:4, depth:4 },
  { name:"Mogaji",     meaning:"Compound Head",          wins:4, depth:5 },
  { name:"Baale",      meaning:"Village Head",           wins:5, depth:5 },
  { name:"Otun Oba",   meaning:"King's Right Hand",      wins:5, depth:6 },
  { name:"Aremo",      meaning:"Crown Prince",           wins:6, depth:6 },
  { name:"Oba",        meaning:"The King 👑",            wins:Infinity, depth:7 },
];

// ── Yoruba Cultural Facts ────────────────────────────────────────────
// Shown as a brief toast each time the PLAYER captures seeds.
const YORUBA_FACTS = [
  "The word <strong>\u2018Ayo\u2019</strong> means <strong>Joy</strong> in Yoruba \u2014 this game was played to celebrate harvests and festivals.",
  "<strong>Cowrie shells</strong> were the currency of Yoruba trade for centuries before coins were introduced.",
  "<strong>Ile-Ife</strong> is considered the cradle of Yoruba civilisation \u2014 all Yoruba trace their spiritual origin there.",
  "The <strong>Oba</strong> is supported by a council of chiefs \u2014 no Oba rules alone in Yoruba tradition.",
  "Yoruba is spoken by over <strong>45 million people</strong> across Nigeria, Benin, Togo, and the diaspora.",
  "<strong>Ifa divination</strong>, a Yoruba knowledge system, is recognised by UNESCO as Intangible Cultural Heritage.",
  "The <strong>talking drum (d\u00f9nd\u00fan)</strong> can mimic the tones of spoken Yoruba \u2014 used to send messages across villages.",
  "<strong>Sango</strong>, Yoruba god of thunder, is worshipped across Africa, Brazil, Cuba, and Trinidad today.",
  "Yoruba <strong>beadwork</strong> carries sacred meaning \u2014 coral beads on a crown signify the divine power of the Oba.",
  "The <strong>Gelede masquerade</strong> honours the power of women and ancestral spirits with elaborate carved masks.",
  "Yoruba <strong>bronze casting</strong> from Benin City is among the finest metalwork ever produced in the ancient world.",
  "<strong>Osun-Osogbo</strong>, a UNESCO World Heritage festival, celebrates the river goddess Osun every August.",
  "A Yoruba proverb: <strong>\u201cAjind\u00e9 \u0254m\u0254 ar\u0254 il\u1eb9, \u1ecd gbogbo wa ni.\u201d</strong> \u2014 \u201cThe gift of a child belongs to all of us.\u201d",
  "The <strong>Ayo board</strong> represents the cycle of life \u2014 seeds sown and harvested, as in farming and governance.",
  "A Yoruba proverb: <strong>\u201c\u1eccr\u1ecd m\u1eb9j\u00ec \u1ecd j\u1eb9 k\u1ecd m\u1ead.\u201d</strong> \u2014 \u201cTwo kings cannot share one crown.\u201d",
  "<strong>Adire</strong> is a Yoruba resist-dye cloth tradition, producing vivid indigo patterns passed down through generations.",
  "Yoruba <strong>architecture</strong> traditionally features a central courtyard (\u201c\u00e0gbo\u00e0l\u00e9\u201d) where the family gathers.",
  "The <strong>Egungun masquerade</strong> brings the spirits of ancestors back to walk among the living during festivals.",
  "A Yoruba proverb: <strong>\u201c\u1eccm\u0254 tit\u00f3 l\u00e1 \u0144 j\u1eb9.\u201d</strong> \u2014 \u201cA child that is well-trained is the one who succeeds.\u201d",
  "<strong>J\u00f9j\u00fa music</strong>, born in Yoruba culture, blends talking drums with guitar \u2014 popularised globally by King Sunny Ad\u00e9.",
  "The <strong>Balogun</strong> was once the supreme military general of the Yoruba army, a title of great honour.",
  "Yoruba <strong>Ag\u1eb9r\u1eb9</strong> (proverbs) are considered the horse of speech \u2014 they carry meaning swiftly and far.",
  "<strong>Yoruba numbers</strong> use subtraction \u2014 45 is said as \u201cfive from fifty,\u201d a unique mathematical tradition.",
  "The <strong>Mogaji</strong> is the head of a family compound \u2014 responsible for settling disputes and protecting all members.",
  "A Yoruba proverb: <strong>\u201cIgb\u00e1 a \u1ecdb\u1ecd ni \u0253\u1ecd\u1ecd.\u201d</strong> \u2014 \u201cThe forest we enter together we leave together.\u201d",
  "<strong>Yoruba twins (Ibeji)</strong> are considered sacred \u2014 among the highest twin birth rates in the world occur in Yoruba land.",
  "The <strong>Oni of Ife</strong> is the most senior Yoruba monarch, considered a direct descendant of Oduduwa.",
  "<strong>\u201eAy\u1ecd Olopon\u201c</strong> means the Ayo board game \u2014 \u201colopon\u201d is the wooden board used to play it.",
  "A Yoruba proverb: <strong>\u201cOk\u00e0n \u1ecd m\u1ead r\u1ecd.\u201d</strong> \u2014 \u201cOne mind does not hold a full council.\u201d",
  "The <strong>Baale</strong> governed at the village level, balancing the needs of farmers, traders, and elders.",

  // ── Kings & Rulers ──────────────────────────────────────────────
  "<strong>Oduduwa</strong> is revered as the first king and divine ancestor of the Yoruba people — he descended from the heavens on a chain to create the earth at Ile-Ife.",
  "<strong>Oranmiyan</strong>, grandson of Oduduwa, founded both the Oyo Empire and the Benin Kingdom — one of the greatest empire-builders in Yoruba history.",
  "<strong>Shango</strong>, the fourth Alaafin of Oyo, was a real king who became deified after death. He is now worshipped as the god of thunder across three continents.",
  "<strong>Moremi Ajasoro</strong> is a Yoruba heroine from Ile-Ife who sacrificed her own son to save her people from invaders — she is still celebrated today.",
  "The <strong>Alaafin of Oyo</strong> was the supreme ruler of the Oyo Empire, once the most powerful state in West Africa, controlling trade routes across the Sahara.",
  "<strong>Obalokun</strong>, an early Alaafin of Oyo, commanded a navy — a rare achievement in West African history and a sign of Oyo's extraordinary reach.",
  "The <strong>Oni of Ife</strong> is the highest spiritual authority among all Yoruba monarchs, regarded as a living link to Oduduwa himself.",
  "The <strong>Awujale of Ijebuland</strong> ruled one of the most strategically important Yoruba kingdoms, controlling the trade routes between the coast and the interior.",

  // ── Historical Sites ─────────────────────────────────────────────
  "<strong>Ile-Ife</strong> — the sacred city of origin — is home to the ancient <strong>Ore Grove</strong>, where Oduduwa is said to have first set foot on earth.",
  "The <strong>Osun-Osogbo Sacred Grove</strong> is a UNESCO World Heritage Site — a 75-hectare forest on the banks of the Osun river filled with shrines and sculptures.",
  "The <strong>ancient walls of Sungbo's Eredo</strong> near Ijebu-Ode are one of the largest pre-colonial earthworks in Africa — longer than the Great Wall of China.",
  "<strong>Old Oyo National Park</strong> preserves the ruins of the original Oyo capital, <em>Oyo-Ile</em>, once a city of over 100,000 people at its height.",
  "The <strong>Ife Bronze Heads</strong>, cast over 700 years ago, display a naturalism so advanced that early European scholars refused to believe Africans had made them.",
  "The <strong>Igbo-Ukwu</strong> archaeological site revealed bronze castings dating to the 9th century — predating European contact by over 600 years.",
  "<strong>Koso</strong> in Old Oyo is the sacred site where Shango is said to have disappeared into the earth, becoming a deity worshipped across the diaspora.",
  "The <strong>National Museum in Ile-Ife</strong> houses over 800 bronze, terracotta, and stone objects that rewrite the story of African artistic sophistication.",

  // ── Empires & Kingdoms ───────────────────────────────────────────
  "The <strong>Oyo Empire</strong> at its peak in the 18th century controlled territory stretching from modern Nigeria into Benin and Togo — one of Africa's largest states.",
  "The <strong>Ekiti Parapo War</strong> of the 1870s–1880s was a coalition of Yoruba states resisting Ilorin and Ibadan — an early example of Yoruba political unity.",
  "The <strong>Benin Kingdom</strong>, founded by Oranmiyan's descendants, produced the famous Benin Bronzes — over 3,000 of which were looted by the British in 1897.",
  "<strong>Ibadan</strong>, founded in the 19th century, grew from a war camp to the largest city in sub-Saharan Africa within decades — a testament to Yoruba urbanisation.",
  "The Yoruba had <strong>urban cities with populations over 70,000</strong> centuries before European colonisation — a level of urbanisation unique in pre-colonial Africa.",

  // ── Religion & Spirituality ──────────────────────────────────────
  "The <strong>Yoruba pantheon</strong> has 401 Orishas (deities), each governing a domain of life — from rivers and iron to smallpox and the crossroads.",
  "<strong>Obatala</strong>, the Orisha of creation, is said to have moulded the human form from clay before Olodumare breathed life into it.",
  "<strong>Ogun</strong>, god of iron and war, is invoked by drivers, surgeons, blacksmiths, and soldiers — his shrine is any place where iron meets purpose.",
  "<strong>Yemoja</strong>, goddess of rivers and the sea, is one of the most widely worshipped Orishas in the diaspora — known as Yemanjá in Brazil.",
  "<strong>Eshu-Elegba</strong> (the trickster) stands at every crossroads — no ceremony begins without first honouring him, as he carries messages between humans and gods.",
  "The <strong>Ifa corpus</strong> consists of 256 chapters (<em>Odù</em>), each containing thousands of verses — it is a complete system of ethics, history, and philosophy.",

  // ── Diaspora & Global Impact ─────────────────────────────────────
  "<strong>Candomblé</strong> in Brazil, <strong>Santería</strong> in Cuba, and <strong>Trinidad Orisha</strong> are all living descendants of Yoruba religion — practiced by millions today.",
  "The city of <strong>Salvador, Bahia</strong> in Brazil is sometimes called the most African city outside Africa — its culture, food, and religion are deeply Yoruba.",
  "The Yoruba word <strong>\u2018Oke\u2019</strong> (hill) appears in place names across the Americas, a linguistic echo of enslaved Yoruba who named their surroundings.",
  "During the <strong>transatlantic slave trade</strong>, Yoruba captives carried their language, religion, and music to the New World — where it survives and thrives today.",

  // ── Art, Music & Culture ─────────────────────────────────────────
  "The <strong>Benin Bronzes</strong> were cast using a lost-wax technique so precise that they remain a benchmark of world metallurgy — displayed in museums across Europe.",
  "<strong>Apala music</strong>, rooted in Yoruba Islamic culture, was pioneered by Haruna Ishola and blends talking drums with devotional chant.",
  "The <strong>gèlèdé</strong> and <strong>Egungun</strong> masquerades use costume, dance, and drumming to bring ancestral wisdom into the living world — a complete performance art.",
  "Yoruba <strong>weaving traditions</strong> — particularly <em>aso-oke</em> cloth — use narrow-strip looms to produce ceremonial fabrics worn at weddings and festivals.",
  "<strong>Wole Soyinka</strong>, the first African Nobel Laureate in Literature (1986), is Yoruba — his works draw heavily on Yoruba mythology and oral tradition.",
  "The concept of <strong>\u2018Ìwàpẹ̀lẹ̀\u2019</strong> (gentle character) is the highest virtue in Yoruba ethics — more valued than wealth, power, or beauty.",
];
let lastFactIdx = -1; // track last shown to avoid repeats

// ── Persistent state ────────────────────────────────────────────────
let gameMode    = 'ai';    // 'ai' | '2p'
let titleIdx       = 0;       // current title index
let titleWins      = 0;       // wins earned at current title
let titleLosses    = 0;       // losses at current title (regression counter)
let totalWins      = 0;       // all-time wins
let totalLosses    = 0;       // all-time losses
let currentStreak  = 0;       // current consecutive win streak
let bestStreak     = 0;       // all-time best streak
let totalSeeds     = 0;       // all-time seeds captured by player
let totalGamesWon  = 0;       // alias kept for avg calc (same as totalWins)
let difficulty     = 'medium'; // 'easy' | 'medium' | 'hard'

const REGRESSION_THRESHOLD = 3; // losses before dropping a title

// ── Haptic feedback (mobile only — silently ignored on desktop) ──────
const Haptic = {
  select:  () => navigator.vibrate?.(18),
  sow:     () => navigator.vibrate?.(8),
  capture: () => navigator.vibrate?.([30, 15, 30]),
  win:     () => navigator.vibrate?.([40, 20, 40, 20, 80]),
  lose:    () => navigator.vibrate?.([60, 30, 60]),
  unlock:  () => navigator.vibrate?.([30, 15, 30, 15, 30, 15, 100]),
};

// ── Per-game state ───────────────────────────────────────────────────
let board      = [];
let stores     = [0, 0];
let turn       = PLAYER;
let busy       = false;   // true while animation / AI thinking
let over       = false;
let savedState   = null;    // snapshot for undo
let canUndo      = false;
let replayData   = null;    // { boardBefore, pitIdx, player }
let isReplaying  = false;

// ────────────────────────────────────────────────────────────────────
// Init
// ────────────────────────────────────────────────────────────────────
// ── Wake Lock — keep screen awake during gameplay ──
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch(e) {}
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') requestWakeLock();
});

// ── Folk melody — real audio + studio processing chain ──────────────
const _melody = new Audio('./meta-melody.mp4');
_melody.loop = true;

let _melodyCtx = null;

function _buildMelodyChain() {
  if (_melodyCtx) return;
  _melodyCtx = new (window.AudioContext || window.webkitAudioContext)();
  const c = _melodyCtx;

  const src = c.createMediaElementSource(_melody);

  // 1. High-pass — remove low-end rumble
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 90;

  // 2. Low-mid cut — remove boxiness (~300 Hz)
  const lowMid = c.createBiquadFilter();
  lowMid.type = 'peaking';
  lowMid.frequency.value = 320;
  lowMid.gain.value = -4;
  lowMid.Q.value = 1.2;

  // 3. Presence boost — add clarity and warmth (~3 kHz)
  const pres = c.createBiquadFilter();
  pres.type = 'peaking';
  pres.frequency.value = 3000;
  pres.gain.value = 3;
  pres.Q.value = 1.0;

  // 4. Air shelf — open up the top end
  const air = c.createBiquadFilter();
  air.type = 'highshelf';
  air.frequency.value = 8000;
  air.gain.value = 3.5;

  // 5. Dynamics compressor — glues it together, studio punch
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.knee.value = 8;
  comp.ratio.value = 3.5;
  comp.attack.value = 0.004;
  comp.release.value = 0.22;

  // 6. Output gain
  const outGain = c.createGain();
  outGain.gain.value = 0.78;

  // 7. Room reverb — two short delays + feedback for natural space
  const revDelay1 = c.createDelay(1.0); revDelay1.delayTime.value = 0.035;
  const revDelay2 = c.createDelay(1.0); revDelay2.delayTime.value = 0.072;
  const revDelay3 = c.createDelay(1.0); revDelay3.delayTime.value = 0.119;
  const revFb1 = c.createGain(); revFb1.gain.value = 0.18;
  const revFb2 = c.createGain(); revFb2.gain.value = 0.12;
  const revFb3 = c.createGain(); revFb3.gain.value = 0.08;
  const revWet = c.createGain(); revWet.gain.value = 0.28;

  // Dry chain: src → hp → lowMid → pres → air → comp → outGain → dest
  src.connect(hp);
  hp.connect(lowMid);
  lowMid.connect(pres);
  pres.connect(air);
  air.connect(comp);
  comp.connect(outGain);
  outGain.connect(c.destination);

  // Reverb send from post-comp
  comp.connect(revDelay1); revDelay1.connect(revFb1); revFb1.connect(revWet);
  comp.connect(revDelay2); revDelay2.connect(revFb2); revFb2.connect(revWet);
  comp.connect(revDelay3); revDelay3.connect(revFb3); revFb3.connect(revWet);
  revWet.connect(c.destination);
}

function melodyPlay() {
  if (SFX.isMuted()) return;
  _buildMelodyChain();
  if (_melodyCtx && _melodyCtx.state === 'suspended') _melodyCtx.resume();
  _melody.play().catch(() => {});
}
function melodyStop() {
  _melody.pause();
  _melody.currentTime = 0;
}

// ── Screen orientation lock ──
function lockPortrait() {
  try {
    screen.orientation?.lock?.('portrait').catch(()=>{});
  } catch(e) {}
}

// ── Android back button ──
function pushNavState(screenId) {
  history.pushState({ screen: screenId }, '');
}
window.addEventListener('popstate', (e) => {
  const current = document.querySelector('.screen:not(.hidden)');
  if (current && current.id !== 'title-screen') {
    goToMenu();
  } else {
    history.pushState({}, '');
  }
});

function init() {
  // Remove intro splash after animation finishes (2.8s delay + 0.6s fade = 3.4s)
  const splash = document.getElementById('intro-splash');
  if (splash) setTimeout(() => splash.remove(), 3400);

  // Wake lock + orientation
  requestWakeLock();
  lockPortrait();

  // Push initial history state for Android back button
  history.pushState({ screen: 'title-screen' }, '');

  // Sync difficulty button active state from loaded value
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  const dBtn = document.getElementById('diff-' + difficulty);
  if (dBtn) dBtn.classList.add('active');

  updateStatsDisplay();
  refreshTitleScreen();
  showScreen('title-screen');
  // Folk melody disabled — pending enhancement
  // document.addEventListener('click', () => { melodyPlay(); }, { once: true });
}

function refreshTitleScreen() {
  updateStatsDisplay();
  const t = TITLES[titleIdx];
  document.getElementById('title-name').textContent    = t.name;
  document.getElementById('title-meaning').textContent = t.meaning;
  if (t.wins === Infinity) {
    document.getElementById('progress-label').textContent = 'You are the Oba! 👑';
    document.getElementById('progress-bar').style.width   = '100%';
  } else {
    document.getElementById('progress-label').textContent = `${titleWins} / ${t.wins} wins to next title`;
    document.getElementById('progress-bar').style.width   = `${(titleWins / t.wins) * 100}%`;
  }
}

function showStats() {
  const games   = totalWins + totalLosses;
  const winRate = games > 0 ? Math.round(totalWins / games * 100) + '%' : '—';
  const avg     = totalWins > 0 ? Math.round(totalSeeds / totalWins) : '—';

  document.getElementById('sc-games').textContent   = games;
  document.getElementById('sc-winrate').textContent = winRate;
  document.getElementById('sc-wins').textContent    = totalWins;
  document.getElementById('sc-losses').textContent  = totalLosses;
  document.getElementById('sc-streak').textContent  = bestStreak;
  document.getElementById('sc-seeds').textContent   = totalSeeds;
  document.getElementById('sc-title').textContent   = TITLES[titleIdx].name;
  document.getElementById('sc-avg').textContent     = avg === '—' ? '—' : avg + ' seeds';

  showScreen('stats-screen');
}

function updateStatsDisplay() {
  const wEl = document.getElementById('stat-wins');
  const lEl = document.getElementById('stat-losses');
  const sEl = document.getElementById('stat-streak');
  if (wEl) wEl.textContent = 'W: ' + totalWins;
  if (lEl) lEl.textContent = 'L: ' + totalLosses;
  const hasStreak = currentStreak > 0 || bestStreak > 0;
  const sepEl = document.getElementById('stat-streak-sep');
  if (sepEl) sepEl.style.display = hasStreak ? '' : 'none';
  if (sEl) {
    sEl.textContent = currentStreak > 0
      ? `🔥 ${currentStreak}` + (bestStreak > 1 ? ` (best ${bestStreak})` : '')
      : `Best: ${bestStreak}`;
    sEl.style.display = hasStreak ? '' : 'none';
  }
}

// ────────────────────────────────────────────────────────────────────
// Difficulty
// ────────────────────────────────────────────────────────────────────
function startGameMode(mode) {
  gameMode = mode;
  startGame();
}

function setDifficulty(d) {
  difficulty = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('diff-' + d);
  if (btn) btn.classList.add('active');
  try { localStorage.setItem('ayo_difficulty', d); } catch(e) {}
}

const WOOD_THEMES = {
  mahogany: { wood:'#3b1c07', wood2:'#5a2c0e', board1:'#3d1f09', board2:'#5c2e10', pitBg:'#1a0800', pitBdr:'#6a3c18' },
  teak:     { wood:'#5a3010', wood2:'#7a4820', board1:'#604020', board2:'#7a5230', pitBg:'#2a1408', pitBdr:'#906030' },
  ebony:    { wood:'#141008', wood2:'#201810', board1:'#161008', board2:'#241a0c', pitBg:'#080404', pitBdr:'#382818' },
  rosewood: { wood:'#3a1408', wood2:'#5a2010', board1:'#3c1408', board2:'#5c2216', pitBg:'#180600', pitBdr:'#6a2018' },
};

function setWood(theme) {
  const t = WOOD_THEMES[theme]; if (!t) return;
  const r = document.documentElement.style;
  r.setProperty('--wood',   t.wood);
  r.setProperty('--wood2',  t.wood2);
  r.setProperty('--board1', t.board1);
  r.setProperty('--board2', t.board2);
  r.setProperty('--pit-bg', t.pitBg);
  r.setProperty('--pit-bdr',t.pitBdr);
  document.querySelectorAll('.wood-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('wood-' + theme);
  if (btn) btn.classList.add('active');
  try { localStorage.setItem('ayo_wood', theme); } catch(e) {}
}

function getAIDepth() {
  const base = TITLES[titleIdx].depth;
  if (difficulty === 'easy') return Math.min(base, 2);
  if (difficulty === 'hard') return Math.min(base + 2, 9);
  return base;
}

// ────────────────────────────────────────────────────────────────────
// Capture particle burst
// ────────────────────────────────────────────────────────────────────
function spawnParticles(pitEl, count) {
  const rect = pitEl.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const dot   = document.createElement('div');
    dot.className = 'capture-particle';

    const angle = Math.random() * Math.PI * 2;
    const dist  = 28 + Math.random() * 44;
    const size  = 6 + Math.random() * 4;          // 6–10 px
    const delay = Math.random() * 0.08;            // slight stagger

    dot.style.cssText = `
      left:${cx}px; top:${cy}px;
      width:${size}px; height:${size}px;
      --tx:${(Math.cos(angle) * dist).toFixed(1)}px;
      --ty:${(Math.sin(angle) * dist).toFixed(1)}px;
      animation-delay:${delay.toFixed(3)}s;
    `;

    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }
}

function showMoveEmoji(pitEl, emoji) {
  const rect = pitEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'move-emoji';
  el.textContent = emoji;
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top  + rect.height / 2) + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// ────────────────────────────────────────────────────────────────────
// Undo
// ────────────────────────────────────────────────────────────────────
function saveUndoState() {
  savedState = { board: [...board], stores: [...stores], turn, totalSeeds };
  canUndo = false;
  updateUndoBtn();
}

function enableUndo() {
  if (over) return;
  canUndo = true;
  updateUndoBtn();
}

function updateUndoBtn() {
  const btn = document.getElementById('btn-undo');
  if (btn) btn.disabled = !canUndo;
}

function undoMove() {
  if (!canUndo || !savedState || over) return;
  board      = [...savedState.board];
  stores     = [...savedState.stores];
  turn       = savedState.turn;
  totalSeeds = savedState.totalSeeds;
  savedState = null;
  canUndo    = false;

  renderBoard();
  updateScores();
  updateClickability();
  highlightValidMoves();
  updateUndoBtn();

  const is2p = gameMode === '2p';
  if (is2p) {
    const p = turn === PLAYER ? 'Player 1' : 'Player 2';
    setHeader('2 Players', `${p}'s turn`);
  } else {
    setHeader(TITLES[titleIdx].name, 'Your turn – tap a pit');
  }
}

// ────────────────────────────────────────────────────────────────────
// Replay last move
// ────────────────────────────────────────────────────────────────────
function updateReplayBtn() {
  const btn = document.getElementById('btn-replay');
  if (btn) btn.disabled = !replayData || isReplaying;
}

function enableReplay() {
  if (over) return;
  updateReplayBtn();
}

function replayLastMove() {
  if (!replayData || isReplaying || busy) return;
  isReplaying = true;

  const { boardBefore, pitIdx, player } = replayData;

  // Snapshot real state so we can restore after replay
  const realBoard  = [...board];
  const realStores = [...stores];

  // Show the pre-move board
  board = [...boardBefore];
  renderBoard();
  updateScores();

  const badge = document.getElementById('replay-badge');
  if (badge) badge.classList.remove('hidden');
  setHeader(
    gameMode === '2p' ? '2 Players' : TITLES[titleIdx].name,
    player === PLAYER ? '▶ Replaying your move…' : '▶ Replaying AI move…'
  );

  // Brief pause so player can see starting position, then animate
  setTimeout(() => {
    SFX.sow(board[pitIdx]);

    // Build sow path
    const seedCount = board[pitIdx];
    const sowPath   = [];
    let cur = pitIdx, rem = seedCount;
    while (rem > 0) {
      cur = (cur + 1) % 12;
      if (cur === pitIdx) cur = (cur + 1) % 12;
      sowPath.push(cur); rem--;
    }

    board[pitIdx] = 0;
    refreshPit(pitIdx);

    sowPath.forEach((p, i) => {
      setTimeout(() => {
        board[p]++;
        refreshPit(p);
        const el = document.getElementById(`pit-${p}`);
        if (el) { el.classList.add('seed-land'); setTimeout(() => el.classList.remove('seed-land'), 120); }
      }, i * SOW_MS);
    });

    const landingPit    = sowPath[sowPath.length - 1];
    const captureDelay  = sowPath.length * SOW_MS + 60;

    setTimeout(() => {
      const tempStores   = [...stores]; // don't touch real stores
      const capturedPits = captureSeeds(board, tempStores, landingPit, player);

      if (capturedPits.length > 0) SFX.capture(capturedPits.length);
      capturedPits.forEach(p => {
        const el = document.getElementById(`pit-${p}`);
        if (el) {
          el.classList.add('captured-flash');
          spawnParticles(el, 5 + Math.floor(Math.random() * 4));
          setTimeout(() => el.classList.remove('captured-flash'), 600);
        }
      });
      for (let i = 0; i < 12; i++) refreshPit(i);

      // Hold the replay result briefly, then restore real state
      setTimeout(() => {
        board  = realBoard;
        stores = realStores;
        renderBoard();
        updateScores();
        updateClickability();
        highlightValidMoves();
        if (badge) badge.classList.add('hidden');

        const is2p = gameMode === '2p';
        const status = turn === PLAYER
          ? (is2p ? 'Player 1\'s turn' : 'Your turn – tap a pit')
          : (is2p ? 'Player 2\'s turn' : 'AI thinking…');
        setHeader(is2p ? '2 Players' : TITLES[titleIdx].name, status);

        isReplaying = false;
        updateReplayBtn();
      }, 900);
    }, captureDelay);
  }, 500);
}

// ────────────────────────────────────────────────────────────────────
// Valid-move highlights & hint
// ────────────────────────────────────────────────────────────────────
function highlightValidMoves() {
  document.querySelectorAll('.pit').forEach(p => p.classList.remove('valid-move', 'hint-move'));
  if (over || busy) return;
  if (gameMode === 'ai' && turn !== PLAYER) return;
  validMoves(turn).forEach(idx => {
    const el = document.getElementById(`pit-${idx}`);
    if (el) el.classList.add('valid-move');
  });
}

function showHint() {
  if (!isHintUnlockedToday()) {
    showToast('💡 Complete today\'s Daily Challenge on the main menu to unlock hints!');
    return;
  }
  if (gameMode === '2p' || busy || over || turn !== PLAYER) return;
  const hintPit = bestPlayerMove(3);
  if (hintPit === -1) return;
  document.querySelectorAll('.pit').forEach(p => p.classList.remove('hint-move'));
  const el = document.getElementById(`pit-${hintPit}`);
  if (el) el.classList.add('hint-move');
}

function bestPlayerMove(depth) {
  const moves = validMoves(PLAYER);
  if (moves.length === 0) return -1;
  let best = -1, bestScore = Infinity;
  for (const m of moves) {
    const tb = [...board], ts = [...stores];
    sowAndCapture(tb, ts, m, PLAYER);
    const score = minimax(tb, ts, Math.max(depth - 1, 0), true, -Infinity, Infinity);
    if (score < bestScore) { bestScore = score; best = m; }
  }
  return best;
}

// ────────────────────────────────────────────────────────────────────
// Screen routing
// ────────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function goToMenu() {
  SFX.ambientStop();
  refreshTitleScreen();
  showScreen('title-screen');
  // melodyPlay(); // disabled — pending enhancement
  // Re-show install banner if prompt is still available
  const banner = document.getElementById('install-banner');
  if (banner && _installPrompt) banner.classList.remove('hidden');
}

function quitToMenu() {
  busy = true; // stop any pending AI
  SFX.ambientStop();
  goToMenu();
}

// ────────────────────────────────────────────────────────────────────
// Game start / reset
// ────────────────────────────────────────────────────────────────────
function startGame() {
  board       = new Array(12).fill(4);
  stores      = [0, 0];
  turn        = PLAYER;
  busy        = false;
  over        = false;
  savedState  = null;
  canUndo     = false;
  replayData  = null;
  isReplaying = false;

  const is2p = gameMode === '2p';
  document.getElementById('lbl-player').textContent  = is2p ? 'P1' : 'You';
  document.getElementById('lbl-opponent').textContent = is2p ? 'P2' : 'AI';
  document.getElementById('fs-lbl-player').textContent = is2p ? 'P1' : 'You';
  document.getElementById('fs-lbl-ai').textContent     = is2p ? 'P2' : 'AI';
  document.getElementById('btn-hint').style.display   = is2p ? 'none' : '';
  updateHintButton();
  document.getElementById('pit-labels').style.display = is2p ? 'none' : '';

  renderBoard();
  updateScores();
  updateBackground();
  setHeader(is2p ? '2 Players' : TITLES[titleIdx].name, is2p ? 'Player 1\'s turn' : 'Your turn – tap a pit');
  showScreen('game-screen');
  highlightValidMoves();
  melodyStop();
  SFX.ambientStart();
}

// ────────────────────────────────────────────────────────────────────
// Board rendering
// ────────────────────────────────────────────────────────────────────
function isPitClickable(idx) {
  if (gameMode === 'ai') return idx < 6;
  return turn === PLAYER ? idx < 6 : idx >= 6;
}

function updateClickability() {
  for (let i = 0; i < 12; i++) {
    const el = document.getElementById(`pit-${i}`);
    if (el) el.classList.toggle('clickable', isPitClickable(i));
  }
}

function renderBoard() {
  const oppRow    = document.getElementById('row-opponent');
  const playerRow = document.getElementById('row-player');
  oppRow.innerHTML = '';
  playerRow.innerHTML = '';

  for (let i = 11; i >= 6; i--) oppRow.appendChild(makePit(i));
  for (let i = 0;  i <= 5;  i++) playerRow.appendChild(makePit(i));
}

function makePit(idx) {
  const div = document.createElement('div');
  div.className = 'pit' + (isPitClickable(idx) ? ' clickable' : '');
  div.id = `pit-${idx}`;
  if (!board[idx]) div.classList.add('empty');

  const num = document.createElement('span');
  num.className = 'pit-num';
  num.textContent = board[idx];
  div.appendChild(num);

  buildDots(div, board[idx]);

  div.addEventListener('click', () => onPitClick(idx));
  return div;
}

function buildDots(pitEl, count) {
  let old = pitEl.querySelector('.seed-dots');
  if (old) pitEl.removeChild(old);
  if (count <= 0) return;
  const wrap = document.createElement('div');
  wrap.className = 'seed-dots';
  const show = Math.min(count, 9);
  for (let s = 0; s < show; s++) {
    const d = document.createElement('div');
    d.className = 'sdot';
    wrap.appendChild(d);
  }
  pitEl.appendChild(wrap);
}

function refreshPit(idx) {
  const el = document.getElementById(`pit-${idx}`);
  if (!el) return;
  const n = board[idx];
  el.querySelector('.pit-num').textContent = n;
  if (n === 0) el.classList.add('empty');
  else         el.classList.remove('empty');
  buildDots(el, n);
}

function updateScores() {
  document.getElementById('score-player').textContent = stores[PLAYER];
  document.getElementById('score-ai').textContent     = stores[OPPONENT];
  const onBoard = board.reduce((a, v) => a + v, 0);
  const el = document.getElementById('seeds-remaining');
  if (el) el.textContent = onBoard > 0 ? `${onBoard} on board` : '';
}

function setHeader(title, status) {
  document.getElementById('hdr-title').textContent  = title;
  document.getElementById('hdr-status').textContent = status;
}

// ────────────────────────────────────────────────────────────────────
// Yoruba fact toast
// ────────────────────────────────────────────────────────────────────
let factTimer = null;
function showFact() {
  // Pick a random fact, avoiding the last one shown
  let idx;
  do { idx = Math.floor(Math.random() * YORUBA_FACTS.length); }
  while (idx === lastFactIdx && YORUBA_FACTS.length > 1);
  lastFactIdx = idx;

  const toast = document.getElementById('fact-toast');
  const text  = document.getElementById('fact-text');
  text.innerHTML = YORUBA_FACTS[idx];
  toast.classList.remove('hidden');

  // Auto-hide after 4.5 seconds
  if (factTimer) clearTimeout(factTimer);
  factTimer = setTimeout(() => toast.classList.add('hidden'), 12000);
}

// ────────────────────────────────────────────────────────────────────
// Background evolution (changes with title tier)
// ────────────────────────────────────────────────────────────────────
function getTitleTier(idx) {
  if (idx <= 2) return 'bg-tier-1'; // Village (Omo Abule – Jagunjagun)
  if (idx <= 6) return 'bg-tier-2'; // Palace (Balogun – Otun Oba)
  return 'bg-tier-3';               // Throne room (Aremo – Oba)
}

function updateBackground() {
  const bg = document.getElementById('bg-layer');
  if (!bg) return;
  bg.className = 'bg-layer ' + getTitleTier(titleIdx);
}

// ────────────────────────────────────────────────────────────────────
// Yoruba voice narration (Web Speech API)
// ────────────────────────────────────────────────────────────────────

// Pre-load the voice list (browsers load it asynchronously)
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

function getBestVoice() {
  const voices = speechSynthesis.getVoices();
  return (
    // 1. Native Yoruba voice (rare but ideal)
    voices.find(v => v.lang.startsWith('yo'))                    ||
    // 2. Nigerian English accent
    voices.find(v => v.lang === 'en-NG')                         ||
    // 3. Any voice whose name mentions Nigeria
    voices.find(v => /nigeria/i.test(v.name))                    ||
    // 4. South African or West African English as fallback
    voices.find(v => v.lang === 'en-ZA')                         ||
    // 5. Any English voice
    voices.find(v => v.lang.startsWith('en'))                    ||
    null
  );
}

function speakTitle(titleName, meaning) {
  if (!window.speechSynthesis) return;
  setTimeout(() => {
    const voice = getBestVoice();

    // "E kú ìgbéga" = Yoruba for "Congratulations on your rise/promotion"
    const text = `E ku igbega! You have risen to ${titleName} — ${meaning}!`;

    const msg  = new SpeechSynthesisUtterance(text);
    if (voice) {
      msg.voice = voice;
      msg.lang  = voice.lang;
    } else {
      msg.lang  = 'en-NG'; // request Nigerian English even if voice not found
    }
    msg.rate   = 0.82;   // slightly slower — deliberate, regal pace
    msg.pitch  = 1.12;   // slightly higher — warm, celebratory tone
    msg.volume = 0.92;
    speechSynthesis.speak(msg);
  }, 800);
}


// ────────────────────────────────────────────────────────────────────
// Player input
// ────────────────────────────────────────────────────────────────────
function onPitClick(idx) {
  if (busy || over) return;

  // Validate correct side clicked for current turn
  if (gameMode === 'ai') {
    if (turn !== PLAYER || idx >= 6) return;
  } else {
    if (turn === PLAYER  && idx >= 6) return;
    if (turn === OPPONENT && idx < 6)  return;
  }

  const curTurn = turn;
  const valid = validMoves(curTurn);
  if (!valid.includes(idx)) return;

  saveUndoState();
  SFX.select(); Haptic.select();
  document.querySelectorAll('.pit').forEach(p => p.classList.remove('selected', 'valid-move', 'hint-move'));
  document.getElementById(`pit-${idx}`).classList.add('selected');

  busy = true;
  setTimeout(() => {
    replayData = { boardBefore: [...board], pitIdx: idx, player: curTurn };
    SFX.sow(board[idx]);
    executeMove(idx, curTurn, () => {
      document.querySelectorAll('.pit').forEach(p => p.classList.remove('selected'));

      if (!over) {
        if (gameMode === 'ai') {
          turn = OPPONENT;
          setHeader(TITLES[titleIdx].name, 'AI thinking…');
          document.getElementById('hdr-status').classList.add('thinking');
          setTimeout(doAITurn, 600 + Math.random() * 400);
        } else {
          turn = curTurn === PLAYER ? OPPONENT : PLAYER;
          const wp = turn === PLAYER ? 'Player 1' : 'Player 2';
          setHeader('2 Players', `${wp}'s turn`);
          busy = false;
          enableUndo(); enableReplay();
          updateClickability();
          highlightValidMoves();
          if (validMoves(turn).length === 0) {
            collectRemaining(turn);
            checkGameOver(true);
          }
        }
      }
    });
  }, 150);
}

// ────────────────────────────────────────────────────────────────────
// AI turn
// ────────────────────────────────────────────────────────────────────
function doAITurn() {
  if (over) return;
  document.getElementById('hdr-status').classList.remove('thinking');

  const depth = getAIDepth();
  const move  = bestMove(depth);

  if (move === -1) {
    collectRemaining(OPPONENT);
    checkGameOver(true);
    return;
  }

  // Flash AI's chosen pit so the player can see what it picked
  const aiPitEl = document.getElementById(`pit-${move}`);
  if (aiPitEl) aiPitEl.classList.add('ai-selected');

  setTimeout(() => {
    if (aiPitEl) aiPitEl.classList.remove('ai-selected');

    replayData = { boardBefore: [...board], pitIdx: move, player: OPPONENT };
    SFX.sow(board[move]);
    executeMove(move, OPPONENT, () => {
      if (!over) {
        turn = PLAYER;
        setHeader(TITLES[titleIdx].name, 'Your turn – tap a pit');
        busy = false;
        enableUndo(); enableReplay();
        highlightValidMoves();

        if (validMoves(PLAYER).length === 0) {
          collectRemaining(PLAYER);
          checkGameOver(true);
        }
      }
    });
  }, 380);
}

// ────────────────────────────────────────────────────────────────────
// Move execution — animates sowing then captures, calls onDone after
// ────────────────────────────────────────────────────────────────────
const SOW_MS = 115; // ms per seed (matches audio schedule ~120 ms)

function executeMove(pitIdx, player, onDone) {
  const seedCount = board[pitIdx];

  // Build the sowing path without mutating the board yet
  const sowPath = [];
  let cur = pitIdx;
  let remaining = seedCount;
  while (remaining > 0) {
    cur = (cur + 1) % 12;
    if (cur === pitIdx) cur = (cur + 1) % 12;
    sowPath.push(cur);
    remaining--;
  }

  // Clear source pit immediately
  board[pitIdx] = 0;
  refreshPit(pitIdx);

  // Animate: drop one seed per pit on a staggered timer
  sowPath.forEach((p, i) => {
    setTimeout(() => {
      board[p]++;
      refreshPit(p);
      const el = document.getElementById(`pit-${p}`);
      if (el) { el.classList.add('seed-land'); setTimeout(() => el.classList.remove('seed-land'), 120); }
    }, i * SOW_MS);
  });

  // After all seeds land, run capture phase
  const landingPit = sowPath[sowPath.length - 1];
  const captureDelay = sowPath.length * SOW_MS + 60;

  setTimeout(() => {
    const capturedPits = captureSeeds(board, stores, landingPit, player);

    if (capturedPits.length > 0) {
      SFX.capture(capturedPits.length); Haptic.capture();
      if (player === PLAYER) setTimeout(showFact, 200);
    }

    capturedPits.forEach(p => {
      const el = document.getElementById(`pit-${p}`);
      if (el) {
        el.classList.add('captured-flash');
        setTimeout(() => el.classList.remove('captured-flash'), 600);
        spawnParticles(el, 5 + Math.floor(Math.random() * 4)); // 5–8 seeds per pit
      }
    });

    // Emoji reaction on landing pit
    const landingEl = document.getElementById(`pit-${landingPit}`);
    if (landingEl) {
      let emoji;
      const totalCaptured = capturedPits.reduce((s, p) => s + (board[p] || 0), 0);
      if (capturedPits.length === 0)        emoji = player === PLAYER ? '👏' : '🤖';
      else if (totalCaptured >= 6)           emoji = '🔥';
      else                                   emoji = player === PLAYER ? '⚡' : '😤';
      showMoveEmoji(landingEl, emoji);
    }

    for (let i = 0; i < 12; i++) refreshPit(i);
    updateScores();
    checkGameOver(false);
    if (onDone) onDone();
  }, captureDelay);
}

// ────────────────────────────────────────────────────────────────────
// Core game logic — sow + capture (split for animation)
// ────────────────────────────────────────────────────────────────────

// Sow seeds from pitIdx counter-clockwise; returns landing pit index
function sowSeeds(b, pitIdx) {
  let seeds = b[pitIdx];
  b[pitIdx] = 0;
  let cur = pitIdx;
  while (seeds > 0) {
    cur = (cur + 1) % 12;
    if (cur === pitIdx) cur = (cur + 1) % 12;
    b[cur]++;
    seeds--;
  }
  return cur;
}

// Run capture phase after sowing; returns captured pit indices
function captureSeeds(b, s, landingPit, player) {
  const oppStart = player === PLAYER ? 6 : 0;
  const oppEnd   = player === PLAYER ? 11 : 5;

  if (landingPit < oppStart || landingPit > oppEnd) return [];

  let toCapture = [];
  let p = landingPit;
  while (p >= oppStart && p <= oppEnd && (b[p] === 2 || b[p] === 3)) {
    toCapture.push(p);
    p--;
  }

  // Grand-slam check
  let totalOpp = 0;
  for (let i = oppStart; i <= oppEnd; i++) totalOpp += b[i];
  const capTotal = toCapture.reduce((acc, i) => acc + b[i], 0);
  if (capTotal >= totalOpp) return [];

  toCapture.forEach(i => {
    const gained = b[i];
    s[player] += gained;
    b[i] = 0;
    if (s === stores && player === PLAYER) totalSeeds += gained;
  });
  return toCapture;
}

// Atomic version used by AI lookahead and validMoves
function sowAndCapture(b, s, pitIdx, player) {
  const landing = sowSeeds(b, pitIdx);
  return captureSeeds(b, s, landing, player);
}

// ────────────────────────────────────────────────────────────────────
// Valid moves
// ────────────────────────────────────────────────────────────────────
function validMoves(player) {
  const myStart  = player === PLAYER ? 0 : 6;
  const myEnd    = player === PLAYER ? 5 : 11;
  const oppStart = player === PLAYER ? 6 : 0;
  const oppEnd   = player === PLAYER ? 11 : 5;

  const all = [];
  for (let i = myStart; i <= myEnd; i++) if (board[i] > 0) all.push(i);

  // Check if opponent has seeds
  let oppHasSeeds = false;
  for (let i = oppStart; i <= oppEnd; i++) if (board[i] > 0) { oppHasSeeds = true; break; }
  if (oppHasSeeds) return all;

  // Must try to feed opponent
  const feeding = all.filter(m => {
    const tb = [...board], ts = [...stores];
    sowAndCapture(tb, ts, m, player);
    for (let i = oppStart; i <= oppEnd; i++) if (tb[i] > 0) return true;
    return false;
  });
  return feeding.length > 0 ? feeding : all;
}

// ────────────────────────────────────────────────────────────────────
// Game over detection
// ────────────────────────────────────────────────────────────────────
function collectRemaining(activePlayer) {
  // The player who CAN'T move collects nothing; the other collects their own seeds
  const oppPlayer = activePlayer === PLAYER ? OPPONENT : PLAYER;
  const s = oppPlayer === PLAYER ? 0 : 6;
  const e = oppPlayer === PLAYER ? 5 : 11;
  for (let i = s; i <= e; i++) { stores[oppPlayer] += board[i]; board[i] = 0; }
  for (let i = 0; i < 12; i++) refreshPit(i);
  updateScores();
}

// Animate sweeping remaining seeds pit-by-pit before showing game over
function sweepAndEnd(pits, delay, callback) {
  if (pits.length === 0) { callback(); return; }
  const idx = pits.shift();
  if (board[idx] > 0) {
    const owner = idx < 6 ? PLAYER : OPPONENT;
    stores[owner] += board[idx];
    board[idx] = 0;
    const el = document.getElementById(`pit-${idx}`);
    if (el) { el.classList.add('captured-flash'); setTimeout(() => el.classList.remove('captured-flash'), 400); }
    refreshPit(idx);
    updateScores();
  }
  setTimeout(() => sweepAndEnd(pits, delay, callback), delay);
}

function checkGameOver(forceEnd) {
  const totalSeeds = board.reduce((a, b) => a + b, 0);
  const playerWon  = stores[PLAYER]   >= 25;
  const aiWon      = stores[OPPONENT] >= 25;
  const noSeeds    = totalSeeds === 0;

  if (!forceEnd && !playerWon && !aiWon && !noSeeds) return;

  over = true;
  busy = true;

  if (forceEnd && !noSeeds) {
    // Animate sweeping each remaining pit one at a time
    const remaining = [];
    for (let i = 0; i < 12; i++) if (board[i] > 0) remaining.push(i);
    sweepAndEnd(remaining, 120, finishGameOver);
  } else {
    finishGameOver();
  }
}

function finishGameOver() {
  const tie = stores[PLAYER] === stores[OPPONENT];
  const win = stores[PLAYER] > stores[OPPONENT];
  if (tie) { /* no fanfare */ }
  else if (win) { SFX.win(); Haptic.win(); }
  else { SFX.lose(); Haptic.lose(); }
  setTimeout(() => showGameOver(win, tie), tie ? 200 : 600);
}

function showGameOver(playerWon, tie) {
  const is2p = gameMode === '2p';
  document.getElementById('btn-share').style.display    = playerWon && !tie ? 'inline-flex' : 'none';
  document.getElementById('result-emoji').textContent   = tie ? '🤝' : '🏆';
  document.getElementById('result-heading').textContent = tie
    ? 'Draw!'
    : is2p
      ? (playerWon ? 'Player 1 Wins!' : 'Player 2 Wins!')
      : (playerWon ? 'You Win!' : 'You Lose!');
  document.getElementById('fs-player').textContent      = stores[PLAYER];
  document.getElementById('fs-ai').textContent          = stores[OPPONENT];

  const title = TITLES[titleIdx];
  let sub = '';

  const unlockEl = document.getElementById('title-unlocked');
  const lostEl   = document.getElementById('title-lost');
  unlockEl.classList.add('hidden');
  lostEl.classList.add('hidden');

  if (tie) {
    sub = 'Both players scored 24 — no seeds change hands.';
  } else if (gameMode === '2p') {
    sub = playerWon
      ? `Player 1 wins by ${stores[PLAYER] - stores[OPPONENT]} seeds`
      : `Player 2 wins by ${stores[OPPONENT] - stores[PLAYER]} seeds`;
  } else if (playerWon) {
    titleLosses = 0;
    currentStreak++;
    if (currentStreak > bestStreak) bestStreak = currentStreak;
    totalWins++;
    titleWins++;
    if (titleIdx < TITLES.length - 1 && titleWins >= title.wins) {
      // Unlock next title
      titleIdx++;
      titleWins = 0;
      const newT = TITLES[titleIdx];
      document.getElementById('unlocked-title-name').textContent    = newT.name;
      document.getElementById('unlocked-title-meaning').textContent = newT.meaning;
      unlockEl.classList.remove('hidden');
      SFX.titleUnlock(); Haptic.unlock();
      speakTitle(newT.name, newT.meaning);
      updateBackground();
      sub = `You've risen to: ${newT.name}! Play again to defend your new title! 💪`;
    } else if (titleIdx === TITLES.length - 1) {
      sub = 'You reign supreme, Oba! 👑 Play again to prove your dominance!';
    } else {
      const remaining = title.wins - titleWins;
      sub = remaining === 1
        ? `Just 1 more win and you become ${TITLES[titleIdx + 1].name}! You're so close! 🔥`
        : `${remaining} more wins to become ${TITLES[titleIdx + 1].name} — keep going! 💪`;
    }
  } else if (gameMode !== '2p') {
    currentStreak = 0;
    totalLosses++;
    titleLosses++;
    if (titleIdx > 0 && titleLosses >= REGRESSION_THRESHOLD) {
      // Drop back one title
      const lostTitle = TITLES[titleIdx];
      titleIdx--;
      titleWins   = 0;
      titleLosses = 0;
      document.getElementById('lost-title-name').textContent    = lostTitle.name;
      document.getElementById('lost-title-meaning').textContent = lostTitle.meaning;
      lostEl.classList.remove('hidden');
      updateBackground();
      sub = `You've fallen back to: ${TITLES[titleIdx].name}`;
    } else {
      const streak = REGRESSION_THRESHOLD - titleLosses;
      sub = titleIdx === 0
        ? `${TITLES[0].name} — you cannot fall lower`
        : `${streak} more loss${streak !== 1 ? 'es' : ''} and you'll lose your title`;
    }
  }

  document.getElementById('result-sub').textContent =
    playerWon && !tie ? sub + '\n🥂 You deserve a bowl of Palmie (Palmwine)!' : sub;
  SFX.ambientStop();
  showScreen('gameover-screen');
  if (!tie && !is2p) setTimeout(maybeShowRatePrompt, 1500);

  // Persist title progress (localStorage)
  saveProgress();
}

// ────────────────────────────────────────────────────────────────────
// Mute toggle
// ────────────────────────────────────────────────────────────────────
function toggleMute() {
  const m = SFX.toggleMute();
  const btn = document.getElementById('btn-mute');
  if (btn) {
    btn.textContent = m ? '🔇' : '🔊';
    btn.classList.toggle('muted', m);
  }
}

// ────────────────────────────────────────────────────────────────────
// Persistence
// ────────────────────────────────────────────────────────────────────
function saveProgress() {
  try {
    localStorage.setItem('ayo_title',       titleIdx);
    localStorage.setItem('ayo_titleWins',   titleWins);
    localStorage.setItem('ayo_titleLosses', titleLosses);
    localStorage.setItem('ayo_totalWins',   totalWins);
    localStorage.setItem('ayo_totalLoss',   totalLosses);
    localStorage.setItem('ayo_streak',      currentStreak);
    localStorage.setItem('ayo_bestStreak',  bestStreak);
    localStorage.setItem('ayo_seeds',       totalSeeds);
    localStorage.setItem('ayo_difficulty',  difficulty);
  } catch(e) {}
}

function loadProgress() {
  try {
    const t   = parseInt(localStorage.getItem('ayo_title'),       10);
    const w   = parseInt(localStorage.getItem('ayo_titleWins'),   10);
    const wl  = parseInt(localStorage.getItem('ayo_titleLosses'), 10);
    const tw  = parseInt(localStorage.getItem('ayo_totalWins'),   10);
    const tl  = parseInt(localStorage.getItem('ayo_totalLoss'),   10);
    const cs  = parseInt(localStorage.getItem('ayo_streak'),      10);
    const bs  = parseInt(localStorage.getItem('ayo_bestStreak'),  10);
    const d   = localStorage.getItem('ayo_difficulty');
    if (!isNaN(t)  && t  >= 0 && t < TITLES.length) titleIdx      = t;
    if (!isNaN(w)  && w  >= 0) titleWins      = w;
    if (!isNaN(wl) && wl >= 0) titleLosses    = wl;
    if (!isNaN(tw) && tw >= 0) totalWins      = tw;
    if (!isNaN(tl) && tl >= 0) totalLosses    = tl;
    if (!isNaN(cs) && cs >= 0) currentStreak = cs;
    if (!isNaN(bs) && bs >= 0) bestStreak    = bs;
    const ss = parseInt(localStorage.getItem('ayo_seeds'), 10);
    if (!isNaN(ss) && ss >= 0) totalSeeds    = ss;
    if (d === 'easy' || d === 'medium' || d === 'hard') difficulty = d;
    const wood = localStorage.getItem('ayo_wood');
    if (wood && WOOD_THEMES[wood]) setWood(wood);
  } catch(e) {}
}

// ────────────────────────────────────────────────────────────────────
// AI — minimax with alpha-beta pruning
// ────────────────────────────────────────────────────────────────────
function bestMove(depth) {
  if (depth === 1) {
    // Random (easiest)
    const moves = aiValidMoves(OPPONENT, board);
    return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : -1;
  }

  const moves = aiValidMoves(OPPONENT, board);
  if (moves.length === 0) return -1;

  let best = -1, bestScore = -Infinity;
  for (const m of moves) {
    const tb = [...board], ts = [...stores];
    sowAndCapture(tb, ts, m, OPPONENT);
    const score = minimax(tb, ts, depth - 1, false, -Infinity, Infinity);
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
}

function minimax(b, s, depth, maximizing, alpha, beta) {
  // Check terminal
  const pSeeds = b.slice(0, 6).reduce((a, v) => a + v, 0);
  const oSeeds = b.slice(6).reduce((a, v) => a + v, 0);
  if (depth === 0 || s[PLAYER] >= 25 || s[OPPONENT] >= 25 || (pSeeds === 0 && oSeeds === 0)) {
    return s[OPPONENT] - s[PLAYER]; // positive = AI winning
  }

  const curPlayer = maximizing ? OPPONENT : PLAYER;
  const moves = aiValidMoves(curPlayer, b);

  if (moves.length === 0) {
    // Collect remaining for opponent
    const nb = [...b], ns = [...s];
    const oppPlayer = curPlayer === PLAYER ? OPPONENT : PLAYER;
    const oppS2 = oppPlayer === PLAYER ? 0 : 6;
    const oppE2 = oppPlayer === PLAYER ? 5 : 11;
    for (let i = oppS2; i <= oppE2; i++) { ns[oppPlayer] += nb[i]; nb[i] = 0; }
    return ns[OPPONENT] - ns[PLAYER];
  }

  if (maximizing) {
    let val = -Infinity;
    for (const m of moves) {
      const nb = [...b], ns = [...s];
      sowAndCapture(nb, ns, m, OPPONENT);
      val = Math.max(val, minimax(nb, ns, depth - 1, false, alpha, beta));
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return val;
  } else {
    let val = Infinity;
    for (const m of moves) {
      const nb = [...b], ns = [...s];
      sowAndCapture(nb, ns, m, PLAYER);
      val = Math.min(val, minimax(nb, ns, depth - 1, true, alpha, beta));
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return val;
  }
}

// Valid moves using a given board (for lookahead)
function aiValidMoves(player, b) {
  const myStart  = player === PLAYER ? 0 : 6;
  const myEnd    = player === PLAYER ? 5 : 11;
  const oppStart = player === PLAYER ? 6 : 0;
  const oppEnd   = player === PLAYER ? 11 : 5;

  const all = [];
  for (let i = myStart; i <= myEnd; i++) if (b[i] > 0) all.push(i);

  let oppHas = false;
  for (let i = oppStart; i <= oppEnd; i++) if (b[i] > 0) { oppHas = true; break; }
  if (oppHas) return all;

  const feeding = all.filter(m => {
    const tb = [...b], ts = [0,0];
    sowAndCapture(tb, ts, m, player);
    for (let i = oppStart; i <= oppEnd; i++) if (tb[i] > 0) return true;
    return false;
  });
  return feeding.length > 0 ? feeding : all;
}

// ────────────────────────────────────────────────────────────────────
// PWA install banner
// ────────────────────────────────────────────────────────────────────
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _installPrompt = e;
  // Only show on title screen
  const banner = document.getElementById('install-banner');
  if (banner && document.getElementById('title-screen') &&
      !document.getElementById('title-screen').classList.contains('hidden')) {
    banner.classList.remove('hidden');
  }
});

window.addEventListener('appinstalled', () => {
  _installPrompt = null;
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.add('hidden');
});

function triggerInstall() {
  if (!_installPrompt) return;
  _installPrompt.prompt();
  _installPrompt.userChoice.then(() => {
    _installPrompt = null;
    dismissInstall();
  });
}

function dismissInstall() {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.add('hidden');
}

// ────────────────────────────────────────────────────────────────────
// Keyboard shortcuts  (1–6 = player pits, H = hint, M = mute)
// ────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Pit selection: keys 1-6 map to pits 0-5
  if (e.key >= '1' && e.key <= '6') {
    const pitIdx = parseInt(e.key) - 1;
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen.classList.contains('hidden')) onPitClick(pitIdx);
    return;
  }
  switch (e.key.toLowerCase()) {
    case 'h': showHint();   break;
    case 'm': toggleMute(); break;
  }
});

// ────────────────────────────────────────────────────────────────────
// Daily Challenge
// ────────────────────────────────────────────────────────────────────
const DAILY_QUESTIONS = [
  { q:'Who is considered the founding ancestor of the Yoruba people?', options:['Oduduwa','Obatala','Oranmiyan'], answer:0, exp:'Oduduwa descended from the heavens on a chain at Ile-Ife and is revered as the progenitor of all Yoruba kingdoms.' },
  { q:'What city is regarded as the cradle of Yoruba civilisation?', options:['Ibadan','Ile-Ife','Oyo-Ile'], answer:1, exp:'Ile-Ife (meaning "house of expansion") is the sacred city where Oduduwa descended and created the earth.' },
  { q:'Who founded the Old Oyo Empire?', options:['Sango','Afonja','Oranmiyan'], answer:2, exp:'Oranmiyan, grandson of Oduduwa, founded the Old Oyo Empire and is also credited with founding Benin City.' },
  { q:'What does the Yoruba word "Ayo" mean?', options:['Board','Joy','Victory'], answer:1, exp:'Ayo means Joy in Yoruba — the game was played at festivals and celebrations to spread happiness.' },
  { q:'Which Yoruba deity is the god of iron, hunting and war?', options:['Sango','Ogun','Eshu'], answer:1, exp:'Ogun is the powerful deity of iron and war. Blacksmiths, soldiers and drivers swear oaths on Ogun.' },
  { q:'Which deity rules thunder and lightning in Yoruba belief?', options:['Sango','Obatala','Orunmila'], answer:0, exp:'Sango was a historical king of Oyo who was deified after death and became the god of thunder and lightning.' },
  { q:'The Osun-Osogbo festival celebrates which river goddess?', options:['Yemoja','Oya','Osun'], answer:2, exp:'Osun is the goddess of the sacred Osun River. The Osun-Osogbo festival is a UNESCO Intangible Cultural Heritage.' },
  { q:'Who was the Yoruba heroine who sacrificed her son to save her people?', options:['Emotan','Moremi Ajasoro','Queen Amina'], answer:1, exp:'Moremi Ajasoro of Ile-Ife allowed herself to be captured by the Ugbo people to learn their secrets, then sacrificed her only son Ela as promised to the river goddess.' },
  { q:'What is "Ifa" in Yoruba tradition?', options:['A royal drum','A divination system and body of sacred knowledge','A type of crown'], answer:1, exp:'Ifa is a vast divination system and oral literary corpus recognised by UNESCO. Priests called Babalawo interpret its 256 chapters called Odu.' },
  { q:'The title "Ooni" belongs to the traditional ruler of which city?', options:['Oyo','Ibadan','Ile-Ife'], answer:2, exp:'The Ooni of Ife is one of the most revered traditional rulers in Yoruba land, regarded as the spiritual head of the Yoruba people.' },
  { q:'What does "Olopon" mean in Yoruba?', options:['Sacred calabash','The wooden board used for Ayo','A royal crown'], answer:1, exp:'"Olopon" refers to the wooden board used to play Ayo — so Ayo Olopon means "the Ayo board game."' },
  { q:'What military weapon made the Old Oyo Empire the most powerful in West Africa?', options:['War canoes','Cavalry (horse warriors)','Iron cannons'], answer:1, exp:'Oyo built one of the largest cavalry forces in West African history, allowing it to dominate a vast territory from the 17th to 18th century.' },
  { q:'The Egungun masquerade in Yoruba culture represents what?', options:['Forest spirits','The spirits of ancestors','Water deities'], answer:1, exp:'Egungun masquerades are believed to be the physical manifestation of ancestral spirits returning to the world of the living to guide and protect their descendants.' },
  { q:'What does the Yoruba concept of "Ori" mean?', options:['Personal destiny and inner spirit','A type of king','A sacred river'], answer:0, exp:'Ori literally means "head" but spiritually represents personal destiny chosen before birth. Yoruba believe worshipping one\'s Ori is essential to achieving one\'s purpose.' },
  { q:'Which UNESCO World Heritage Site is located in Yoruba land?', options:['Sukur Cultural Landscape','Kano Old City','Osun-Osogbo Sacred Grove'], answer:2, exp:'The Osun-Osogbo Sacred Grove is one of the last remnants of primary forest in southern Nigeria and a UNESCO World Heritage Site since 2005.' },
  { q:'What is the significance of twins (Ibeji) in Yoruba culture?', options:['They are considered bad omens','They are sacred and believed to bring fortune','They must be separated at birth'], answer:1, exp:'Yoruba people have one of the highest twin birth rates in the world. Twins are considered sacred children of Sango and are believed to bring blessings to the family.' },
  { q:'The Gelede masquerade honours which group in Yoruba society?', options:['Warriors and hunters','Women, mothers and female ancestors','Kings and chiefs'], answer:1, exp:'Gelede is performed to honour the power of women, especially elderly women and female ancestors known as "the mothers." It is a UNESCO Intangible Heritage.' },
  { q:'Which Yoruba god is the divine trickster and guardian of crossroads?', options:['Sango','Obatala','Eshu/Elegba'], answer:2, exp:'Eshu (also called Elegba or Elegua) is the divine messenger between humans and gods. No ritual begins without first honouring Eshu to ensure safe passage.' },
  { q:'Yemoja is the Yoruba goddess of what?', options:['The harvest','Rivers and motherhood','Thunder'], answer:1, exp:'Yemoja is the mother of waters and protector of women and children. Her worship spread across the Atlantic with the Yoruba diaspora to Brazil and Cuba.' },
  { q:'The Alaafin is the traditional ruler of which Yoruba kingdom?', options:['Lagos','Ekiti','Oyo'], answer:2, exp:'The Alaafin of Oyo was historically the most powerful Yoruba ruler, commanding the vast Old Oyo Empire and its renowned cavalry.' },
  { q:'The city of Abeokuta is built around which famous natural feature?', options:['Olumo Rock','A sacred waterfall','A volcanic crater'], answer:0, exp:'Olumo Rock served as a fortress for the Egba people during the inter-tribal wars of the 19th century. "Abeokuta" means "under the rock."' },
  { q:'What is "Adire" in Yoruba culture?', options:['A royal war chant','Traditional indigo tie-dye fabric','A ceremonial calabash'], answer:1, exp:'Adire is a beautiful indigo-dyed cloth made using tie-dye and starch-resist techniques. It is one of the most celebrated traditional crafts of the Egba Yoruba.' },
  { q:'Which Egba hero led the revolt for Egba independence from Old Oyo?', options:['Afonja','Lisabi','Kurunmi'], answer:1, exp:'Lisabi Agbongbo Akala organised the Egba people\'s uprising against Oyo oppression around 1774, liberating the Egba from Oyo\'s tributary demands.' },
  { q:'How many days are in a traditional Yoruba week?', options:['7 days','5 days','4 days'], answer:2, exp:'The traditional Yoruba week has 4 days — Ojo Awo, Ojо Ogun, Ojо Sango, and Ojо Obatala — each associated with a specific deity.' },
  { q:'Obatala is the Yoruba deity associated with what?', options:['Purity, wisdom and creation of human bodies','Fire and destruction','The ocean and deep waters'], answer:0, exp:'Obatala (also called Orisa-nla) is the deity of creation, purity and calm. Yoruba believe Olodumare gave Obatala the task of moulding human bodies from clay.' },
  { q:'What is the name of the Yoruba divination priest?', options:['Babalawo','Oba','Balogun'], answer:0, exp:'A Babalawo ("father of secrets") is a trained Ifa divination priest who studies for years to memorise the 256 Odu chapters of Ifa wisdom.' },
  { q:'The ancient Ife bronze heads discovered in Ile-Ife are significant because?', options:['They are the oldest known artworks in Africa','They show Yoruba mastery of naturalistic bronze casting centuries ago','They were made by Portuguese traders'], answer:1, exp:'The Ife bronze heads (c. 12th–14th century) display extraordinary naturalistic detail that astonished the world when first discovered, proving advanced Yoruba artistry.' },
  { q:'In which century did the Old Oyo Empire reach its peak of power?', options:['10th–11th century','14th–15th century','17th–18th century'], answer:2, exp:'The Old Oyo Empire reached its height of power in the 17th and 18th centuries, controlling a vast territory and conducting trade across West Africa.' },
  { q:'What is the name of the Yoruba oral literature tradition recognised by UNESCO?', options:['Ifa literary corpus','Egungun songs','Gelede chants'], answer:0, exp:'The Ifa literary corpus was inscribed on UNESCO\'s Representative List of Intangible Cultural Heritage in 2008. It contains the history, philosophy and medicine of the Yoruba.' },
  { q:'Which Yoruba kingdom controlled the trade routes between the coast and the interior of Nigeria?', options:['Ijebu kingdom','Ekiti kingdom','Ondo kingdom'], answer:0, exp:'The Ijebu kingdom, ruled by the Awujale, controlled strategic trade routes and became extremely wealthy. They were known for their military strength and resistance to foreign interference.' },
  { q:'What does the name "Ibadan" roughly translate to?', options:['City of warriors','Near the forest by the open plain','Home of the river'], answer:1, exp:'Ibadan comes from "Eba Odan" meaning "near the forest by the open savanna." It was founded in the 1820s and grew rapidly to become the largest city in sub-Saharan Africa by the late 1800s.' },
  { q:'The Yoruba diaspora in Brazil practise a religion based on Yoruba beliefs called?', options:['Vodou','Santería','Candomblé'], answer:2, exp:'Candomblé in Brazil is directly descended from Yoruba religious practices brought by enslaved Yoruba people. The orishas are still worshipped under their Yoruba names.' },
  { q:'What does "Oba" mean in Yoruba?', options:['Elder','King or Ruler','Warrior chief'], answer:1, exp:'Oba means King in Yoruba. It is the highest traditional title, used for rulers of major Yoruba cities and kingdoms.' },
  { q:'Which river flows through the sacred Osun-Osogbo grove?', options:['Niger River','Ogun River','Osun River'], answer:2, exp:'The Osun River flows through the sacred grove at Osogbo. The river is believed to be the physical embodiment of the goddess Osun herself.' },
  { q:'The Yoruba architectural style of a royal palace is called?', options:['Afin','Ile-Oba','Agbo-ile'], answer:0, exp:'An Afin is the palace complex of a Yoruba Oba. The great Afin of Oyo was one of the largest palace complexes in West Africa.' },
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getDailyQuestion() {
  // Use date as deterministic index
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}

function isHintUnlockedToday() {
  try { return localStorage.getItem('ayo_daily_date') === todayKey() && localStorage.getItem('ayo_daily_correct') === '1'; } catch(e) { return false; }
}

function initDailyChallenge() {
  const q = getDailyQuestion();
  const todayDone = (() => { try { return localStorage.getItem('ayo_daily_date') === todayKey(); } catch(e) { return false; } })();

  const badge   = document.getElementById('daily-badge');
  const qWrap   = document.getElementById('daily-question-wrap');
  const doneMsg = document.getElementById('daily-done-msg');

  if (todayDone) {
    qWrap.classList.add('hidden');
    doneMsg.classList.remove('hidden');
    if (isHintUnlockedToday()) badge.classList.remove('hidden');
  } else {
    document.getElementById('daily-q').textContent = q.q;
    const optsEl = document.getElementById('daily-options');
    optsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'daily-opt';
      btn.textContent = opt;
      btn.onclick = () => answerDaily(i, q);
      optsEl.appendChild(btn);
    });
  }
  updateHintButton();
}

function answerDaily(chosen, q) {
  const opts = document.querySelectorAll('.daily-opt');
  opts.forEach((btn, i) => {
    btn.onclick = null;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === chosen) btn.classList.add('wrong');
  });

  const feedback = document.getElementById('daily-feedback');
  feedback.textContent = q.exp;
  feedback.classList.remove('hidden');

  const correct = chosen === q.answer;
  try {
    localStorage.setItem('ayo_daily_date',    todayKey());
    localStorage.setItem('ayo_daily_correct', correct ? '1' : '0');
  } catch(e) {}

  setTimeout(() => {
    document.getElementById('daily-question-wrap').classList.add('hidden');
    document.getElementById('daily-done-msg').classList.remove('hidden');
    if (correct) {
      document.getElementById('daily-badge').classList.remove('hidden');
      showToast('🎉 Correct! Hint button unlocked for today!');
    } else {
      showToast('Not quite — read the answer and try again tomorrow.');
    }
    updateHintButton();
  }, 2800);
}

function updateHintButton() {
  const btn = document.getElementById('btn-hint');
  if (!btn) return;
  if (isHintUnlockedToday()) {
    btn.classList.remove('locked');
    btn.title = '';
  } else {
    btn.classList.add('locked');
    btn.title = 'Complete today\'s Daily Challenge to unlock the hint';
  }
}

// ────────────────────────────────────────────────────────────────────
// Offline detection
// ────────────────────────────────────────────────────────────────────
const offlineOverlay = document.getElementById('offline-overlay');
function updateOnlineStatus() {
  if (!navigator.onLine) {
    offlineOverlay.style.display = 'flex';
  } else {
    offlineOverlay.style.display = 'none';
  }
}
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('online',  updateOnlineStatus);

// ────────────────────────────────────────────────────────────────────
// Share
// ────────────────────────────────────────────────────────────────────
function shareGame() {
  const text = 'I just won at Ayo Olopon! 🏆 Can you beat me? Play the traditional Yoruba board game:';
  const url  = 'https://oluseyevisuals.github.io/ayo-olopon/';
  if (navigator.share) {
    navigator.share({ title: 'Ayo Olopon', text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).then(() => alert('Link copied! Share it with friends.'));
  }
}

// ────────────────────────────────────────────────────────────────────
// Rate prompt — show after every 3rd win
// ────────────────────────────────────────────────────────────────────
const STORE_URL = 'https://oluseyevisuals.github.io/ayo-olopon/';
function maybeShowRatePrompt() {
  try {
    if (localStorage.getItem('ayo_rated')) return;
    const dismissed = parseInt(localStorage.getItem('ayo_rate_dismissed') || '0', 10);
    if (totalWins > 0 && totalWins % 3 === 0 && totalWins > dismissed) {
      document.getElementById('rate-prompt').style.display = 'flex';
    }
  } catch(e) {}
}
function rateApp() {
  try { localStorage.setItem('ayo_rated', '1'); } catch(e) {}
  document.getElementById('rate-prompt').style.display = 'none';
  window.open(STORE_URL, '_blank');
}
function dismissRate() {
  try { localStorage.setItem('ayo_rate_dismissed', String(totalWins)); } catch(e) {}
  document.getElementById('rate-prompt').style.display = 'none';
}

// ────────────────────────────────────────────────────────────────────
// Boot
// ────────────────────────────────────────────────────────────────────
loadProgress();
init();
initDailyChallenge();
