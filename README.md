# Docker

- `docker -v` - prints current version

How to understand container vs image:

> Cooking metaphor:
> 
> **Image** is pre-cooked, frozen treat.
> **Container** is the delicious treat.

## Useful commands for working with Docker:

- `docker container run hello-world` - runs a specified container, if not present, will download
  - `docker container run -it ubuntu bash` - flags, `-it` make sure we can interact with the container
  - `docker container run --rm ubuntu ls` - runs the `ls` command and removes the container after execution
  - `docker container run -it --name hello-node node:20 bash` - creates a container named `hello-node` with image `node:20`, with node preinstalled 

- `docker run -it hello-node-world bash` - runs the image `hello-node-world` in interactive mode with bash

- `docker container ls -a` - list containers, the `-a` will list containers that have been stoped
  - `docker ps` - shortcut, same as above

- `docker container diff hello-node-world` - check for the changes between the original image and new container 

- `docker container rm hopeful_clarke` - removes the container

- `docker start hopeful_clarke` - starts a stoped container
  - `docker start -i hopeful_clarke` - starts container in interactive mode

- `docker kill hopeful_clarke` - stops a container by **name** 
  - `docker kill 3c` - you can use the **id**

- `docker commit hopeful_clarke hello-node-world` - creates a new image named `hello-node-world` based on `hopeful-clarke` container, with all the changes we have made

- `docker image pull hello-world` - download the latest version of the image
  - `docker image ls` - lists images
  - `docker image rm fs-hello-world` - deletes an image

- `docker container cp ./index.js hello-node:/usr/src/app/index.js` - copy file from own machine to the container

## Dockerfile

### Useful commands for running a Dockerfile:

- `docker build -t fs-hello-world . ` - builds an image based on the Dockerfile, 
  - the -t allows us to pick a name, in this case `fs-hello-world`
  - the dot (.) means that the dockerfile is in this directory
  - Meaning: Docker please build with tag (you may think of the tag as the name of the resulting image.) fs-hello-world the Dockerfile in this directory

- `docker run -it fs-hello-world bash` - we can overwrite the default CMD command
  - `docker run -p 3123:3000 express-server` - the `-p` flag allows us to open a port from the host machine and direct it to a port in the container
  - The format is `-p host-port:application-port`

### Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:

- Try to create as **secure** of an image as possible
- Try to create as **small** of an image as possible

Snyk&apos;s **10 best practices for Node/Express containerization**, [read more on the Snyk blog](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

### Basic Dockerfile:

```Dockerfile
# syntax=docker/dockerfile:1 # best practice, specify dockerfile version 

FROM node:20 # Use the node:20 image as the base for our image

WORKDIR /usr/src/app # guarantee all of the following commands will have /usr/src/app set as the working directory, prevents overwriting important files

COPY ./index.js ./index.js # copy the file from the host machine to the file with the same name in the image

CMD node index.js # what happens when docker run is used, default command, can be overwritten
```

- rule of thumb is to only **copy files that you would push to GitHub**
- **allways** install deps during the build step
- don't run the application as root instead `COPY --chown=node:node . .` and then `USER node`

Set environment variables using `ENV` command, examplle:

```Dockerfile
ENV DEBUG=playground:*
```

If you're wondering what the **DEBUG environment variable** does, [read the docs](http://expressjs.com/en/guide/debugging.html#debugging-express).


- using a `.dockerignore` prevents unwanted files from being copied to your image
  - should be placed next to `Dockerfile`

Example of `.dockerignore`:

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

Better example of a `Dockerfile`:

```Dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine

ENV DEBUG=playground:* NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci --only=production

USER node

CMD [ "node", "./bin/www" ]
```

### Node specific for Dockerfile

- `npm ci` - better version of `npm install` for building Docker images
  - `npm ci --omit=dev` - do not waste time installing development deps

It is best when we run our project not using npm or pnpm at all but with the underlining command, e.g.:

```Dockerfile
CMD [ "node", "./bin/www" ]
```

and not:

```Dockerfile
CMD [ "npm", "start" ]
```

## Docker Compose

Helps us to manage containers.

To use it, it's **very recommended btw**, we create a `docker-compose.yml` file next to our Dockerfile.

Example:

```yml
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

### Useful commands for working with Docker Compse:

- `docker compose up` - to build and run the app, we can gracefully stop the app using `Ctrl+c` (on Win) 
  - `docker compose up --build` - if we want to rebuild the images
  - `docker compose up -d` - using `-d` for detached application

- `docker compose down` - to close the application

### Utilizing containers in dev

Using docker compose, we can run a MongoDB database for development porpuses.

We can create a docker compose file for development like `docker-compose.dev.yml`:

```yml
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

- `docker compose -f docker-compose.dev.yml up` - run this file with Docker Compose
  - `docker compose -f docker-compose.dev.yml up -d` - with `-d` we run the app in the backgroud
    - `docker compose -f docker-compose.dev.yml logs -f` - view output logs, the `-f` will ensure we follow the log stream
- `docker compose -f docker-compose.dev.yml down --volumes` - start from a clean slate when using volumes

### Bind mount

Bind mount is the act of binding a file (or directory) on the host machine to a file (or directory) in the container. A bind mount is done by adding a `-v` flag with `container run`. The syntax is `-v FILE-IN-HOST:FILE-IN-CONTAINER`. The bind mount is declared under key volumes in `docker-compose.dev.yml`.

Example:

```yml
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes: 
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
```

The result of the above bind mount is that the file `mongo-init.js` in ./mongo folder of the host machine is the same as the `mongo-init.js` file in the container's `/docker-entrypoint-initdb.d` directory.

## Persisting data with volumes

Two distinct methods to store data:

- Declaring a location in your filesystem (called **bind mount**)
  - preferable if we really need to avoid the data being deleted
- Letting Docker decide where to store the data (**volume**)

### Example using the mongo image:

```yml
services:
  mongo:
    # Skiped here... image:, ports:, environment:
    volumes:
      - ./mongo_data:/data/db
```

The above will create a directory called `mongo_data` to your local filesystem and map it into the container as `/data/db`. Data in `/data/db` is stored outside of the container but still accessible by the container! 

Just remember to add the directory to your `.gitignore`:

```
/mongo_data
```

### Using named volumes:

```yml
services:
  mongo:
    # Skiped here... image:, ports:, environment:
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

The above will let Docker create and manage the volume that is still stored in your local filesystem but figuring out where may not be as trivial as with the previous option.

### Useful commands for working with volumes:

- `docker volume ls` - list the volumes
- `docker volume inspect` - inspect the volume
- `docker volume rm` - delete volume
