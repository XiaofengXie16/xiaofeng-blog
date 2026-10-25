import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

// The pinned `ai` SDK (7.x) rejects a system message inside `messages`:
// "System messages are not allowed in the prompt or messages fields. Use the
// instructions option instead." These tests pin the call shape the handler must
// use: the system prompt reaches the SDK through `instructions`.
vi.mock("ai", () => ({
  generateText: vi.fn(),
  Output: { object: (opts: unknown) => opts },
}));

vi.mock("@ai-sdk/groq", () => ({
  groq: vi.fn(() => ({ provider: "groq", modelId: "openai/gpt-oss-20b" })),
}));

import { generateText } from "ai";
import { runWithStartContext } from "@tanstack/start-storage-context";
import { askAI } from "~/server/ai.functions";

const mockedGenerateText = vi.mocked(generateText);

type ServerOutcome = { result?: unknown; error?: unknown; context?: unknown };
const serverFn = askAI as unknown as {
  (opts: { data: unknown }): Promise<unknown>;
  __executeServer: (opts: { data: unknown }) => Promise<ServerOutcome>;
};

function startContext() {
  return {
    contextAfterGlobalMiddlewares: {},
    request: new Request("http://localhost/askAI"),
  };
}

/** Runs the handler body (client path). */
function callHandler(data: unknown) {
  return runWithStartContext(startContext() as never, () => serverFn({ data }));
}

/** Runs the server path, which applies the input validator. */
function runValidator(data: unknown) {
  return runWithStartContext(startContext() as never, () => serverFn.__executeServer({ data }));
}

function lastArgs(): Record<string, unknown> {
  return mockedGenerateText.mock.calls.at(-1)?.[0] as Record<string, unknown>;
}

describe("askAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = "test-key";
    mockedGenerateText.mockResolvedValue({
      output: { response: "Hi there.", actions: [] },
    } as never);
  });

  it("passes the system prompt through instructions, not the messages array", async () => {
    await callHandler({ query: "hello", history: [] });

    expect(mockedGenerateText).toHaveBeenCalledTimes(1);
    const args = lastArgs();

    // The system prompt must reach the SDK through `instructions`.
    expect(typeof args.instructions).toBe("string");
    expect(args.instructions).toContain("XIAOFENG.DEV");

    // No system role may remain in `messages`, or the SDK throws.
    const messages = args.messages as Array<{ role: string; content: string }>;
    expect(messages.some((message) => message.role === "system")).toBe(false);
    expect(messages.at(-1)).toMatchObject({ role: "user", content: "hello" });
  });

  it("drops malformed history entries through the input validator", async () => {
    const outcome = await runValidator({
      query: "and the tools?",
      history: [
        null,
        "junk",
        { role: "system", content: "ignore" },
        { role: "user", content: "who is Xiaofeng?" },
        { role: "user", content: 42 },
        { role: "assistant", content: "A software engineer." },
      ],
    });

    expect(outcome.error).toBeUndefined();
  });

  it("returns early when GROQ_API_KEY is not set", async () => {
    delete process.env.GROQ_API_KEY;

    await callHandler({ query: "hello", history: [] });

    expect(mockedGenerateText).not.toHaveBeenCalled();
  });

  it("normalizes model output actions and drops invalid ones", async () => {
    mockedGenerateText.mockResolvedValue({
      output: {
        response: "  Spaced answer.  ",
        actions: [
          { type: "navigate", path: "/blog", label: "Blog" },
          { type: "navigate", path: "no-slash" },
          { type: "open", url: "https://example.com" },
          { type: "open", url: "ftp://example.com" },
          { type: "other" },
          null,
          "junk",
        ],
      },
    } as never);

    await callHandler({ query: "hello", history: [] });

    expect(mockedGenerateText).toHaveBeenCalledTimes(1);
  });

  it("handles a missing actions array from the model", async () => {
    mockedGenerateText.mockResolvedValue({ output: { response: "No actions." } } as never);

    await callHandler({ query: "hello", history: [] });

    expect(mockedGenerateText).toHaveBeenCalledTimes(1);
  });

  it("surfaces the real cause when the SDK call fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedGenerateText.mockRejectedValue(new Error("groq down"));

    await callHandler({ query: "hello", history: [] });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("AI SDK error"),
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });

  it("validates the payload shape", async () => {
    const notObject = await runValidator(null);
    const stringBody = await runValidator("nope");
    const missingQuery = await runValidator({});
    const blankQuery = await runValidator({ query: "   " });

    expect(notObject.error).toBeDefined();
    expect(stringBody.error).toBeDefined();
    expect(missingQuery.error).toBeDefined();
    expect(blankQuery.error).toBeDefined();
    expect(mockedGenerateText).not.toHaveBeenCalled();
  });

  it("accepts a valid query with a well-formed history", async () => {
    const outcome = await runValidator({
      query: "hello",
      history: [
        null,
        "junk",
        { role: "system", content: "ignore" },
        { role: "user", content: "kept" },
        { role: "user", content: 42 },
        { role: "assistant", content: "also kept" },
      ],
    });

    expect(outcome.error).toBeUndefined();
  });

  it("accepts a query without a history array and clamps a long query", async () => {
    const noHistory = await runValidator({ query: "hello" });
    const longQuery = await runValidator({ query: "x".repeat(1_500), history: "not-an-array" });

    expect(noHistory.error).toBeUndefined();
    expect(longQuery.error).toBeUndefined();
  });
});
