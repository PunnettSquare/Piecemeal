angular.module('Piecemeal', ['ui.router', 'ngMessages'])
  .constant('_', window._)
  .run(function($rootScope) {
    $rootScope._ = window._;
  });
