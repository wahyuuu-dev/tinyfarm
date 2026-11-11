// Layar menu berbasis DOM. handlers: tindakan dari atribut data-action.
export class Menus {
  constructor(handlers) {
    this.screens = [...document.querySelectorAll('.screen')];
    document.querySelectorAll('[data-action]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.action;
      if (a === 'settings' || a === 'credits') this.show(a);
      else if (a === 'back') this.show('menu');
      else if (handlers[a]) handlers[a]();
    }));
  }
  show(id) { this.screens.forEach((s) => s.classList.toggle('hidden', s.id !== id)); }
  hideAll() { this.screens.forEach((s) => s.classList.add('hidden')); }
  setText(id, text) { document.getElementById(id).textContent = text; }
  setDisabled(id, off) { document.getElementById(id).disabled = off; }
}
