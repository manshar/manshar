'use strict';

angular.module('webClientApp')
  .directive('mansharFile', [function () {

    return {
      restrict: 'A',
      scope: {
        fileModel: '=',
        previewUrl: '='
      },
      link: function (scope, element) {

        element.on('change', function(e) {
          if(!e.target || !e.target.files) {
            return;
          }

          var selectedFile = e.target.files[0];

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