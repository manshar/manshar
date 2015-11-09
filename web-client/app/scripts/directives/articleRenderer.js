'use strict';

angular.module('webClientApp')
  .directive('articleRenderer', [function () {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$render = function() {
          if (ngModel.$viewValue) {
            var json = JSON.parse(ngModel.$viewValue);
            var article = carbon.Article.fromJSON(json);
            // TODO(mkhatib): Add getHTML() API to carbon.Article.
            element.html(article.dom.innerHTML);
          }
        };
      }
    };
  }]);
