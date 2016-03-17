var gulp         = require('gulp');

var config       = require('../../config').assets.development;


/**
 * Copies misc assets to build folder.
 */
gulp.task('assets:development', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
