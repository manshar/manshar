'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$routeParams', '$location', 'Article', 'LoginService',
      function ($scope, $routeParams, $location, Article, LoginService) {

    $scope.isLoggedIn = LoginService.isLoggedIn();
    $scope.article = Article.get({'articleId': $routeParams.articleId});

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

  }]);
