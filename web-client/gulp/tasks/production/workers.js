var gulp = require('gulp');

var concat = require('gulp-concat');

var config = require('../../config').workers.dist;


/**
 * Copy Javascript files from src to production.
 */
gulp.task('workers:dist', function() {
  return gulp.src(config.src)
    .pipe(concat('sw-toolbox-workers.js'))
    .pipe(gulp.dest(config.dest));
});
