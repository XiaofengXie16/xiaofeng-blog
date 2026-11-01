import { describe, expect, test } from "bun:test";
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
