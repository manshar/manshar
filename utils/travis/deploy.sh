if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]
then
  echo "This is a pull request. No deployment will be done."
  exit 0
elif [[ "$TRAVIS_BRANCH" == "" ]]
then
  echo "TRAVIS_BRANCH variable is empty. This util is only to be used by Travis CI."
  exit 1
elif [[ "$TRAVIS_BRANCH" != "master" ]]
then
  echo "Not master. No Deploy to do."
  exit 0
else
  echo "On master. Deploying now..."
  wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
  git remote add web-client-heroku git@heroku.com:manshar-web-client.git
  git remote add backend-heroku git@heroku.com:manshar-backend.git
  git remote add workers-heroku git@heroku.com:manshar-workers.git
  echo "Host heroku.com" >> ~/.ssh/config
  echo "   StrictHostKeyChecking no" >> ~/.ssh/config
  echo "   CheckHostIP no" >> ~/.ssh/config
  echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config
  heroku keys:clear
  yes | heroku keys:add

  git config user.email "deploy-bot@manshar.me"
  git config user.name "Manshar Deploy Bot"

  # Deploy Manshar Web-Client.
  # Create a temp branch to deploy from.
  git checkout -b tmp-deploy
  # Un-ignoring dist for a second.
  sed '/web-client\/dist/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore
  # Sass gem is needed to build web client.
  sudo gem install sass
  cd $MANSHAR_HOME/web-client/ && grunt --cdn-base=//d32rdl4awdotlf.cloudfront.net && cd $MANSHAR_HOME
  git add --all && git commit -a -m 'Deploying Web Client Dist...'
  yes | git push web-client-heroku `git subtree split --prefix web-client/dist tmp-deploy`:master --force

  # Deploy Manshar Backend.
  git checkout master
  # Un-ignoring database.yml and using database.yml.sample to upload to heroku.
  # This is mainly for database pool configuration.
  sed '/config\/database.yml/d' backend/.gitignore > backend/.gitignore.new && mv backend/.gitignore.new backend/.gitignore
  mv backend/config/database.yml.sample backend/config/database.yml
  git add --all && git commit -am 'Deploying Manshar Backend...'
  yes | git push backend-heroku `git subtree split --prefix backend master`:master --force
  heroku run rake db:migrate --app manshar-backend

  yes | git push workers-heroku `git subtree split --prefix backend master`:master --force
  heroku run rake db:migrate --app manshar-workers
fi
