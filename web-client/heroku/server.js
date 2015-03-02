'use strict';

var express = require('express');

var app = module.exports = express();

app.configure(function(){
  // Here we require the prerender middleware that will handle requests from Search Engine crawlers
  // We set the token only if we're using the Prerender.io service
  app.use(require('prerender-node').set('prerenderToken', 'zJohnQZtTAHTRGaDACW5'));
  app.use(express.compress());

  var options = {
    maxAge: '60d',
    setHeaders: function (res, path, stat) {
      // Webfonts need to have CORS * set in order to work.
      if (path.match(/ttf|woff|woff2|eot|svg/ig)) {
        res.set('Access-Control-Allow-Origin', '*');
      }
    }
  };
  app.use(express.static(__dirname, options));
  app.use(app.router);
});

// This will ensure that all routing is handed over to AngularJS
app.get('*', function(req, res){
  res.sendfile('index.html');
});

var port = process.env.PORT || 9000;
app.listen(port);
console.log("Listening on port " + port);
