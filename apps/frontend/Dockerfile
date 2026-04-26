# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./frontend-package.json

# Install pnpm and dependencies
RUN npm install -g pnpm@10.18.3
COPY . .
RUN pnpm install --frozen-lockfile

# Build the application
WORKDIR /app/apps/frontend
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.18.3

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY apps/frontend/package.json ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/next.config.js ./apps/frontend/

EXPOSE 3001

CMD ["pnpm", "--dir", "apps/frontend", "start"]
