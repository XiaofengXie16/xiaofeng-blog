import { describe, expect, test } from "bun:test";
import { STROLL_MAX, STROLL_MIN, easeInOut, nextStroll } from "~/utils/stroll";

describe("nextStroll", () => {
  test("walks forward in the middle of the ribbon", () => {
    expect(nextStroll(0.4, 1, 0.2)).toEqual({ target: 0.6000000000000001, dir: 1 });
  });

  test("walks backward when heading back", () => {
    const r = nextStroll(0.5, -1, 0.2);
    expect(r.dir).toBe(-1);
    expect(r.target).toBeCloseTo(0.3);
  });

  test("turns around at the far end", () => {
    const r = nextStroll(0.9, 1, 0.2);
    expect(r.dir).toBe(-1);
    expect(r.target).toBeCloseTo(STROLL_MAX - 0.13);
  });

  test("turns around at the start", () => {
    const r = nextStroll(0.1, -1, 0.2);
    expect(r.dir).toBe(1);
    // 0.1 - 0.2 overshoots the start (0.03) by 0.13, so it bounces back by 0.13.
    expect(r.target).toBeCloseTo(STROLL_MIN + 0.13);
  });

  test("always stays on the ribbon", () => {
    for (const at of [0, 0.03, 0.5, 0.97, 1]) {
      for (const dir of [1, -1] as const) {
        const { target } = nextStroll(at, dir, 0.9);
        expect(target).toBeGreaterThanOrEqual(STROLL_MIN);
        expect(target).toBeLessThanOrEqual(STROLL_MAX);
      }
    }
  });
});

describe("nextStroll with a custom range", () => {
  test("bounces back inside a short range", () => {
    const r = nextStroll(0.1, 1, 0.16, 0.04, 0.17);
    expect(r.dir).toBe(-1);
    expect(r.target).toBeCloseTo(0.08);
  });

  test("never leaves its range, even for long strolls", () => {
    for (const at of [0.04, 0.1, 0.17]) {
      for (const dir of [1, -1] as const) {
        const { target } = nextStroll(at, dir, 0.5, 0.04, 0.17);
        expect(target).toBeGreaterThanOrEqual(0.04);
        expect(target).toBeLessThanOrEqual(0.17);
      }
    }
  });
});

describe("easeInOut", () => {
  test("starts at 0, ends at 1, passes the midpoint", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5);
  });
});
