'use strict';

var express = require('express');

var app = module.exports = express();

app.configure(function(){
  // Here we require the prerender middleware that will handle requests from Search Engine crawlers
  // We set the token only if we're using the Prerender.io service
  app.use(require('prerender-node').set('prerenderToken', 'zJohnQZtTAHTRGaDACW5'));
  app.use(express.compress());
  app.use(express.static(__dirname));
  app.use(app.router);
});

// This will ensure that all routing is handed over to AngularJS
app.get('*', function(req, res){
        res.sendfile('index.html');
});

var port = process.env.PORT || 9000;
app.listen(port);
console.log("Listening on port " + port);
