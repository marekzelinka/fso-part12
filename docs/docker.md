# Docker

- `docker -v` - prints current version

How to understand container vs image:

> Cooking metaphor:
> 
> **Image** is pre-cooked, frozen treat.
> **Container** is the delicious treat.

## Useful commands for working with Docker

- `docker container run hello-world` - creates and runs a new container from a image
  - if image is no present, we will download from the [Docker Hub](https://hub.docker.com/)
  - `docker container run -it ubuntu bash` - flag, `-it` make sure we can interact with the container
  - `docker container run --rm ubuntu ls` - runs the `ls` command and removes the container after execution
  - `docker container run -it --name hello-node node:20 bash` - creates a container named `hello-node` with image `node:20`, with node preinstalled 

- `docker run -it hello-node-world bash` - runs the image `hello-node-world` in interactive mode with bash

- `docker container ls -a` - list containers, the `-a` will list containers that have been stoped
  - `docker ps` - shortcut, same as above

- `docker container diff hello-node-world` - check for the changes between the original image and new container 

- `docker container rm hopeful_clarke` - removes the container

- `docker start hopeful_clarke` - starts a stoped container
  - `docker start -i hopeful_clarke` - starts container in interactive mode

- `docker container stop hopeful_clarke` - stops (more graceful) a container
- `docker container kill hopeful_clarke` - sends a signal `SIGKILL` to the process forcing it to exit, and that causes the container to stop
  - `docker container start 3c && docker container stop 3c` - you can also use the container id, instead of label

- `docker commit hopeful_clarke hello-node-world` - creates a new image named `hello-node-world` based on `hopeful-clarke` container, with all the changes we have made

- `docker image pull hello-world` - download the latest version of the image
  - `docker image ls` - lists images
  - `docker image rm fs-hello-world` - deletes an image

- `docker container cp ./index.js hello-node:/usr/src/app/index.js` - copy file from own machine to the container
