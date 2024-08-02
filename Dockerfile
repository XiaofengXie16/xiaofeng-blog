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

# Copy package files and install dependencies using Bun
COPY package.json bun.lockb ./
RUN bun install

# Copy application code
COPY . .

# Build application using Bun
RUN bun run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Expose port
EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
CMD ["bun", "run", "start"]
