/** Small, framework-free motion helpers shared by the 3D figures. */

/** A damped spring. Mutates and returns `s` after advancing by `dt` seconds. */
export type Spring = { value: number; velocity: number };

export function springStep(s: Spring, target: number, dt: number, stiffness = 170, damping = 16) {
  // Sub-step so long frames (tab switches) stay stable.
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = Math.min(dt, 0.1) / steps;
  for (let i = 0; i < steps; i++) {
    const force = (target - s.value) * stiffness - s.velocity * damping;
    s.velocity += force * h;
    s.value += s.velocity * h;
  }
  return s;
}

/** Overshoots slightly past 1, then settles: a playful "pop". */
export function easeOutBack(t: number, overshoot = 1.70158) {
  const x = clamp01(t) - 1;
  return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
}

/** A ball dropped from 1 to 0 that bounces twice before resting. */
export function bounceDrop(t: number) {
  const x = clamp01(t);
  const n = 7.5625;
  const d = 2.75;
  let y: number;
  if (x < 1 / d) y = n * x * x;
  else if (x < 2 / d) y = n * (x - 1.5 / d) ** 2 + 0.75;
  else if (x < 2.5 / d) y = n * (x - 2.25 / d) ** 2 + 0.9375;
  else y = n * (x - 2.625 / d) ** 2 + 0.984375;
  return 1 - y;
}

/** Progress of a staggered animation for item `index`, from 0 to 1. */
export function stagger(elapsed: number, index: number, delay: number, duration: number) {
  return clamp01((elapsed - index * delay) / duration);
}

/** Evenly spaced column centres across `width`, centred on 0. */
export function columnCenters(count: number, width: number) {
  return Array.from({ length: count }, (_, i) => ((i + 0.5) / count - 0.5) * width);
}

/** Whether a blink is happening at time `t` (seconds), given a blink every `every` seconds. */
export function blinkAmount(t: number, every = 3.6, length = 0.14) {
  const phase = t % every;
  if (phase > length) return 0;
  return Math.sin((phase / length) * Math.PI);
}

export function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
