/** The item at `index`, wrapping around: cycle([a, b], 3) === b. Never undefined. */
export function cycle<T>(items: readonly [T, ...T[]], index: number): T {
  const i = ((index % items.length) + items.length) % items.length;
  return items[i] ?? items[0];
}
