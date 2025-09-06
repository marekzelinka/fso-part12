# syntax=docker/dockerfile:1

FROM node:22 AS base

WORKDIR /usr/src/app

FROM base AS test

COPY . .

RUN npm ci --include=dev

RUN npm run test

FROM test AS build

ENV VITE_BACKEND_URL="http://localhost:8080/"

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html