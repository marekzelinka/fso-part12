# MongoDB

## Setup for MongoDB CLI using `mongosh`

First we need a running container with the mongo image:

```sh
# using the -f flag allows us to pick a different docker-compose file
# by default it picks the docker-compose.yml file
docker compose -f docker-compose.dev.yml up -d
```

The `docker-compose.dev.yml` file:

```yml
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=example
      - MONGO_INITDB_DATABASE=the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db
volumes:
  mongo_data:
```

We also need a `./mongo/mongo-init.js` file that is run by the image for auth puropses:

```js
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

Now we can connect to it via:

```sh
docker exec -it 4c bash # 4c is the id of our running container
```

Inside the container we can run `mongosh`:

```sh
mongosh -u root -p example
```

## CLI commands when we run `mongosh`

- `show dbs` - show currnet databases
- `use the_database` - pick a working database
- `show collections` - lists available collections
- `db.todos.find()` - here the `todos` is a database that we can run mongo commands on
- `db.todos.insertOne({text:"Increase the number of tools in my tool belt", done:false})` - insert a new document into the `todos` collection
