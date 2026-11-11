import { CROPS } from '../data/crops.js';

// Buntu: koin tidak cukup beli benih termurah yang bisa dijual, dan tidak ada benih,
// hasil panen, atau tanaman yang bisa dijual. Dalam keadaan ini koin tidak mungkin bertambah lagi.
export function isStuck(coins, inv, farming) {
  const sellable = Object.keys(CROPS).filter((id) => CROPS[id].sellPrice > 0);
  if (coins >= Math.min(...sellable.map((id) => CROPS[id].seedPrice))) return false;
  for (const id of sellable)
    if (inv.count('seed_' + id) || inv.count('crop_' + id) || inv.count('fine_' + id)) return false;
  return !farming.hasSellableCrop();
}
