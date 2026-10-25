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

# Drop dev dependencies for the final image
RUN rm -rf node_modules && bun install --frozen-lockfile --production


# Final stage for app image
FROM oven/bun:${BUN_VERSION}-slim

LABEL fly_launch_runtime="TanStack Start"

# App lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy built application
COPY --from=build /app /app

# Start the Nitro node-server output under Bun
EXPOSE 3000
CMD [ "bun", "./.output/server/index.mjs" ]
