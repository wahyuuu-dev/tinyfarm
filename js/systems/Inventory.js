// Penyimpanan jumlah item (benih dan hasil panen). Panel inventory dibuat di Tahap 5.
export class Inventory {
  constructor(start = {}) { this.reset(start); }
  reset(start = {}) { this.items = { ...start }; }
  count(id) { return this.items[id] || 0; }
  add(id, n = 1) { this.items[id] = this.count(id) + n; }
  remove(id, n = 1) {
    if (this.count(id) < n) return false;
    this.items[id] -= n; return true;
  }
}
