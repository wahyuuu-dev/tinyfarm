import { CFG } from '../data/config.js';
import { drawPlayer } from '../world/Sprites.js';

const T = CFG.TILE;
const HB = { x: 4, y: 10, w: 8, h: 5 }; // kotak tabrakan di sekitar kaki
const FACING = [[0, 1], [0, -1], [-1, 0], [1, 0]]; // bawah, atas, kiri, kanan
const HAND = [[12, 9], [3, 9], [2, 10], [13, 10]];
const ACT_TIME = 0.22;

export class Player {
  constructor() { this.reset(); }
  reset() { this.x = 19 * T; this.y = 12 * T; this.dir = 0; this.anim = 0; this.moving = false; this.actT = 0; this.actColor = '#8a8f98'; }
  // Memulai animasi ayunan alat dengan warna ujung alat.
  act(color) { this.actT = ACT_TIME; this.actColor = color; }
  update(dt, m, world) {
    if (this.actT > 0) this.actT = Math.max(0, this.actT - dt);
    this.moving = m.x !== 0 || m.y !== 0;
    if (!this.moving) { this.anim = 0; return; }
    this.dir = Math.abs(m.x) > Math.abs(m.y) ? (m.x < 0 ? 2 : 3) : (m.y < 0 ? 1 : 0);
    this.anim += dt;
    // Sumbu X dan Y dicoba terpisah supaya karakter meluncur di sepanjang dinding.
    const step = CFG.PLAYER_SPEED * dt;
    const nx = this.x + m.x * step;
    if (!world.isBlocked(nx + HB.x, this.y + HB.y, HB.w, HB.h)) this.x = nx;
    else if (m.x !== 0 && Math.abs(m.y) < 0.3) this.assist(world, nx, this.y, step, true);
    const ny = this.y + m.y * step;
    if (!world.isBlocked(this.x + HB.x, ny + HB.y, HB.w, HB.h)) this.y = ny;
    else if (m.y !== 0 && Math.abs(m.x) < 0.3) this.assist(world, this.x, ny, step, false);
  }
  // Koreksi sudut: bila terhalang tepat di tepi celah (gerbang, antara pohon), geser karakter
  // ke sisi yang bebas (maksimal 6 px). Membantu joystick sentuh yang kurang presisi.
  assist(world, nx, ny, step, horizontal) {
    for (let o = 1; o <= 6; o++) for (const s of [1, -1]) {
      const cx = horizontal ? nx : this.x + s * o, cy = horizontal ? this.y + s * o : ny;
      if (world.isBlocked(cx + HB.x, cy + HB.y, HB.w, HB.h)) continue;
      const d = s * Math.min(o, step), px = horizontal ? this.x : this.x + d, py = horizontal ? this.y + d : this.y;
      if (!world.isBlocked(px + HB.x, py + HB.y, HB.w, HB.h)) { this.x = px; this.y = py; }
      return;
    }
  }
  // Tile tepat di depan karakter.
  front() {
    const f = FACING[this.dir], cx = this.x + 8, cy = this.y + 12;
    return { tx: Math.floor((cx + f[0] * 10) / T), ty: Math.floor((cy + f[1] * 10) / T) };
  }
  draw(ctx) {
    const x = Math.round(this.x), y = Math.round(this.y);
    const step = this.moving ? 1 + (Math.floor(this.anim * 8) % 2) : 0;
    drawPlayer(ctx, x, y, this.dir, step);
    if (this.actT > 0) {
      const sw = Math.round((1 - this.actT / ACT_TIME) * 4), f = FACING[this.dir], h = HAND[this.dir];
      const hx = x + h[0], hy = y + h[1], len = 3 + sw, tx = hx + f[0] * len, ty = hy + f[1] * len;
      ctx.fillStyle = '#7a4e2d';
      ctx.fillRect(Math.min(hx, tx), Math.min(hy, ty), Math.abs(tx - hx) + 1, Math.abs(ty - hy) + 1);
      ctx.fillStyle = this.actColor; ctx.fillRect(tx - 1, ty - 1, 3, 3);
    }
  }
}
