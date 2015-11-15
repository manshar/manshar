MANSHAR_HOME=$(pwd)
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

while [ "$1" != "" ]; do
  case $1 in
    -n | --name )           shift
                            NAME=$1
                            ;;
    -cdn | --cdn-base )     shift
                            CDN_BASE=$1
                            ;;
  esac
  shift
done

echo "Deploying $NAME..."

echo "Checking if logged in with Heroku CLI..."
heroku auth:whoami

if [ $? -ne 0 ]; then
  echo "Please Login to Heroku..."
  heroku login

  if [ $? -ne 0 ]; then
    exit $?
  fi
fi

echo "Creating Heroku App for Web Client: $NAME-web"
heroku create $NAME-web
git remote add $NAME-web git@heroku.com:$NAME-web.git

echo "Creating Heroku App for Backend: $NAME-backend"
heroku create $NAME-backend
git remote add $NAME-backend git@heroku.com:$NAME-backend.git

echo "Creating Heroku App for Workers: $NAME-workers"
heroku create $NAME-workers
git remote add $NAME-workers git@heroku.com:$NAME-workers.git

API_HOST=$NAME-backend.herokuapp.com
WEB_CLIENT_HOST=$NAME-web.herokuapp.com

# Setup Environment Variables only if they aren't already setup.
REMOTE_API_HOST=`heroku config:get API_HOST --app $NAME-backend`
REMOTE_WEB_CLIENT_HOST=`heroku config:get WEB_CLIENT_HOST --app $NAME-backend`
if [ ! $REMOTE_API_HOST ]; then
  echo 'Setting up backend ENV variables...'
  heroku config:set API_HOST=$API_HOST --app $NAME-backend
  heroku config:set WEB_CLIENT_HOST=$WEB_CLIENT_HOST --app $NAME-backend
fi

REMOTE_API_HOST=`heroku config:get API_HOST --app $NAME-web`
REMOTE_WEB_CLIENT_HOST=`heroku config:get WEB_CLIENT_HOST --app $NAME-web`
if [ ! $REMOTE_API_HOST ]; then
  echo 'Setting up backend ENV variables...'
  heroku config:set API_HOST=$API_HOST --app $NAME-web
  heroku config:set WEB_CLIENT_HOST=$WEB_CLIENT_HOST --app $NAME-web
fi


REMOTE_API_HOST=`heroku config:get API_HOST --app $NAME-workers`
REMOTE_WEB_CLIENT_HOST=`heroku config:get WEB_CLIENT_HOST --app $NAME-workers`
if [ ! $REMOTE_API_HOST ]; then
  echo 'Setting up backend ENV variables...'
  heroku config:set API_HOST=$API_HOST --app $NAME-workers
  heroku config:set WEB_CLIENT_HOST=$WEB_CLIENT_HOST --app $NAME-workers
fi

echo "Creating Deploying Branch to Deploy Master..."
git branch $NAME-deploy
git checkout $NAME-deploy
STATUS=$?
if [ $STATUS -ne 0 ]; then
  echo 'An error happened :-('
  exit $STATUS
fi
# sed '/web-client\/dist/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore

echo "Installing sass to compile web-client..."
echo "You might be prompted to enter your computer password..."
gem install sass

echo "Building Web Client..."
cd $MANSHAR_HOME/web-client/
grunt build --cdn-base=$CDN_BASE --api-host=$REMOTE_API_HOST --force
cd $MANSHAR_HOME/web-client/dist
echo "Deploing Web Client Dist to $NAME-web..."
git init
git add .
git commit -am 'Deploying web client dist...'
git remote add $NAME-web git@heroku.com:$NAME-web.git
git push $NAME-web master --force
# yes | git push $NAME-web `git subtree split --prefix web-client/dist deploy`:master --force
STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo "Deployed $NAME-web Successfully..."
  rm -rf $MANSHAR_HOME/web-client/dist/.git
else
  echo "Deploying failed. Cleaning up and restoring state..."
  rm -rf $MANSHAR_HOME/web-client/dist/.git
  git reset --hard HEAD
  git checkout $CURRENT_BRANCH
  git branch -D $NAME-deploy
  exit $STATUS
fi


cd $MANSHAR_HOME/backend
mv config/database.yml.sample config/database.yml
git init
# Deploy Manshar Backend.
# Un-ignoring database.yml and using database.yml.sample to upload to heroku.
# This is mainly for database pool configuration.
# sed '/config\/database.yml/d' backend/.gitignore > backend/.gitignore.new && mv backend/.gitignore.new backend/.gitignore
git add --all && git commit -am 'Deploying Manshar Backend...'

echo "Deploing Backend instance to $NAME-backend..."
# git subtree push --prefix backend $NAME-backend master
git remote add $NAME-backend git@heroku.com:$NAME-backend.git
git push $NAME-backend master --force

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo "Deployed $NAME-backend Successfully..."
  rm -rf $MANSHAR_HOME/backend/.git
else
  echo "Deploying failed. Cleaning up and restoring state..."
  rm -rf $MANSHAR_HOME/backend/.git
  git reset --hard HEAD
  git checkout $CURRENT_BRANCH
  git branch -D $NAME-deploy
  exit $STATUS
fi


REMOTE_SECRET=`heroku config:get SECRET_TOKEN --app $NAME-backend`
if [ ! $REMOTE_SECRET ]; then
  echo 'Setting up backend SECRET_TOKEN ENV variables...'
  REMOTE_SECRET=`heroku run RAILS_ENV=production rake secret --app $NAME-backend 2>&1 | tail -1`
  heroku config:set SECRET_TOKEN=$REMOTE_SECRET --app $NAME-backend
fi

REMOTE_SECRET=`heroku config:get DRAGONFLY_SECRET --app $NAME-backend`
if [ ! $REMOTE_SECRET ]; then
  echo 'Setting up backend DRAGONFLY_SECRET ENV variables...'
  REMOTE_SECRET=`heroku run RAILS_ENV=production rake secret --app $NAME-backend 2>&1 | tail -1`
  heroku config:set DRAGONFLY_SECRET=$REMOTE_SECRET --app $NAME-backend
fi

echo "Running rake db:migrate to update the database scheme..."
heroku run rake db:migrate --app $NAME-backend

cd $MANSHAR_HOME/backend
git init
git add --all && git commit -am 'Deploying Manshar Workers...'

# Deploying Workers instance.
echo "Deploing Workers instance to $NAME-workers..."
# git subtree push --prefix backend $NAME-workers master
git remote add $NAME-workers git@heroku.com:$NAME-workers.git
git push $NAME-workers master --force

STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo "Deployed $NAME-workers Successfully..."
  rm -rf $MANSHAR_HOME/backend/.git
else
  echo "Deploying failed. Cleaning up and restoring state..."
  rm -rf $MANSHAR_HOME/backend/.git
  git reset --hard HEAD
  git checkout $CURRENT_BRANCH
  git branch -D $NAME-deploy
  exit $STATUS
fi

echo "Running rake db:migrate to update the database scheme..."
heroku run rake db:migrate --app $NAME-workers

echo "Done. Cleaning up..."
git reset --hard HEAD
git checkout $CURRENT_BRANCH
git branch -D $NAME-deploy
