# Contributing to Manshar
> Before you start working on a task, make sure it's assigned to you on the [issue tracker](https://www.pivotaltracker.com/n/projects/985678). You either assign it to yourself, or the project lead assigns it to you.

## Install the environment

The following steps will help you prepare your environment and get the project running on your local machine. However, if you just want to work on the front-end part of Manshar, you can reuse the existing dev backend `api-dev.manshar.com` and not have to install the whole backend and its dependencies including the database. Please refer to the wiki page [Contributing to Web Client](https://github.com/manshar/manshar/wiki/Contributing-to-Web-Client) for more details.

### Install [Homebrew](http://brew.sh/) (OS X)

Homebrew is the best package manager out there for OS X.

```sh
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

### Install Ruby

We recommend you to use one of the Ruby version control. We mainly use Ruby 2.0.

#### Install rbenv a Ruby version manager (with Homebrew)

```sh
brew install openssl

brew install ruby-build

brew install rbenv # Follow the instructions after installing rbenv

brew install rbenv-gemset

brew install redis # Make sure to also run redis afterwards.
```

#### Install Ruby 2.0

```sh
rbenv install 2.0.0-p247
```

### [Install Postgres, NodeJS, and PhantomJS] (https://github.com/manshar/manshar/wiki/Installing-Postgres,-NodeJS,-and-PhantomJS)


## Fork Manshar

Fork the repository to your account then clone it to your machine

```sh
git clone https://github.com/USERNAME/manshar.git manshar && cd manshar
```

## Setup the development configurations

```sh
cp backend/.env.sample backend/.env

cp backend/config/database.yml.sample backend/config/database.yml
```

## Install the project dependencies

```sh
# Installing backend dependencies.

cd backend

gem install bundler

bundle install

# Installing web-client dependencies.

cd web-client

sudo gem install sass

npm install

bower install
```

## Setup the database

```sh
# Create postgres role and leave the password empty when prompted.
createuser -P -s -e postgres

cd backend

bundle exec  rake db:create

bundle exec rake db:migrate

# Optional: Seed the Database with some test data.
bundle exec rake db:seed
```

## Run the app.

```sh
# Running the backend.

cd backend

rails s

# Running the web-client.
cd web-client

grunt serve
```

## Run tests

```sh
# Backend Tests.

cd backend

rspec spec

# Web-client tests.

cd web-client

# This will also show you the test coverage.
grunt test

# If you want to dive deeper into the code coverage to see what is not covered.
# You can run the following command and go to manshar/web-client/coverage/
# Folder and copy paste the folder name after the localhost:5555 that opened.
# You'll end up with something like: localhost:5555/PhantomJS 1.9.2 (Mac OS X)
grunt coverage
```

## HowTo keep in sync your git repository for Manshar

We recommend you to add `manshar/manshar` as upstream

```sh
git remote add upstream https://github.com/manshar/manshar.git

git fetch upstream

git merge upstream/master
```

## HowTo add a feature to Manshar

> Before that, **\*try*** to have your repository synced.

Let's say you want to contribute to XYZ feature, for your local repository create a branch for this feature

```sh
# you are on master

git branch xyz

git checkout xyz
```

After implementing the feature and its test cases, push it to your github account

If your edits touch the web-client code, make sure to also run ```grunt``` to build the web-client. And make sure
it builds successfully without errors or jshints warnings (try to fix jshints warnings).


```sh
git add .

git commit -m "feature XYZ"

git push origin xyz
```

Then open a pull request so we get notified for the feature you've implemented.
