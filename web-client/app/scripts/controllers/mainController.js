'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$state','$rootScope', 'Article', 'User', 'articles', 'publishers',
      function ($scope, $state, $rootScope, Article, User, articles, publishers) {
    var currentState = $state.current.url;

    $scope.order = currentState.substring(0, currentState.length - 1);
    $scope.title = 'مَنْشَر';
    $scope.tagline = 'منصة النشر العربية';
    $scope.articles = articles;
    $scope.publishers = publishers;

    $scope.hasNext = articles ? true: false;

    // TODO(mkhatib): Refactor this to move it to its own directive for listing
    // articles with specific
    var page = 1;
    $scope.loadMoreArticles = function() {
      $scope.inProgress = 'load-more';
      Article.query({
        'order': $scope.order,
        'page': ++page
      }, function(articles) {
        if (!articles || !articles.length) {
          $scope.hasNext = false;
        }
        Array.prototype.push.apply($scope.articles, articles);
        $scope.inProgress = null;
      });
    };

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };

  }]);
