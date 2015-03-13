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

        var uploadCallback = function (filesList, successFn, progressFn, errorFn) {
          if (scope.mode !== 'rich') {
            return;
          }
          var file = filesList[0];
          var image = {'asset': file};

          // Actually upload the image.
          Image.save({image: image},
            // Success.
            function(resource) {
              if (successFn) {
                successFn(resource.url);
              }
              read(); // Update the ngModel.
            },
            // Fail.
            function(error) {
              window.alert(error);
              errorFn();
            },
            // Progress.
            function(event) {
              if (progressFn) {
                progressFn(parseInt(100.0 * event.loaded / event.total));
              }
            });
        };

        new Grande(element, {
          containerSelector: 'body',
          placeholder: scope.placeholder || '',
          mode: scope.mode || 'rich',
          rtl: scope.rtl || false,
          imagesFromUrls: scope.mode === 'rich',
          allowImages: scope.mode === 'rich',
          imageTooltipLabel: '<i class="fa fa-image"></i>',
          urlInputPlaceholder: 'أدخل أو ألصق رابط',
          uploadCallback: uploadCallback,
          enableGuids: true,
          guidAttribute: 'title'
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
