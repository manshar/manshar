'use strict';

angular.module('webClientApp')
  .directive('scrollSpy', ['$window', '$interval',
      function ($window, $interval) {
    var didScroll;
    var lastScroll = 0;

    return function(scope) {
      angular.element($window).bind('scroll', function() {
        didScroll = true;
      });

      $interval(function(){
        if(didScroll) {
          scope.yscroll = document.body.scrollTop || document.documentElement.scrollTop;
          didScroll = false;

          if(scope.yscroll < 50) {
            scope.moveUp = false;
          }
          else if(scope.yscroll > lastScroll) {
            scope.moveUp = true;
          }
          else if(scope.yscroll < lastScroll-10) {
            scope.moveUp = false;
          }
          lastScroll = scope.yscroll;
        }
      }, 30);
    };
  }]);
