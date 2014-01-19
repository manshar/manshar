'use strict';

angular.module('webClientApp')
	.directive('grandeEditor', [function () {
		return {
      require: '?ngModel',
			restrict: 'A',
      scope: {
        placeholder: '@',
        mode: '@',
        rtl: '@'
      },
			link: function (scope, element, attrs, ngModel) {

        new Grande(element, {
          placeholder: scope.placeholder || '',
          mode: scope.mode || 'rich',
          rtl: scope.rtl || false
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