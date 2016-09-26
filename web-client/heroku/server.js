'use strict';

var _ = require('lodash');
var express = require('express');
var app = module.exports = express();
var routes = require('./routes');

app.configure(function(){
  // Here we require the prerender middleware that will handle requests from
  // Search Engine crawlers.
  // We set the token only if we're using the Prerender.io service
  var prerender = require('prerender-node').set(
      'prerenderToken', process.env.PRERENDER_TOKEN);

  // These search engine bot do not adheres to google's _escaped_fragment_
  // proposal, so we use user agent to detect them.
  var moreCrawlerUserAgents = [
      'Slurp!',
      'MSNBot',
      'YoudaoBot',
      'JikeSpider',
      'Sosospider',
      '360Spider',
      'Sogou web spider',
      'Sogou inst spider',
      'baiduspider',
      'facebookexternalhit',
      'twitterbot',
      'rogerbot',
      'linkedinbot',
      'embedly',
      'quora link preview',
      'showyoubot',
      'outbrain',
      'pinterest',
      'developers.google.com/+/web/snippet',
      'slackbot',
      'vkShare',
      'W3C_Validator',
      'redditbot'
  ];
  prerender.set('crawlerUserAgents', _.union(
      prerender.crawlerUserAgents, moreCrawlerUserAgents));

  app.use(prerender);
  app.use(express.compress());

  var options = {
    maxAge: '60d',
    setHeaders: function (res, path, stat) {
      // Webfonts need to have CORS * set in order to work.
      if (path.match(/ttf|woff|woff2|eot|svg/ig)) {
        res.set('Access-Control-Allow-Origin', '*');
      }

      // Cache service workers for only 15 minutes.
      var SW_REGEX = /\/(?:workers|service-worker\.js)/i;
      if (path.match(SW_REGEX)) {
        res.set('Cache-Control', 'public, max-age=900000');
      }
    }
  };


  // TODO(mkhatib): This allows people to access EVERYTHING in the root dir
  // including this very same server.js file. Instead maybe whitelist specific
  // files and folders. Add them to routes.js.
  // Maybe move all the static files under a /public folder to allow easy
  // management - these would still be served with a '/' path so nothing
  // breaks.
  app.use(express.static(__dirname, options));
  app.use(app.router);
});

app.get('/service-worker.js', function(req, res) {
  res.sendFile(__dirname + '/service-worker.js');
});

app.get('/favicon.ico', function(req, res) {
  res.sendFile(__dirname + '/favicon.ico');
});

app.get('/robots.txt', function(req, res) {
  res.sendFile(__dirname + '/robots.txt');
});

app.get('/manifest.json', function(req, res) {
  res.sendFile(__dirname + '/manifest.json');
});


// Any static files that weren't found by express.static middleware
// should just 404.
app.get('/scripts/*', function(req, res) {
  res.send('Not Found', 404);
});
app.get('/styles/*', function(req, res) {
  res.send('Not Found', 404);
});
app.get('/images/*', function(req, res){
  res.send('Not Found', 404);
});

// This will ensure that all routing that the AngularJS app handles is handed
// over to AngularJS entrypoint which is index.html. All others will 404.
// TODO(mkhatib): Update 404.html file.
routes.appRoutes.forEach(function(route) {
  app.get(route, function(req, res){
    res.sendfile('index.html');
  });
})

var port = process.env.PORT || 9000;
app.listen(port);
console.log("Listening on port " + port);
