import { CFG, RULES } from '../data/config.js';

// Warna suasana [r, g, b, alpha] menurut jam (menit sejak 00:00).
const KEYS = [[360, [255, 190, 120, 0.15]], [420, [255, 190, 120, 0]], [1020, [255, 160, 80, 0]],
  [1140, [255, 140, 70, 0.22]], [1260, [15, 25, 70, 0.5]], [1440, [15, 25, 70, 0.55]]];

// Memajukan jam. Mengembalikan true saat tengah malam tercapai.
export function advance(state, dt) {
  state.minutes += dt * ((RULES.END_MINUTES - CFG.START_MINUTES) / RULES.DAY_SECONDS);
  return state.minutes >= RULES.END_MINUTES;
}
export function tint(m) {
  if (m <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    if (m <= KEYS[i][0]) {
      const [m0, a] = KEYS[i - 1], [m1, b] = KEYS[i], k = (m - m0) / (m1 - m0);
      return a.map((v, n) => v + (b[n] - v) * k);
    }
  }
  return KEYS[KEYS.length - 1][1];
}
export function drawTint(g, m) {
  const [r, gr, b, a] = tint(m);
  if (a < 0.01) return;
  g.fillStyle = `rgba(${Math.round(r)},${Math.round(gr)},${Math.round(b)},${a.toFixed(3)})`;
  g.fillRect(0, 0, CFG.W, CFG.H);
}
