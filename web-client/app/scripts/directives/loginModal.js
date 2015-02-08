'use strict';

angular.module('webClientApp')
  .directive('loginModal', ['$rootScope', '$timeout', '$location',
      function ($rootScope, $timeout, $location) {

    return {
      restrict: 'A',
      templateUrl: 'views/directives/loginModal.html',
      link: function (scope) {
        var prev = null;
        var showDialog = function (event, data) {
          prev = data && data.prev;

          // Don't show the modal if the user is already in one of access paths.
          var ACCESS_PATHS = [
            '/login',
            '/signup',
            '/accounts/reset_password',
            '/accounts/update_password'
          ];
          if (ACCESS_PATHS.indexOf($location.path()) === -1) {
            scope.visible = true;
          }
        };

        scope.visible = false;

        $rootScope.$on('showLoginDialog', showDialog);
        $rootScope.$on('auth:login-success', function () {
          scope.visible = false;
          if (prev) {
            $location.path(prev);
            prev = null;
          }
        });
      }
    };
  }]);
