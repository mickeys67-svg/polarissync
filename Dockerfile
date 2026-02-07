# Build Stage
FROM node:20-slim AS builder
WORKDIR /app
# Copy package files for caching
COPY frontend/package.json frontend/package-lock.json* ./frontend/
WORKDIR /app/frontend
# Install ALL dependencies (including dev) for building
RUN npm install
COPY frontend/ .
RUN npm run build

# Production Stage
FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /app
# Copy root package files if they exist
COPY package.json package-lock.json* ./
# Install only prod dependencies (express). Fallback to init if package.json is missing/invalid for server
RUN npm install --production --no-optional || (npm init -y && npm install express)
# Copy built assets to 'public' folder
COPY --from=builder /app/frontend/dist ./public
COPY server.js ./
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]

