// Audio sintetis lewat Web Audio API. Tidak memakai file audio sama sekali.
const DAY = [262, 294, 330, 392, 440, 523, 587, 659];     // pentatonik mayor
const NIGHT = [220, 262, 294, 330, 392, 440, 523];        // pentatonik minor

export class AudioSys {
  constructor() { this.ctx = null; this.sfxOn = true; this.musicOn = true; this.mood = 'day'; this.timer = 0; this.idx = 3; this.beat = 0; }

  // Harus dipanggil dari tindakan pengguna (sentuh/klik/tombol) agar browser mengizinkan suara.
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { return; }
      const c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = 0.7; this.master.connect(c.destination);
      this.sfx = c.createGain(); this.sfx.connect(this.master);
      this.mus = c.createGain(); this.mus.connect(this.master);
      this.applyVolumes();
      this.noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.startMusic();
  }
  applyVolumes() { this.sfx.gain.value = this.sfxOn ? 0.5 : 0; this.mus.gain.value = this.musicOn ? 0.4 : 0; }
  setSfx(on) { this.sfxOn = on; if (this.ctx) this.applyVolumes(); }
  setMusic(on) { this.musicOn = on; if (this.ctx) { this.applyVolumes(); if (on) this.startMusic(); } }
  setMood(m) { this.mood = m; }
  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend(); }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }

  tone(f, dur, o = {}) {
    const c = this.ctx, t = c.currentTime + (o.delay || 0), osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(f, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f + o.slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.out || this.sfx);
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  noise(dur, o = {}) {
    const c = this.ctx, t = c.currentTime + (o.delay || 0), src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = this.noiseBuf; f.type = o.type || 'lowpass'; f.frequency.value = o.freq || 1000;
    g.gain.setValueAtTime(o.vol || 0.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.sfx);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }

  play(n) {
    if (!this.ctx || !this.sfxOn) return;
    const seq = (notes, dur, o) => notes.forEach((f, i) => this.tone(f, dur, { ...o, delay: i * (o.gap || 0.1) }));
    switch (n) {
      case 'click': this.tone(660, 0.05, { vol: 0.15 }); break;
      case 'step': this.noise(0.05, { vol: 0.06, freq: 700 }); break;
      case 'till': this.noise(0.14, { vol: 0.3, freq: 500 }); this.tone(130, 0.12, { type: 'sine', vol: 0.3, slide: -50 }); break;
      case 'plant': seq([520, 700], 0.09, { type: 'triangle', vol: 0.25, gap: 0.07 }); break;
      case 'water': this.noise(0.3, { vol: 0.2, freq: 2500, type: 'highpass' }); this.tone(700, 0.2, { type: 'sine', vol: 0.12, slide: 500 }); break;
      case 'harvest': seq([523, 659, 784], 0.12, { type: 'triangle', vol: 0.3, gap: 0.07 }); break;
      case 'coin': seq([988, 1319], 0.12, { vol: 0.18, gap: 0.07 }); break;
      case 'buy': seq([440, 330], 0.1, { type: 'triangle', vol: 0.25, gap: 0.08 }); break;
      case 'grow': seq([660, 880], 0.18, { type: 'sine', vol: 0.2, gap: 0.12 }); break;
      case 'error': this.tone(180, 0.15, { type: 'sawtooth', vol: 0.15, slide: -40 }); break;
      case 'sleep': seq([392, 330, 262], 0.4, { type: 'sine', vol: 0.25, gap: 0.3 }); break;
      case 'faint': this.tone(300, 0.6, { type: 'sawtooth', vol: 0.18, slide: -240 }); break;
      case 'levelup': seq([523, 659, 784, 1047], 0.18, { type: 'triangle', vol: 0.3 }); break;
      case 'win': seq([523, 523, 659, 784, 659, 784, 1047], 0.2, { vol: 0.18, gap: 0.14 }); break;
      case 'lose': seq([392, 349, 330, 262], 0.35, { type: 'triangle', vol: 0.28, gap: 0.25 }); break;
    }
  }

  // Musik latar acak yang lembut; siang lebih ceria, malam lebih pelan dan tenang.
  startMusic() {
    if (this.timer || !this.musicOn || !this.ctx) return;
    const tick = () => {
      this.timer = 0;
      if (!this.musicOn || !this.ctx) return;
      const night = this.mood === 'night', scale = night ? NIGHT : DAY;
      if (this.ctx.state === 'running') {
        if (Math.random() > 0.3) {
          this.idx = Math.max(0, Math.min(scale.length - 1, this.idx + Math.floor(Math.random() * 3) - 1));
          this.tone(scale[this.idx], 0.9, { type: 'triangle', vol: 0.07, out: this.mus });
        }
        if (this.beat % 8 === 0) {
          const root = night ? 110 : 131;
          this.tone(root, 3.5, { type: 'sine', vol: 0.06, out: this.mus });
          this.tone(root * 1.5, 3.5, { type: 'sine', vol: 0.04, out: this.mus });
        }
        this.beat++;
      }
      this.timer = setTimeout(tick, night ? 720 : 480);
    };
    tick();
  }
}
