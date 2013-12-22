'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', function ($scope, $routeParams, Article) {

    $scope.article = Article.get({'articleId': $routeParams.articleId});

  });
