# Multi-stage build for production (fixed)
FROM node:18-alpine AS builder
WORKDIR /app

# copy package files then install all dependencies (dev + prod) for build
COPY package*.json pnpm-lock.yaml* ./

# Use full install for build step
RUN npm ci

# copy app source
COPY . .

# Build the Next app (will produce /app/out because next.config.mjs uses output: 'export')
RUN npm run build

# Production stage: serve static 'out' with nginx
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
