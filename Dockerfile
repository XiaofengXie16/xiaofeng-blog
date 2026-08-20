# syntax = docker/dockerfile:1

# Node is used only to build; the runtime image is Bun (see BUN_VERSION below)
ARG NODE_VERSION=24
ARG BUN_VERSION=1.4

# Throw-away build stage to reduce size of final image
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

# Install Vite+ CLI (curl needed for installer)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://vite.plus | bash
ENV PATH="/root/.vite-plus/bin:$PATH"

# Install dependencies
COPY --link package-lock.json package.json ./
RUN sed -i 's/"prepare": "vp config"/"prepare": "true"/' package.json && \
    npm ci

# Copy application code
COPY --link . .

# Build application (emits .output/ via Nitro)
RUN vp build

# Drop dev dependencies for the final image
RUN npm prune --omit=dev


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
