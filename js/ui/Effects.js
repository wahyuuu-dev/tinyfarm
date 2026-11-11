// Partikel dan teks melayang di dunia permainan.
const KINDS = {
  dirt: { n: 8, cols: ['#6e4426', '#8a5a34', '#4f2f18'], vx: 30, vy: [-70, -40], g: 160, life: 0.5, size: 2 },
  water: { n: 9, cols: ['#8fd0f2', '#4f9fd6'], vx: 14, vy: [-30, -10], g: 120, life: 0.6, size: 1 },
  dust: { n: 5, cols: ['#e3d3a8', '#c9a46a'], vx: 12, vy: [-25, -15], g: 40, life: 0.4, size: 1 },
  sparkle: { n: 8, cols: ['#fffdf5', '#f2c230', '#ffe066'], vx: 36, vy: [-36, 12], g: -10, life: 0.8, size: 1, star: true },
  grow: { n: 7, cols: ['#fffdf5', '#ffe066', '#f2c230'], vx: 14, vy: [-34, -14], g: -4, life: 1.5, size: 1, star: true },
};
const rnd = (a, b) => a + Math.random() * (b - a);

export class Effects {
  constructor() { this.reset(); }
  reset() { this.p = []; this.texts = []; this.glows = []; this.leafT = 0; this.leafN = 0; }
  burst(kind, x, y) {
    const k = KINDS[kind];
    for (let i = 0; i < k.n; i++)
      this.p.push({ x, y, vx: rnd(-k.vx, k.vx), vy: rnd(k.vy[0], k.vy[1]), g: k.g, life: k.life, max: k.life,
        col: k.cols[Math.floor(Math.random() * k.cols.length)], size: kind === 'dirt' && i % 2 ? 1 : k.size, star: !!k.star });
  }
  // Sinar berdenyut pada satu tile (tanaman tumbuh). ready = siap panen (lebih terang, keemasan).
  glow(tx, ty, ready) { this.glows.push({ x: tx * 16, y: ty * 16, life: 1.6, max: 1.6, ready }); }
  text(s, x, y, col = '#fffdf5') { this.texts.push({ s, x, y, col, life: 1.1 }); }

  // Daun yang jatuh pelan di sekitar layar (animasi lingkungan).
  ambient(cam, dt, minutes) {
    if (minutes >= 1140 || this.leafN >= 10) return;
    if ((this.leafT -= dt) > 0) return;
    this.leafT = rnd(1, 2.5); this.leafN++;
    this.p.push({ x: cam.x + rnd(0, 480), y: cam.y - 4, vx: 10, vy: 14, g: 0, life: 7, max: 7, leaf: true, size: 2,
      col: ['#3f8a58', '#56a46c', '#7cc45c'][Math.floor(Math.random() * 3)] });
  }

  update(dt) {
    const keep = []; let leaves = 0;
    for (const q of this.p) {
      if (q.leaf) q.vx = 10 + Math.sin(q.life * 3) * 12;
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.life -= dt;
      if (q.life > 0) { keep.push(q); if (q.leaf) leaves++; }
    }
    this.p = keep; this.leafN = leaves;
    for (const q of this.glows) q.life -= dt;
    this.glows = this.glows.filter((q) => q.life > 0);
    for (const t of this.texts) { t.y -= 12 * dt; t.life -= dt; }
    this.texts = this.texts.filter((t) => t.life > 0);
  }

  draw(g, cam) {
    if (!this.p.length && !this.texts.length && !this.glows.length) return;
    g.save(); g.translate(-Math.round(cam.x), -Math.round(cam.y));
    for (const q of this.glows) {
      const a = Math.sin(Math.PI * (1 - q.life / q.max));
      g.fillStyle = q.ready ? '#ffe066' : '#fff4aa';
      g.globalAlpha = a * (q.ready ? 0.55 : 0.4); g.fillRect(q.x, q.y, 16, 16);
      g.globalAlpha = Math.min(1, a * 1.3); // garis tepi
      g.fillRect(q.x, q.y, 16, 1); g.fillRect(q.x, q.y + 15, 16, 1); g.fillRect(q.x, q.y, 1, 16); g.fillRect(q.x + 15, q.y, 1, 16);
    }
    for (const q of this.p) {
      g.globalAlpha = Math.min(1, (q.life / q.max) * 2);
      g.fillStyle = q.col;
      const x = Math.round(q.x), y = Math.round(q.y);
      if (q.star) { g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
      else g.fillRect(x, y, q.size, q.leaf ? 1 : q.size);
    }
    g.font = 'bold 8px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'top';
    for (const t of this.texts) {
      g.globalAlpha = Math.min(1, t.life / 0.4);
      g.fillStyle = '#2b2118'; g.fillText(t.s, Math.round(t.x) + 1, Math.round(t.y) + 1);
      g.fillStyle = t.col; g.fillText(t.s, Math.round(t.x), Math.round(t.y));
    }
    g.globalAlpha = 1; g.textAlign = 'left'; g.restore();
  }
}
