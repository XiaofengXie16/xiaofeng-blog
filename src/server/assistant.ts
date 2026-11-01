import { createGroqText } from "@tanstack/ai-groq";
import { z } from "zod";
import { AI_MODEL } from "~/constants/ai";

const actionSchema = z.object({
  type: z.enum(["navigate", "open"]).describe("navigate = internal page, open = external link"),
  path: z.string().optional().describe("Internal route starting with / (navigate only)"),
  url: z.string().optional().describe("Absolute http(s) URL (open only)"),
  label: z.string().optional().describe("Short button label"),
});

export const askAISchema = z.object({
  response: z.string().describe("Plain-text answer, 2-4 sentences. No markdown."),
  actions: z.array(actionSchema).max(4).describe("Suggested follow-up actions; may be empty."),
});

/**
 * Groq text adapter for the site assistant, with structured output forced
 * onto a single non-streaming request.
 *
 * TanStack AI's Groq adapter streams structured output
 * (`stream: true` + `response_format: json_schema`), but Groq documents that
 * "Streaming and tool use are not currently supported with Structured
 * Outputs" (https://console.groq.com/docs/structured-outputs). Without
 * `structuredOutputStream`, `chat()` falls back to the adapter's
 * `structuredOutput()`, which sends `stream: false`. That fallback is
 * TanStack AI's own production path for adapters without native streaming.
 */
export function createSiteAssistantAdapter(apiKey: string) {
  const adapter = createGroqText(AI_MODEL, apiKey);
  Object.defineProperty(adapter, "structuredOutputStream", { value: undefined });
  return adapter;
}
