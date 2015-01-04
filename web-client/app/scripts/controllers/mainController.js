'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Article',
      function ($scope, $rootScope, $location, Article) {
    $scope.order = 'best';
    $scope.title = 'مَنْشَر';
    $scope.tagline = 'منصة النشر العربية';
    $scope.articles = [{ loading: true }, { loading: true },
        { loading: true }];
    Article.query({'order': $scope.order}, function(articles) {
      $scope.articles = articles;
    });

    $scope.newArticle = function () {
      $location.path('/articles/new');
    };

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

    $scope.orderArticles = function (order) {
      $scope.articles = [{ loading: true }, { loading: true },
          { loading: true }];
      $scope.order = order;
      Article.query({'order': order}, function(articles) {
        $scope.articles = articles;
      });
    };

  }]);
