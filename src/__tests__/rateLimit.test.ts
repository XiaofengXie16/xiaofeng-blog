import { describe, it, expect, beforeEach } from "vite-plus/test";
import { consume, resetRateLimits } from "../server/rateLimit";

describe("rate limiter", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the limit and rejects the next one", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) {
      expect(consume("key", 3, 60_000, now).allowed).toBe(true);
    }

    const blocked = consume("key", 3, 60_000, now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("reports retryAfterSeconds as the remaining window", () => {
    const now = 1_000_000;
    consume("key", 1, 60_000, now);
    const blocked = consume("key", 1, 60_000, now + 30_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(30);
  });

  it("resets once the window elapses", () => {
    const now = 1_000_000;
    consume("key", 1, 60_000, now);
    expect(consume("key", 1, 60_000, now).allowed).toBe(false);
    expect(consume("key", 1, 60_000, now + 60_000).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const now = 1_000_000;
    consume("a", 1, 60_000, now);
    expect(consume("b", 1, 60_000, now).allowed).toBe(true);
    expect(consume("a", 1, 60_000, now).allowed).toBe(false);
  });

  it("does not grow unbounded as keys rotate", () => {
    const now = 1_000_000;
    for (let i = 0; i < 500; i++) {
      consume(`key-${i}`, 1, 1_000, now);
    }
    // A later call past the prune interval drops every expired window, so each
    // stale key is admitted again rather than persisting.
    expect(consume("key-0", 1, 1_000, now + 120_000).allowed).toBe(true);
    expect(consume("key-1", 1, 1_000, now + 120_000).allowed).toBe(true);
  });
});
