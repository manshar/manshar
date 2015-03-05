'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$filter', '$anchorScroll', 'Article',
      function ($scope, $rootScope, $routeParams, $location, $filter, $anchorScroll, Article) {

    $anchorScroll();
    $rootScope.forceBar = true;

    Article.get({'articleId': $routeParams.articleId},
        function(resource) {
      /* jshint camelcase: false */
      $rootScope.page.title = resource.title;
      $rootScope.page.image = resource.cover_url;
      $rootScope.page.publishedTime = resource.created_at;
      var cleanBody = $filter('nohtml')(resource.body);
      $rootScope.page.description = $filter('words')(cleanBody, 50);

      $scope.article = resource;
    });

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

  }]);
