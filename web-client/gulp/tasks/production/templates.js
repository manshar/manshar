var gulp = require('gulp');

var htmlmin = require('gulp-htmlmin');
var ngTemplates = require('gulp-ng-templates');

var config = require('../../config').templates.production;


/**
 * Genreates templateCache.js file to cache all the template views
 * for angular app.
 */
gulp.task('templates:production', function () {
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
});
