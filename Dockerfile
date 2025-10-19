# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy app source
COPY . .

# Build the Next.js app (will produce /app/out because next.config.mjs uses output: 'export')
RUN npm run build

# Production stage: serve static 'out' with nginx
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
