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
COPY --link bun.lock* package.json ./
COPY --link prisma ./prisma
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bun run prisma generate

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
CMD [ "sh", "-c", "bun run prisma db push --skip-generate && bun run start" ]
