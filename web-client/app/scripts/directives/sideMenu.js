'use strict';

angular.module('webClientApp')
.directive('sideMenu', ['$document', '$rootScope', '$timeout', '$analytics', 'LoginService', 'User',
  function ($document, $rootScope, $timeout, $analytics, LoginService, User) {
  	return {
      restrict: 'E',
      link: function(scope, element) {
        $rootScope.pushAside = false;
  			scope.menuStatus = 'closed';
        scope.logout = function () {
          $analytics.eventTrack('Logout', {
            category: 'User'
          });
          LoginService.logout();
          scope.thumbnail = null;
        };

        // Escape key listner to close menu
      	$document.bind('keyup', function(e) {
          if (e.keyCode === 27) {
            if(scope.menuStatus !== 'closed') {
              $analytics.eventTrack('ESC Close', {
                category: 'Side Menu'
              });
            	scope.menuStatus = 'closed';
              $rootScope.pushAside = false;
            }
          }
        });

        function getUserThumbUrl(user) {
          if(user.id) {
            User.get({
              userId: user.id
            }, function(user) {
              scope.thumbnail = user.thumb_url;
            });
          }
        }

        $rootScope.$on('auth:login-success', function(ev, user) {
          if(user) {
            getUserThumbUrl(user);
          }
        });

        $rootScope.$on('auth:validation-success', function(ev, user) {
          if(user) {
            getUserThumbUrl(user);
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

        scope.clickedOutsideNavIcon = function() {
          $timeout(function() {
            if(document.body.clientWidth < 1100 &&
               scope.menuStatus === 'opened') {
              $analytics.eventTrack('Clicked Outside Nav Icon Close', {
                category: 'Side Menu'
              });
              $rootScope.pushAside = false;
              scope.menuStatus = 'closed';
            }
          }, 100);
        };

        scope.clickedOutsideMenu = function() {
          $timeout(function() {
            if(scope.menuStatus === 'opened') {
              $analytics.eventTrack('Clicked Outside Side Menu Close', {
                category: 'Side Menu'
              });
              $rootScope.pushAside = false;
              scope.menuStatus = 'closed';
            }
          }, 100);
        };

        scope.clickedOnMenuItem = function() {
          $timeout(function() {
            if(document.body.clientWidth < 1100 &&
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
