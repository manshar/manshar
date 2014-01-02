'use strict';

angular.module('webClientApp')
  .controller('EditArticleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'Article',
      function ($rootScope, $scope, $routeParams, $location, Article) {

    var isEdit = false;
    $scope.article = {};

    // Update the page title when the title of the article changes.
    $scope.$watch('article.title', function(){
      $rootScope.page.title = $scope.article.title || 'مقال جديد';
    });

    if($routeParams.articleId) {
      isEdit = true;
      $scope.article = Article.get({'articleId': $routeParams.articleId});
    }

    var success = function (resource) {
      $location.path('/articles/' + resource.id);
    };

    var error = function (resource) {
      console.log(resource);
    };

    $scope.saveArticle = function(article, published) {
      article.published = published;
      if(isEdit) {
        Article.update({ 'articleId': article.id }, { article: article }, success, error);
      } else {
        Article.save({ article: article }, success, error);
      }
    };

  }]);
