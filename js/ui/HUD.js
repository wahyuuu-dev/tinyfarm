import { CFG, PAL, RULES } from '../data/config.js';
import { HOTBAR } from '../data/items.js';

const SLOT = 22, GAP = 2;
const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

function icon(g, it, x, y) {
  if (it.icon === 'hoe') {
    for (let i = 0; i < 9; i++) R(g, PAL.brown, x + 3 + i, y + 12 - i, 2, 2);
    R(g, '#8a8f98', x + 9, y + 2, 6, 3); R(g, '#b8bcc4', x + 9, y + 2, 6, 1);
  } else if (it.icon === 'can') {
    R(g, PAL.sky, x + 3, y + 6, 8, 8); R(g, '#4f9fd6', x + 3, y + 11, 8, 3);
    R(g, PAL.sky, x + 11, y + 6, 3, 2); R(g, PAL.sky, x + 13, y + 4, 2, 3); R(g, PAL.ink, x + 4, y + 3, 6, 1); R(g, PAL.ink, x + 4, y + 3, 1, 3);
  } else {
    R(g, '#c9a46a', x + 4, y + 5, 8, 9); R(g, PAL.brownDark, x + 5, y + 3, 6, 3); R(g, it.color, x + 6, y + 8, 4, 4);
  }
}

export class HUD {
  constructor() { this.note = null; }
  notify(text) { this.note = { text, t: 3 }; }
  update(dt) { if (this.note && (this.note.t -= dt) <= 0) this.note = null; }
  slotRect(i) {
    const total = HOTBAR.length * SLOT + (HOTBAR.length - 1) * GAP;
    return { x: Math.round((CFG.W - total) / 2) + i * (SLOT + GAP), y: CFG.H - SLOT - 4, w: SLOT, h: SLOT };
  }
  slotAt(px, py) {
    for (let i = 0; i < HOTBAR.length; i++) {
      const r = this.slotRect(i);
      if (px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h) return i;
    }
    return -1;
  }
  panel(g, x, y, w, h) { R(g, PAL.ink, x, y, w, h); R(g, PAL.cream, x + 1, y + 1, w - 2, h - 2); }
  text(g, s, x, y, align = 'left') { g.textAlign = align; g.fillStyle = PAL.ink; g.fillText(s, x, y); }

  draw(g, st) {
    g.font = 'bold 8px "Courier New", monospace'; g.textBaseline = 'top';
    // Koin + energi
    this.panel(g, 4, 4, 86, 28);
    R(g, PAL.ink, 8, 8, 8, 8); R(g, PAL.orange, 9, 9, 6, 6); R(g, '#f6c36a', 10, 10, 2, 2);
    this.text(g, st.coins + '/' + RULES.GOAL_COINS, 20, 9);
    this.text(g, 'EN', 8, 21);
    R(g, PAL.ink, 24, 20, 62, 8); R(g, PAL.creamDark, 25, 21, 60, 6);
    R(g, st.energy > 25 ? PAL.green : PAL.orange, 25, 21, Math.round(60 * st.energy / CFG.MAX_ENERGY), 6);
    this.panel(g, 4, 34, 92, 12); this.text(g, 'Harmoni ' + st.harmonyName, 8, 37);
    // Hari + jam
    this.panel(g, CFG.W - 74, 4, 70, 28);
    const tm = Math.floor(st.minutes), hh = String(Math.floor(tm / 60) % 24).padStart(2, '0'), mm = String(tm % 60).padStart(2, '0');
    this.text(g, 'Hari ' + st.day + '/' + RULES.LAST_DAY, CFG.W - 69, 9); this.text(g, hh + ':' + mm, CFG.W - 69, 20);
    // Hotbar
    HOTBAR.forEach((it, i) => {
      const r = this.slotRect(i), sel = i === st.selected;
      R(g, sel ? PAL.orange : PAL.ink, r.x, r.y, r.w, r.h);
      R(g, PAL.creamDark, r.x + 2, r.y + 2, r.w - 4, r.h - 4);
      icon(g, it, r.x + 3, r.y + 3);
      g.font = 'bold 6px "Courier New", monospace'; this.text(g, String(i + 1), r.x + 3, r.y + 3);
      if (it.icon === 'seed') this.text(g, String(st.inventory.count(it.id)), r.x + r.w - 3, r.y + r.h - 8, 'right');
    });
    // Penunjuk alat
    g.font = 'bold 8px "Courier New", monospace';
    const name = HOTBAR[st.selected].name, w = Math.ceil(g.measureText(name).width) + 12, r0 = this.slotRect(0);
    this.panel(g, Math.round((CFG.W - w) / 2), r0.y - 15, w, 12);
    this.text(g, name, CFG.W / 2, r0.y - 12, 'center');
    // Penunjuk interaksi
    if (st.target) {
      const t = '[Aksi] ' + st.target.label, pw = Math.ceil(g.measureText(t).width) + 12;
      this.panel(g, Math.round((CFG.W - pw) / 2), r0.y - 30, pw, 12);
      this.text(g, t, CFG.W / 2, r0.y - 27, 'center');
    }
    // Notifikasi
    if (this.note) {
      const nw = Math.ceil(g.measureText(this.note.text).width) + 12;
      g.globalAlpha = Math.min(1, this.note.t * 2);
      this.panel(g, Math.round((CFG.W - nw) / 2), 38, nw, 14);
      this.text(g, this.note.text, CFG.W / 2, 42, 'center');
      g.globalAlpha = 1;
    }
    g.textAlign = 'left';
  }
}
