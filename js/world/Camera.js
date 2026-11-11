import { CFG } from '../data/config.js';

export class Camera {
  constructor() { this.x = 0; this.y = 0; this.pk = null; this.slow = 0; }
  goal(p) { return { x: p.x + 8 - CFG.W / 2, y: p.y + 8 - CFG.H / 2 }; }
  clamp() {
    this.x = Math.max(0, Math.min(CFG.MAP_W * CFG.TILE - CFG.W, this.x));
    this.y = Math.max(0, Math.min(CFG.MAP_H * CFG.TILE - CFG.H, this.y));
  }
  snap(p) { this.pk = null; this.slow = 0; const g = this.goal(p); this.x = g.x; this.y = g.y; this.clamp(); }
  // Menoleh ke titik (x, y) dunia selama `t` detik (dihitung saat bermain), lalu kembali ke karakter pelan-pelan.
  peek(x, y, t) {
    this.pk = { x, y, t };
    this.x = x - CFG.W / 2; this.y = y - CFG.H / 2; this.clamp();
  }
  follow(p, dt) {
    if (this.pk && (this.pk.t -= dt) <= 0) { this.pk = null; this.slow = 1.2; }
    if (this.pk) return; // diam di titik yang dilihat
    if (this.slow > 0) this.slow -= dt;
    const g = this.goal(p), k = Math.min(1, dt * (this.slow > 0 ? 3 : 8));
    this.x += (g.x - this.x) * k; this.y += (g.y - this.y) * k; this.clamp();
  }
}
