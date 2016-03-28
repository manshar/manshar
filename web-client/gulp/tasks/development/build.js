var gulp        = require('gulp');
var runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:development', function(callback) {
  runSequence('clean:development',
  [
    'lint',
    'styles:development',
    'scripts:development',
    'assets:development',
    'constants:development',
    'templates:development',
    'images:development',
    'fonts:development',
  ], callback);
});
