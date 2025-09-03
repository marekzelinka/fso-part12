## Docker commands


- `docker -v` - prints current version

How to understand container vs image:
> Cooking metaphor:
> 
> **Image** is pre-cooked, frozen treat.
> **Container** is the delicious treat.

- `docker container run hello-world` - runs a specified container, if not present, will download
- `docker container run -it ubuntu bash` - flags, `-it` make sure we can interact with the container
- `docker container run --rm ubuntu ls` - runs the `ls` command and removes the container after execution
- `docker run -it hello-node-world bash` - runs the image `hello-node-world

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

- `docker container cp ./index.js hello-node:/usr/src/app/index.js` - copy file from own machine to the container