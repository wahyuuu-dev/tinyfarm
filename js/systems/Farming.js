import { CROPS } from '../data/crops.js';
import { COST } from '../data/config.js';
import { SPR } from '../world/Sprites.js';
import { HARMONY } from '../data/config.js';
import { hasGoodNeighbor, hasDaisyNeighbor } from './Harmony.js';

const key = (x, y) => x + ',' + y;

// Petak lahan: { crop, growth (hari tumbuh), watered }. Petak ada di Map hanya jika sudah dicangkul.
export class Farming {
  constructor() { this.plots = new Map(); }
  reset() { this.plots.clear(); }
  get(tx, ty) { return this.plots.get(key(tx, ty)); }

  // 0 benih, 1 tunas, 2 muda, 3 siap panen, -1 tidak ada tanaman.
  stageOf(p) {
    if (!p || !p.crop) return -1;
    const r = p.growth / CROPS[p.crop].days;
    return r >= 1 ? 3 : r >= 0.5 ? 2 : r > 0 ? 1 : 0;
  }

  // Menjalankan alat terpilih pada petak. Panen punya prioritas bila tanaman siap.
  apply(item, tx, ty, inv) {
    const p = this.get(tx, ty), no = (msg) => ({ ok: false, msg });
    if (this.stageOf(p) === 3) {
      const id = p.crop, fine = hasDaisyNeighbor(this.plots, tx, ty, id);
      p.crop = null; p.growth = 0; p.watered = false;
      inv.add((fine ? 'fine_' : 'crop_') + id);
      return { ok: true, msg: 'Panen ' + CROPS[id].name + (fine ? ' Harmoni' : '') + '! +1', energy: COST.harvest, kind: 'harvest', crop: id, fine };
    }
    if (item.id === 'hoe') {
      if (p) return no(p.crop ? 'Ada tanaman di sini.' : 'Tanah sudah dicangkul.');
      this.plots.set(key(tx, ty), { tx, ty, crop: null, growth: 0, watered: false });
      return { ok: true, msg: 'Tanah dicangkul.', energy: COST.till, kind: 'till' };
    }
    if (item.icon === 'seed') {
      if (!p) return no('Cangkul tanah dulu.');
      if (p.crop) return no('Sudah ada tanaman.');
      if (!inv.remove(item.id)) return no('Benih habis.');
      p.crop = item.crop; p.growth = 0; p.watered = false;
      return { ok: true, msg: 'Menanam ' + CROPS[item.crop].name + '.', energy: COST.plant, kind: 'plant' };
    }
    if (item.id === 'can') {
      if (!p || !p.crop) return no('Tidak ada tanaman untuk disiram.');
      if (p.watered) return no('Sudah disiram hari ini.');
      p.watered = true;
      return { ok: true, msg: 'Tanaman disiram.', energy: COST.water, kind: 'water' };
    }
    return no('Alat ini belum bisa dipakai di sini.');
  }

  // Pergantian hari: hanya tanaman yang disiram yang tumbuh, lalu tanah mengering.
  // Mengembalikan daftar petak yang tahap tumbuhnya naik (untuk efek kilau).
  nextDay() {
    const grown = [];
    for (const [k, p] of this.plots) {
      if (p.crop && p.watered && p.growth < CROPS[p.crop].days) {
        const [tx, ty] = k.split(',').map(Number), before = this.stageOf(p);
        p.growth += hasGoodNeighbor(this.plots, tx, ty, p.crop) ? HARMONY.growthBonus : 1;
        if (this.stageOf(p) !== before) grown.push({ tx, ty, ready: this.stageOf(p) === 3 });
      }
      p.watered = false;
    }
    return grown;
  }
  hasSellableCrop() {
    for (const p of this.plots.values()) if (p.crop && CROPS[p.crop].sellPrice > 0) return true;
    return false;
  }

  drawGround(g, x0, y0, x1, y1) {
    for (const p of this.plots.values()) {
      const { tx, ty } = p;
      if (tx < x0 || tx > x1 || ty < y0 || ty > y1) continue;
      g.drawImage(p.watered ? SPR.tilledWet : SPR.tilled, tx * 16, ty * 16);
      if (p.crop) g.drawImage(SPR.crops[p.crop][this.stageOf(p)], tx * 16, ty * 16);
    }
  }
}
