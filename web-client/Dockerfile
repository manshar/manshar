FROM dockerfile/nodejs-bower-grunt
RUN apt-get update && apt-get install -y ruby
RUN gem install sass

# Set the locale to UTF-8.
RUN locale-gen en_US.UTF-8
RUN update-locale en_US.UTF-8
ENV LANG en_US.UTF-8

WORKDIR /manshar-web-client
RUN npm cache clean
RUN npm install -g phantomjs
RUN npm install -g grunt grunt-cli --save-dev

# Install node packages.
WORKDIR /node
ADD package.json /node/package.json
RUN npm install

# Install bower packages.
WORKDIR /bower
ADD bower.json /bower/bower.json
RUN bower install --allow-root

WORKDIR /manshar-web-client
