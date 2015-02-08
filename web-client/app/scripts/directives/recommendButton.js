'use strict';

// TODO(mkhatib): Write tests.

angular.module('webClientApp')
  .directive('recommendButton', ['$rootScope', 'ArticleRecommendation', function ($rootScope, ArticleRecommendation) {

    var getUserRecommendation = function(article, recommendations) {
      if ($rootScope.user) {
        for (var i=0; i < recommendations.length ; i++) {
          if ($rootScope.isOwner($rootScope.user, recommendations[i])) {
            return recommendations[i];
          }
        }
      }
      return null;
    };

    return {
      templateUrl: 'views/directives/recommendButton.html',
      restrict: 'A',
      scope: {
        article: '='
      },
      link: function (scope, element) {
        scope.$watch('article', function (newValue) {
          if (!newValue) {
            return;
          }

          var userRecommendation = null;
          ArticleRecommendation.query({
            'articleId': scope.article.id
          }, function (recommendations) {
            userRecommendation = getUserRecommendation(scope.article, recommendations);
            scope.isRecommended = !!userRecommendation;
          });

          element.on('click', function () {
            if (scope.isRecommended) {
              ArticleRecommendation.delete({
                'articleId': scope.article.id,
                'recommendationId': userRecommendation.id
              });
              /* jshint camelcase: false */
              scope.article.recommendations_count--;
              scope.isRecommended = false;
            } else {
              ArticleRecommendation.save({'articleId': scope.article.id},
                function (recommendation) {
                  userRecommendation = recommendation;
                  /* jshint camelcase: false */
                  scope.article.recommendations_count++;
                  scope.isRecommended = true;
                });
            }
          });

        });
      }
    };
  }]);
