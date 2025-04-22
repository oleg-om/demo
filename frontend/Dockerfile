# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY ./frontend /app

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start", "-p", "3010"]
