// Game loop dengan delta time.
export class Game {
  constructor(update, render) {
    this.update = update; this.render = render; this.last = 0; this.running = false;
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame(this.tick);
  }
  tick = (t) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.tick);
  };
}
