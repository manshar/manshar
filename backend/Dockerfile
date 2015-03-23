FROM ruby
RUN mkdir /manshar-backend
WORKDIR /manshar-backend
ADD Gemfile /manshar-backend/Gemfile
ADD Gemfile.lock /manshar-backend/Gemfile.lock
RUN bundle install
