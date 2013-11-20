# Contributing to Manshar

## Install the environment

### Install [Homebrew](http://brew.sh/) (OS X)

Homebrew is the best package manager out there for OS X.

```sh
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

### Install Ruby

We recommend you to use one of the Ruby version control. We mainly use Ruby 2.0.

#### Install rbenv a Ruby version manager (with Homebrew)

```sh
brew install openssl

brew install ruby-build

brew install rbenv # Follow the instructions after installing rbenv

brew install rbenv-gemset
```

#### Install Ruby 2.0

```sh
rbenv install 2.0.0-p247
```

### Install Postgres

```sh
brew install postgresql
```

### Install Node.js and Phantom.js

We are using Phantom.js as a part of testing the javascript application.

```sh
brew install nodejs

brew install phantomjs
```

## Fork Manshar

Fork the repository to your account then clone it to your machine

```sh
git clone https://github.com/USERNAME/manshar.git manshar && cd manshar
```

## Setup the development configurations

```sh
cp .env.sample .env

cp config/database.yml.sample config/database.yml
```

## Install the project dependencies

```sh
gem install bundler

bundle install

npm install
```

## Setup the database

```sh
bundle exec  rake db:create

bundle exec rake db:migrate
```

## Run the server - We love Pow!

To run Manshar on a .dev domain at your local machine, we recommend you to use [Pow](http://pow.cx).

There's a gem called `powder` which makes working with pow alot easier.

```sh
gem install powder
```

Here's some handy commands (inside your project folder):

```sh
powder install

powder link

powder start

powder stop

powder restart
```

## Run tests

```sh
bundle exec guard
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

```sh
git add .

git commit -m "feature XYZ"

git push origin xyz
```

Then open a pull request so we get notified for the feature you've implemented.
