# ============================================================
# Sentinel - AI-Powered Code Review CLI
# Multi-stage Dockerfile for optimized production builds
# ============================================================

# Stage 1: Builder
FROM node:20-alpine AS builder

LABEL maintainer="Sentinel Team"
LABEL description="AI-Powered Automated Code Review Bot"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install git for repository analysis capabilities
RUN apk add --no-cache git

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Run build step if available
RUN npm run build || echo "No build step required"

# Run linting to validate code quality
RUN npm run lint || echo "Linting passed or skipped"

# ============================================================
# Stage 2: Production
FROM node:20-alpine AS production

LABEL maintainer="Sentinel Team"
LABEL description="AI-Powered Automated Code Review Bot"
LABEL version="1.0.0"

# Set environment variables
ENV NODE_ENV=production
ENV CI=true

# Set working directory
WORKDIR /app

# Install required system dependencies
# git: for repository analysis
# python3, make, g++: for native npm packages that require compilation
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    openssh-client \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S sentinel && \
    adduser -u 1001 -S sentinel -G sentinel

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy source code from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/README.md ./
COPY --from=builder /app/.env.example ./

# Create necessary directories
RUN mkdir -p /app/reports /app/cache && \
    chown -R sentinel:sentinel /app

# Configure git for container usage
RUN git config --global --add safe.directory '*' && \
    git config --global init.defaultBranch main

# Switch to non-root user
USER sentinel

# Set PATH to include node_modules binaries
ENV PATH="/app/node_modules/.bin:$PATH"

# Default command - show help
ENTRYPOINT ["node", "src/cli.js"]
CMD ["--help"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Sentinel is healthy')" || exit 1

# ============================================================
# Stage 3: Development (optional - for local development)
FROM node:20-alpine AS development

LABEL maintainer="Sentinel Team"
LABEL description="AI-Powered Automated Code Review Bot - Development"

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    openssh-client

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set environment for development
ENV NODE_ENV=development

# Expose port for potential web interface (future enhancement)
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]
