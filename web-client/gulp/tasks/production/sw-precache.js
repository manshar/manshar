var gulp = require('gulp');
var swPrecache = require('sw-precache');
var path = require('path');

var packageJson = require('../../../package.json');
var config = require('../../config').precache;

// var pathToRegexp = require('path-to-regexp');
// var routes = require('../../../heroku/routes');
// function getNavigateFallbackWhitelist() {
//   var fallbackUrlsWhitelist = [];
//   var patterns = routes.appRoutes;
//   for (var i = 0; i < patterns.length; i++) {
//     var exp = pathToRegexp(patterns[i]);
//     var expStr = exp.source;
//     fallbackUrlsWhitelist.push(new RegExp(expStr));
//   }
//   return fallbackUrlsWhitelist;
// }


function writeServiceWorkerFile(target, callback) {
  var precacheConfig = {
    cacheId: packageJson.name,
    importScripts: config[target].importScripts,
    navigateFallback: '/index.html',
    // TODO(mkhatib): Maybe whitelist specific paths to fallback to index.html
    // at the time I implemented this I couldn't get regexes to be generated
    // in the correct format for sw-precache to understand them.
    // navigateFallbackWhitelist: getNavigateFallbackWhitelist(),
    // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
    // the service worker will precache resources but won't actually serve them.
    // This allows you to test precaching behavior without worry about the cache preventing your
    // local changes from being picked up during the development cycle.
    handleFetch: config[target].handleFetch,
    staticFileGlobs: config[target].staticFileGlobs,
    stripPrefix: config[target].stripPrefix,
    remoteResources: config[target].remoteResources,
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: config[target].verbose
  };

  swPrecache.write(path.join(
      config[target].dest, 'service-worker.js'), precacheConfig, callback);
}

gulp.task('sw:development', function(callback) {
  writeServiceWorkerFile('development', callback);
});

gulp.task('sw:dist', function(callback) {
  writeServiceWorkerFile('dist', callback);
});
