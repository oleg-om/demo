# Creating multi-stage build for production
FROM node:18-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/build
COPY package.json yarn.lock ./
RUN yarn global add node-gyp
RUN yarn config set network-timeout 600000 -g && yarn install --production
ENV PATH=/opt/build/node_modules/.bin:$PATH
COPY . .
RUN yarn build

# Creating final production image
FROM node:18-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/app

# Copy only necessary files from build stage
COPY --from=build --chown=node:node /opt/build/node_modules ./node_modules
COPY --from=build --chown=node:node /opt/build/package.json .
COPY --from=build --chown=node:node /opt/build/yarn.lock .
COPY --from=build --chown=node:node /opt/build/config ./config
COPY --from=build --chown=node:node /opt/build/build ./build
COPY --from=build --chown=node:node /opt/build/public ./public
COPY --from=build --chown=node:node /opt/build/.tmp ./.tmp

ENV PATH=/opt/app/node_modules/.bin:$PATH

USER node
EXPOSE 1337
CMD ["yarn", "start"]
