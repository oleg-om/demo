# Используем официальный образ Node.js
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем Strapi (если используется сборка)
RUN npm run build

# Указываем порт (по умолчанию Strapi использует 1337)
EXPOSE 1337

# Запускаем Strapi
CMD ["yarn", "start"]
