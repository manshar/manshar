var gulp = require('gulp');

var del = require('del');
var rev = require('gulp-rev');
var path = require('path');

var config = require('../../config').revision;

/**
 * Revision all asset files and write a manifest file.
 */
gulp.task('revision', function() {
  return gulp.src(config.src.assets, { base: config.src.base })
    .pipe(gulp.dest(config.dest.assets))
    .pipe(rev())
    .pipe(gulp.dest(config.dest.assets))
    .pipe(rev.manifest({ path: config.dest.manifest.name }))
    .pipe(gulp.dest(config.dest.manifest.path));
});


/**
 * Clean up old non-revisioned files.
 */
gulp.task('clean:revision', function(callback) {
  var manifestPath = path.join('../../..',
      config.dest.manifest.path,
      config.dest.manifest.name);
  /* eslint-disable */
  var manifest = require(manifestPath);
  /* eslint-enable */
  var nonRevFiles = Object.keys(manifest).map(function(filename) {
    return path.join(config.dest.manifest.path, filename);
  });
  return del(nonRevFiles, callback);
});
