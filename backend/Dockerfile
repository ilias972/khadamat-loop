# build stage
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npx prisma generate
RUN npm prune --omit=dev

# runtime stage
FROM node:lts-alpine AS runtime
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 5000
CMD ["node","dist/server.js"]
