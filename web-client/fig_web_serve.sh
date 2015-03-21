#!/bin/bash
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
ln -s /node/node_modules .
ln -s /bower/bower_components app/
grunt serve
