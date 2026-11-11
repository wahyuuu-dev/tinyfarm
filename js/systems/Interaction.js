import { CROPS } from '../data/crops.js';

// Menentukan objek di depan karakter. Tanah pertanian menampilkan status petaknya.
const LABEL = { grass: 'Rumput', soil: 'Tanah pertanian', path: 'Jalan setapak', water: 'Kolam',
  tree: 'Pohon', house: 'Rumah: tidur', shop: 'Toko', fence: 'Pagar kebun' };
const INFO = { grass: 'Rumput liar.', path: 'Jalan setapak menuju rumah.',
  water: 'Air kolam. Tidak bisa dilewati.', tree: 'Pohon yang rindang.', fence: 'Pagar kebun.' };

export class Interaction {
  constructor() { this.target = null; }
  update(player, world, farming) {
    const f = player.front(), kind = world.kindAt(f.tx, f.ty);
    if (!kind) { this.target = null; return; }
    let label = LABEL[kind];
    if (kind === 'soil') {
      const p = farming.get(f.tx, f.ty), st = farming.stageOf(p);
      if (p) {
        if (!p.crop) label = 'Tanah dicangkul';
        else if (st === 3) label = CROPS[p.crop].name + ' siap panen';
        else label = CROPS[p.crop].name + (p.watered ? ' (disiram)' : ' (kering)');
      }
    }
    this.target = { tx: f.tx, ty: f.ty, kind, label };
  }
  act() { return INFO[this.target.kind]; }
}
