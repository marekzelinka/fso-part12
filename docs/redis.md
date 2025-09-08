# Redis

- key-value database
- by default, works *in-memory*, which means that **it does not store data persistently**
- mostly used for caching
  - caches are used to store data that are slow to fetch (mostly from external resources)
- redis, unlike mongo has less structure, no collections or tables like sql
- redis is just another service we can run in `docker-compose.dev.yml` for development purposes


## Setup using `redis-cli`

First we need a running container with the mongo image:

```sh
# using the -f flag allows us to pick a different docker-compose file
# by default it picks the docker-compose.yml file
docker compose -f docker-compose.dev.yml up -d
```

The `docker-compose.dev.yml` file:

```yml
services:
  redis:
    image: redis
    ports:
      - 6379:6379
```

The url for ENV is `redis://localhost:6379`

Now we can connect to it via `exec`:

```sh
docker exec -it 4c bash # 4c is the id of our running container
```

Inside the container we can run `redis-cli`:

```sh
redis-cli
```

## Persisting data with Redis


To persist data with Docker we can do the following:

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - redis_data:/data
  volumes:
    # Everything else
    redis_data
```

## Other features of Redis

- auto expire keys, useful when used as a cache.
- can be used to implement the so-called [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) (or PubSub) pattern which is an asynchronous communication mechanism for distributed software
