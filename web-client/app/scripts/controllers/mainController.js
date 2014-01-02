'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$location', 'Article', 'LoginService',
      function ($scope, $location, Article, LoginService) {
    $scope.title = 'منشر';
    $scope.tagline = 'منصة نشر مخصصة بالعربية';
    $scope.articles = Article.query();
    $scope.isLoggedIn = LoginService.isLoggedIn();

    $scope.newArticle = function () {
      $location.path('/articles/new');
    };

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

  }]);
