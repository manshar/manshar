var gulp = require('gulp');

var argv = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');

var config = require('../../config').constants.production;


/**
 * Generates AngularJS App Config constants.
 */
gulp.task('constants:production', function () {
  var constants = {
    ENV: config.ENV,
    API_HOST: argv['api-host'] || process.env.API_HOST || config.API_HOST,
    GA_TRACKING_ID: config.GA_TRACKING_ID
  };

  return ngConstant({
    name: config.module,
    constants: constants,
    stream: true
  }).pipe(rename({basename: config.filename}))
    .pipe(gulp.dest(config.dest));
});
