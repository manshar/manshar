var gulp = require('gulp');

var assets = require('gulp-assets');
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var config = require('../../config');


/**
 * Compiles SASS files to CSS and minify them and generate
 * sourcemaps files for them. This also autoprefix properties.
 */
gulp.task('sass:production', function() {
  // Don’t write sourcemaps of sourcemaps
  var cssFilter = filter(['*.css', '!*.map'], { restore: true });

  return gulp.src(config.sass.production.src)
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass.production.options)
          .on('error', sass.logError))
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(cssFilter)
      .pipe(sourcemaps.write('.', {
        includeContent: true,
        sourceRoot: 'app/styles'
      }))
      .pipe(cssFilter.restore)
      .pipe(gulp.dest(config.sass.production.dest));
});


/**
 * Copies the CSS files in the index to production.
 */
gulp.task('styles:production', ['sass:production'], function() {
  return gulp.src(config.index.production.src)
      .pipe(assets.css())
      .pipe(gulp.dest(config.index.production.dest));
});
