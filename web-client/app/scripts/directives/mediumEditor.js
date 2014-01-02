'use strict';

angular.module('webClientApp')
	.directive('mediumEditor', [function () {
		return {
      require: '?ngModel',
			restrict: 'A',
      scope: {
        placeholder: '@',
        maxLength: '@',
        mode: '@'
      },
			link: function (scope, element, attrs, ngModel) {
        // TODO(mkhatib):
        // Medium has a bug in Firefox with innerText undefined.
        // Issue: http://goo.gl/E7kl3z
        new Medium({
          placeholder: scope.placeholder || '',
          maxLength: scope.maxLength || -1,
          debug: false,
          autoHR: false,
          mode: scope.mode || 'rich',
          element: element[0]
        });

        // we're done if no ng-model.
        if(!ngModel) {
          return;
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue);
        };

        function read() {
          var text = element.text().trim();
          var html = element.html();
          // Ignore the placeholder and clear the model.
          if(text === scope.placeholder) {
            text = '';
            html = '';
          }
          if (scope.mode !== 'rich'){
            ngModel.$setViewValue(text);
          } else {
            ngModel.$setViewValue(html);
          }
        }
        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
        read(); // initialize
			}
		};
	}]);