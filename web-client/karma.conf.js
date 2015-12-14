// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // Coverage reporters.
    reporters: ['progress'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-i18n/angular-locale_ar.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-truncate/src/truncate.js',
      'app/bower_components/angular-tooltips/dist/angular-tooltips.min.js',
      'app/bower_components/carbon/dist/carbon.js',
      'app/bower_components/grande.js/js/grande.js',
      'app/bower_components/grande.js/js/grande.js',
      'app/bower_components/image-zoom/dist/imagezoom.js',
      'app/bower_components/snapjs/snap.js',
      'app/bower_components/angular-snap/angular-snap.js',
      'app/bower_components/angulartics/src/angulartics.js',
      'app/bower_components/angulartics/src/angulartics-ga.js',
      'app/bower_components/angular-file-upload/dist/angular-file-upload.js',
      'app/bower_components/angular-loading-bar/build/loading-bar.js',
      'app/bower_components/ng-token-auth/dist/ng-token-auth.js',
      'app/bower_components/angular-cookie/angular-cookie.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
