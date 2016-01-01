// # Piecemeal App Module 

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Initializes Piecemeal application.

angular.module('Piecemeal', ['ui.router', 'ngMessages'])

// Set lodash ```_``` as a property of window
  .constant('_', window._)
  .run(function($rootScope) {
    $rootScope._ = window._;
  });
