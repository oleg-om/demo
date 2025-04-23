# Используем официальный образ Node.js
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app
ENV NODE_ENV=production
# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем остальные файлы проекта
COPY . .

# Собираем Strapi (если используется сборка)
RUN yarn build

# Указываем порт (по умолчанию Strapi использует 1337)
EXPOSE 1337

# Запускаем Strapi
CMD ["yarn", "start"]
