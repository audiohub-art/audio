FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build && find dist -type f -name "*.js"

FROM oven/bun:1-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile --production && \
    bun pm cache rm
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

ENV NODE_ENV=production
ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma.config.ts ./prisma.config.ts


USER nestjs
EXPOSE 3333

CMD ["sh", "-c", "bunx prisma migrate deploy && bun dist/src/main.js"]
