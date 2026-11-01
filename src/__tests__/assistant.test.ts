import { afterEach, describe, expect, test } from "bun:test";
import { chat } from "@tanstack/ai";
import { AI_MODEL } from "~/constants/ai";
import { askAISchema, createSiteAssistantAdapter } from "~/server/assistant";

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Stub Groq's chat completions endpoint with a non-streaming JSON reply. */
function stubGroq(content: string) {
  const requests: Array<{ url: string; body: Record<string, any> }> = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    const raw =
      typeof init?.body === "string"
        ? init.body
        : input instanceof Request
          ? await input.text()
          : "{}";
    requests.push({ url, body: JSON.parse(raw) });
    return Response.json({
      id: "chatcmpl-test",
      object: "chat.completion",
      created: 0,
      model: AI_MODEL,
      choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    });
  }) as typeof fetch;
  return requests;
}

function ask() {
  return chat({
    adapter: createSiteAssistantAdapter("gsk_test"),
    threadId: "test-thread",
    systemPrompts: ["You are the site assistant."],
    messages: [{ role: "user", content: "What should I read?" }],
    modelOptions: { temperature: 0.7, max_completion_tokens: 300 },
    outputSchema: askAISchema,
  });
}

describe("site assistant Groq adapter", () => {
  test("sends one non-streaming json_schema request and returns the typed reply", async () => {
    const reply = {
      response: "Start with the module federation posts.",
      actions: [{ type: "navigate" as const, path: "/blog", label: "BLOG" }],
    };
    const requests = stubGroq(JSON.stringify(reply));

    const output = await ask();

    expect(output).toEqual(reply);
    expect(requests).toHaveLength(1);
    const [{ url, body }] = requests;
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    // Groq rejects streaming together with structured outputs.
    expect(body.stream).toBe(false);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.model).toBe(AI_MODEL);
    expect(body.temperature).toBe(0.7);
    expect(body.max_completion_tokens).toBe(300);
    expect(body.messages).toEqual([
      { role: "system", content: "You are the site assistant." },
      { role: "user", content: "What should I read?" },
    ]);
  });

  test("rejects a reply that doesn't match the schema", async () => {
    stubGroq(JSON.stringify({ response: "hi", actions: [{ type: "teleport" }] }));
    const error = await ask().then(
      () => null,
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(Error);
  });
});
