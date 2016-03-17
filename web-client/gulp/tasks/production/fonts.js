var gulp   = require('gulp');

var config = require('../../config').fonts;


/**
 * Copy fonts to build folder.
 */
gulp.task('fonts:production', function() {
  return gulp.src(config.production.src)
    .pipe(gulp.dest(config.production.dest));
});


/**
 * Copy fonts to dist folder.
 */
gulp.task('fonts:dist', function() {
  return gulp.src(config.dist.src)
    // TODO(mkhatib): Possibly do any optimization required.
    .pipe(gulp.dest(config.dist.dest));
});
