# Docker


- `docker -v` - prints current version

How to understand container vs image:
> Cooking metaphor:
> 
> **Image** is pre-cooked, frozen treat.
> **Container** is the delicious treat.

- `docker container run hello-world` - runs a specified container, if not present, will download
- `docker container run -it ubuntu bash` - flags, `-it` make sure we can interact with the container
- `docker container run --rm ubuntu ls` - runs the `ls` command and removes the container after execution
- `docker run -it hello-node-world bash` - runs the image `hello-node-world` in interactive mode with bash

- `docker container ls -a` - list containers, the `-a` will list containers that have been exited
  - `docker ps` - shortcut, same as above

- `docker container diff hello-node-world` - check for the changes between the original image and container 

- `docker container rm hopeful_clarke` - removes the container

- `docker container run -it --name hello-node node:20 bash` - creates a container named `hello-node` with image `node:20`, that has node already installed 
- `docker start hopeful_clarke` - starts a already exited container
- `docker start -i hopeful_clarke` - starts container in interactive mode
- `docker kill hopeful_clarke` - stops a container

- `docker commit hopeful_clarke hello-node-world` - creates a new image named `hello-node-world` based on `hopeful-clarke` container, with all the changes we have made

- `docker image pull hello-world` - download the latest version of the image
- `docker image ls` - lists images
- `docker image rm fs-hello-world` - deletes an image

- `docker container cp ./index.js hello-node:/usr/src/app/index.js` - copy file from own machine to the container

## Dockerfile

- `docker build -t fs-hello-world . ` - builds an image based on the Dockerfile, 
  - the -t allows us to pick a name, in this case `fs-hello-world`
  - the dot (.) means that the dockerfile is in this directory
  - Meaning: Docker please build with tag (you may think of the tag as the name of the resulting image.) fs-hello-world the Dockerfile in this directory
- `docker run -it fs-hello-world bash` - we can overwrite the default CMD command

### Basic Dockerfile:

```Dockerfile
FROM node:20 # Use the node:20 image as the base for our image

WORKDIR /usr/src/app # guarantee all of the following commands will have /usr/src/app set as the working directory, prevents overwriting important files

COPY ./index.js ./index.js # copy the file from the host machine to the file with the same name in the image

CMD node index.js # what happens when docker run is used, default command, can be overwritten
```