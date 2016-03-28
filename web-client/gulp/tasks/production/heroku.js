var gulp = require('gulp');
var rename = require('gulp-rename');
var install = require('gulp-install');

var config = require('../../config').heroku.dist;


gulp.task('heroku:dist', function() {
    gulp.src(config.src)
      .pipe(rename(function(path) {
        if (path.basename == 'distpackage') {
          path.basename = 'package';
        }
      }))
      .pipe(install())
      .pipe(gulp.dest(config.dest));
});
