# syntax=docker/dockerfile:1

FROM node:22-alpine

ENV DEBUG=playground:* NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci --only=production

USER node

CMD [ "node", "./bin/www" ]