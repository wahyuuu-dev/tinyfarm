export const CFG = {
  W: 480, H: 270, TILE: 16, MAP_W: 40, MAP_H: 30,
  PLAYER_SPEED: 70, START_COINS: 100, MAX_ENERGY: 100, START_MINUTES: 360,
};
export const PAL = {
  green: '#5aa84a', greenDark: '#3d7a38', greenLight: '#7cc45c',
  brown: '#7a4e2d', brownDark: '#5a3820', brownLight: '#a06c40',
  cream: '#f6ecd0', creamDark: '#e3d3a8', orange: '#e8873a', sky: '#6cb8e6', ink: '#2b2118',
};

// Biaya energi tiap aksi dan isi inventory awal (benih untuk mencoba sistem pertanian).
export const COST = { till: 2, plant: 1, water: 1, harvest: 1 };
export const START_ITEMS = { seed_carrot: 5, seed_wheat: 3, seed_tomato: 2, seed_daisy: 3 };

// Aturan permainan (Tahap 6).
export const RULES = { GOAL_COINS: 1500, LAST_DAY: 20, DAY_SECONDS: 240, END_MINUTES: 1440, FAINT_ENERGY: 60 };
// Harmony Garden: bonus tumbuh, bonus harga (Daisy di sebelah tanaman), bonus level 3, ambang level.
export const HARMONY = { growthBonus: 1.5, fineBonus: 0.15, levelBonus: 0.05, level2: 3, level3: 6 };

export const VERSION = '1.0.0';
