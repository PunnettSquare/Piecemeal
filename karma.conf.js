// Karma configuration
// Generated on Tue Jan 05 2016 16:50:00 GMT-0800 (PST)
// Run with 'npm test', which will run 'karma start karma.conf.js'
// Note that phantomJS works when using npm test, but not when manually running 'karma start karma.conf.js'. Chrome works in either.

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'client/bower_components/angular/angular.js',
        'client/bower_components/angular-mocks/angular-mocks.js',
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
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
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
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
