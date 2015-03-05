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
      $scope.hasNext = true;
      $scope.publishers = User.query();
    });

    $rootScope.forceBar = false;

    // TODO(mkhatib): Refactor this to move it to its own directive for listing
    // articles with specific
    var page = 1;
    $scope.hasNext = false;
    $scope.loadMoreArticles = function() {
      $scope.inProgress = 'load-more';
      Article.query({
        'order': $scope.order,
        'page': ++page
      }, function(articles) {
        if (!articles || !articles.length) {
          $scope.hasNext = false;
        }
        Array.prototype.push.apply($scope.articles, articles);
        $scope.inProgress = null;
      });
    };

    $scope.newArticle = function () {
      $location.path('/articles/new');
    };

    $scope.showArticle = function (articleId) {
      $location.path('/articles/' + articleId);
    };

    $scope.orderArticles = function (order) {
      page = 1;
      $scope.activeTab = order;
      $scope.articles = [{ loading: true }, { loading: true },
          { loading: true }];
      $scope.order = order;
      Article.query({'order': order}, function(articles) {
        $scope.articles = articles;
        $scope.hasNext = true;
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

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };

    /**
     * Make sure to cleanup the binded events and intervals when the user
     * leaves to another controller.
     */
    var onDestroy = function () {
      categorySelectedUnbind();
    };
    $scope.$on('$destroy', onDestroy);


  }]);
