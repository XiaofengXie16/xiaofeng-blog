import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { getAllBlogPosts } from "~/utils/blogData";

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
- When relevant, suggest specific actions using this JSON format at the END of your response:
  [ACTIONS: {"actions": [{"type": "navigate", "path": "/blog", "label": "View Blog"}, {"type": "open", "url": "https://...", "label": "Open Raycast"}]}]
- Action types: "navigate" (internal page), "open" (external link)
- Be helpful: answer questions about the site, recommend tools, suggest blog posts
- If asked something unrelated to the site, briefly answer but steer back to what's available
- Never use markdown. Plain text only.`;
  return _systemPrompt;
}

type AskAIInput = {
  query: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
};

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
  .inputValidator(validateAskAIInput)
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
        model: groq("llama-3.1-8b-instant"),
        messages,
        temperature: 0.7,
        maxOutputTokens: 300,
      });

      const text = result.text;

      // Parse actions from the response
      let actions: ActionItem[] = [];
      let cleanText = text;

      const actionsMatch = text.match(/\[ACTIONS:\s*(\{.*\})\]/s);
      if (actionsMatch) {
        try {
          const parsed = JSON.parse(actionsMatch[1]);
          actions = normalizeActions(parsed.actions);
          cleanText = text.replace(/\[ACTIONS:\s*\{.*\}\]/s, "").trim();
        } catch {
          // ignore parse errors
        }
      }

      return { response: cleanText, actions };
    } catch (err) {
      console.error("AI SDK error:", err);
      return {
        response: "AI request failed. Try again.",
        actions: [] as ActionItem[],
      };
    }
  });
