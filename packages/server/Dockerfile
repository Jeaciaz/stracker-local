FROM oven/bun:1.2-alpine AS base

WORKDIR /app

COPY package.json bun.lockb .
COPY packages/server/package.json packages/server

RUN bun install --frozen-lockfile --production

COPY . .

WORKDIR /app/packages/server

CMD ["bun", "serve"]
