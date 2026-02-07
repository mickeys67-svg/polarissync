# Build Stage
FROM node:20-slim AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build -- --emptyOutDir

# Production Stage
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY server.js ./
EXPOSE 8080
CMD ["node", "server.js"]
