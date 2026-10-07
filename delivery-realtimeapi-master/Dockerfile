# --- dependências (cache de layers) ---
FROM node:16-alpine AS deps

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# --- runtime ---
FROM node:16-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY index.js ./
COPY config ./config
COPY src ./src

USER node

EXPOSE 3000

CMD ["node", "index.js"]
