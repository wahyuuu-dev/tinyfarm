import { PAL } from '../data/config.js';

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mk(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d')); return c;
}
const R = (g, col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

function grass(v, lush = false) {
  const base = lush ? '#68be50' : PAL.green, dark = lush ? '#4a9a40' : PAL.greenDark, light = lush ? '#8ad868' : PAL.greenLight;
  return mk(16, 16, (g) => {
    R(g, base, 0, 0, 16, 16);
    const r = rng(v + 11);
    for (let i = 0; i < 12; i++) R(g, dark, Math.floor(r() * 15), Math.floor(r() * 14), 1, 2);
    for (let i = 0; i < 8; i++) R(g, light, Math.floor(r() * 15), Math.floor(r() * 15), 2, 1);
    if (v === 2) {
      const x = 3 + Math.floor(r() * 9), y = 3 + Math.floor(r() * 9);
      R(g, PAL.cream, x, y - 1, 1, 3); R(g, PAL.cream, x - 1, y, 3, 1); R(g, PAL.orange, x, y, 1, 1);
    }
  });
}
function speckled(base, dark, light, seed) {
  return mk(16, 16, (g) => {
    R(g, base, 0, 0, 16, 16);
    const r = rng(seed);
    for (let i = 0; i < 14; i++) R(g, dark, Math.floor(r() * 14), Math.floor(r() * 15), 2, 1);
    for (let i = 0; i < 8; i++) R(g, light, Math.floor(r() * 15), Math.floor(r() * 15), 1, 1);
  });
}
function water(f) {
  return mk(16, 16, (g) => {
    R(g, '#4f9fd6', 0, 0, 16, 16);
    for (let k = 0; k < 4; k++) R(g, '#8fd0f2', (k * 5 + f * 4) % 13, (k * 4 + 2) % 15, 3, 1);
  });
}
function tree() {
  return mk(32, 40, (g) => {
    R(g, 'rgba(0,0,0,.2)', 7, 36, 18, 3);
    R(g, PAL.brown, 13, 26, 6, 13); R(g, PAL.brownDark, 16, 26, 3, 13);
    const r = rng(5);
    for (let y = 0; y < 30; y++) for (let x = 0; x < 32; x++) {
      const d = ((x - 16) / 15) ** 2 + ((y - 15) / 14) ** 2;
      if (d >= 1) continue;
      let c = d > 0.8 ? '#173d2c' : d > 0.55 ? '#235a3c' : '#2e7048'; // tepi gelap, badan hijau tua
      if (d < 0.6 && x < 15 && y < 13) c = '#3f8a58';
      const n = r();
      if (d <= 0.8 && n < 0.08) c = '#173d2c'; else if (d <= 0.8 && n > 0.93) c = '#56a46c';
      R(g, c, x, y, 1, 1);
    }
  });
}
function shop() {
  return mk(32, 32, (g) => {
    R(g, 'rgba(0,0,0,.2)', 1, 29, 30, 3);
    R(g, PAL.brown, 2, 10, 2, 20); R(g, PAL.brown, 28, 10, 2, 20);
    for (let x = 0; x < 32; x++) {
      const c = Math.floor(x / 4) % 2 ? PAL.cream : PAL.orange;
      R(g, c, x, 2, 1, 9); if (x % 4 < 2) R(g, c, x, 11, 1, 1);
    }
    R(g, PAL.ink, 0, 1, 32, 1);
    R(g, PAL.brownLight, 1, 20, 30, 4); R(g, PAL.brown, 1, 24, 30, 6); R(g, PAL.brownDark, 1, 24, 30, 1);
    R(g, PAL.orange, 6, 16, 3, 4); R(g, PAL.green, 6, 15, 3, 1);
    R(g, '#d94a3a', 14, 17, 4, 3); R(g, '#d94a3a', 18, 18, 3, 2);
    R(g, '#d9b84a', 23, 15, 1, 5); R(g, '#d9b84a', 25, 16, 1, 4); R(g, '#f0d070', 22, 14, 5, 2);
  });
}
function house() {
  return mk(48, 48, (g) => {
    R(g, PAL.creamDark, 4, 22, 40, 26); R(g, '#a89c86', 4, 40, 40, 8);
    R(g, '#8a8f98', 34, 2, 6, 10);
    for (let r = 0; r < 18; r++) {
      const half = Math.min(24, 10 + r * 1.9);
      R(g, r % 4 === 3 ? '#d9783a' : '#c25e2e', Math.round(24 - half), 4 + r, Math.round(half * 2), 1);
    }
    R(g, PAL.brownDark, 2, 20, 44, 3);
    R(g, PAL.brown, 20, 32, 9, 16); R(g, PAL.orange, 26, 40, 1, 2);
    for (const wx of [8, 33]) {
      R(g, PAL.brownDark, wx - 1, 27, 10, 10); R(g, PAL.sky, wx, 28, 8, 8);
      R(g, PAL.cream, wx + 3, 28, 1, 8); R(g, PAL.cream, wx, 31, 8, 1);
    }
  });
}
function fence(vertical) {
  return mk(16, 16, (g) => {
    if (vertical) { R(g, PAL.brownLight, 6, 0, 4, 16); R(g, PAL.brown, 6, 0, 1, 16); R(g, PAL.brownDark, 5, 6, 6, 3); return; }
    R(g, PAL.brownLight, 0, 8, 16, 2); R(g, PAL.brownLight, 0, 12, 16, 2);
    R(g, PAL.brown, 1, 6, 3, 10); R(g, PAL.brown, 12, 6, 3, 10);
  });
}

export const SPR = {
  tiles: [grass(0), grass(1), grass(2), speckled('#8a5a34', PAL.brownDark, PAL.brownLight, 21), speckled('#cfae72', '#b8955a', '#e0c590', 33)],
  water: [water(0), water(1)],
  tree: tree(), house: house(), shop: shop(), fenceH: fence(false), fenceV: fence(true),
};

function tilled(wet) {
  return mk(16, 16, (g) => {
    R(g, wet ? '#52331c' : '#6e4426', 0, 0, 16, 16);
    for (const y of [2, 7, 12]) { R(g, wet ? '#3a2312' : '#4f2f18', 0, y, 16, 2); R(g, wet ? '#6b4a30' : '#8a5a34', 0, y + 2, 16, 1); }
    if (wet) for (const [x, y] of [[3, 5], [10, 4], [6, 10], [13, 9], [2, 14]]) R(g, '#4f7fa6', x, y, 2, 1);
  });
}
// Tahap tanaman: 0 benih, 1 tunas, 2 muda, 3 siap panen.
function cropSprite(id, st) {
  return mk(16, 16, (g) => {
    const G = PAL.green, GD = PAL.greenDark, GL = PAL.greenLight;
    if (st === 0) { R(g, '#e3d3a8', 6, 11, 2, 1); R(g, '#e3d3a8', 9, 12, 2, 1); return; }
    if (st === 1) { R(g, G, 7, 8, 2, 6); R(g, GL, 5, 7, 3, 2); R(g, GL, 8, 6, 3, 2); return; }
    if (id === 'carrot') {
      if (st === 2) { R(g, G, 6, 5, 1, 9); R(g, GL, 8, 4, 1, 10); R(g, G, 10, 6, 1, 8); R(g, GD, 5, 10, 6, 1); }
      else { R(g, G, 5, 2, 1, 8); R(g, GL, 7, 1, 1, 9); R(g, G, 9, 2, 1, 8); R(g, GL, 11, 3, 1, 7); R(g, PAL.orange, 6, 10, 5, 3); R(g, '#c96a24', 7, 13, 3, 2); }
    } else if (id === 'wheat') {
      for (const x of [4, 7, 10]) {
        if (st === 2) R(g, '#9ccf5a', x, 5, 1, 9);
        else { R(g, '#d9b84a', x, 4, 1, 10); R(g, '#f0d070', x - 1, 1, 3, 4); }
      }
    } else if (id === 'tomato') {
      R(g, G, 7, 4, 2, 10); R(g, GD, 3, 5, 10, 6); R(g, G, 4, 4, 8, 5); R(g, GL, 5, 5, 3, 2);
      if (st === 3) { R(g, '#d94a3a', 4, 8, 3, 3); R(g, '#d94a3a', 9, 6, 3, 3); R(g, '#d94a3a', 8, 11, 3, 3); }
      else { R(g, GL, 4, 8, 2, 2); R(g, GL, 10, 7, 2, 2); }
    } else {
      R(g, G, 7, 6, 2, 8); R(g, GL, 4, 10, 3, 2); R(g, GL, 9, 9, 3, 2);
      if (st === 2) R(g, PAL.cream, 6, 3, 4, 3);
      else { R(g, '#fffdf5', 5, 2, 6, 6); R(g, '#fffdf5', 4, 4, 8, 2); R(g, '#f2c230', 7, 4, 2, 2); }
    }
  });
}
SPR.tilled = tilled(false); SPR.tilledWet = tilled(true);
SPR.crops = {};
for (const id of ['carrot', 'wheat', 'tomato', 'daisy']) SPR.crops[id] = [0, 1, 2, 3].map((s) => cropSprite(id, s));

// Karakter petani 16x16. dir: 0 bawah, 1 atas, 2 kiri, 3 kanan. step: 0 diam, 1/2 jalan.
export function drawPlayer(g, x, y, dir, step) {
  const bob = step ? -1 : 0, up = dir === 1;
  R(g, 'rgba(0,0,0,.22)', x + 3, y + 14, 10, 2);
  const l = step === 1 ? 1 : 0, r = step === 2 ? 1 : 0;
  R(g, PAL.brownDark, x + 4, y + 12 - l, 3, 3); R(g, PAL.brownDark, x + 9, y + 12 - r, 3, 3);
  R(g, '#3d7a38', x + 4, y + 8 + bob, 8, 5);
  R(g, PAL.cream, x + 4, y + 7 + bob, 8, 3);
  R(g, '#f1c9a0', x + 2, y + 8 + bob, 2, 3); R(g, '#f1c9a0', x + 12, y + 8 + bob, 2, 3);
  R(g, '#f1c9a0', x + 4, y + 2 + bob, 8, 6);
  if (up) R(g, PAL.brown, x + 4, y + 2 + bob, 8, 5);
  else {
    R(g, PAL.brown, x + 4, y + 2 + bob, 8, 2);
    const ex = dir === 0 ? [6, 9] : dir === 2 ? [5, 7] : [8, 10];
    for (const e of ex) R(g, PAL.ink, x + e, y + 5 + bob, 1, 2);
  }
  R(g, PAL.orange, x + 2, y + 2 + bob, 12, 2); R(g, '#f0a860', x + 4, y + bob, 8, 3);
}

// Rumput lebih hijau (Harmoni level 3) dan bunga liar (level 2 ke atas).
SPR.lush = [0, 1, 2].map((v) => grass(v, true));
function wildFlower(v) {
  const [c0, c1] = [['#f08aa8', '#fffdf5'], ['#fffdf5', '#f2c230'], ['#f2c230', '#e8873a']][v];
  return mk(16, 16, (g) => {
    for (const [x, y] of [[3, 4], [10, 9], [6, 12]]) { R(g, c0, x, y - 1, 1, 3); R(g, c0, x - 1, y, 3, 1); R(g, c1, x, y, 1, 1); }
  });
}
SPR.wild = [0, 1, 2].map(wildFlower);
