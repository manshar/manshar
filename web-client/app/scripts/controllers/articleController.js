'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Article',
      function ($scope, $rootScope, $routeParams, $location, Article) {

    $scope.article = Article.get({'articleId': $routeParams.articleId},
        function(resource) {
      $rootScope.page.title = resource.title;
    });

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

  }]);
