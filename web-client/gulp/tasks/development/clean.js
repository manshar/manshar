var gulp   = require('gulp');
var del    = require('del');
var config = require('../../config').clean.development;


/**
 * Clean folders and files.
 */
gulp.task('clean:development', function(callback) {
  return del(config.src, callback);
});
