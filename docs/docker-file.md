# Dockerfile

## Useful commands for running a Dockerfile

- `docker build . -t fs-hello-world` - builds an image based on the Dockerfile, 
  - the -t allows us to pick a name, in this case `fs-hello-world`
  - the dot (.) means that the dockerfile is in this directory
  - Meaning: Docker please build with tag (you may think of the tag as the name of the resulting image.) fs-hello-world the Dockerfile in this directory

- `docker run -it fs-hello-world bash` - we can overwrite the default CMD command
  - `docker run -p 3123:3000 express-server` - the `-p` flag allows us to open a port from the host machine and direct it to a port in the container
  - The format is `-p host-port:application-port`

## Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:

- Try to create as **secure** of an image as possible
- Try to create as **small** of an image as possible

Snyk&apos;s **10 best practices for Node/Express containerization**, [read more on the Snyk blog](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

## Basic Dockerfile

```Dockerfile
# syntax=docker/dockerfile:1 # best practice, specify dockerfile version 

FROM node:22 # Use the node:20 image as the base for our image

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
