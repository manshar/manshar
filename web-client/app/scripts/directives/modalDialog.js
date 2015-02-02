'use strict';

angular.module('webClientApp')
  .directive('modalDialog', ['$rootScope', '$timeout',
      function ($rootScope, $timeout) {

    return {
      restrict: 'A',
      templateUrl: 'views/directives/modalDialog.html',
      scope: {
        visible: '='
      },
      transclude: true,
      replace: true,
      link: function (scope) {
        angular.element(document).on('keydown', function(event) {
          if (event.keyCode === 27) {
            $timeout(scope.hideDialog);
          }
        });

        scope.hideDialog = function () {
          scope.visible = false;
        };
      }
    };
  }]);
