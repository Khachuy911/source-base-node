# Stage 1: Build base image
FROM node:18-alpine as base

WORKDIR /app

RUN npm install -g pnpm@9.1.3

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
COPY services/node-api/package.json ./services/node-api/

# Use BuildKit cache mount for efficient package installation
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build node-api

# Stage 2: Build production image
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/node-api/package.json ./services/node-api/

RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    npm install -g pnpm@9.1.3 && \
    pnpm install --prod --frozen-lockfile

# Stage 3: Create final image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY scripts/entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "entrypoint.sh"]

CMD ["node", "dist/services/node-api/main.js"]
