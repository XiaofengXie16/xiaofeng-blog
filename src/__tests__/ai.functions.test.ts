import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

// The pinned `ai` SDK (7.x) rejects a system message inside `messages`:
// "System messages are not allowed in the prompt or messages fields. Use the
// instructions option instead." The handler must pass its system prompt through
// `instructions`, so these tests pin that call shape.
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

async function callAskAI(data: unknown) {
  const startContext = {
    contextAfterGlobalMiddlewares: {},
    request: new Request("http://localhost/askAI"),
  };
  return runWithStartContext(startContext as never, () =>
    (askAI as unknown as (opts: unknown) => Promise<unknown>)({ data }),
  );
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
    await callAskAI({ query: "hello", history: [] });

    expect(mockedGenerateText).toHaveBeenCalledTimes(1);
    const args = mockedGenerateText.mock.calls[0][0] as Record<string, unknown>;

    // The system prompt must reach the SDK through `instructions`.
    expect(typeof args.instructions).toBe("string");
    expect(args.instructions).toContain("XIAOFENG.DEV");

    // No system role may remain in `messages`, or the SDK throws.
    const messages = args.messages as Array<{ role: string; content: string }>;
    expect(messages.some((message) => message.role === "system")).toBe(false);
    expect(messages.at(-1)).toMatchObject({ role: "user", content: "hello" });
  });

  it("keeps prior user and assistant turns in the messages array", async () => {
    await callAskAI({
      query: "and the tools?",
      history: [
        { role: "user", content: "who is Xiaofeng?" },
        { role: "assistant", content: "A software engineer." },
      ],
    });

    const args = mockedGenerateText.mock.calls[0][0] as Record<string, unknown>;
    expect(args.messages).toEqual([
      { role: "user", content: "who is Xiaofeng?" },
      { role: "assistant", content: "A software engineer." },
      { role: "user", content: "and the tools?" },
    ]);
  });
});
