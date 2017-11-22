# Docker Tutorial

Software Architecture VO/KU

706.706/706.707 WS17/18

Jan Schlacher (j.schlacher@student.tugraz.at)

## What is docker?

Docker is a pioneer of the containerization platform. From a 1000 foot perspective it's like a VM but without the OS kernel overhead in your virtual machines.

> A container image is a lightweight, stand-alone, executable package of a piece of software that includes everything needed to run it: code, runtime, system tools, system libraries, settings. ([Source](https://www.docker.com/what-container))

## Installation

To install the docker daemon go to their [website](https://www.docker.com) and download the binary for your OS.

## Basics

Use the `images` command to list all your local available images:

```
$ docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
```

To download an image from the internet, you can either use the `pull` command or the `run` command. If the image isn't available the `run` command will download the image automatically.

```
$ docker pull postgres
// or
$ docker run postgres
```

If you need to access a port on your container, you need to map it to your local network via the `-p` parameter of the `run` command.
The format is either `-P` to make all ports of the container available and map them to the same port number or `-p hostPort:containerPort`.

```
$ docker run -p 5000:5432 postgres
```

To start a container in detached mode instead of foreground mode, we use the `-d` option.

```
$ docker run -d -name awesome-db postgres
e6028e5b65ba...
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
e6028e5b65ba        82b06f064259        "docker-entrypoint..."   43 minutes ago      Up 44 minutes       0.0.0.0:5432->5432/tcp   awesome-db
$ docker stop e
// or
$ docker stop awesome-db
```


To be able to preserve the container storage you can use docker volumes, that way don't need to care if the container gets deleted.
As long as the volume exists, the storage will be saved.
That way we can remove the container each time it gets stopped and when we start it again, we just need to map it to the correct volume again.

```
$ docker volume create awesome-project-db
$ docker run --rm -v awesome-project-db:/var/lib/postgresql/data postgres
```

To list all your existing volumes use the `docker volume ls` command.

## Cleanup

Sometimes you end up with a lot of images you might not use anymore.
Then you can run the following commands to clean all the images and stopped containers:

```
$ docker rm $(docker ps -a -q)
$ docker rmi $(docker images --filter dangling=true -q)
```

The first command will remove all containers and the second command will remove all images that aren't used anymore. Make sure that all of your containers are stopped before typing this commands.
