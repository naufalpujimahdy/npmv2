# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./backend-package.json

# Install pnpm and dependencies
RUN npm install -g pnpm@10.18.3
COPY . .
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.18.3

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY apps/backend/package.json ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma files
COPY apps/backend/prisma ./prisma

# Copy built application
COPY --from=builder /app/apps/backend/.next ./apps/backend/.next
COPY --from=builder /app/apps/backend/public ./apps/backend/public
COPY --from=builder /app/apps/backend/next.config.js ./apps/backend/
COPY --from=builder /app/apps/backend/middleware.ts ./apps/backend/

# Create a startup script to handle migrations
RUN echo '#!/bin/sh\nset -e\n\necho "Running database migrations..."\npnpm exec prisma migrate deploy --schema apps/backend/prisma/schema.prisma\n\necho "Starting backend..."\nexec node apps/backend/node_modules/.bin/next start --port 3000' > /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
