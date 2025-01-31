FROM oven/bun:1.2-alpine AS base

WORKDIR /app

COPY package.json bun.lockb .
COPY packages/client/package.json packages/client
COPY packages/server/package.json packages/server

RUN bun install --frozen-lockfile --production

COPY . .

WORKDIR /app/packages/client

RUN bun run build

COPY ./dist /dist
