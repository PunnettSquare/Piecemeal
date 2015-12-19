// Karma configuration
// Generated on Wed Dec 09 2015 11:49:59 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // {pattern: "bower_components/angular-socket.io-mock.js", included: false},
      // not included unless needed: jquery, angular-animate, angular-aria
      // load angular and angular-mocks.js first:
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // 'client/bower_components/angular-socket-io/mock/socket-io.js',
      // 'client/bower_components/angular-socket-io/socket.js',
      'client/bower_components/angular-ui-router/**/*.js',
      'client/bower_components/angular-messages/angular-messages.js',
      'client/bower_components/lodash/lodash.js',
      'client/bower_components/jquery/dist/jquery.js',
      'client/app/app.module.js',
      'client/app/*.js',
      'client/app/**/*.js',
      'test/*.js'
    ],

    // list of files to exclude
    exclude: [
      ''
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // port for karma's own web server to run. should not overlap with existing web server's port (8080)
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  });
};
