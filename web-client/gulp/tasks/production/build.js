var gulp = require('gulp');

var runSequence = require('run-sequence');


/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:production', function(callback) {

  // TODO(mkhatib): Handle service workers stuff.
  // TODO(mkhatib): Add linting and tests.
  // TODO(mkhatib): Minfiy HTML.
  runSequence(
    // Removes dist/ and build/production.
    'clean:production', [

    // Generate Angular App Config file with constants.
    'constants:production',

    // Minfies and generate angular template cache file from views.
    'templates:production'
  ], [
    // Compiles SASS to CSS and copies included CSS files to production.
    'styles:production',

    // Copies included JS files to production.
    'scripts:production',

    // Copies images to production.
    'images:production',

    // Copies fonts to production.
    'fonts:production',

    // Copies index.html, favicon, manifest.json, robot.txt and others.
    'assets:production',
  ], [
    // Compress images and copies them to dist.
    'images:dist',

    // Copies fonts to dist.
    'fonts:dist',

    // Copies assets to dist - minifies HTML files.
    'assets:dist',

    // Bundles JS, CSS, minifies and replaces build blocks in HTML.
    'bundle:dist',

    // Concatinate and copy service workers files.
    'workers:dist',
  ],
  // Revision all assets.
  'revision',

  // Replace assets references with the new revisioned ones.
  'rev:collect',

  // Removes source before revision.
  'clean:revision',

  // Generate sw-precache files to precache assets.
  'sw:dist',

  // Copy heroku config files.
  'heroku:dist',
  callback);
});
