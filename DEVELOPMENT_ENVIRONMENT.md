# Introduction

This short guide helps you setup a consistent [Docker](https://www.docker.com/) based development environment for Manshar. 
It makes use of [fig](http://www.fig.sh/) to instantiate a set of containers to run a development instance of Manshar.

# Install Pre-requisites:
## Docker

You will need a linux host to act as the docker host.
A docker host will run the Manshar containers that are necessary to run the webapp services.
If you are already using a linux machine for development, you may use the same machine as the containers host.
Otherwise, you will need access to a linux machine for that purpose.
The easiet way to achieve the latter is to spin a linux VM on your development machine.
We recommend using boot2docker, which is a preconfigured virtualbox linux VM that has docker pre-installed on it.
In addition, boot2docker provides a simple CLI tool to manage the docker host VM.

### Docker on Linux

Make sure to install docker on your development machine.
You can find the installation instructions for your distribution [here](https://docs.docker.com/installation/).

### Docker on Mac OSX (and Windows, just in case)

Install boot2docker as per the instructions that can be found [here](http://boot2docker.io/).
After installing boot2docker, make sure to initialize the boot2docker VM by running:

```bash
$ boot2docker init
```

## Fig

Install Fig as described in the instructions [here](http://www.fig.sh/install.html)

# Initialize the Development Containers:

## Boot2docker Initialization Pre-requisites

If you are using boot2docker, make sure to run the following two commands first:
```bash
$ boot2docker up
$ $(boot2docker shellinit)
```
The first of these commands will make sure that the boot2docker VM is up and running.
The second command will initialize some environment variables that are used by the 'docker' CLI tool so that it knows which docker server it should talk to (the one running on the boot2docker VM).

Note that these two commands should always be run when restarting the boot2docker VM.

## Common Initialization Instructions

* Edit the fig.yml and replace the 'dockerhost' strings with the IP address or hostname of the docker host. In the case you are using boot2docker, you can figure out the VM IP address by running:
```bash
$ boot2docker ip
```
* Initialize the database container by running the following commands:
```bash
$ fig run backend rake db:create
$ fig run backend rake db:migrate
```
Note that running these commands might take a significant amount of time, depending on your Internet connection.
The reason being that these commands will pull the Manshar's development environment docker containers from docker hub.
Once these commands finish runing, you're development environment should be ready.

# Common Usage
## Running the Manshar Services

Running the Manshar servers is as simple as running:
```bash
$ fig up
```

## Stopping the Development Services:

The reverse of `up` is `down`:
```bash
$ fig down
```

## Installing Extra Packages in a Container

This depends on which container you want to install extra packages to. 
For example, if you need to install packages to the 'web' container, you can run

```bash
$ fig run web npm install <whatever-package>
```

## Other Stuff
For More Information on How to Deal with Docker Containers and Fig, checkout the [docker](https://docs.docker.com/) and [fig](http://www.fig.sh/) documentation.
