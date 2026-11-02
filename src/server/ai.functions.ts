import { createServerFn } from "@tanstack/react-start";
import { chat } from "@tanstack/ai";
import {
  askAIInputSchema,
  askAISchema,
  buildSystemPrompt,
  createSiteAssistantAdapter,
  normalizeActions,
  type AssistantReply,
} from "~/server/assistant";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { getSiteUrl } from "~/constants/site";
import { getAllBlogPosts } from "~/utils/blogData";
import { AI_MODEL } from "~/constants/ai";

// The prompt only depends on content baked into the build, so build it once.
let systemPrompt: string | undefined;
const getSystemPrompt = () =>
  (systemPrompt ??= buildSystemPrompt({
    siteUrl: getSiteUrl(),
    tools: TOOLS,
    books: BOOKS,
    posts: getAllBlogPosts(),
  }));

/** Answers a command-palette question about the site with Groq. */
export const askAI = createServerFn({ method: "POST" })
  .validator(askAIInputSchema)
  .handler(async ({ data }): Promise<AssistantReply> => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        response:
          "AI not configured. Set GROQ_API_KEY environment variable to enable the AI assistant.",
        actions: [],
      };
    }

    try {
      // With an outputSchema and no tools, TanStack AI skips the agent loop
      // and makes a single schema-constrained Groq request.
      const output = await chat({
        adapter: createSiteAssistantAdapter(apiKey),
        threadId: crypto.randomUUID(),
        systemPrompts: [getSystemPrompt()],
        messages: [...data.history, { role: "user", content: data.query }],
        modelOptions: { temperature: 0.7, max_completion_tokens: 300 },
        outputSchema: askAISchema,
      });

      return { response: output.response.trim(), actions: normalizeActions(output.actions) };
    } catch (err) {
      // Surface the real cause: a silent catch here is why the llama-3.1
      // shutdown went unnoticed in production.
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`TanStack AI error (model: ${AI_MODEL}):`, err);
      return { response: `AI request failed (${detail}). Try again.`, actions: [] };
    }
  });
