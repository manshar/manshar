'use strict';

angular.module('webClientApp')
  .directive('mansharCover', [function () {

    return {
      restrict: 'A',
      scope: {
        url: '@'
      },
      link: function (scope, element) {
        scope.$watch('url', function (newValue) {
          element.css({
            'background-image': 'url(' + newValue + ')'
          });
        });
        element.css({
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': '50% 50%'
        });
      }
    };
  }]);
