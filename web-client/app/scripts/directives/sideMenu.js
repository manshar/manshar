'use strict';

angular.module('webClientApp')
.directive('sideMenu', ['$document', '$rootScope', 'LoginService',
  function ($document, $rootScope, LoginService) {
  	return {
      restrict: 'E',
      link: function(scope, element) {
        $rootScope.pushAside = false;
  			scope.menuStatus = 'closed';
        // scope.$on('auth:validation-success', function(ev, user) {
        //   console.log('$rootScope.user', $rootScope.user)
        //   scope.user = user;
        // });
        // scope.$on('auth:login-success', function(ev, user) {
        //   console.log('$rootScope.user', $rootScope.user)
        //   scope.user = user;
        // });
        scope.logout = function () {
          // scope.user = {};
          // $analytics.eventTrack('Logout', {
          //   category: 'User'
          // });
          LoginService.logout();
        };
        // Escape key listner to close menu
      	$document.bind('keyup', function(e) {
      		console.log('key', e.keyCode);
          if (e.keyCode === 27) {
            // $rootScope.$broadcast('escapePressed', e.target);
            if(scope.menuStatus !== 'closed') {
            	scope.menuStatus = 'closed';
              $rootScope.pushAside = false;
            }
          }
        });

	    	element[0].getElementsByClassName('menu-icon')[0].addEventListener('click', function(){
			    if(scope.menuStatus === 'closed') {
            $rootScope.pushAside = true;
			      scope.menuStatus = 'opened';
			    } else {
            $rootScope.pushAside = false;
			      scope.menuStatus = 'closed';
			    }
			  });
      },
      templateUrl: 'views/directives/sideMenu.html'
    };
  }]);