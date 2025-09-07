# syntax=docker/dockerfile:1

FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV VITE_BACKEND_URL="http://localhost:8080/"

CMD ["npm", "run", "dev", "--", "--host"]