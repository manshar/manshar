FROM ubuntu:14.04

RUN apt-get update -qq && apt-get install -y build-essential nodejs npm git curl postgresql postgresql-contrib libpq-dev libreadline-dev imagemagick libmagickcore-dev libmagickwand-dev advancecomp gifsicle jhead jpegoptim libjpeg-progs optipng pngcrush wget
RUN mkdir -p /manshar-backend

RUN wget http://static.jonof.id.au/dl/kenutils/pngout-20130221-linux.tar.gz
RUN tar -xzf pngout-20130221-linux.tar.gz
RUN cp pngout-20130221-linux/x86_64/pngout /usr/local/bin/

# Install rbenv
RUN git clone https://github.com/sstephenson/rbenv.git /usr/local/rbenv
RUN echo '# rbenv setup' > /etc/profile.d/rbenv.sh
RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >> /etc/profile.d/rbenv.sh
RUN echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >> /etc/profile.d/rbenv.sh
RUN echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh
RUN chmod +x /etc/profile.d/rbenv.sh

# install ruby-build
RUN mkdir /usr/local/rbenv/plugins
RUN git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build

ENV RBENV_ROOT /usr/local/rbenv
ENV PATH $RBENV_ROOT/bin:$RBENV_ROOT/shims:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN CONFIGURE_OPTS="--with-readline-dir=/usr/include/readline" rbenv install 2.1.3
RUN bash -l -c 'rbenv global 2.1.3; gem install bundler; rbenv rehash'
RUN gem install rb-readline
WORKDIR /manshar-backend

# Cache Gemfile steps so we don't run bundle install every time other files change.
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install

ADD ../../backend /manshar-backend

CMD foreman start
