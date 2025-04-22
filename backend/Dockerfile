# backend/Dockerfile
FROM node:18

WORKDIR /app

# Копируем только содержимое backend сразу в /app
COPY ./backend /app

# Устанавливаем зависимости и билдим Strapi
RUN yarn install
RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]
