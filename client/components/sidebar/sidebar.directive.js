'use strict';

angular.module('Piecemeal')
  .directive('sidebar', function () {
    return {
      templateUrl: 'components/sidebar/sidebar.html',
      restrict: 'E',
      link: function (scope, element) {
        element.addClass('sidebar');
      }
    };
  });
