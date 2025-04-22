# Используем базовый образ для Node.js
FROM node:18

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем backend код в контейнер
COPY ./backend /app/backend

# Переходим в директорию backend
WORKDIR /app/backend

# Устанавливаем зависимости
RUN yarn install

# Строим Strapi проект
RUN yarn build

# Открываем порт 1337 для Strapi
EXPOSE 1337

# Запускаем Strapi
CMD ["yarn", "start"]
