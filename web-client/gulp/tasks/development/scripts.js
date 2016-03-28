var gulp = require('gulp');

var browsersync = require('browser-sync');
var concat = require('gulp-concat');
var changed = require('gulp-changed');

var config  = require('../../config').scripts.development;


/**
 * Copy Javascript files.
 */
gulp.task('scripts:development', function() {
  return gulp.src(config.src, {base: config.base})
      .pipe(changed(config.dest))
      .pipe(gulp.dest(config.dest));
});
