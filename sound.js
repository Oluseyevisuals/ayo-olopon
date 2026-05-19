// ── sound.js — Ayo Olopon Sound Effects ───────────────────────────────

const SFX = (() => {
  let muted = false;

  // ── Audio file loader ────────────────────────────────────────────────
  function mkAudio(src, loop, vol) {
    const a = new Audio(src);
    a.loop   = !!loop;
    a.volume = vol !== undefined ? vol : 1;
    return a;
  }

  const A = {
    sow:     mkAudio('sow.mp3',      false, 0.8),
    capture: mkAudio('capture.mp3',  false, 0.9),
    win:     mkAudio('win.mp3',      false, 1.0),
    lose:    mkAudio('lose.mp3',     false, 1.0),
    hint:    mkAudio('hint.mp3',     false, 0.7),
    bg:      mkAudio('bg-music.mp3', true,  0.4),
    title:   mkAudio('title.mp3',    true,  0.5),
  };

  function play(a) {
    if (muted) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  // ── Lightweight Web Audio tap for pit selection ──────────────────────
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function select() {
    if (muted) return;
    const c = getCtx(), t = c.currentTime;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 600;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + 0.09);
  }

  // ── Public API ───────────────────────────────────────────────────────

  function sow()     { play(A.sow); }
  function capture() { play(A.capture); }
  function win()     { play(A.win); }
  function lose()    { play(A.lose); }
  function hint()    { play(A.hint); }

  function titleUnlock() { play(A.win); }

  // Background music during gameplay
  function ambientStart() {
    A.title.pause();
    if (!muted) A.bg.play().catch(() => {});
  }

  function ambientStop() {
    A.bg.pause();
    A.bg.currentTime = 0;
  }

  // Title screen music
  function titleStart() {
    A.bg.pause();
    if (!muted) A.title.play().catch(() => {});
  }

  function titleStop() {
    A.title.pause();
    A.title.currentTime = 0;
  }

  function toggleMute() {
    muted = !muted;
    if (muted) { A.bg.pause(); A.title.pause(); }
    else { }
    return muted;
  }

  function isMuted() { return muted; }

  return {
    select, sow, capture, win, lose, hint,
    titleUnlock, toggleMute, isMuted,
    ambientStart, ambientStop, titleStart, titleStop
  };
})();
