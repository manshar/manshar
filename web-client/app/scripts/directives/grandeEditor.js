'use strict';

angular.module('webClientApp')
  .directive('grandeEditor', ['Image', function (Image) {
    return {
      require: '?ngModel',
      restrict: 'A',
      scope: {
        placeholder: '@',
        mode: '@',
        rtl: '@'
      },
      link: function (scope, element, attrs, ngModel) {

        var read = function () {
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
        };

        var uploadCallback = function (filesList, insertImageCallback) {
          if (scope.mode !== 'rich') {
            return;
          }
          var file = filesList[0];
          var image = {'asset': file};
          // Actually upload the image.
          Image.save({image: image},
            // Success.
            function(resource) {
              insertImageCallback(resource.url);
              read(); // Update the ngModel.
            }, function() {
              window.alert('Erorr uploading the image');
            });
        };

        new Grande(element, {
          placeholder: scope.placeholder || '',
          mode: scope.mode || 'rich',
          rtl: scope.rtl || false,
          imagesFromUrls: scope.mode === 'rich',
          allowImages: scope.mode === 'rich',
          uploadCallback: uploadCallback
        });

        // we're done if no ng-model.
        if(!ngModel) {
          return;
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue);
        };

        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
        read(); // initialize
      }
    };
  }]);
