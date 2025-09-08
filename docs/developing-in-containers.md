# Development using containers

## Frontend (React)

To containerize a React (Vite based) app follow this steps:

```sh
npm create vite@latest hello-front -- --template react
cd hello-front
npm install
```

Next up, run the `build` script (Vite has a `build` script):

```sh
npm run build
```

Let's create a `Dockerfile`:

```Dockerfile
# syntax=docker/dockerfile:1

FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

Let's build the image and run it:

```sh
docker build . -t hello-front
docker run -it hello-front bash
```

### Using multiple stages

- goal is to create Docker images so that they do not contain anything irrelevant
- we can split the build process into many separate stages, where we must pass **some** data to the following stages
- small images are faster to upload and download
- stages that are unused are **skipped**
- we can use `nginx` to serve static files

Let's change the above `Dockerfile` to use multi-stage builds, to do this we can create a new state using the `FROM` command, that will create a new state, and we must `COPY` some data to it:

```Dockerfile
# syntax=docker/dockerfile:1

# The first FROM is now a stage called build-stage
FROM node:22 AS build-stage 

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.25-alpine

# COPY the directory dist from the build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
```

Next up, we can build and run the image:

```sh
docker build . -t hello-front
docker run -p 8080:80 hello-front
```

## Development in containers

Reasons to containerize you whole app (in this case frontend and backend):

- keep the development environment similar between development and production
- avoid differences between your team members setup
- help new members by having them install container runtime and requiring nothing else

Tradeoffs of development in containers:

- the setup is different
- difficulties running our dev env like we used to
- moving the app to a container requires us to:
  - start the app in dev mode
  - access the files in our editor (VS Code)
- installing new dependencies is cumbersome

Starting the app in dev mode (Frontend - Vite):

Starting Vite in dev mode is easy, following `Dockerfile`:

```Dockerfile
# syntax=docker/dockerfile:1

FROM node:22

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]
```

*Extra parameters -- --host are needed to expose the dev server to host*

To build we can run the following command:

```sh
docker build -f ./dev.Dockerfile -t hello-front-dev .
```

Accessing the files in our editor (VS Code):

We need to use Docker volumes, via `-v` flag:

```sh
docker run -p 5173:5173 -v "$(pwd):/usr/src/app/" hello-front-dev
```

Now we can edit our source files inside of our editor and the changes are hot-loaded!

We can simplify this setup by creating a `docker-compose.dev.yml` file:


```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 5173:5173
    container_name: hello-front-dev # This will name the container hello-front-dev
```

| Note using the name `docker-compose.dev.yml` for development environment compose files

With this configuration in place, we can run our app in dev mode via:

```sh
docker compose -f docker-compose.dev.yml up -d
```
