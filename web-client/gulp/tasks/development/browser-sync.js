var gulp        = require('gulp');
var browsersync = require('browser-sync');
var config      = require('../../config');
var nodemon = require('gulp-nodemon');


/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync:development', ['nodemon'], function() {
  browsersync(config.browsersync.development.options);
});


gulp.task('nodemon', ['build:development'], function (cb) {
  var started = false;
  return nodemon({
    script: 'gulp/server.js',
    ext: 'js',
    env: config.server.development.ENV
  }).on('start', function () {
    if (!started) {
      started = true;
      cb();
    }
  })
  .on('restart', function () {
    // Also reload the browsers after a slight delay.
    // This is needed to make sure browsersync reloads the browser after
    // we start nodemon otherwise the browser will appear stuck because
    // browsersync fails to connect to the proxied nodemon.
    setTimeout(function reload() {
      browsersync.reload({
        stream: false
      });
    }, 500);
  });

});
