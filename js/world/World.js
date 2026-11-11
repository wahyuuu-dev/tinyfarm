import { CFG } from '../data/config.js';
import { SPR } from './Sprites.js';

const T = CFG.TILE;
const GRASS = 0, DIRT = 3, PATH = 4, WATER = 5;
const HOUSE = { x: 18, y: 8, w: 3, h: 3 };
const PLOT = { x1: 14, y1: 17, x2: 25, y2: 22 };

function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296; }

export class World {
  constructor() {
    this.w = CFG.MAP_W; this.h = CFG.MAP_H;
    this.tiles = new Uint8Array(this.w * this.h);
    this.objects = [];
    this.lush = false;
    this.cache = [null, null];
    this.generate();
    this.buildCollision();
  }
  at(x, y) { return this.tiles[y * this.w + x]; }
  set(x, y, id) { this.tiles[y * this.w + x] = id; }
  generate() {
    const r = rng(7);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const h = (x * 7 + y * 13) % 11;
      this.set(x, y, h === 0 ? 2 : (x * 3 + y * 5) % 4 === 0 ? 1 : GRASS);
    }
    for (let y = PLOT.y1; y <= PLOT.y2; y++) for (let x = PLOT.x1; x <= PLOT.x2; x++) this.set(x, y, DIRT);
    for (let y = HOUSE.y + HOUSE.h; y < PLOT.y1; y++) this.set(19, y, PATH);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++)
      if (((x - 31) / 4.5) ** 2 + ((y - 20) / 3.2) ** 2 < 1) this.set(x, y, WATER);

    for (let x = PLOT.x1 - 1; x <= PLOT.x2 + 1; x++) for (const y of [PLOT.y1 - 1, PLOT.y2 + 1])
      if (!(y === PLOT.y1 - 1 && (x === 19 || x === 20))) this.objects.push({ k: 'fenceH', x, y });
    for (let y = PLOT.y1; y <= PLOT.y2; y++) for (const x of [PLOT.x1 - 1, PLOT.x2 + 1]) this.objects.push({ k: 'fenceV', x, y });
    this.objects.push({ k: 'house', x: HOUSE.x, y: HOUSE.y });
    this.objects.push({ k: 'shop', x: 22, y: 12 });

    const free = (x, y) => {
      if (x >= HOUSE.x - 2 && x <= HOUSE.x + HOUSE.w + 1 && y >= HOUSE.y - 2 && y <= HOUSE.y + HOUSE.h + 5) return false;
      if (x >= 21 && x <= 26 && y >= 10 && y <= 15) return false;
      if (x >= PLOT.x1 - 3 && x <= PLOT.x2 + 3 && y >= PLOT.y1 - 3 && y <= PLOT.y2 + 3) return false;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < this.w && ny < this.h && this.at(nx, ny) === WATER) return false;
      }
      return true;
    };
    const trees = [];
    const tryTree = (x, y) => {
      if (!free(x, y) || trees.some((t) => Math.abs(t.x - x) < 2 && Math.abs(t.y - y) < 2)) return;
      const t = { k: 'tree', x, y }; trees.push(t); this.objects.push(t);
    };
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++)
      if ((x < 2 || x >= this.w - 2 || y < 2 || y >= this.h - 2) && r() < 0.6) tryTree(x, y);
    for (let i = 0; i < 40; i++) tryTree(Math.floor(r() * this.w), Math.floor(r() * this.h));
  }
  // Lapisan tanah/rumput digambar sekali ke satu kanvas, lalu disalin per frame (jauh lebih sedikit panggilan gambar).
  groundCache(lush) {
    const i = lush ? 1 : 0;
    if (!this.cache[i]) {
      const c = document.createElement('canvas'); c.width = this.w * T; c.height = this.h * T;
      const g = c.getContext('2d');
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        const id = this.at(x, y);
        if (id !== WATER) g.drawImage(lush && id < 3 ? SPR.lush[id] : SPR.tiles[id], x * T, y * T);
      }
      this.cache[i] = c;
    }
    return this.cache[i];
  }
  buildCollision() {
    this.solids = []; this.objAt = new Map();
    const mark = (tx, ty, k) => this.objAt.set(ty * this.w + tx, k);
    for (const o of this.objects) {
      const px = o.x * T, py = o.y * T;
      if (o.k === 'tree') { this.solids.push({ x: px + 5, y: py + 6, w: 6, h: 9 }); mark(o.x, o.y, 'tree'); }
      else if (o.k === 'house') {
        this.solids.push({ x: px + 4, y: py + 22, w: 40, h: 26 });
        for (let dy = 0; dy < HOUSE.h; dy++) for (let dx = 0; dx < HOUSE.w; dx++) mark(o.x + dx, o.y + dy, 'house');
      } else if (o.k === 'shop') {
        this.solids.push({ x: px + 2, y: py + 12, w: 28, h: 20 });
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) mark(o.x + dx, o.y + dy, 'shop');
      } else if (o.k === 'fenceH') { this.solids.push({ x: px, y: py + 8, w: 16, h: 8 }); mark(o.x, o.y, 'fence'); }
      else { this.solids.push({ x: px + 5, y: py, w: 6, h: 16 }); mark(o.x, o.y, 'fence'); }
    }
  }
  // Apakah kotak (x,y,w,h) dalam piksel menabrak air, objek, atau batas peta?
  isBlocked(x, y, w, h) {
    if (x < 0 || y < 0 || x + w > this.w * T || y + h > this.h * T) return true;
    for (let ty = Math.floor(y / T); ty <= Math.floor((y + h - 1) / T); ty++)
      for (let tx = Math.floor(x / T); tx <= Math.floor((x + w - 1) / T); tx++)
        if (this.at(tx, ty) === WATER) return true;
    for (const s of this.solids) if (x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y) return true;
    return false;
  }
  kindAt(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return null;
    const o = this.objAt.get(ty * this.w + tx);
    if (o) return o;
    const id = this.at(tx, ty);
    return id === WATER ? 'water' : id === PATH ? 'path' : id === DIRT ? 'soil' : 'grass';
  }
  sortY(o) { return o.k === 'house' ? (o.y + HOUSE.h) * T : o.k === 'shop' ? (o.y + 2) * T : o.y * T + T; }

  // extras: [{y, draw(ctx)}] digambar bersama objek dunia agar urutan depan-belakang benar.
  draw(ctx, cam, clock, extras, ground) {
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    ctx.save(); ctx.translate(-cx, -cy);
    const x0 = Math.max(0, Math.floor(cx / T)), x1 = Math.min(this.w - 1, Math.ceil((cx + CFG.W) / T));
    const y0 = Math.max(0, Math.floor(cy / T)), y1 = Math.min(this.h - 1, Math.ceil((cy + CFG.H) / T));
    const wf = Math.floor(clock * 2) % 2;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++)
      if (this.at(x, y) === WATER) ctx.drawImage(SPR.water[wf], x * T, y * T);
    ctx.drawImage(this.groundCache(this.lush), cx, cy, CFG.W, CFG.H, cx, cy, CFG.W, CFG.H);
    if (ground) ground(ctx, x0, y0, x1, y1);
    const list = [];
    for (const o of this.objects) {
      const px = o.x * T, py = o.y * T;
      if (px < cx - 56 || px > cx + CFG.W + 56 || py < cy - 56 || py > cy + CFG.H + 56) continue;
      list.push({ y: this.sortY(o), draw: (c) => this.drawObject(c, o) });
    }
    for (const e of extras) list.push(e);
    list.sort((a, b) => a.y - b.y);
    for (const d of list) d.draw(ctx);
    ctx.restore();
  }
  drawObject(c, o) {
    const px = o.x * T, py = o.y * T;
    if (o.k === 'tree') c.drawImage(SPR.tree, px - 8, py - 24);
    else if (o.k === 'house') c.drawImage(SPR.house, px, py);
    else if (o.k === 'shop') c.drawImage(SPR.shop, px, py);
    else c.drawImage(o.k === 'fenceH' ? SPR.fenceH : SPR.fenceV, px, py);
  }
}
