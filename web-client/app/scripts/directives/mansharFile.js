'use strict';

angular.module('webClientApp')
  .directive('mansharFile', [function () {

    var myFunc = function () {
      console.log('HELLOOOO');
    };

    return {
      restrict: 'A',
      scope: {
        fileModel: '=',
        previewUrl: '='
      },
      link: function (scope, element) {

        element.on('change', function(e) {
          var selectedFile = e.target.files[0];
          var previewUrl;

          if (selectedFile) {

            var reader = new FileReader();
            reader.onload = function (e) {
              scope.$apply(function () {
                scope.previewUrl = e.target.result;
              });
            };
            reader.readAsDataURL(selectedFile);

            scope.$apply(function () {
              scope.fileModel = selectedFile;
            });
          }
        });

      }
    };
  }]);