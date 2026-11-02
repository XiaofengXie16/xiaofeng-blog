My blog: https://www.xiaofengxie.dev/

Built with TanStack Start (React 19 through TanStack Redact), Tailwind CSS v4 and three.js, on Bun. It deploys to Fly.io from `main`.

## Getting started

```sh
bun install
bun run dev     # http://localhost:3000
```

`bun run format`, `lint`, `typecheck` and `test` are what CI runs. [AGENTS.md](AGENTS.md) has the full toolchain. Set `GROQ_API_KEY` to enable the ⌘K assistant's Ask AI mode.

## Where things live

| Path                          | What                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| `src/routes/`                 | Pages (file-based routing), plus `rss.xml` and `sitemap.xml`                |
| `src/blogs/`                  | Posts, as markdown with front matter                                        |
| `src/constants/`              | Site content and config: pages, books, tools, site URL and meta             |
| `src/components/design/`      | Shared UI: section headings, filter pills, the bookshelf, sky messages      |
| `src/components/three/`       | The plush 3D figures and the 3D bookshelf, lazy-loaded after hydration      |
| `src/components/figures/`     | SVG illustrations, also the fallbacks when WebGL is unavailable             |
| `src/components/CommandAgent` | The ⌘K palette: search over pages, tools and books, and Ask AI              |
| `src/server/`                 | Server functions (blog data, the AI assistant) and the assistant's prompt   |
| `src/utils/`                  | Pure helpers (markdown, feeds, search, motion), unit-tested in `__tests__/` |

The canonical origin is `https://www.xiaofengxie.dev`. Override it with `VITE_SITE_URL` at build time or `SITE_URL` at runtime.
