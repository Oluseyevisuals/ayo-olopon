// ── sound.js — Ayo Olopon Sound Effects (Web Audio API) ──────────────
// All sounds synthesised procedurally — no audio files needed.
// Tuned for cowrie shells landing in a wooden pit.

const SFX = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Core: cowrie shell on wood ───────────────────────────────────
  // Cowrie shells are smooth, hollow, and light — producing a bright
  // high-pitched "clack" with fast decay and a short woody resonance.
  //
  // at    — scheduled offset in seconds from now
  // vol   — 0–1 gain
  // pitch — multiplier for resonance freq (vary per drop for realism)
  function cowrieOnWood(at, vol, pitch) {
    at    = at    === undefined ? 0    : at;
    vol   = vol   === undefined ? 0.55 : vol;
    pitch = pitch === undefined ? 1    : pitch;

    const c = getCtx();
    const t = c.currentTime + at;

    // 1. Shell impact — sharp noise burst through a bright bandpass
    //    (800–1100 Hz gives the "clack" of a shell, not a heavy thud)
    const bufLen = Math.floor(c.sampleRate * 0.055); // 55 ms burst
    const buf = c.createBuffer(1, bufLen, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.06));
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;

    // Bright bandpass — shell "clack"
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900 * pitch;
    bp.Q.value = 3.5;

    // High-pass to cut muddy low end
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;

    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    noise.connect(bp);
    bp.connect(hp);
    hp.connect(noiseGain);
    noiseGain.connect(c.destination);
    noise.start(t);
    noise.stop(t + 0.06);

    // 2. Hollow wood resonance — higher pitched, very short "tok"
    const osc = c.createOscillator();
    const oscGain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(260 * pitch, t + 0.09);
    oscGain.gain.setValueAtTime(vol * 0.32, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(oscGain);
    oscGain.connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.10);
  }

  // ── Public API ───────────────────────────────────────────────────

  /** Pit selection tap */
  function select() {
    if (muted) return;
    cowrieOnWood(0, 0.38, 1.4);
  }

  /**
   * Sowing — plays EXACTLY seedCount cowrie sounds, one per seed.
   * Each drop has a unique pitch & tiny timing jitter for realism.
   */
  function sow(seedCount) {
    if (muted) return;
    var n = Math.max(1, seedCount);
    for (var i = 0; i < n; i++) {
      var pitch  = 0.82 + Math.random() * 0.38; // ±~20% pitch variation
      var vol    = 0.42 + Math.random() * 0.18;
      var jitter = Math.random() * 0.01;          // up to 10 ms scatter
      cowrieOnWood(i * 0.12 + jitter, vol, pitch);
    }
  }

  /** Capture — cowrie cascade + hollow wood drum */
  function capture(capturedPitCount) {
    if (muted) return;
    capturedPitCount = capturedPitCount || 1;
    const c = getCtx();
    const t = c.currentTime;

    var hits = Math.min(capturedPitCount * 2 + 1, 6);
    for (var i = 0; i < hits; i++) {
      cowrieOnWood(i * 0.06, 0.65, 0.85 + Math.random() * 0.3);
    }

    // Deep wooden thud
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t + hits * 0.06);
    osc.frequency.exponentialRampToValueAtTime(70, t + hits * 0.06 + 0.22);
    gain.gain.setValueAtTime(0.35, t + hits * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + hits * 0.06 + 0.25);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t + hits * 0.06);
    osc.stop(t + hits * 0.06 + 0.28);
  }

  /** Ascending Yoruba pentatonic arpeggio — win */
  function win() {
    if (muted) return;
    const c = getCtx();
    const t = c.currentTime;
    [293.66, 369.99, 440, 493.88, 587.33].forEach(function(freq, i) {
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var st = t + i * 0.13;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.28, st + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.55);
      osc.connect(g); g.connect(c.destination);
      osc.start(st); osc.stop(st + 0.6);
    });
  }

  /** Descending minor arpeggio — lose */
  function lose() {
    if (muted) return;
    const c = getCtx();
    const t = c.currentTime;
    [392, 349.23, 311.13, 261.63].forEach(function(freq, i) {
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      var st = t + i * 0.2;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.22, st + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
      osc.connect(g); g.connect(c.destination);
      osc.start(st); osc.stop(st + 0.55);
    });
  }

  /** Cowrie scatter + rising shimmer — title unlocked */
  function titleUnlock() {
    if (muted) return;
    for (var i = 0; i < 5; i++) {
      cowrieOnWood(i * 0.07, 0.5, 1.0 + i * 0.1);
    }
    win();
    const c = getCtx();
    const t = c.currentTime + 0.7;
    [880, 1046.5, 1318.51].forEach(function(freq, i) {
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var st = t + i * 0.1;
      g.gain.setValueAtTime(0, st);
      g.gain.linearRampToValueAtTime(0.14, st + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.45);
      osc.connect(g); g.connect(c.destination);
      osc.start(st); osc.stop(st + 0.5);
    });
  }

  function toggleMute() { muted = !muted; return muted; }
  function isMuted()    { return muted; }

  // ── Ambient Yoruba drum loop ─────────────────────────────────────
  // 12-step triplet grid at 112 BPM (~2.14 s per bar).
  // Bass djembe on beats 1,4,7,10 · mid drum on 3,5,8,11 · hi-hat every step.
  const STEP_S   = 60 / 112 / 3;   // ≈ 0.178 s per triplet step
  const STEPS    = 12;
  const BASS_PAT = [0, 3, 6, 9];
  const MID_PAT  = [2, 4, 7, 10];

  let drumTimer = null;
  let nextBarAt = 0;

  function drumBass(at) {
    const c = getCtx(), osc = c.createOscillator(), g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(82, at);
    osc.frequency.exponentialRampToValueAtTime(36, at + 0.20);
    g.gain.setValueAtTime(0.28, at);
    g.gain.exponentialRampToValueAtTime(0.001, at + 0.24);
    osc.connect(g); g.connect(c.destination);
    osc.start(at); osc.stop(at + 0.26);
  }

  function drumMid(at) {
    const c = getCtx(), osc = c.createOscillator(), g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(215, at);
    osc.frequency.exponentialRampToValueAtTime(115, at + 0.07);
    g.gain.setValueAtTime(0.16, at);
    g.gain.exponentialRampToValueAtTime(0.001, at + 0.11);
    osc.connect(g); g.connect(c.destination);
    osc.start(at); osc.stop(at + 0.13);
  }

  function drumHihat(at, vol) {
    const c   = getCtx();
    const len = Math.floor(c.sampleRate * 0.032);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.12));
    const src = c.createBufferSource(); src.buffer = buf;
    const hp  = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 8000;
    const g   = c.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.001, at + 0.032);
    src.connect(hp); hp.connect(g); g.connect(c.destination);
    src.start(at); src.stop(at + 0.036);
  }

  function scheduleBar() {
    if (muted) return;
    const c = getCtx();
    // Re-sync if we've fallen behind (e.g. after unmuting or tab sleep)
    if (nextBarAt < c.currentTime + 0.05) nextBarAt = c.currentTime + 0.05;
    for (let s = 0; s < STEPS; s++) {
      const t = nextBarAt + s * STEP_S;
      if (BASS_PAT.includes(s)) drumBass(t);
      if (MID_PAT.includes(s))  drumMid(t);
      drumHihat(t, s % 3 === 0 ? 0.09 : 0.04);
    }
    nextBarAt += STEPS * STEP_S;
  }

  // Poll every 400 ms; schedule a new bar whenever < 1 s of audio is buffered
  function drumTick() {
    if (!muted && nextBarAt - getCtx().currentTime < 1.0) scheduleBar();
  }

  function ambientStart() {
    if (drumTimer) return;
    nextBarAt = 0; // force re-sync on first scheduleBar call
    scheduleBar();
    drumTimer = setInterval(drumTick, 400);
  }

  function ambientStop() {
    if (drumTimer) { clearInterval(drumTimer); drumTimer = null; }
  }

  // ── Mẹta mẹta l'ore o — folk melody loop ───────────────────────────
  // Synthesised as a warm flute/kalimba voice over the drum loop.
  // Uses G major pentatonic (G4·A4·B4·D5·E5·G5) — the natural scale
  // of Yoruba folk music. Tempo: 88 BPM, gentle vibrato, soft attack.
  const FOLK_BPM   = 104;
  const FOLK_BEAT  = 60 / FOLK_BPM;               // ≈ 0.577 s per beat

  // Mẹ́tà mẹ́tà lọ́rẹ́ o — syllable-tone mapped to G pentatonic (G·A·B·D·E)
  // Yoruba tone marks drive pitch: H(igh)=up, L(ow)=down, "Èèè"=long fall response
  // [freq_hz, duration_in_beats]
  const FOLK_NOTES = [
    // ── Chorus x2: "Mẹ́tà mẹ́tà lọ́rẹ́ o, Èèè" ──────────────────────
    [440.00, 0.5],  // A4  Mẹ́
    [493.88, 0.5],  // B4  tà
    [440.00, 0.5],  // A4  mẹ́
    [493.88, 0.5],  // B4  tà
    [440.00, 0.5],  // A4  lọ́
    [493.88, 0.5],  // B4  rẹ́
    [587.33, 2.0],  // D5  o    (high, stretched)
    [392.00, 2.0],  // G4  Èèè
    [0,      0.5],
    [440.00, 0.5],  // A4  Mẹ́
    [493.88, 0.5],  // B4  tà
    [440.00, 0.5],  // A4  mẹ́
    [493.88, 0.5],  // B4  tà
    [440.00, 0.5],  // A4  lọ́
    [493.88, 0.5],  // B4  rẹ́
    [587.33, 2.0],  // D5  o
    [392.00, 2.0],  // G4  Èèè
    [0,      0.5],

    // ── Verse: "Ọ̀kan ni ń wà sùn lélẹ̀ ni, Èèè" (L-tones, lower register) ──
    [392.00, 0.5],  // G4  Ọ̀   (low)
    [440.00, 0.5],  // A4  kan  (mid)
    [392.00, 0.5],  // G4  ni   (low)
    [440.00, 0.5],  // A4  ń    (mid)
    [392.00, 0.5],  // G4  wà   (low)
    [392.00, 0.5],  // G4  sùn  (low)
    [493.88, 0.5],  // B4  lé   (high)
    [392.00, 0.5],  // G4  lẹ̀  (low)
    [440.00, 1.0],  // A4  ni   (mid, held)
    [349.23, 2.0],  // F4  Èèè  (settling low)
    [0,      0.5],

    // ── Verse 2: "Ọ̀kan ni ń wà sùn nílé, Èèè" ──
    [392.00, 0.5],  // G4  Ọ̀
    [440.00, 0.5],  // A4  kan
    [392.00, 0.5],  // G4  ni
    [440.00, 0.5],  // A4  ń
    [392.00, 0.5],  // G4  wà
    [392.00, 0.5],  // G4  sùn
    [493.88, 0.5],  // B4  ní   (high)
    [440.00, 1.0],  // A4  lé   (mid held)
    [349.23, 2.0],  // F4  Èèè
    [0,      0.5],

    // ── Closing: "Yé ẹ̀yẹ o lọ́rẹ́ o, Èèè" ──
    [493.88, 0.5],  // B4  Yé   (high)
    [392.00, 0.5],  // G4  ẹ̀   (low)
    [440.00, 0.5],  // A4  yẹ   (mid)
    [587.33, 2.0],  // D5  o    (high, stretched)
    [440.00, 0.5],  // A4  lọ́
    [493.88, 0.5],  // B4  rẹ́
    [587.33, 2.0],  // D5  o    (high, stretched)
    [392.00, 2.5],  // G4  Èèè  (long settle)

    // ── Rest before loop ──
    [0,      2.0],
  ];

  let folkTimer   = null;
  let folkNoteIdx = 0;
  let folkNextAt  = 0;

  function folkNote(freq, dur, at) {
    if (muted || freq === 0) return; // 0 = rest, skip
    const c = getCtx();
    const sustain = dur * FOLK_BEAT * 0.72;
    const release = dur * FOLK_BEAT * 0.22;
    const end     = at + sustain + release;

    // ── Flute timbre ─────────────────────────────────────────────
    // Sine wave with gentle vibrato — warm, breathy flute character
    const osc  = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Gentle vibrato
    const lfo     = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 5.2;
    lfoGain.gain.value  = freq * 0.007;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Soft breath attack
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.10, at + 0.06);
    gain.gain.setValueAtTime(0.10, at + sustain);
    gain.gain.exponentialRampToValueAtTime(0.001, end);

    osc.connect(gain);
    gain.connect(c.destination);

    lfo.start(at); osc.start(at);
    lfo.stop(end + 0.05);
    osc.stop(end + 0.05);
  }

  function folkTick() {
    if (muted || !folkTimer) return;
    const c = getCtx();
    if (folkNextAt < c.currentTime + 0.05) folkNextAt = c.currentTime + 0.05;
    // Schedule up to 1.5 s ahead
    while (folkNextAt < c.currentTime + 1.5) {
      const [freq, dur] = FOLK_NOTES[folkNoteIdx % FOLK_NOTES.length];
      folkNote(freq, dur, folkNextAt);
      folkNextAt += dur * FOLK_BEAT;
      folkNoteIdx++;
    }
  }

  function folkMelodyStart() {
    if (folkTimer) return;
    folkNoteIdx = 0; folkNextAt = 0;
    folkTick();
    folkTimer = setInterval(folkTick, 300);
  }

  function folkMelodyStop() {
    if (folkTimer) { clearInterval(folkTimer); folkTimer = null; }
  }

  return { select, sow, capture, win, lose, titleUnlock, toggleMute, isMuted, ambientStart, ambientStop, folkMelodyStart, folkMelodyStop };
})();
