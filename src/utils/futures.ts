/** Phrases the home page writes into the sky when someone clicks it. */
export const FUTURES = [
  "a brilliant bloom",
  "a calmer codebase",
  "a green test suite",
  "a perfect future",
  "zero flaky tests",
  "one more good book",
  "shipped on Friday",
  "a kinder review",
  "faster builds",
  "a quiet on-call",
  "tiny bundles",
  "a cleaner API",
] as const;

/**
 * Picks a phrase, avoiding an immediate repeat of `previous`.
 * `random` is injectable for tests.
 */
export function pickFuture(previous?: string, random: () => number = Math.random): string {
  const options = previous ? FUTURES.filter((f) => f !== previous) : FUTURES;
  return options[Math.floor(random() * options.length) % options.length] ?? FUTURES[0];
}
