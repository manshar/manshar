'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$routeParams', 'Article',
      function ($scope, $routeParams, Article) {

    $scope.article = Article.get({'articleId': $routeParams.articleId});

  }]);
