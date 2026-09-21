// Fixed-window counter used to bound how often a billable server-side action
// (currently the Groq-backed askAI endpoint) may run.
//
// The blog runs as a single long-lived Nitro process on one Fly machine, so an
// in-process Map is sufficient to enforce a limit. If the app is ever scaled
// horizontally this must move to a shared store, otherwise each instance would
// enforce its own copy of the limit.

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

// Stale keys are dropped opportunistically so a flood of distinct keys (for
// example spoofed client IPs) cannot grow the Map without bound.
const PRUNE_INTERVAL_MS = 60_000;
let lastPruneAt = 0;

function prune(now: number): void {
  if (now - lastPruneAt < PRUNE_INTERVAL_MS) return;
  lastPruneAt = now;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the current window resets; 0 when the request is allowed. */
  retryAfterSeconds: number;
};

/**
 * Record one hit against `key` and report whether it is within `limit` per
 * `windowMs`. `now` is injectable so the behavior is testable.
 */
export function consume(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  prune(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Drop all counters. Exposed for tests so state does not leak between cases. */
export function resetRateLimits(): void {
  windows.clear();
  lastPruneAt = 0;
}
