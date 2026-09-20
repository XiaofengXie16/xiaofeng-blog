import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { logError, logInfo } from "../utils/logger";

const parseLine = (spy: { mock: { calls: unknown[][] } }, call = 0): Record<string, unknown> =>
  JSON.parse(String(spy.mock.calls[call]?.[0])) as Record<string, unknown>;

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits one JSON line carrying the event name and its fields", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});

    logInfo("ai.ask", { model: "openai/gpt-oss-20b", outcome: "ok", durationMs: 42 });

    expect(spy).toHaveBeenCalledTimes(1);
    const record = parseLine(spy);
    expect(record).toMatchObject({
      level: "info",
      event: "ai.ask",
      model: "openai/gpt-oss-20b",
      outcome: "ok",
      durationMs: 42,
    });
    expect(typeof record.time).toBe("string");
  });

  it("attaches an Error object as named error fields", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("ai.ask", { outcome: "error" }, new Error("groq 503"));

    const record = parseLine(spy);
    expect(record).toMatchObject({
      level: "error",
      event: "ai.ask",
      outcome: "error",
      errorName: "Error",
      errorMessage: "groq 503",
    });
  });

  it("keeps a string throwable verbatim", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("ai.ask", {}, "plain failure");

    expect(parseLine(spy).errorMessage).toBe("plain failure");
  });

  it("serializes a non-Error object throwable instead of stringifying it", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("ai.ask", {}, { status: 503, code: "unavailable" });

    expect(JSON.parse(String(parseLine(spy).errorMessage))).toEqual({
      status: 503,
      code: "unavailable",
    });
  });

  it("omits error fields when no error is passed", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logError("ai.ask", { outcome: "unconfigured" });

    const record = parseLine(spy);
    expect(record.outcome).toBe("unconfigured");
    expect(record).not.toHaveProperty("errorMessage");
  });

  it("never throws when a field cannot be serialized", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(() => logInfo("x", { circular })).not.toThrow();

    const record = parseLine(spy);
    expect(record.event).toBe("x");
    expect(record.serializationFailed).toBe(true);
  });
});
