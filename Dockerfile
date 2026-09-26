# TJT — production image for the Next.js public site.
# Build context is the repo root so the prebuild step can sync root data files
# (config.json, sys_registry.json) into the frontend app.
FROM node:22-slim AS base
WORKDIR /app

# --- deps: install with a warm cache on lockfile only ---
FROM base AS deps
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

# --- build: compile the Next app (prebuild copies ../config.json etc.) ---
FROM base AS build
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY . .
RUN cd frontend && npm run build

# --- runtime ---
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
# config.json and sys_registry.json are written at runtime — mount them as
# volumes (see DEPLOY.md) so clicks/metrics/content persist across restarts.
CMD ["sh", "-c", "cd frontend && npm start"]
