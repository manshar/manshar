'use strict';

angular.module('webClientApp')
  .directive('articleRenderer', [function () {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$render = function() {
          if (ngModel.$viewValue) {
            if (!carbon.Loader.load('embedProviders')) {
              carbon.Loader.register('embedProviders', {
                embedly: new carbon.EmbedlyProvider({
                  apiKey: '46c6ad376b1343359d774c5d8a940db7'
                }),
                carbon: new carbon.CarbonEmbedProvider({})
              });
            }

            var json = JSON.parse(ngModel.$viewValue);
            var article = carbon.Article.fromJSON(json);
            article.render(element[0]);
          }
        };
      }
    };
  }]);
