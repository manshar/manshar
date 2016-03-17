var gulp = require('gulp');

var assets = require('gulp-assets');

var config = require('../../config');


/**
 * Copy Javascript files from src to production.
 */
gulp.task('scripts:production', function() {
  return gulp.src(config.index.production.src)
    .pipe(assets.js())
    .pipe(gulp.dest(config.index.production.dest));
});
