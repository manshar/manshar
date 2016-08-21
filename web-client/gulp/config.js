var src               = 'app';
var development       = 'build/development';
var production        = 'build/production';
var dist              = 'dist';


module.exports = {
  browsersync: {
    development: {
      options: {
        logLevel: 'debug',
        proxy: 'http://localhost:9001',
        port: 9000,
        open: false,
        notify: false,
        browser: 'google chrome',
      }
    },
    dist: {
      options: {
        proxy: 'http://localhost:9901',
        port: 9900,
        browser: 'google chrome',
        files: [
          dist + '/**/*.*',
        ]
      }
    }
  },
  server: {
    development: {
      ENV: {
        NODE_ENV: 'development',
        SERVER_DIR: development,
        PORT: 9001,
      }
    },
    dist: {
      ENV: {
        NODE_ENV: 'production',
        SERVER_DIR: dist,
        PORT: 9901,
      }
    }
  },
  clean: {
    development: {
      src: [development],
    },
    production: {
      src: [production, dist],
    }
  },
  sass: {
    development: {
      src:  src + '/styles/**/*.{sass,scss}',
      dest: development + '/styles',
    },
    production: {
      src:  src + '/styles/**/*.{sass,scss}',
      dest: production + '/styles',
      options: {
        outputStyle: 'compressed',
      }
    }
  },
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4',
    ],
    cascade: true
  },
  styles: {
    development: {
      base: src,
      src: [
        src + '/styles/**/*.css',
        src + '/bower_components/**/*.css',
      ],
      dest: development,
    },
    dist: {
      src:  production + '/styles/**/*.css',
      dest: dist + '/styles/',
    }
  },
  scripts: {
    development: {
      base: src,
      src: [
        src + '/scripts/**/*.js',
        src + '/bower_components/**/*.js',
        src + '/workers/*.js',
      ],
      dest: development,
    },
    production: {
      src: src + '/scripts/**/*.js',
      dest: production,
    },
    dist: {
      src: [
        production + '/scripts/**/*.js',
        production + '/workers/*.js',
      ],
      dest: dist,
    }
  },
  images: {
    development: {
      src:  src + '/images/**/*',
      dest: development + '/images',
    },
    production: {
      src: src + '/images/**/*',
      dest: production + '/images/',
    },
    dist: {
      src: production + '/images/**/*',
      dest: dist + '/images',
      options: {
        optimizationLevel: 3,
        progessive: true,
        interlaced: true,
      },
    },
  },
  fonts: {
    development: {
      src:  src + '/styles/fonts/*',
      dest: development + '/styles/fonts'
    },
    production: {
      src:  src + '/styles/fonts/*',
      dest: production + '/styles/fonts'
    },
    dist: {
      src: production + '/styles/fonts/*',
      dest: dist + '/styles/fonts',
    }
  },
  watch: {
    assets: [
      src + '/*.html',
      src + '/favicon.ico',
      src + '/manifest.json',
      src + '/robots.txt'
    ],
    sass: src + '/styles/**/*.{sass,scss}',
    scripts: src + '/scripts/**/*.js',
    images: src + '/images/**/*',
    fonts: src + '/styles/fonts/*',
    templates: src + '/views/**/*.html'
  },
  lint: {
    src: [
      '!node_modules/**',
      src + '/scripts/**/*.js',
      src + '/workers/**/*.js',
    ]
  },
  constants: {
    development: {
      dest: development + '/scripts',
      filename: 'appConfig',
      module: 'AppConfig',
      API_HOST: 'localhost:3000',
      ENV: 'development',
      GA_TRACKING_ID: 'UA-XXXXXXXX-X'
    },
    production: {
      dest: production + '/scripts',
      filename: 'appConfig',
      module: 'AppConfig',
      API_HOST: 'api.manshar.com',
      ENV: 'production',
      GA_TRACKING_ID: 'UA-47379030-1'
    }
  },
  templates: {
    development: {
      src: src + '/views/**/*.html',
      dest: development + '/scripts',
      module: 'webClientApp',
      filename: 'cachedTemplates.js',
      options: {
        collapseWhitespace: true
      }
    },
    production: {
      src: src + '/views/**/*.html',
      dest: production + '/scripts',
      module: 'webClientApp',
      filename: 'cachedTemplates.js',
      options: {
        collapseWhitespace: true
      }
    }
  },
  revision: {
    src: {
      assets: [
        dist + '/styles/*.css',
        dist + '/styles/fonts/*',
        dist + '/scripts/*.js',
        dist + '/images/**/*'
      ],
      base: dist
    },
    dest: {
      assets: dist,
      manifest: {
        name: 'rev-manifest.json',
        path: dist
      }
    }
  },
  collect: {
    src: [
      dist + '/rev-manifest.json',
      dist + '/**/*.{html,xml,txt,json,css,js}',
      '!' + dist + '/feed.xml'
    ],
    dest: dist
  },
  assets: {
    development: {
      src: [
        src + '/*.html',
        src + '/favicon.ico',
        src + '/manifest.json',
        src + '/robots.txt',
        src + '/workers/*.js'
      ],
      dest: development
    },
    production: {
      base: src,
      src: [
        src + '/*.html',
        src + '/favicon.ico',
        src + '/manifest.json',
        src + '/robots.txt',
        src + '/bower_components/sw-toolbox/sw-toolbox.js',
        src + '/workers/*.js',
      ],
      dest: production
    },
    dist: {
      base: production,
      src: [
        production + '/*.html',
        '!' + production + '/index.html',
        production + '/favicon.ico',
        production + '/manifest.json',
        production + '/robots.txt'
      ],
      dest: dist,
      options: {
        collapseWhitespace: true
      }
    }
  },
  workers: {
    dist: {
      name: 'sw-toolbox-workers.js',
      src: [
        production + '/bower_components/sw-toolbox/sw-toolbox.js',
        production + '/workers/*.js'
      ],
      dest: dist + '/workers'
    }
  },
  index: {
    development: {
      src: src + '/index.html',
      dest: development
    },
    production: {
      src: src + '/index.html',
      dest: production
    },
    dist: {
      src: production + '/index.html',
      dest: dist,
      options: {
        collapseWhitespace: true
      }
    }
  },
  precache: {
    // TODO(mkhatib): Maybe remove this.
    development: {
      dest: development,
      staticFileGlobs: [
        development + '/bower_components/angular-file-upload/dist/angular-file-upload-shim.min.js',
        development + '/styles/**.css',
        development + '/styles/fonts/*',
        development + '/scripts/**.js',
        development + '/images/**.*',
        development + '/views/**.html',
        development + '/favicon.ico',
        development + '/*.html',
      ],
      stripPrefix: development + '/',
      verbose: true,
      handleFetch: false
    },
    dist: {
      dest: dist,
      staticFileGlobs: [
        dist + '/styles/**.css',
        dist + '/styles/fonts/*',
        dist + '/scripts/**.js',
        dist + '/images/**.*',
        dist + '/favicon.ico',
        // TODO(mkhatib): We might not want to cache this to avoid the
        // problems of new versions not being served correctly because of
        // partially busted cache. See http://goo.gl/FUBuLH for details.
        dist + '/*.html',
      ],
      stripPrefix: dist + '/',
      verbose: true,
      handleFetch: true,
      importScripts: ['workers/sw-toolbox-workers.js'],
      remoteResources: [
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js',
        'https://yandex.st/highlightjs/8.0/highlight.min.js',
        'https://yandex.st/highlightjs/8.0/styles/default.min.css',
        'https://fonts.googleapis.com/earlyaccess/droidarabicnaskh.css',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff2',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.ttf',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff2',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff',
        'https://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.ttf',

        'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js',
        'http://yandex.st/highlightjs/8.0/highlight.min.js',
        'http://yandex.st/highlightjs/8.0/styles/default.min.css',
        'http://fonts.googleapis.com/earlyaccess/droidarabicnaskh.css',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff2',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.woff',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Regular.ttf',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff2',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.woff',
        'http://fonts.gstatic.com/ea/droidarabicnaskh/v7/DroidNaskh-Bold.ttf',

        // TODO(mkhatib): Figure out a way to do this.
        // APIs responses we'd like to get to get the user to browse offline.
        // 'https://api.manshar.com/api/v1/categories',
        // 'https://api.manshar.com/api/v1/users',
        // 'https://api.manshar.com/api/v1/articles?order=popular',
        // 'https://api.manshar.com/api/v1/articles?order=best',
        // 'https://api.manshar.com/api/v1/articles?order=recents',
      ],
    }
  },
  heroku: {
    dist: {
      src: 'heroku/*',
      dest: dist
    }
  }
};
