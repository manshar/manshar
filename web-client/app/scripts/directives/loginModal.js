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
          prev = data.prev;
          scope.visible = true;
        };
        var showLogin = function() {
          scope.activeView = 'login';
        };

        scope.visible = false;
        $rootScope.$on('unauthenticated', showDialog);

        $rootScope.$on('user.loggedIn', function () {
          scope.visible = false;
          if (prev) {
            $location.path(prev);
            prev = null;
          }
        });

        $rootScope.$on('user.signedUp', showLogin);
      }
    };
  }]);
