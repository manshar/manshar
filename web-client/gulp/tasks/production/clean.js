var gulp   = require('gulp');
var del    = require('del');

var config = require('../../config').clean.production;


/**
 * Clean folders and files.
 */
gulp.task('clean:production', function(callback) {
  return del(config.src, callback);
});
