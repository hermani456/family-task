FROM node:18-alpine AS base

# Install turbo globally
RUN npm install turbo --global

FROM base AS prune
WORKDIR /app
COPY . .
RUN turbo prune --scope=server --docker

FROM base AS installer
WORKDIR /app

# Add lockfile and package.json's of isolated subworkspace
COPY .gitignore .gitignore
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN corepack enable
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=prune /app/out/full/ .
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json
RUN pnpm run build --filter=server

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

CMD ["node", "apps/server/dist/server.js"]
