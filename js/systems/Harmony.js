import { HARMONY } from '../data/config.js';
import { SPR } from '../world/Sprites.js';

export const LEVEL_NAMES = ['', 'Rintisan', 'Mekar', 'Harmonis'];
const GOOD = [['carrot', 'tomato'], ['tomato', 'wheat']];
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const COLORS = ['#e8873a', '#6cb8e6', '#fffdf5', '#f08aa8'];

export const isGoodPair = (a, b) => GOOD.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
export function neighborCrops(plots, tx, ty) {
  const out = [];
  for (const [dx, dy] of DIRS) { const p = plots.get((tx + dx) + ',' + (ty + dy)); if (p && p.crop) out.push(p.crop); }
  return out;
}
// Aturan 1: tetangga baik membuat tanaman tumbuh lebih cepat.
export const hasGoodNeighbor = (plots, tx, ty, crop) => neighborCrops(plots, tx, ty).some((n) => isGoodPair(crop, n));
// Aturan 2: Daisy di sebelah tanaman lain menaikkan harga jual tanaman itu.
export const hasDaisyNeighbor = (plots, tx, ty, crop) => crop !== 'daisy' && neighborCrops(plots, tx, ty).includes('daisy');

// Aturan 3: level Harmoni dari jumlah pasangan, plus kupu-kupu, kunang-kunang, dan bunga liar.
export class Harmony {
  constructor() { this.reset(); }
  reset() { this.level = 1; this.pairs = 0; this.daisyTiles = []; this.flyers = []; this.fireflies = []; this.acc = 0; this.t = 0; }

  recalc(plots) {
    let pairs = 0; const dt = [];
    for (const [k, p] of plots) {
      if (!p.crop) continue;
      const [tx, ty] = k.split(',').map(Number);
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        const q = plots.get((tx + dx) + ',' + (ty + dy));
        if (q && q.crop && (isGoodPair(p.crop, q.crop) || (p.crop === 'daisy') !== (q.crop === 'daisy'))) pairs++;
      }
      if (p.crop === 'daisy' && neighborCrops(plots, tx, ty).some((n) => n !== 'daisy')) dt.push({ tx, ty });
    }
    this.pairs = pairs; this.daisyTiles = dt;
    this.level = pairs >= HARMONY.level3 ? 3 : pairs >= HARMONY.level2 ? 2 : 1;
  }

  // Mengembalikan level baru bila level naik, selain itu 0.
  update(dt, farming, minutes) {
    this.t += dt; this.acc += dt;
    let up = 0;
    if (this.acc >= 0.5) {
      this.acc = 0; const old = this.level;
      this.recalc(farming.plots);
      if (this.level > old) up = this.level;
    }
    this.moveFlyers(dt, minutes);
    return up;
  }

  home() {
    if (this.daisyTiles.length) {
      const d = this.daisyTiles[Math.floor(Math.random() * this.daisyTiles.length)];
      return { x: d.tx * 16 + 8, y: d.ty * 16 + 8 };
    }
    return { x: 20 * 16, y: 19 * 16 };
  }
  moveFlyers(dt, minutes) {
    const want = Math.min(8, this.daisyTiles.length * 2) + (this.level >= 2 ? 2 : 0);
    while (this.flyers.length < want) {
      const h = this.home();
      this.flyers.push({ x: h.x, y: h.y, tx: h.x, ty: h.y, ph: Math.random() * 6, timer: 0, col: COLORS[Math.floor(Math.random() * COLORS.length)] });
    }
    this.flyers.length = Math.min(this.flyers.length, want);
    for (const f of this.flyers) {
      if ((f.timer -= dt) <= 0) { const h = this.home(); f.tx = h.x + (Math.random() - 0.5) * 48; f.ty = h.y + (Math.random() - 0.5) * 40; f.timer = 1.5 + Math.random() * 2; }
      f.x += ((f.tx - f.x) * 0.9 + Math.cos(this.t * 3 + f.ph) * 14) * dt;
      f.y += ((f.ty - f.y) * 0.9 + Math.sin(this.t * 4 + f.ph) * 14) * dt;
    }
    const wantFire = this.level >= 3 ? 14 : 0;
    while (this.fireflies.length < wantFire)
      this.fireflies.push({ x: 192 + Math.random() * 240, y: 224 + Math.random() * 160, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, ph: Math.random() * 6 });
    this.fireflies.length = Math.min(this.fireflies.length, wantFire);
    for (const f of this.fireflies) {
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.x < 192 || f.x > 432) f.vx = -f.vx;
      if (f.y < 224 || f.y > 384) f.vy = -f.vy;
    }
  }

  // Bunga liar di rumput mulai level 2 (lebih banyak di level 3).
  drawGround(g, x0, y0, x1, y1, world) {
    if (this.level < 2) return;
    const mod = this.level >= 3 ? 4 : 7;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
      if ((x * 13 + y * 7) % mod === 0 && world.kindAt(x, y) === 'grass') g.drawImage(SPR.wild[(x + y) % 3], x * 16, y * 16);
  }

  drawFlyers(g, cam, minutes) {
    if (!this.flyers.length && !this.fireflies.length) return;
    g.save(); g.translate(-Math.round(cam.x), -Math.round(cam.y));
    if (minutes < 1140) {
      for (const f of this.flyers) {
        const up = Math.floor(this.t * 10 + f.ph) % 2, x = Math.round(f.x), y = Math.round(f.y), h = up ? 3 : 2;
        g.fillStyle = f.col; g.fillRect(x - 3, y - h + 1, 3, h); g.fillRect(x + 1, y - h + 1, 3, h);
        g.fillStyle = '#2b2118'; g.fillRect(x, y - 1, 1, 3);
      }
    }
    if (minutes >= 1080) {
      const night = Math.min(1, (minutes - 1080) / 120);
      for (const f of this.fireflies) {
        const b = 0.5 + 0.5 * Math.sin(this.t * 3 + f.ph), x = Math.round(f.x), y = Math.round(f.y);
        g.fillStyle = '#f6e27a';
        g.globalAlpha = night * 0.25 * b; g.fillRect(x - 1, y - 1, 4, 4);
        g.globalAlpha = night * (0.4 + 0.6 * b); g.fillRect(x, y, 2, 2);
      }
      g.globalAlpha = 1;
    }
    g.restore();
  }
}
