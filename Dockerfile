# ---------- Build stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Limit memory usage to prevent Hostinger container OOM (Out Of Memory) crash
ENV NODE_OPTIONS="--max-old-space-size=1536"

COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund --legacy-peer-deps

COPY . .
RUN npm run build


# ---------- Production stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]