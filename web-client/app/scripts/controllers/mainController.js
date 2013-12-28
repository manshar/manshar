'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$location', 'Article', function ($scope, $location, Article) {
    $scope.title = 'منشر';
    $scope.tagline = 'منصة نشر مخصصة بالعربية';
    $scope.articles = Article.query();

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

  }]);
