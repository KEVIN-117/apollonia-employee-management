# ---------- Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
