# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.34
FROM oven/bun:${BUN_VERSION}-alpine as base

LABEL fly_launch_runtime="React Router"

# React Router app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install dependencies using bun
COPY --link bun.lockb* package.json ./
RUN bun install --frozen-lockfile

# Copy application code
COPY --link . .

# Build application
RUN bun run build


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "start" ]
