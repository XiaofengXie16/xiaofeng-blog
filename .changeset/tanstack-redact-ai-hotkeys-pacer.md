---
"xiaofeng-blog": minor
---

Adopt TanStack Redact, TanStack AI, TanStack Hotkeys and TanStack Pacer

- TanStack Redact replaces React/React DOM in the browser via its Vite plugin (Activity, fragment refs and portals disabled; the site uses none of them). Client JS drops from 144.7 KB to 107.8 KB gzipped
- The command palette assistant moves from the Vercel AI SDK (`ai`, `@ai-sdk/groq`) to `@tanstack/ai` with the native `@tanstack/ai-groq` adapter. Structured output is forced onto a single non-streaming request, since Groq doesn't support streaming with structured outputs
- Cmd/Ctrl+K uses `useHotkey` from `@tanstack/react-hotkeys` instead of a hand-written `keydown` listener
- AI queries are rate-limited client-side to 5 per minute with `@tanstack/react-pacer`
