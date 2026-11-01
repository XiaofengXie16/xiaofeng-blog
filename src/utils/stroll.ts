/** How far along a ribbon a walker can go, as fractions of its length. */
export const STROLL_MIN = 0.03;
export const STROLL_MAX = 0.97;

/**
 * Where a walker at `at` (0–1 along the path), heading `dir` (1 forward,
 * -1 back), ends up after strolling `distance` (a fraction of the path).
 * Walkers turn around at the ends of their range (`min`–`max`, the whole
 * ribbon by default) instead of walking off it.
 */
export function nextStroll(
  at: number,
  dir: 1 | -1,
  distance: number,
  min = STROLL_MIN,
  max = STROLL_MAX,
): { target: number; dir: 1 | -1 } {
  let target = at + dir * distance;
  let nextDir = dir;
  if (target > max) {
    target = max - (target - max);
    nextDir = -1;
  } else if (target < min) {
    target = min + (min - target);
    nextDir = 1;
  }
  return { target: Math.min(max, Math.max(min, target)), dir: nextDir };
}

/** Smooth start and stop for a stroll. */
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
