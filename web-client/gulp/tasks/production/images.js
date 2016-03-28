var gulp = require('gulp');

var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var pngquant = require('imagemin-pngquant');

var config = require('../../config').images;


/**
 * Copy images to build folder.
 */
gulp.task('images:production', function() {
  return gulp.src(config.production.src)
    .pipe(gulp.dest(config.production.dest));
});


/**
 * Compress and copy images to dist.
 */
gulp.task('images:dist', function() {
  var options = config.dist.options;
  options.use = [pngquant()];
  return gulp.src(config.dist.src)
    .pipe(imagemin(options))
    .pipe(gulp.dest(config.dist.dest))
    .pipe(size());
});
