# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY ./frontend ./
RUN yarn install && yarn build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
RUN yarn install --production
EXPOSE 3000

CMD ["yarn", "start"]
