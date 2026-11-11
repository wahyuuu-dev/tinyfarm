// Input keyboard. Joystick sentuh mengisi this.joy lewat TouchControls.
export class Input {
  constructor() {
    this.keys = new Set(); this.joy = { x: 0, y: 0 }; this.onKeyDown = null;
    const block = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    addEventListener('keydown', (e) => {
      if (block.includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (!e.repeat && this.onKeyDown) this.onKeyDown(e.code);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
  }
  getMove() {
    const k = this.keys;
    let x = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    let y = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0);
    if (x === 0 && y === 0) { x = this.joy.x; y = this.joy.y; }
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    return { x, y };
  }
}
