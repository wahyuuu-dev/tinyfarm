import { CROPS } from '../data/crops.js';
import { CFG, RULES } from '../data/config.js';
import { HOTBAR } from '../data/items.js';

// Penyimpanan progres dan pengaturan di localStorage.
// Penulisan dua langkah + cadangan: data lama tidak ditimpa sebelum data baru terbukti valid.
const KEY = 'tfl_save_v1', BAK = 'tfl_save_v1_bak', TMP = 'tfl_save_v1_tmp', SET = 'tfl_settings_v1';
export const VERSION = 1;
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const store = () => { try { return globalThis.localStorage || null; } catch (e) { return null; } };
const num = (v, min, max) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null);
const int = (v, min, max) => (Number.isInteger(v) && v >= min && v <= max ? v : null);

// Membersihkan dan memeriksa data simpanan. Mengembalikan data aman, atau null bila tidak valid.
export function sanitize(raw, world) {
  if (!raw || typeof raw !== 'object' || raw.v !== VERSION) return null;
  const coins = int(raw.coins, 0, 1e7), day = int(raw.day, 1, RULES.LAST_DAY);
  const minutes = num(raw.minutes, CFG.START_MINUTES, RULES.END_MINUTES - 1), energy = num(raw.energy, 1, CFG.MAX_ENERGY);
  if (coins === null || day === null || minutes === null || energy === null) return null;
  const pr = raw.player || {};
  let x = num(pr.x, 0, CFG.MAP_W * 16 - 16), y = num(pr.y, 0, CFG.MAP_H * 16 - 16);
  if (x === null || y === null || world.isBlocked(x + 4, y + 10, 8, 5)) { x = 19 * 16; y = 12 * 16; }
  const items = {};
  if (raw.items && typeof raw.items === 'object')
    for (const [k, v] of Object.entries(raw.items)) {
      const m = /^(seed|crop|fine)_(\w+)$/.exec(k);
      if (m && has(CROPS, m[2]) && Number.isInteger(v) && v >= 0 && v <= 9999) items[k] = v;
    }
  const plots = [], seen = new Set();
  if (Array.isArray(raw.plots))
    for (const e of raw.plots) {
      if (!Array.isArray(e) || e.length !== 5) continue;
      const [tx, ty, crop, growth, watered] = e;
      if (!Number.isInteger(tx) || !Number.isInteger(ty) || world.kindAt(tx, ty) !== 'soil' || seen.has(tx + ',' + ty)) continue;
      if (crop !== null && !(typeof crop === 'string' && has(CROPS, crop))) continue;
      const g = crop ? num(growth, 0, CROPS[crop].days + 3) : 0;
      if (g === null || typeof watered !== 'boolean') continue;
      seen.add(tx + ',' + ty); plots.push([tx, ty, crop, g, watered]);
    }
  return { coins, day, minutes, energy, selected: int(raw.selected, 0, HOTBAR.length - 1) ?? 0,
    player: { x, y, dir: int(pr.dir, 0, 3) ?? 0 }, items, plots };
}

const parses = (s) => { try { return JSON.parse(s).v === VERSION; } catch (e) { return false; } };

export function write(data) {
  const s = store(); if (!s) return false;
  try {
    const json = JSON.stringify({ ...data, v: VERSION, saved: Date.now() });
    JSON.parse(json);
    const prev = s.getItem(KEY);
    if (prev && parses(prev)) s.setItem(BAK, prev);
    s.setItem(TMP, json);
    if (s.getItem(TMP) !== json) return false;
    s.setItem(KEY, json); s.removeItem(TMP);
    return true;
  } catch (e) { return false; }
}
export function read(world) {
  const s = store(); if (!s) return null;
  for (const k of [KEY, BAK]) {
    try { const raw = s.getItem(k); if (raw) { const d = sanitize(JSON.parse(raw), world); if (d) return d; } } catch (e) { /* coba cadangan */ }
  }
  return null;
}
// 'none' (tidak ada), 'ok', atau 'corrupt' (ada tetapi tidak bisa dibaca).
export function status(world) {
  const s = store(); if (!s) return 'none';
  let any = false; try { any = !!(s.getItem(KEY) || s.getItem(BAK)); } catch (e) { return 'none'; }
  return !any ? 'none' : read(world) ? 'ok' : 'corrupt';
}
export function clear() { const s = store(); if (s) try { s.removeItem(KEY); s.removeItem(BAK); s.removeItem(TMP); } catch (e) { /* abaikan */ } }

export function readSettings() {
  const d = { music: true, sfx: true, fps: false };
  try { const o = JSON.parse(store().getItem(SET)); for (const k of Object.keys(d)) if (typeof o[k] === 'boolean') d[k] = o[k]; } catch (e) { /* pakai bawaan */ }
  return d;
}
export function writeSettings(o) { const s = store(); if (s) try { s.setItem(SET, JSON.stringify(o)); } catch (e) { /* abaikan */ } }
