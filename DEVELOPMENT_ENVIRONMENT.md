# Introduction

This short guide helps you setup a consistent [Docker](https://www.docker.com/) based development environment for Manshar. 
It makes use of [docker-compose](https://docs.docker.com/compose/) to instantiate a set of containers to run a development instance of Manshar.

# Install Pre-requisites:
## Docker

You will need a linux host to act as the docker host.
A docker host will run the Manshar containers that are necessary to run the webapp services.
If you are already using a linux machine for development, you may use the same machine as the containers host.
Otherwise, you will need access to a linux machine for that purpose.
The easiet way to achieve the latter is to spin a linux VM on your development machine.
We recommend using docker-machine, which creates a preconfigured virtualbox linux VM that has docker pre-installed on it.
In addition, docker-machine provides a simple CLI tool to manage the docker host VM.

### Docker on Linux

Make sure to install docker on your development machine.
You can find the installation instructions for your distribution [here](https://docs.docker.com/installation/).

### Docker on Mac OSX (and Windows, just in case)

Install the docker toolbox as per the instructions that can be found [here](https://www.docker.com/toolbox). The toolbox will install virtualbox, docker, docker-compose, and docker-machine.
After installing the toolbox, make sure to initialize the docker-machine VM by running:

```bash
$ docker-machine create -d virtualbox default
```

### Docker on Ubuntu

Run the following commands and you can skip everything related to docker-machine in the instructions since Ubuntu is a Linux distro which can run containers on bare metal.

1. [Install Docker](https://docs.docker.com/installation/ubuntulinux/#install) and don't forget to [setup the docker group](https://docs.docker.com/installation/ubuntulinux/#create-a-docker-group)
2. [Install Docker Compose](https://docs.docker.com/compose/install/)

## Docker Compose

# Initialize the Development Containers:

## Docker Machine Initialization Pre-requisites

If you are using docker-machine, make sure to run the following two commands first:
```bash
$ docker-machine start default
$ eval $(docker-machine env default)
```
The first of these commands will make sure that the docker-machine VM is up and running.
The second command will initialize some environment variables that are used by the 'docker' CLI tool so that it knows which docker server it should talk to (the one running on the docker-machine VM).

Note that these two commands should always be run when restarting the docker-machine VM or running in a new terminal session.

## Common Initialization Instructions

* Edit the docker-compose.yml and replace the 'dockerhost' strings with the IP address or hostname of the docker host. In the case you are using docker-machine, you can figure out the VM IP address by running:
```bash
$ docker-machine ip default
```
* Initialize the database container by running the following command:
```bash
$ docker-compose run backend ./init_db.sh
```
Note that running these commands might take a significant amount of time, depending on your Internet connection.
The reason being that these commands will pull the Manshar's development environment docker containers from docker hub.
Once these commands finish runing, you're development environment should be ready.

# Common Usage
## Running the Manshar Services

Running the Manshar servers is as simple as running:
```bash
$ docker-compose up
```

## Stopping the Development Services:

```bash
$ docker-compose stop
```

## Installing Extra Packages in a Container

This depends on which container you want to install extra packages to. 
For example, if you need to install packages to the 'web' container, you can run

```bash
$ docker-compose run web npm install <whatever-package>
```

## Other Stuff
For More Information on How to Deal with Docker Containers and Fig, checkout the [docker](https://docs.docker.com/) and [docker-compose](https://docs.docker.com/compose/) documentation.


## Troubleshooting
### x509: certificate has expired or is not yet valid
If you get this message when running any docker or docker-compose commands, restart the docker-machine VM by running:
```bash
$ docker-machine restart default
```
And then run your command again.
