'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Article', 'User',
      function ($scope, $rootScope, $location, Article, User) {
    $scope.order = 'popular';
    $scope.title = 'مَنْشَر';
    $scope.tagline = 'منصة النشر العربية';
    $scope.articles = [{ loading: true }, { loading: true },
        { loading: true }];

    $scope.activeTab = $scope.order;
    Article.query({'order': $scope.order}, function(articles) {
      $scope.articles = articles;

      $scope.publishers = User.query();
    });

    $scope.newArticle = function () {
      $location.path('/articles/new');
    };

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

    $scope.orderArticles = function (order) {
      $scope.activeTab = order;
      $scope.articles = [{ loading: true }, { loading: true },
          { loading: true }];
      $scope.order = order;
      Article.query({'order': order}, function(articles) {
        $scope.articles = articles;
      });
    };

    $scope.selectTab = function(tab) {
      $scope.activeTab = tab;
    };

    $scope.showCategoriesPicker = function() {
      $rootScope.$emit('openTopicPicker', {pickOnlyCategory: true});
    };

    var categorySelectedUnbind = $rootScope.$on('categorySelected',
        function(event, data) {
      $location.path('/categories/' + data.category.id);
    });

    /**
     * Make sure to cleanup the binded events and intervals when the user
     * leaves to another controller.
     */
    var onDestroy = function () {
      categorySelectedUnbind();
    };
    $scope.$on('$destroy', onDestroy);


  }]);
