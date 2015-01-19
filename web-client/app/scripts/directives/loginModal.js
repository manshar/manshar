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

        var hideDialog = function () {
          scope.visible = false;
        };

        var showLogin = function() {
          scope.activeView = 'login';
        };

        scope.visible = false;
        $rootScope.$on('unauthenticated', showDialog);

        $rootScope.$on('user.loggedIn', function () {
          hideDialog();
          if (prev) {
            $location.path(prev);
            prev = null;
          }
        });

        $rootScope.$on('user.signedUp', showLogin);


        angular.element(document).on('keydown', function(event) {
          if (event.keyCode === 27) {
            $timeout(scope.hideDialog);
          }
        });

        scope.hideDialog = hideDialog;
      }
    };
  }]);
