'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$routeParams', '$location', 'Article',
      function ($scope, $routeParams, $location, Article) {

    $scope.article = Article.get({'articleId': $routeParams.articleId});

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

  }]);
