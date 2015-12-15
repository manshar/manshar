'use strict';

angular.module('webClientApp')
.directive('sideMenu', ['$document', '$rootScope',
  function ($document, $rootScope) {
  	return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        $rootScope.pushAside = false;
  			scope.menuStatus = 'closed';

        // Escape key listner to close menu
      	$document.bind('keyup', function(e) {
      		console.log('key', e.keyCode);
          if (e.keyCode === 27) {
            // $rootScope.$broadcast('escapePressed', e.target);
            if(scope.menuStatus != 'closed') {
            	scope.menuStatus = 'closed';
              $rootScope.pushAside = false;
            }
          }
        });

	    	element[0].getElementsByClassName('menu-icon')[0].addEventListener('click', function(e){

			    if(scope.menuStatus == 'closed') {
            $rootScope.pushAside = true;
			      scope.menuStatus = 'opened';
			    } else {
			      $('.body-wrapper, header').removeClass('push-right');
            $rootScope.pushAside = false;
			      scope.menuStatus = 'closed';
			    }
			  });
      },
      templateUrl: 'views/directives/sideMenu.html'
    }
  }]);