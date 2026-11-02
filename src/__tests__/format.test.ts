import { describe, expect, test } from "bun:test";
import { cycle } from "~/utils/array";
import { formatPostDate, shortTitle } from "~/utils/format";

describe("formatPostDate", () => {
  test("formats ISO dates without shifting the day", () => {
    expect(formatPostDate("2025-10-13")).toBe("Oct 13, 2025");
    expect(formatPostDate("2026-01-01")).toBe("Jan 1, 2026");
  });

  test("returns unrecognised input unchanged", () => {
    expect(formatPostDate("sometime")).toBe("sometime");
  });
});

describe("shortTitle", () => {
  test("drops the subtitle after a colon", () => {
    expect(shortTitle("Why Nations Fail: The Origins of Power")).toBe("Why Nations Fail");
  });

  test("keeps titles without a colon", () => {
    expect(shortTitle("The Staff Engineer's Path")).toBe("The Staff Engineer's Path");
  });
});

describe("cycle", () => {
  test("wraps around in both directions", () => {
    const items = ["a", "b", "c"] as const;
    expect(cycle(items, 0)).toBe("a");
    expect(cycle(items, 4)).toBe("b");
    expect(cycle(items, -1)).toBe("c");
  });
});
