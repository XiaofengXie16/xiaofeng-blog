# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="TanStack Start"

# App lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

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
FROM base

# Copy built application
COPY --from=build /app /app

# Start the Nitro node-server output
EXPOSE 3000
CMD [ "node", "./.output/server/index.mjs" ]
