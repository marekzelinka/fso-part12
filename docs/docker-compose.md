# Docker Compose

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

## Useful commands for working with Docker Compse

- `docker compose up` - to build and run the app, we can gracefully stop the app using `Ctrl+c` (on Win) 
  - `docker compose up --build` - if we want to rebuild the images
  - `docker compose up -d` - using `-d` for detached application

- `docker compose down` - to close the application

## Utilizing containers in dev

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
- `docker compose -f docker-compose.dev.yml down --volumes` - ensure that nothing is left and start from a clean slate

## Bind mount

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

### Example using the mongo image

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

### Using named volumes

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

### Useful commands for working with volumes

- `docker volume ls` - list the volumes
- `docker volume inspect` - inspect the volume
- `docker volume rm` - delete volume
