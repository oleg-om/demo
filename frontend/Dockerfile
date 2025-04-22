# Stage 1: Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build the app
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# перед сборкой пробрасываем адрес Strapi (имя сервиса из docker‑compose)
ARG API_URL
ENV NEXT_PUBLIC_API_URL=${API_URL}

RUN yarn build

# Stage 3: Run the app
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
# оставляем ту же переменную на runtime, чтоб при старте тоже видел API
ARG API_URL
ENV NEXT_PUBLIC_API_URL=${API_URL}

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3010
CMD ["yarn", "start", "-p", "3010"]
