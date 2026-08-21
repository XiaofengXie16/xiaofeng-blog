import { createServerFn } from "@tanstack/react-start";
import { Output, generateText } from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { getAllBlogPosts } from "~/utils/blogData";
import { AI_MODEL } from "~/constants/ai";

let _systemPrompt: string | null = null;
function buildSystemPrompt(): string {
  if (_systemPrompt) return _systemPrompt;
  const tools = TOOLS.map((t) => `- ${t.name} (${t.category}): ${t.description}`).join("\n");
  const books = BOOKS.map((b) => `- ${b.name}`).join("\n");

  let blogInfo = "";
  try {
    const posts = getAllBlogPosts();
    blogInfo = posts
      .map((p) => `- "${p.title}" (slug: ${p.slug}): ${p.preview.slice(0, 200)}`)
      .join("\n");
  } catch {
    blogInfo = "Blog posts unavailable";
  }

  _systemPrompt = `You are the AI assistant embedded in Xiaofeng's personal developer blog (XIAOFENG.DEV). You have a cyberpunk/hacker personality — concise, technical, slightly witty. Use terminal-style language sparingly.

ABOUT THE SITE OWNER:
- Xiaofeng Xie is a Software Engineer who crafts digital experiences
- The site has a cyberpunk/hacker aesthetic with neon colors

SITE PAGES:
- / (HOME) — Landing page with hero section
- /blog (BLOG) — Blog posts about software engineering
- /reading-list (READING LIST) — Book recommendations
- /tool (TOOLS) — Developer tools and utilities Xiaofeng uses

BLOG POSTS:
${blogInfo}

TOOLS XIAOFENG USES:
${tools}

READING LIST:
${books}

INSTRUCTIONS:
- Keep responses SHORT (2-4 sentences max). This is a command palette, not a chat.
- When relevant, suggest up to 4 actions: "navigate" for an internal page (set "path"), "open" for an external link (set "url").
- Be helpful: answer questions about the site, recommend tools, suggest blog posts
- If asked something unrelated to the site, briefly answer but steer back to what's available
- Never use markdown. Plain text only.`;
  return _systemPrompt;
}

type AskAIInput = {
  query: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
};

const actionSchema = z.object({
  type: z.enum(["navigate", "open"]).describe("navigate = internal page, open = external link"),
  path: z.string().optional().describe("Internal route starting with / (navigate only)"),
  url: z.string().optional().describe("Absolute http(s) URL (open only)"),
  label: z.string().optional().describe("Short button label"),
});

const askAISchema = z.object({
  response: z.string().describe("Plain-text answer, 2-4 sentences. No markdown."),
  actions: z.array(actionSchema).max(4).describe("Suggested follow-up actions; may be empty."),
});

type ActionItem = { type: "navigate" | "open"; path?: string; url?: string; label?: string };

function validateAskAIInput(input: unknown): AskAIInput {
  if (!input || typeof input !== "object") {
    throw new Error("Expected an AI request payload");
  }

  const payload = input as Record<string, unknown>;
  if (typeof payload.query !== "string" || !payload.query.trim()) {
    throw new Error("Expected a non-empty AI query");
  }

  const history = Array.isArray(payload.history) ? payload.history : [];
  return {
    query: payload.query.trim().slice(0, 1_000),
    history: history
      .filter(
        (msg): msg is { role: "user" | "assistant"; content: string } =>
          !!msg &&
          typeof msg === "object" &&
          ((msg as { role?: unknown }).role === "user" ||
            (msg as { role?: unknown }).role === "assistant") &&
          typeof (msg as { content?: unknown }).content === "string",
      )
      .slice(-6)
      .map((msg) => ({ role: msg.role, content: msg.content.slice(0, 1_000) })),
  };
}

function normalizeActions(actions: unknown): ActionItem[] {
  if (!Array.isArray(actions)) return [];

  return actions.flatMap<ActionItem>((action) => {
    if (!action || typeof action !== "object") return [];
    const item = action as Record<string, unknown>;
    const label = typeof item.label === "string" ? item.label.slice(0, 80) : undefined;

    if (item.type === "navigate" && typeof item.path === "string" && item.path.startsWith("/")) {
      return [{ type: "navigate", path: item.path, label }];
    }

    if (item.type === "open" && typeof item.url === "string" && /^https?:\/\//i.test(item.url)) {
      return [{ type: "open", url: item.url, label }];
    }

    return [];
  });
}

export const askAI = createServerFn({ method: "POST" })
  .validator(validateAskAIInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        response:
          "AI not configured. Set GROQ_API_KEY environment variable to enable the AI assistant.",
        actions: [] as ActionItem[],
      };
    }

    const systemPrompt = buildSystemPrompt();

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...data.history.map((msg) => ({
        role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: data.query },
    ];

    try {
      const result = await generateText({
        model: groq(AI_MODEL),
        messages,
        temperature: 0.7,
        maxOutputTokens: 300,
        output: Output.object({
          schema: askAISchema,
          name: "site_assistant_reply",
          description: "A short reply plus optional navigation actions.",
        }),
      });

      // Still normalize: the schema constrains shape, not whether a path is
      // internal or a URL is http(s).
      return {
        response: result.output.response.trim(),
        actions: normalizeActions(result.output.actions),
      };
    } catch (err) {
      // Surface the real cause: a silent catch here is why the llama-3.1
      // shutdown went unnoticed in production.
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`AI SDK error (model: ${AI_MODEL}):`, err);
      return {
        response: `AI request failed (${detail}). Try again.`,
        actions: [] as ActionItem[],
      };
    }
  });
