# Pull base image.
FROM dockerfile/nodejs-bower-grunt

# Installing Ruby.
RUN apt-get update -qq && apt-get install -y build-essential nodejs npm git curl ruby-full rubygems-integration

# Install Sass.
RUN gem install sass

# Add app directory.
ADD . /manshar-web-client


RUN cd /manshar-web-client && npm install -g phantomjs
RUN cd /manshar-web-client && npm install grunt --save-dev
RUN cd /manshar-web-client && npm install
RUN cd /manshar-web-client && bower install --allow-root
RUN cd /manshar-web-client && npm uninstall grunt-contrib-imagemin && npm install grunt-contrib-imagemin
RUN cd /manshar-web-client && grunt

# Define working directory.
WORKDIR /manshar-web-client

# Define default command.
CMD ["grunt", "serve"]

# Expose ports.
EXPOSE 9000
