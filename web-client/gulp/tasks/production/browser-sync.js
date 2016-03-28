var gulp        = require('gulp');
var browsersync = require('browser-sync');
var config      = require('../../config');
var nodemon = require('gulp-nodemon');


/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('serve:dist', ['nodemon:dist'], function() {
  browsersync.init(null, config.browsersync.dist.options);
});


gulp.task('nodemon:dist', ['build:production'], function (cb) {
  var started = false;
  return nodemon({
    script: 'gulp/server.js',
    env: config.server.dist.ENV
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});
