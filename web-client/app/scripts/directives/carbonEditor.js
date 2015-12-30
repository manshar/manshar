'use strict';

angular.module('webClientApp')
  .directive('carbonEditor', ['Image', function (Image) {
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
            editor.render();
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
                new carbon.Layout({
                  type: carbon.Layout.Types.SingleColumn,
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
            })
          ]
        });

        var editor = new carbon.Editor(element[0], {
          locale: 'ar',
          modules: [
            carbon.GiphyComponent,
            carbon.EmbeddedComponent,
          ],
          article: article,
          rtl: scope.rtl || true
        });

        editor.install(carbon.EmbeddingExtension, {
          embedProviders: carbon.Loader.load('embedProviders') || {
            embedly: new carbon.EmbedlyProvider({
              apiKey: '46c6ad376b1343359d774c5d8a940db7'
            }),
            carbon: new carbon.CarbonEmbedProvider({
            })
          },
          ComponentClass: carbon.EmbeddedComponent
        });
        editor.install(carbon.SelfieExtension);
        editor.install(carbon.LayoutingExtension);
        editor.render();

        editor.addEventListener('change', function() {
          scope.$evalAsync(read);
          if (scope.onChange) {
            scope.onChange({editor: editor});
          }
        });

        editor.addEventListener('attachment-added', function(event) {
          var attachment = event.detail.attachment;
          if (attachment.file) {
            uploadFile(attachment.file, function(src) {
              attachment.setAttributes({
                src: src
              });
            });
          } else if (attachment.dataUri) {
            var dataUri = attachment.dataUri;
            var timestamp = (new Date()).getTime();
            var name = 'selfie-' + timestamp;
            var imageFormat = '';
            var match = dataUri.match(/^data\:image\/(\w+)/);
            if (match) {
              imageFormat = match[1];
            } else {
              throw 'Cannot locate image format in Data URI';
            }
            // extract raw base64 data from Data URI
            var rawImageData = dataUri.replace(
                /^data\:image\/\w+\;base64\,/, '');
            var blob = new Blob(
                [Webcam.base64DecToArr(rawImageData)],
                {type: 'image/'+imageFormat, name: name});
            blob.name = name;
            uploadFile(blob, function(src) {
              attachment.setAttributes({
                src: src
              });
            });
          }
        });

        // read(); // initialize

        scope.$on('$destroy', function() {
          editor.destroy();
        });
      }
    };
  }]);
