angular.module('Piecemeal', ['ui.router', 'ngMessages'])
  .constant('_', window._)
  .run(function($rootScope) {
    $rootScope._ = window._;
  });
// .config(function($locationProvider) {
//   $locationProvider.html5Mode(true);
// });
