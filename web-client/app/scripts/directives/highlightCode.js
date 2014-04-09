'use strict';

angular.module('webClientApp')
  .directive('highlightCode', ['$timeout', function ($timeout) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {

        var highlight = function() {
          var codeTags = element[0].getElementsByTagName('pre');
          for (var i=0; i<codeTags.length; i++) {
            hljs.highlightBlock(codeTags[i]);
          }
        };

        // Need to call this after awhile to make sure the dom has been updated.
        scope.$watch(ngModel, function() {
          $timeout(highlight, 500);
        });
        highlight();
      }
    };
  }]);
