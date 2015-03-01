FROM dockerfile/nodejs-bower-grunt
RUN apt-get update -qq && apt-get install -y build-essential nodejs npm git curl ruby-full rubygems-integration
RUN gem install sass
WORKDIR /manshar-web-client
RUN npm cache clean
RUN npm install -g phantomjs
RUN npm install -g grunt grunt-cli --save-dev
ADD package.json /manshar-web-client/package.json
RUN npm install
ADD bower.json /manshar-web-client/bower.json
RUN bower install --allow-root
