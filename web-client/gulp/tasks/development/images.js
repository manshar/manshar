var gulp        = require('gulp');

var changed     = require('gulp-changed');

var config      = require('../../config').images.development;


/**
 * Copy images to build folder if changed.
 */
gulp.task('images:development', function() {
  return gulp.src(config.src)
    // Ignore unchanged files.
    .pipe(changed(config.dest))
    .pipe(gulp.dest(config.dest));
});
