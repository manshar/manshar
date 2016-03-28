var gulp = require('gulp');

var browsersync = require('browser-sync');
var htmlmin = require('gulp-htmlmin');
var ngTemplates = require('gulp-ng-templates');



var config = require('../../config').templates.development;


/**
 * Genreates templateCache.js file to cache all the template views
 * for angular app.
 */
gulp.task('templates:development', function () {
  return gulp.src(config.src)
    .pipe(htmlmin(config.options))
    .pipe(ngTemplates({
      standalone: false,
      filename: config.filename,
      module: config.module,
      path: function(path, base) {
        return path.replace(base, 'views/');
      }
    }))
    .pipe(gulp.dest(config.dest));

  // TODO(mkhatib):
  // For development, just copy the original views to development dest.
  // return gulp.src(config.src)
  //   .pipe(gulp.dest(config.dest));
});

