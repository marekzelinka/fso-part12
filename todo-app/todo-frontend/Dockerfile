FROM node:20 AS build-state

WORKDIR /usr/src/app

ENV VITE_BACKEND_URL=http://localhost:3000/

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:1.25-alpine


COPY --from=build-state /usr/src/app/dist /usr/share/nginx/html
