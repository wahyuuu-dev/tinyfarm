import { CROPS } from '../data/crops.js';

const IDS = Object.keys(CROPS);
const chip = (c) => `<i class="chip" style="background:${c}"></i>`;

// Panel tas (DOM): benih, hasil panen, dan koin.
export class InventoryPanel {
  constructor(root, state, inv) {
    this.state = state; this.inv = inv;
    this.coinsEl = root.querySelector('#invCoins'); this.listEl = root.querySelector('#invList');
  }
  open() { this.refresh(); }
  refresh() {
    this.coinsEl.textContent = this.state.coins + ' koin';
    const row = (id, label, n, note = '') => `<div class="row">${chip(CROPS[id].color)}<span class="name">${label}${note}</span><b>${n}</b></div>`;
    let html = '<h3>Benih</h3>' + IDS.map((id) => row(id, 'Benih ' + CROPS[id].name, this.inv.count('seed_' + id))).join('') + '<h3>Hasil panen</h3>';
    for (const id of IDS) {
      const c = CROPS[id], fine = this.inv.count('fine_' + id);
      html += row(id, id === 'daisy' ? 'Bunga Daisy' : c.name, this.inv.count('crop_' + id), c.sellPrice === 0 ? ' <span class="sub">(tidak dijual)</span>' : '');
      if (fine > 0) html += row(id, c.name + ' Harmoni', fine);
    }
    this.listEl.innerHTML = html;
  }
}
