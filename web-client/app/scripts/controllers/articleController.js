'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$filter', 'Article',
      function ($scope, $rootScope, $routeParams, $location, $filter, Article) {

    $scope.article = Article.get({'articleId': $routeParams.articleId},
        function(resource) {
      /*jshint camelcase: false */
      $rootScope.page.title = resource.title;
      $rootScope.page.image = resource.cover_url;
      $rootScope.page.author = resource.user.name;
      $rootScope.page.publishedTime = resource.created_at;
      var cleanBody = $filter('nohtml')(resource.body);
      $rootScope.page.description = $filter('words')(cleanBody, 50);
    });

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

  }]);
