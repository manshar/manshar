'use strict';

angular.module('webClientApp')
.directive('sideMenu', ['$document', '$rootScope', '$timeout', 'LoginService', 'User',
  function ($document, $rootScope, $timeout, LoginService, User) {
  	return {
      restrict: 'E',
      link: function(scope, element) {
        $rootScope.pushAside = false;
  			scope.menuStatus = 'closed';
        scope.logout = function () {
          // $analytics.eventTrack('Logout', {
          //   category: 'User'
          // });
          LoginService.logout();
        };
        // Escape key listner to close menu
      	$document.bind('keyup', function(e) {
          if (e.keyCode === 27) {
            if(scope.menuStatus !== 'closed') {
            	scope.menuStatus = 'closed';
              $rootScope.pushAside = false;
            }
          }
        });

        $rootScope.$on('auth:validation-success', function() {
          if($rootScope.user.id) {
            User.get({
              userId: $rootScope.user.id
            }, function(user) {
              scope.thumbnail = user.thumb_url;
            });
          }
        });

        element[0].getElementsByClassName('menu-icon')[0].addEventListener(
            'click', function(){
			    if(scope.menuStatus === 'closed') {
            $rootScope.pushAside = true;
			      scope.menuStatus = 'opened';
			    } else {
            $rootScope.pushAside = false;
			      scope.menuStatus = 'closed';
			    }
			  });

        scope.clickedOutside = function() {
          $timeout(function() {
            if(document.body.clientWidth < 900 &&
               scope.menuStatus === 'opened') {
              $rootScope.pushAside = false;
              scope.menuStatus = 'closed';
            }
          }, 100);
        };
      },
      templateUrl: 'views/directives/sideMenu.html'
    };
  }]);
