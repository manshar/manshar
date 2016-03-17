var gulp   = require('gulp');

var changed = require('gulp-changed');

var config = require('../../config').fonts.development;

/**
 * Copy fonts to folder
 */
gulp.task('fonts:development', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest))
    .pipe(gulp.dest(config.dest));
});
