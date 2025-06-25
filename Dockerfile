# syntax=docker/dockerfile:1

# Use the official Bun image
FROM oven/bun:latest as base

# Label for the runtime environment
LABEL fly_launch_runtime="Remix"

# Set the working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install dependencies using Bun with clean install
RUN bun install --frozen-lockfile --production=false

# Copy application code
COPY . .

# Build application using Bun
RUN bun run build

# Remove development dependencies
RUN bun install --production --frozen-lockfile

# Final stage for app image
FROM base

# Create non-root user for security
RUN addgroup --system --gid 1001 bun
RUN adduser --system --uid 1001 bun

# Copy only the built application and production dependencies
COPY --from=build --chown=bun:bun /app/build /app/build
COPY --from=build --chown=bun:bun /app/node_modules /app/node_modules
COPY --from=build --chown=bun:bun /app/package.json /app/package.json

# Switch to non-root user
USER bun

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the server by default, this can be overwritten at runtime
CMD ["bun", "run", "start"]
