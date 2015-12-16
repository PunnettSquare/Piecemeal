(function() {
  'use strict';

  angular.module('Piecemeal')
    .directive('loading', loading);

  function loading() {
    var directive = {
      link: link
    };

    return directive;

    function link(scope, elem, attrs) {
      var opts = {
        lines: 13,
        length: 28,
        width: 10,
        radius: 42,
        scale: 0.25,
        corners: 1,
        color: '#000',
        opacity: 0.2,
        rotate: 0,
        direction: 1,
        speed: 1.8,
        trail: 61,
        fps: 20,
        zIndex: 2e9,
        className: 'spinner',
        top: '0%',
        left: '0%',
        shadow: false,
        hwaccel: false,
        position: 'relative'
      };

      var spinner = new Spinner(opts).spin();

      elem.replaceWith(spinner.el);

      elem.on('$destroy', function() {
        spinner.stop();
      });
    }
  }

})();
