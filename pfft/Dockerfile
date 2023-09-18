FROM node:18.16-alpine3.17 AS deps
RUN apk add --no-cache \
        libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18.16-alpine3.17  AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build-prod

FROM node:18.16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/out ./out
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./.env.local
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD [ "npm", "start" ]
