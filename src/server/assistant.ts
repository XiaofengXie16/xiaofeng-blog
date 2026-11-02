import { createGroqText } from "@tanstack/ai-groq";
import { z } from "zod";
import { AI_MODEL } from "~/constants/ai";

/**
 * Everything about the site assistant that doesn't need a request: the model
 * adapter, the reply schema, input validation, action normalisation and the
 * system prompt. Kept free of server-function plumbing so it can be tested.
 */

const MAX_TEXT = 1_000;
const MAX_HISTORY = 6;

const actionSchema = z.object({
  type: z.enum(["navigate", "open"]).describe("navigate = internal page, open = external link"),
  path: z.string().optional().describe("Internal route starting with / (navigate only)"),
  url: z.string().optional().describe("Absolute http(s) URL (open only)"),
  label: z.string().optional().describe("Short button label"),
});

/** The structured reply the model must produce. */
export const askAISchema = z.object({
  response: z.string().describe("Plain-text answer, 2-4 sentences. No markdown."),
  actions: z.array(actionSchema).max(4).describe("Suggested follow-up actions; may be empty."),
});

/** A follow-up button the palette renders under an answer. */
export type AssistantAction = z.infer<typeof actionSchema>;
export type AssistantReply = { response: string; actions: AssistantAction[] };

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().transform((s) => s.slice(0, MAX_TEXT)),
});
export type ChatTurn = z.output<typeof messageSchema>;

/**
 * Validates the palette's request. Over-long text is truncated rather than
 * rejected, and malformed history entries are dropped instead of failing the
 * whole request: the history is context, not something to error on.
 */
export const askAIInputSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Expected a non-empty AI query")
    .transform((s) => s.slice(0, MAX_TEXT)),
  history: z
    .array(z.unknown())
    .optional()
    .transform((items = []) =>
      items
        .flatMap((item) => {
          const parsed = messageSchema.safeParse(item);
          return parsed.success ? [parsed.data] : [];
        })
        .slice(-MAX_HISTORY),
    ),
});
export type AskAIInput = z.input<typeof askAIInputSchema>;

/**
 * Keeps only actions the palette can safely perform. The schema constrains
 * shape, not whether a path is internal or a URL is http(s).
 */
export function normalizeActions(actions: readonly AssistantAction[]): AssistantAction[] {
  return actions.flatMap<AssistantAction>(({ type, path, url, label }) => {
    const shortLabel = label?.slice(0, 80);
    if (type === "navigate" && path?.startsWith("/") && !path.startsWith("//")) {
      return [{ type, path, label: shortLabel }];
    }
    if (type === "open" && url && /^https?:\/\//i.test(url)) {
      return [{ type, url, label: shortLabel }];
    }
    return [];
  });
}

type PromptSources = {
  siteUrl: string;
  tools: readonly { name: string; category: string; description: string }[];
  books: readonly { name: string }[];
  posts: readonly { title: string; slug: string; preview: string }[];
};

/** The system prompt: who the assistant is, what the site holds and how to answer. */
export function buildSystemPrompt({ siteUrl, tools, books, posts }: PromptSources): string {
  const host = new URL(siteUrl).host;
  const list = <T>(items: readonly T[], line: (item: T) => string, empty: string) =>
    items.length ? items.map(line).join("\n") : empty;

  return `You are the AI assistant embedded in Xiaofeng's personal developer blog (${host}). Your tone is warm, calm and concise, with a light touch of whimsy.

ABOUT THE SITE OWNER:
- Xiaofeng Xie is a Software Engineer who crafts digital experiences
- The site has a painterly look: dusk skies, flowing ribbons, handwritten glowing notes and cute plush 3D figures

SITE PAGES:
- / (HOME) — Landing page with hero section
- /blog (BLOG) — Blog posts about software engineering
- /reading-list (READING LIST) — Book recommendations
- /tool (TOOLKIT) — Developer tools and utilities Xiaofeng uses

BLOG POSTS:
${list(posts, (p) => `- "${p.title}" (slug: ${p.slug}): ${p.preview.slice(0, 200)}`, "Blog posts unavailable")}

TOOLS XIAOFENG USES:
${list(tools, (t) => `- ${t.name} (${t.category}): ${t.description}`, "None listed")}

READING LIST:
${list(books, (b) => `- ${b.name}`, "None listed")}

INSTRUCTIONS:
- This is a command palette, not a chat.
- When relevant, suggest up to 4 actions: "navigate" for an internal page (set "path"), "open" for an external link (set "url").
- Be helpful: answer questions about the site, recommend tools, suggest blog posts
- If asked something unrelated to the site, briefly answer but steer back to what's available`;
}

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
