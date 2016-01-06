// # Piecemeal App Module

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Initialize Piecemeal application.

angular.module('Piecemeal', ['ui.router'])

// Set lodash ```_``` as a property of window
  .constant('_', window._)
  .run(function($rootScope) {
    $rootScope._ = window._;
  });
