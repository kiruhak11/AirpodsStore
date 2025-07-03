ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-slim as base

# Install system dependencies including build tools for native modules
RUN apt-get update && apt-get install -y \
  openssl \
  libssl-dev \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

ARG PORT=3010

ENV NODE_ENV=production

WORKDIR /app

# Build
FROM base as build

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production=false

COPY . .

COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /app /app

# Применение миграций при запуске контейнера
CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]