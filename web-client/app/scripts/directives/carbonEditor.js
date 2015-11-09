'use strict';

angular.module('webClientApp')
  .directive('grandeEditor', ['Image', function (Image) {
    return {
      require: '?ngModel',
      restrict: 'A',
      scope: {
        rtl: '@',
        onChange: '&onChange'
      },
      link: function (scope, element, attrs, ngModel) {
        ngModel.$render = function() {
          if (ngModel.$viewValue) {
            editor.loadJSON(JSON.parse(ngModel.$viewValue));
          }
        };

        // Write data to the model.
        function read() {
          ngModel.$setViewValue(JSON.stringify(editor.getJSONModel()));
        }

        var uploadFile = function (file, successFn, progressFn, errorFn) {
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
              if (errorFn) {
                errorFn();
              }
            },
            // Progress.
            function(event) {
              if (progressFn) {
                progressFn(parseInt(100.0 * event.loaded / event.total));
              }
            });
        };

        var article = new carbon.Article({
          sections:[
            new carbon.Section({
              components: [
                new carbon.Paragraph({
                  paragraphType: carbon.Paragraph.Types.MainHeader,
                  placeholderText: 'عنوان المقال'
                }),
                new carbon.Paragraph({
                  placeholderText: 'اكتب مقالك هنا'
                })
              ]
            })
          ]
        });

        var editor = new carbon.Editor(element[0], {
          modules: [
            carbon.YouTubeComponent,
            carbon.GiphyComponent,
          ],
          article: article,
          rtl: scope.rtl || true
        });

        editor.addEventListener('change', function() {
          scope.$evalAsync(read);
          if (scope.onChange) {
            scope.onChange({editor: editor});
          }
        });

        editor.addEventListener('attachment-added', function(event) {
          var attachment = event.detail.attachment;
          uploadFile(attachment.file, function(src) {
            attachment.setAttributes({
              src: src
            });
          });
        });

        read(); // initialize

        scope.$on('$destroy', function() {
          editor.destroy();
        });
      }
    };
  }]);
