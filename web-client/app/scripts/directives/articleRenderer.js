'use strict';

angular.module('webClientApp')
  .directive('articleRenderer', [function () {

    var getFirstLayoutType = function (article) {
      if (!article.hasCover()) {
        return false;
      }
      var layout = article.getFirstComponent();
      while (!layout.getLength() && layout.getNextComponent()) {
        layout = layout.getNextComponent();
      }
      return layout.type;
    };

    var isStaged = function (article) {
      return carbon.Layout.Types.Staged === getFirstLayoutType(article);
    };

    var isBleed = function (article) {
      return carbon.Layout.Types.Bleed === getFirstLayoutType(article);
    };

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

            if (article.hasCover()) {
              document.body.classList.add('article-with-cover');
              if (isStaged(article)) {
                document.body.classList.add('staged-cover');
              } else if (isBleed(article)) {
                document.body.classList.add('bleed-cover');
              }
            }

            article.render(element[0]);
          }
        };

        scope.$on('$destroy', function() {
          document.body.classList.remove('article-with-cover');
          document.body.classList.remove('staged-cover');
          document.body.classList.remove('bleed-cover');
        });
      }
    };
  }]);
