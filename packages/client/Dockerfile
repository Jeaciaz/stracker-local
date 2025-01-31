FROM oven/bun:1.2-alpine AS base

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile --production

WORKDIR /app/packages/client

RUN bun run build

RUN mkdir -p /dist

CMD ["sh", "-c", "cp -r /app/packages/client/dist/. /dist/ && tail -f /dev/null"]
