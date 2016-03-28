var gulp   = require('gulp');
var browsersync   = require('browser-sync');
var config = require('../../config').watch;

/**
 * Start browsersync task and then watch files for changes
 */
gulp.task('watch', ['browsersync:development'], function() {
  gulp.watch(config.sass, ['sass:development']);
  gulp.watch(config.scripts, ['scripts:development', 'lint']);
  gulp.watch(config.images, ['images:development']);
  gulp.watch(config.fonts, ['fonts:development']);
  gulp.watch(config.templates, ['templates:development']);
  gulp.watch(config.assets, ['assets:development']);
});
