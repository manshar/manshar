FROM ruby
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev
RUN mkdir /manshar-backend
WORKDIR /manshar-backend
ADD Gemfile /manshar-backend/Gemfile
ADD Gemfile.lock /manshar-backend/Gemfile.lock
RUN bundle install
