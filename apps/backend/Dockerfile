# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm first
RUN npm install -g pnpm@10.18.3

# Copy all package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the code
COPY apps/backend ./apps/backend

# Generate Prisma Client
RUN pnpm --dir apps/backend exec prisma generate --schema prisma/schema.prisma

# Build the application
RUN pnpm --dir apps/backend build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.18.3

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma schema
COPY apps/backend/prisma ./apps/backend/prisma

# Copy built application
COPY --from=builder /app/apps/backend/.next ./apps/backend/.next
COPY --from=builder /app/apps/backend/public ./apps/backend/public
COPY --from=builder /app/apps/backend/next.config.js ./apps/backend/
COPY --from=builder /app/apps/backend/middleware.ts ./apps/backend/

# Create a startup script to handle migrations
RUN echo '#!/bin/sh\nset -e\n\necho "Running database migrations..."\npnpm --dir apps/backend exec prisma migrate deploy\n\necho "Starting backend..."\npnpm --dir apps/backend start' > /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
