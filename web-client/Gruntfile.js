// Generated on 2013-11-28 using generator-angular 0.6.0-rc.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var packageJson = require('./package.json');
var path = require('path');
var modRewrite = require('connect-modrewrite');
var compression = require('compression');
var swPrecache = require('sw-precache');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load Google CDN tasks.
  grunt.loadNpmTasks('grunt-google-cdn');

  // Replace assets with cdn url.
  grunt.loadNpmTasks('grunt-string-replace');

  // Define the configuration for all the tasks
  grunt.initConfig({
    swPrecache: {
      dev: {
        handleFetch: false,
        rootDir: 'app'
      },
      dist: {
        handleFetch: true,
        rootDir: 'dist',
        importScripts: ['workers/sw-toolbox-workers.js'],
      }
    },

    // Help caches angular templates to avoid errors during testing.
    ngtemplates: {
      webClientApp: {
        cwd: 'app',
        src: 'views/{,**/}*.html',
        dest: '<%= yeoman.app %>/scripts/cachedTemplates.js'
      }
    },

    // Define configuration depending on environment.
    ngconstant: {
      options: {
        space: '  ',
        dest: '<%= yeoman.app %>/scripts/appConfig.js',
        name: 'AppConfig'

      },
      development: {
        wrap: '\'use strict\';\n\n<%= __ngModule %>',
        constants: {
          ENV: 'development',
          API_HOST: '<%= grunt.option("api-host") || process.env.API_HOST || "localhost:3000" %>',
          GA_TRACKING_ID: 'UA-XXXXXXXX-X'
        }
      },
      production: {
        wrap: '\'use strict\';\n\n<%= __ngModule %>',
        constants: {
          ENV: 'production',
          API_HOST: '<%= grunt.option("api-host") || process.env.API_HOST || "api.manshar.com" %>',
          GA_TRACKING_ID: 'UA-47379030-1'
        }
      }
    },

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      templates: {
        files: ['app/views/{,*/}*.html'],
        tasks: ['ngtemplates']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        protocol: grunt.option('secure') ? 'https' : 'http',
        key: grunt.file.read('utils/dev/certs/server.key').toString(),
        cert: grunt.file.read('utils/dev/certs/server.crt').toString(),
        ca: grunt.file.read('utils/dev/certs/ca.crt').toString(),
        port: grunt.option('port') || 9000,
        hostname: grunt.option('host') || '0.0.0.0',
        livereload: 35729,
        middleware: function (connect, options) {
          var optBase = (typeof options.base === 'string') ? [options.base] : options.base,
              middleware = [modRewrite(['!\\.html|\\.js|\\.svg|\\.ttf|\\.woff|\\.woff2|\\.css|\\.png|\\.jpg\\.gif|\\swf$ / [L]']), compression()]
                .concat(optBase.map(function (path) {
                  if (path.indexOf('rewrite|') === -1) {
                    return connect.static(path);
                  } else {
                    path = path.replace(/\\/g, '/').split('|');
                    return connect().use(path[1], connect.static(path[2]));
                  }
                }));

          return middleware;
        }

      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'rewrite|/bower_components|./bower_components',
            'rewrite|/app/styles|./app/styles', // for sourcemaps
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      },
      coverage: {
        options: {
          open: true,
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        globals: {
          jasmine: false
        }
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        // Exclude the auto-generated stuff from ngconstant and ngtemplate tasks.
        '!<%= yeoman.app %>/scripts/appConfig.js',
        '!<%= yeoman.app %>/scripts/cachedTemplates.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: [
          'test/spec/{,*/}*.js',
          // Exclude the auto-generated stuff from ngtemplates task.
          '!<%= yeoman.app %>/scripts/cachedTemplates.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dist: {
        options: {
          loadPath: require('node-neat').includePaths
        },
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.scss',
          '.tmp/styles/enhanced.css': '<%= yeoman.app %>/styles/enhanced.scss'
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      css: '<%= yeoman.app %>/styles/{,*/}*.scss',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: [
        '<%= yeoman.dist %>/{,*/}*.html',
        '<%= yeoman.dist %>/views/partials/{,*/}*.html'
      ],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: [
        '<%= yeoman.dist %>/scripts/{,*/}*.js',
        '<%= yeoman.dist %>/manifest.json'
      ],
      options: {
        assetsDirs: ['<%= yeoman.dist %>'],
        patterns: {
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp))/gm, 'Update the JS to reference our revved images'],
            [/(styles\/fonts\/.*?\.(?:eot|svg|ttf|woff|woff2))/gm, 'Update the CSS to reference our revved fonts']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images',
        }],
        options: {
          cache: false
        }
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      options: {
        cdn: require('google-cdn-data')
      },
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    'string-replace': {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['index.html', 'styles/*.main.css'],
          dest: 'dist/'
        }],
        options: {
          // TODO(mkhatib): Move this into its own Grunt task.
          replacements: [{
            pattern: /['"(]((\/?[\w\d.\-]+\/)+([\w\d@.-]+)\.(?:js|css|gif|webp|png|jpg|jpeg|svg|woff|woff2|eot|ttf).*?)['")]/ig,
            replacement: function (match, path) {
              // If path is an absolute URL (starts with http:// or https:// or //)
              // just return the url itself to keep it as is.
              if (path.search(/(https?:)?\/\//) === 0) {
                return match;
              } else {
                var cdnBase = grunt.option('cdn-base');
                if (cdnBase) {
                  if (path.indexOf('/') !== 0) {
                    cdnBase += '/';
                  }
                  var replacement = match.replace(path, cdnBase + path);
                  console.log('Replacing: ', match, ' with: ', replacement);
                  return replacement;
                } else {
                  return match;
                }
              }
            }
          }]
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt,js,json}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          cwd: 'heroku',
          src: '*',
          rename: function (dest, src) {
            var path = require('path');
            if (src === 'distpackage.json') {
              return path.join(dest, 'package.json');
            }
            return path.join(dest, src);
          }
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/grande.js/css/icomoon/',
          src: ['**'],
          dest: '<%= yeoman.dist %>/styles/icomoon/' // Copy icomoon fonts.
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass',
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'sass',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      options: {
        sourceMap: true
      },
      dist: {
        src: [
          // TODO
          '<%= yeoman.app %>/bower_components/sw-toolbox/sw-toolbox.js',
          // '<%= yeoman.app %>/scripts/helpers/simple-db.js',
          // '<%= yeoman.app %>/scripts/workers/offline-analytics.js',
          // '<%= yeoman.app %>/scripts/workers/offline-session-update.js',
          // '<%= yeoman.app %>/scripts/workers/push-notifications.js',
          '<%= yeoman.app %>/workers/*.js',
        ],
        dest: '<%= yeoman.dist %>/workers/sw-toolbox-workers.js',
      },
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      unitCoverage: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/{,*/}*.js': ['coverage']
        },
        coverageReporter: {
          reporters: [
            {type : 'text'},
            {type: 'html', dir: 'coverage'}
          ]
        }
      }
    }
  });


  function writeServiceWorkerFile(rootDir, handleFetch, importScripts, callback) {
    var config = {
      cacheId: packageJson.name,
      importScripts: importScripts,
      // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
      // the service worker will precache resources but won't actually serve them.
      // This allows you to test precaching behavior without worry about the cache preventing your
      // local changes from being picked up during the development cycle.
      handleFetch: handleFetch,
      logger: grunt.log.writeln,
      staticFileGlobs: [
        rootDir + '/*.html',
        rootDir + '/favicon.ico',
        rootDir + '/styles/*.*.css',
        rootDir + '/styles/fonts/*.*.{eot,svg,ttf,woff,woff2}',
        rootDir + '/bower_components/angular-file-upload/dist/angular-file-upload-shim.min.js',
        rootDir + '/scripts/*.*.js',
        rootDir + '/images/*.{png,jpg,jpeg,gif,webp,svg}'
      ],
      remoteResources: [
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.17/angular.min.js',
        'https://yandex.st/highlightjs/8.0/highlight.min.js',
        'https://yandex.st/highlightjs/8.0/styles/default.min.css',
        'https://fonts.googleapis.com/earlyaccess/droidarabicnaskh.css',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff2',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.ttf',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff2',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.ttf',
      ],
      stripPrefix: rootDir + '/',
      // verbose defaults to false, but for the purposes of this demo, log more.
      // verbose: true
    };

    swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
  }

  grunt.registerMultiTask('swPrecache', function() {
    var done = this.async();
    var rootDir = this.data.rootDir;
    var handleFetch = this.data.handleFetch;
    var importScripts = this.data.importScripts;

    writeServiceWorkerFile(rootDir, handleFetch, importScripts, function(error) {
      if (error) {
        grunt.fail.warn(error);
      }
      done();
    });
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:development',
      'ngtemplates:webClientApp',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('coverage', [
    'karma:unitCoverage',
    'connect:coverage'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'ngconstant:development',
    'ngtemplates:webClientApp',
    'connect:test',
    'karma:unitCoverage',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:production',
    'useminPrepare',
    'ngtemplates:webClientApp',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'string-replace',
    'swPrecache:dist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    // TODO(mkhatib): Re-enable tests after getting back to focusing on writing
    // better tests.
    // 'test',
    'build'
  ]);
};
