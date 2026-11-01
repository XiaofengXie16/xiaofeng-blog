import { describe, expect, test } from "bun:test";
import { FUTURES, pickFuture } from "~/utils/futures";

describe("pickFuture", () => {
  test("returns one of the phrases", () => {
    for (const r of [0, 0.3, 0.6, 0.999]) {
      expect(FUTURES).toContain(pickFuture(undefined, () => r) as (typeof FUTURES)[number]);
    }
  });

  test("never repeats the previous phrase", () => {
    for (const previous of FUTURES) {
      for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
        expect(pickFuture(previous, () => r)).not.toBe(previous);
      }
    }
  });

  test("stays in range when random returns its upper bound", () => {
    expect(FUTURES).toContain(pickFuture(undefined, () => 1) as (typeof FUTURES)[number]);
  });
});
