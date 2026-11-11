import { CROPS } from '../data/crops.js';

const IDS = Object.keys(CROPS), SELL = IDS.filter((id) => CROPS[id].sellPrice > 0);
const chip = (c) => `<i class="chip" style="background:${c}"></i>`;

// Panel toko (DOM): beli benih, jual hasil panen (biasa dan Harmoni).
export class Shop {
  constructor(root, economy, onResult) {
    this.economy = economy;
    this.buyEl = root.querySelector('#shopBuy'); this.sellEl = root.querySelector('#shopSell');
    this.coinsEl = root.querySelector('#shopCoins'); this.msgEl = root.querySelector('#shopMsg');
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-op]');
      if (!b || b.disabled) return;
      const { op, crop } = b.dataset, fine = b.dataset.fine === '1';
      const r = op === 'buy' ? economy.buy(crop) : op === 'sell' ? economy.sell(crop, 1, fine) : economy.sellAll(crop, fine);
      this.msgEl.textContent = r.msg; if (onResult) onResult(op, r); this.refresh();
    });
  }
  open() { this.msgEl.textContent = ''; this.refresh(); }
  refresh() {
    const { state, inv } = this.economy;
    this.coinsEl.textContent = state.coins + ' koin';
    this.buyEl.innerHTML = IDS.map((id) => {
      const c = CROPS[id];
      return `<div class="row">${chip(c.color)}<span class="name">${c.name}<br><span class="sub">${c.seedPrice} koin, punya ${inv.count('seed_' + id)}</span></span>
        <button class="mini" data-op="buy" data-crop="${id}" ${state.coins < c.seedPrice ? 'disabled' : ''}>Beli</button></div>`;
    }).join('');
    const rows = [];
    for (const id of SELL) for (const fine of [false, true]) {
      const n = inv.count((fine ? 'fine_' : 'crop_') + id);
      if (fine && n === 0) continue;
      const off = n === 0 ? 'disabled' : '', d = `data-crop="${id}" data-fine="${fine ? 1 : 0}"`;
      rows.push(`<div class="row">${chip(CROPS[id].color)}<span class="name">${CROPS[id].name}${fine ? ' Harmoni' : ''}<br><span class="sub">${this.economy.price(id, fine)} koin, punya ${n}</span></span>
        <button class="mini" data-op="sell" ${d} ${off}>Jual</button><button class="mini" data-op="all" ${d} ${off}>Semua</button></div>`);
    }
    this.sellEl.innerHTML = rows.join('');
  }
}
