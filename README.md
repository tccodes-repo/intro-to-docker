# Intro to Docker <!-- omit in toc -->

This repository was created for the Intro to [Docker] workshop at TCcodes.  

- [Getting Started](#getting-started)
  - [Hello World](#hello-world)
  - [The `docker` command](#the-docker-command)
- [Images and Containers](#images-and-containers)
  - [Your first image](#your-first-image)
    - [The Dockerfile](#the-dockerfile)
    - [Building The Image](#building-the-image)


## Getting Started

### Hello World

As with any new development technology Docker has a `hello-world` image you can use to 
make sure your [Docker] environment is setup correctly.  

Run the following command

```
docker run hello-world
```

You should see the following output:

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
Digest: sha256:4df8ca8a7e309c256d60d7971ea14c27672fc0d10c5f303856d7bc48f8cc17ff
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### The `docker` command

The [docker cli] is the main application for creating, managing, and distributing
[Docker] containers.

The [docker cli] has many sub commands that make it very powerful.  We will not cover 
all of the commands in this lesson.  

To see the full list of possible commands run:

```
docker
```

Output:
```

Usage:	docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string      Location of client config files (default
                           "/Users/derek/.docker")
  -c, --context string     Name of the context to use to connect to
                           the daemon (overrides DOCKER_HOST env var
                           and default context set with "docker
                           context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level
                           ("debug"|"info"|"warn"|"error"|"fatal")
                           (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default
                           "/Users/derek/.docker/ca.pem")
      --tlscert string     Path to TLS certificate file (default
                           "/Users/derek/.docker/cert.pem")
      --tlskey string      Path to TLS key file (default
                           "/Users/derek/.docker/key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Management Commands:
  builder     Manage builds
  config      Manage Docker configs
  container   Manage containers
  context     Manage contexts
  image       Manage images
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a Docker registry
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker COMMAND --help' for more information on a command.
```

For this lesson we are going to focs on the `run`, `build`, `pull`, and `push` commands.

## Images and Containers

[Docker] uses **images** and **containers** to encapsulate and distribute your applications.
**Images** are snapshots of your application that contain environment settings,
configs, and other dependencies.  **Containers** are a running instance of an **image**.  When you execute `docker run` the [Docker] system will create a **container** that is executing.  Take a look at the digram below to see how this works.  In the digram you will see:

  - **Linux Operating System** - Provides managent of resources such as CPU, Memory, Network, and File System.
  - **Docker** - The docker system used to start, run, and manage **containers**.
  - **Container** - Provides the environment for running the image.  It has its own set of environment variables, and is completely isolated from any other running containers, or applications on the host.
  - **Image** - Provides the definition of **what** to run.  This is where you have the executables for things like MySQL, Nginx, Mongodb, etc.

<p align="center">
    <img src="images/containers_and_images.png" />
</p>

### Your first image

For this part of the lesson we are going to use the [whalesay]
image to show create or own image.

To see what the [whalesay] image does, run the following command:

```
docker run docker/whalesay cowsay 'Hello tccodes!'
```

The output will look like this:

```
 ________________ 
< Hello tccodes! >
 ---------------- 
    \
     \
      \     
                    ##        .            
              ## ## ##       ==            
           ## ## ## ##      ===            
       /""""""""""""""""___/ ===        
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~   
       \______ o          __/            
        \    \        __/             
          \____\______/  
```

#### The Dockerfile

[Docker] uses a file called [Dockerfile] to define the instructions for building an
image. We will create a [Dockerfile] that builds on top of the [whalesay] image and 
creates a new image containing our arguments of what we want the whale to say.

Create a new directory in [VS Code] named `whalesay`.  Then create a new file and name 
it `Dockerfile`.  Notice that [VS Code] will recognize the file as a docker file.

![vscode_docker_file](images/whalesay_folder.png)

Add the following to the [Dockerfile] you created.

```dockerfile
# Defines what image we want to start from
# TIP: You can start from your own images
FROM docker/whalesay

# A helpful label to know who created this
LABEL MAINTAINER="Derek Smith"

# Overriding the command to provide our own arguments
CMD ["coway", "Hello from Derek!"]
```

#### Building The Image

Now that we have a valid [Dockerfile] we can build our image using the `docker build` command.

To build the file run:

```
docker build .
```

You should see something like this:
```
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM docker/whalesay
 ---> 6b362a9f73eb
Step 2/3 : LABEL MAINTAINER="Derek Smith"
 ---> Running in 86b88456758b
Removing intermediate container 86b88456758b
 ---> ce0bc3c90da1
Step 3/3 : CMD ["coway", "Hello from Derek!"]
 ---> Running in 4754e0ea1449
Removing intermediate container 4754e0ea1449
 ---> a2c434e73458
Successfully built a2c434e73458
```

**What's going on here?**

The first line `Sending build context to Docker daemon  2.048kB` is creating the **context** for building the container.  The final argument of the `build` command defines the context, which we provide `.` in our example. The `.` is short for the current directory.  

> IMPORANT: Docker cannot see ANYTHING outside of the context you provide it.  
> This was done for security purposes.  For example, you cannt include a file that
> is above the context folder in your image such as (..\..\config.json).














[Docker]: https://www.docker.com/
[docker cli]: https://docs.docker.com/engine/reference/commandline/cli/
[whalesay]: https://hub.docker.com/r/docker/whalesay/
[Dockerfile]: https://docs.docker.com/engine/reference/builder/