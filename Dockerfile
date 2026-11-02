# syntax = docker/dockerfile:1

# Bun installs dependencies and serves the app; Node runs the Vite build,
# because the TanStack Start prerenderer boots the built server under Node.
ARG NODE_VERSION=24
# Keep in sync with "packageManager" in package.json and the Dagger module.
ARG BUN_VERSION=1.4.4

FROM oven/bun:${BUN_VERSION}-slim AS bun

# Throw-away build stage to reduce size of final image
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

COPY --link --from=bun /usr/local/bin/bun /usr/local/bin/bun

# Install dependencies (the `prepare` hook setup is a no-op without git)
COPY --link package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code
COPY --link . .

# Build application (emits .output/ via Nitro). `bun run` honors the vite
# bin's node shebang, so the build and prerender run under Node.
RUN bun run build


# Final stage for app image
FROM oven/bun:${BUN_VERSION}-slim

LABEL fly_launch_runtime="TanStack Start"

WORKDIR /app
ENV NODE_ENV="production"

# Nitro's output is self-contained: the server bundle inlines every dependency
# (vite.config.ts sets ssr.noExternal) and traces the rest into .output, so the
# runtime image needs neither node_modules nor the source.
COPY --from=build /app/.output /app/.output

# Start the Nitro node-server output under Bun
EXPOSE 3000
USER bun
CMD [ "bun", "./.output/server/index.mjs" ]
