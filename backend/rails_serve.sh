#!/bin/bash
ln -s ./database.yml.sample config/database.yml
rails s -b '0.0.0.0'
