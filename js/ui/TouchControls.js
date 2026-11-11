// Joystick virtual: muncul di titik sentuh pada sisi kiri layar. Mendukung multi-touch.
const RADIUS = 40, DEAD = 0.15;
export class TouchControls {
  constructor(zone, base, knob, input) {
    let pid = null, ox = 0, oy = 0;
    const reset = () => {
      pid = null; input.joy.x = 0; input.joy.y = 0;
      base.style.display = 'none'; knob.style.transform = '';
    };
    zone.addEventListener('pointerdown', (e) => {
      if (pid !== null) return;
      pid = e.pointerId; ox = e.clientX; oy = e.clientY;
      zone.setPointerCapture(pid);
      base.style.display = 'block';
      base.style.left = (ox - 50) + 'px'; base.style.top = (oy - 50) + 'px';
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pid) return;
      let dx = e.clientX - ox, dy = e.clientY - oy;
      const len = Math.hypot(dx, dy);
      if (len > RADIUS) { dx = dx / len * RADIUS; dy = dy / len * RADIUS; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      const nx = dx / RADIUS, ny = dy / RADIUS;
      const m = Math.hypot(nx, ny);
      input.joy.x = m < DEAD ? 0 : nx; input.joy.y = m < DEAD ? 0 : ny;
    });
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture'])
      zone.addEventListener(t, (e) => { if (e.pointerId === pid) reset(); });
    this.reset = reset;
  }
}
