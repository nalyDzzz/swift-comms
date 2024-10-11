# DEPENDENCIES
FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY prisma ./

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ARG AUTH_GOOGLE_SECRET
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ARG AUTH_GITHUB_ID
ENV AUTH_GITHUB_ID=${AUTH_GITHUB_ID}
ARG AUTH_GITHUB_SECRET
ENV AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET}
ARG AUTH_URL
ENV AUTH_URL=${AUTH_URL}
ARG AUTH_SECRET
ENV AUTH_SECRET=${AUTH_SECRET}
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV AUTH_TRUST_HOST=true

RUN npx prisma db push
RUN npm run build

FROM --platform=linux/amd64 gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ARG AUTH_GOOGLE_SECRET
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ARG AUTH_GITHUB_ID
ENV AUTH_GITHUB_ID=${AUTH_GITHUB_ID}
ARG AUTH_GITHUB_SECRET
ENV AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET}
ARG AUTH_URL
ENV AUTH_URL=${AUTH_URL}
ARG AUTH_SECRET
ENV AUTH_SECRET=${AUTH_SECRET}
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV AUTH_TRUST_HOST=true

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["server.js"]