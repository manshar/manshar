var gulp = require('gulp');
var swPrecache = require('sw-precache');
var path = require('path');

var packageJson = require('../../../package.json');
var config = require('../../config').precache;
var routes = require('../../../heroku/routes');

function writeServiceWorkerFile(target, callback) {
  var precacheConfig = {
    cacheId: packageJson.name,
    importScripts: config[target].importScripts,
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: routes.appRoutesRegexes,
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
