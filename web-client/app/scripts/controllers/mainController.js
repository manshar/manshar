'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Article',
      function ($scope, $rootScope, $location, Article) {
    $scope.title = 'منشر';
    $scope.tagline = 'منصة نشر مخصصة بالعربية';
    $scope.articles = Article.query();

    $scope.newArticle = function () {
      $location.path('/articles/new');
    };

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

  }]);
