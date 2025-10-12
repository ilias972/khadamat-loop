# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS base
WORKDIR /app

COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY backend/package.json ./backend/package.json

RUN npm install --include-workspace-root true

FROM base AS build
COPY . .
ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Installation de ripgrep avant build
RUN apt-get update && apt-get install -y --no-install-recommends ripgrep && rm -rf /var/lib/apt/lists/*

RUN npm run build
RUN npm prune --omit=dev

FROM node:20-bullseye-slim AS api
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/backend ./backend
COPY --from=build /app/shared ./shared
COPY --from=build /app/attached_assets ./attached_assets

EXPOSE 5000
CMD ["node", "dist/index.js"]

FROM nginx:1.27-alpine AS web
COPY --from=build /app/dist/public /usr/share/nginx/html
