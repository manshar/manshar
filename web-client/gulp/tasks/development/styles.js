var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var browsersync = require('browser-sync');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');

var config = require('../../config');


/**
 * Generate CSS from SCSS, build sourcemaps.
 */
gulp.task('sass:development', function() {
  browsersync.notify('Compiling Sass');

  // Don’t write sourcemaps of sourcemaps
  var cssFilter = filter(['*.css', '!*.map'], { restore: true });

  return gulp.src(config.sass.development.src)
      .pipe(changed(config.sass.development.dest))
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass.development.options)
          .on('error', sass.logError))
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(cssFilter)
      .pipe(sourcemaps.write('.', {
        includeContent: true,
        sourceRoot: 'app/styles'
      }))
      .pipe(cssFilter.restore)
      .pipe(gulp.dest(config.sass.development.dest))

      // match is very important to avoid full refresh by filtering out
      // generated .css.map file. For more details:
      // http://stackoverflow.com/a/36003566/646979
      .pipe(browsersync.stream({match: '**/*.css'}));
});


/**
 * Copies the CSS files (including bower components) to development.
 */
gulp.task('styles:development', ['sass:development'], function() {
  var options = { base: config.styles.development.base };
  return gulp.src(config.styles.development.src, options)
      .pipe(changed(config.styles.development.dest))
      .pipe(gulp.dest(config.styles.development.dest))
      .pipe(browsersync.stream({match: '**/*.css'}));
});
