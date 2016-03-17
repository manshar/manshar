var gulp = require('gulp');

var cssnano = require('gulp-cssnano');
var googlecdn = require('gulp-google-cdn');
var gulpif = require('gulp-if');
var lazypipe = require('lazypipe');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var bowerConfig = require('../../../bower.json');
var config = require('../../config');


/**
 * Concatinate, Uglify and generate sourcemaps.
 */
gulp.task('bundle:dist', function() {
  return gulp.src(config.index.dist.src)
    // Concatenate with gulp-useref all build:type blocks.
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))

    // Load AngularJS from the Google CDN.
    .pipe(googlecdn(bowerConfig))

    // Concatinate and minify any javascript sources and write sourcemaps.
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.js', sourcemaps.write('.', {includeContent: true})))

    // Concatinate and minify any CSS sources and write sourcemaps.
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulpif('*.css', sourcemaps.write('.', {includeContent: true})))
    .pipe(gulp.dest(config.index.dist.dest));
});
