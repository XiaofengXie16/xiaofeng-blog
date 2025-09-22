# Repository Guidelines

## Project Structure & Module Organization
`app/` contains the React Router codebase: UI modules live in `app/components/`, shared utilities in `app/utils/`, and route loaders/actions inside `app/routes/`. Tests mirror their targets inside `app/__tests__/`, while static assets stay in `public/` and build artifacts are emitted to `build/` after production builds. Reach for `vite.config.ts`, `tailwind.config.js`, and `react-router.config.ts` when adjusting bundling, styling, or filesystem routing.

## Build, Test, and Development Commands
`npm run dev` launches the Vite dev server with hot reloading; keep it running during feature work. Ship-ready bundles come from `npm run build`, served locally by `npm run start`. Guard quality with `npm run lint` (Oxlint) and `npm run typecheck` (React Router typegen + `tsc`) before every push. Use `npm run test`, `npm run test:watch`, or `npm run test:coverage` to execute Vitest suites, and reach for `npm run deploy` when releasing to Fly.io.

## Coding Style & Naming Conventions
Write TypeScript with 2-space indentation and allow Prettier (with the Tailwind plugin) to format files and order class lists. Favor PascalCase for React components (`PostList.tsx`) and camelCase for helpers; co-locate files with the feature they serve. Oxlint governs import order and React best practices—leave rule disables documented, and prefer filesystem-based route names such as `app/routes/blog.$slug.tsx`.

## Testing Guidelines
Vitest + Testing Library power all specs; use the JSDOM environment and assert on behavior, not implementation details. Name files `*.test.ts` or `*.test.tsx`, and keep fixtures alongside the spec to avoid global state. Run coverage before merging (`npm run test:coverage`) and reset mocked loaders or fetches in `beforeEach` hooks to keep tests isolated.

## Commit & Pull Request Guidelines
Write present-tense, imperative commit subjects under 72 characters (e.g., `Add markdown metadata parser`) and expand with rationale in the body when needed. Squash trivial fixups locally so the tree stays linear. Pull requests should describe the change, reference any issues, and attach screenshots or logs for UI or deployment-impacting work. Verify `npm run lint`, `npm run typecheck`, and `npm run test` locally before requesting review.

## Environment & Deployment Notes
Target Node 18+ as declared in `package.json`; re-run `npm install` whenever `bun.lock` changes. Store secrets in Fly.io or local `.env` files kept out of version control, and monitor Fly logs after `npm run deploy` for regressions.
