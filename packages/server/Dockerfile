FROM oven/bun:1.2-alpine AS base

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile --production

WORKDIR /app/packages/server

CMD ["bun", "serve"]
