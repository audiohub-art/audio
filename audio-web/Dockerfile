# ─── deps ────────────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl build-base python3 py3-setuptools
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ─── builder ─────────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ─── runner ──────────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile --production && \
    bun pm cache rm

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "bun start"]
