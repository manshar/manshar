'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$rootScope', '$state', '$filter', '$anchorScroll', 'article',
      function ($scope, $rootScope, $state, $filter, $anchorScroll, article) {

    $anchorScroll();

    // TODO: set proper values for page properties
    $rootScope.page.title = (article.title || article.tagline) + ' - ' + article.user.name;
    $rootScope.page.image = article.cover_url;
    $rootScope.page.publishedTime = article.created_at;
    $rootScope.page.description = article.tagline;

    $scope.article = article;

    // TODO: retrieve more than one article and rename the variable to readmore
    $scope.articles = article.articles || [];

    $scope.editArticle = function (articleId) {
      $state.go('app.articles.edit', {articleId: articleId});
    };

  }]);
