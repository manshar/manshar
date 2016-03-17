var gulp         = require('gulp');

var config       = require('../../config').assets;


/**
 * Copies misc assets to build folder.
 */
gulp.task('assets:production', function() {
  return gulp.src(config.production.src, {base: config.production.base})
    .pipe(gulp.dest(config.production.dest));
});


/**
 * Copies misc assets to dist folder.
 */
gulp.task('assets:dist', function() {
  return gulp.src(config.dist.src, {base: config.dist.base})
    .pipe(gulp.dest(config.dist.dest));
});
