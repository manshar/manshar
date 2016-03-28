'use strict';

var DIR = process.env.SERVER_DIR || 'build/development';
var express = require('express');
var path = require("path");
var app = module.exports = express();

app.use(express.static(DIR));

// This will ensure that all routing is handed over to AngularJS.
app.get('*', function(req, res){
  res.sendfile(DIR + '/index.html');
});

var port = process.env.PORT || 9001;
app.listen(port);
console.log("Listening on port " + port);
