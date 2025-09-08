# FullStackOpen 2025 - Containers

In this project my focus was on learning how to configure the environment where my apps are executed. To do this I will utilize containers.

Containerization is a powerful modern tool used in the letter part of the development cycle. Containers encapsulate your app into a single package that includes the app and all of its dependencies, so that it can run isolated from other containers.

We use containers to prevent the app inside from accessing resources of the device without premission.

Containers are a OS-level virtualization, unlike VMs that can be resource heavy and are used to run multiple OSs, containers runs the software using the host OS

Cloud services like AWS, Google Cloud and otheres support containers in different applications. Google Cloud Run, for example, runs containers as serverless - meaning that they dont need to be running if left unused.

The benefits of using containers:

1. You are developing a new app that needs to run on the same machine as a legacy application. Both require installing different versions of Node.
2. Your application runs on your machine, but you need to move it to a server.

To manage and to containerize our apps, we will use a set of products called **Docker**.

## Overview

- [Intro to Docker](./docs/docker.md)
- [Dockerfile](./docs/docker-file.md)
- [Docker Compose](./docs/docker-compose.md)
- [Debugging issues in containers](./docs/debugging.md)
- [Working with the Mongo image](./docs/mongo.md)
- [Working with the Redis image](./docs/redis.md)
- [Developing in containers](./docs/developing-in-containers.md)

| TODO: write about the basics of orchestration