'use strict';

angular.module('webClientApp')
  .directive('imageZoom', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.on('click', function(event) {
          if (event.target && event.target.tagName === 'IMG') {
            var zoom = new Imagezoom(event.target).overlay().padding(20);
            zoom.show();
            zoom.on('shown', (function(imgZoom) {
              return function() {
                var unbindWatch = scope.$watch('yscroll', function (
                    oldValue, newValue) {
                  if (oldValue !== newValue) {
                    try {
                      imgZoom.hide();
                    } catch (e) {
                      console.log('Error happened: ', e);
                    }
                    unbindWatch();
                  }
                });
              };
            })(zoom));
          }
        });
      }
    };
  });
