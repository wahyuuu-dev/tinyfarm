import { CFG } from '../data/config.js';

// Skala dari ukuran area (piksel perangkat): bilangan bulat agar piksel tajam;
// hanya bila area lebih kecil dari 480x270 dipakai skala pecahan supaya tetap muat.
export function calcScale(vw, vh) {
  const e = Math.min(vw / CFG.W, vh / CFG.H);
  return e >= 1 ? Math.floor(e) : Math.max(e, 0.25);
}

// Canvas internal 480x270, diskalakan dengan bilangan bulat agar piksel tajam.
export class Renderer {
  constructor(canvas, stage) {
    this.canvas = canvas; this.stage = stage;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.scale = 1;
    this.resize();
    addEventListener('resize', () => this.resize());
    addEventListener('orientationchange', () => setTimeout(() => this.resize(), 200));
    if (window.ResizeObserver) new ResizeObserver(() => this.resize()).observe(stage);
  }
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const vw = this.stage.clientWidth * dpr, vh = this.stage.clientHeight * dpr;
    const s = calcScale(vw, vh), cw = Math.round(CFG.W * s), ch = Math.round(CFG.H * s);
    if (this.canvas.width === cw && this.canvas.height === ch) return;
    this.scale = cw / CFG.W;
    this.canvas.width = cw; this.canvas.height = ch;
    this.canvas.style.width = (cw / dpr) + 'px';
    this.canvas.style.height = (ch / dpr) + 'px';
  }
  begin() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }
  toLogical(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * CFG.W, y: (e.clientY - r.top) / r.height * CFG.H };
  }
}
