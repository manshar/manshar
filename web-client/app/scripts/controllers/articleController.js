'use strict';

angular.module('webClientApp')
  .controller('ArticleCtrl', ['$scope', '$rootScope', '$state', '$filter', '$anchorScroll', 'article',
      function ($scope, $rootScope, $state, $filter, $anchorScroll, article) {

    $anchorScroll();

    // TODO: set proper values for page properties
    $rootScope.page.title = article.title;
    $rootScope.page.image = article.cover_url;
    $rootScope.page.publishedTime = article.created_at;

    var cleanBody = $filter('nohtml')(article.body);
    $rootScope.page.description = $filter('words')(cleanBody, 50);

    $scope.article = article;

    // TODO: retrieve more than one article and rename the variable to readmore
    console.log(article);
    $scope.articles = article.next? [article.next]: [];

    $scope.editArticle = function (articleId) {
      $state.go('app.articles.edit', {articleId: articleId});
    };

  }]);
