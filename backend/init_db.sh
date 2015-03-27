#!/bin/bash
ln -s ./database.yml.sample config/database.yml
rake db:create
rake db:migrate
