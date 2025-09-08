# Debugging issues in container

- We need new tools for debugging
- Configuration most often is in either of two states: 
  1. working
  2. broken
- When writting long `Dockerfile`s or `docker-compose.yml`, take a moment and think about the various ways you could confirm something is working

## Consider the following scenario

Running `docker container run -d nginx` (among other things, capable of serving static HTML files)

Now the q's are:
  - Where should we go with our browser? (what's the url and port)
  - Is it even running?

We can list running containers using `docker container ls`.

```
$ docker container ls
CONTAINER ID   IMAGE   COMMAND  CREATED     STATUS    PORTS     NAMES
3f831a57b7cc   nginx   ...      3 sec ago   Up 2 sec  80/tcp    keen_darwin
```

*The default port for nginx is `80` and our container name is `keen_darwin`.*

Let's shut it down and restart, specifing a port:

```sh
docker stop keen_darwin
docker rm keen_darwin
docker run -d -p 8080:80 nginx
```

Now, running `docker ps` will result in:

```
CONTAINER ID   IMAGE     COMMAND  PORTS                  NAMES
7edcb36aff08   nginx     ...      0.0.0.0:8080->80/tcp   wonderful_ramanujan
```

When we visit `localhost:8080` we can see it shows the wrong message! Lets fix that by using the `exec` command, you can keep your browser open and your container running:

```sh
docker exec -it wonderful_ramanujan bash
```

Now, inside the container, we can replace the default `index.html` file:

```
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

## Using the `docker exec` command

- can be used to jump into a container when it's running
- `docker exec -it wonderful_ramanujan bash` - jump into a running container, with interactive mode and `bash` running
