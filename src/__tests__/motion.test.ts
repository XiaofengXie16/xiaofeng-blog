import { describe, expect, test } from "bun:test";
import {
  blinkAmount,
  bounceDrop,
  clamp01,
  columnCenters,
  easeOutBack,
  springStep,
  stagger,
} from "~/utils/motion";

describe("springStep", () => {
  test("settles on the target", () => {
    const s = { value: 0, velocity: 0 };
    for (let i = 0; i < 240; i++) springStep(s, 1, 1 / 60);
    expect(s.value).toBeCloseTo(1, 3);
    expect(Math.abs(s.velocity)).toBeLessThan(0.01);
  });

  test("overshoots on the way, which makes it bouncy", () => {
    const s = { value: 0, velocity: 0 };
    let peak = 0;
    for (let i = 0; i < 120; i++) peak = Math.max(peak, springStep(s, 1, 1 / 60).value);
    expect(peak).toBeGreaterThan(1);
  });

  test("stays stable across a very long frame", () => {
    const s = { value: 0, velocity: 0 };
    springStep(s, 1, 5);
    expect(Number.isFinite(s.value)).toBe(true);
    expect(Math.abs(s.value)).toBeLessThan(2);
  });
});

describe("easing", () => {
  test("easeOutBack starts at 0, ends at 1 and overshoots", () => {
    expect(easeOutBack(0)).toBeCloseTo(0);
    expect(easeOutBack(1)).toBeCloseTo(1);
    expect(Math.max(...[0.6, 0.7, 0.8].map((t) => easeOutBack(t)))).toBeGreaterThan(1);
  });

  test("bounceDrop falls from 1 to rest at 0", () => {
    expect(bounceDrop(0)).toBeCloseTo(1);
    expect(bounceDrop(1)).toBeCloseTo(0);
    for (const t of [0.2, 0.5, 0.8, 0.95]) {
      expect(bounceDrop(t)).toBeGreaterThanOrEqual(0);
      expect(bounceDrop(t)).toBeLessThanOrEqual(1);
    }
  });
});

describe("stagger", () => {
  test("later items start later", () => {
    expect(stagger(0.1, 0, 0.1, 1)).toBeCloseTo(0.1);
    expect(stagger(0.1, 1, 0.1, 1)).toBe(0);
    expect(stagger(5, 3, 0.1, 1)).toBe(1);
  });
});

describe("columnCenters", () => {
  test("spreads items evenly around 0", () => {
    expect(columnCenters(2, 10)).toEqual([-2.5, 2.5]);
    expect(columnCenters(6, 12)[0]).toBeCloseTo(-5);
    expect(columnCenters(6, 12)[5]).toBeCloseTo(5);
  });
});

describe("blinkAmount", () => {
  test("eyes are open most of the time and close briefly", () => {
    expect(blinkAmount(1)).toBe(0);
    expect(blinkAmount(3.6 + 0.07)).toBeCloseTo(1, 1);
  });
});

test("clamp01", () => {
  expect(clamp01(-1)).toBe(0);
  expect(clamp01(0.4)).toBe(0.4);
  expect(clamp01(3)).toBe(1);
});
