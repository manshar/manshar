'use strict';

angular.module('webClientApp')
  .controller('CategoryCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$filter', '$anchorScroll', 'Category', 'Topic', 'CategoryArticle',
      function ($scope, $rootScope, $routeParams, $location, $filter, $anchorScroll, Category, Topic, CategoryArticle) {
    $anchorScroll();

    Category.get({'categoryId': $routeParams.categoryId},
        function(resource) {
      /* jshint camelcase: false */
      $rootScope.page.title = resource.title;
      $rootScope.page.image = resource.original_image_url;
      $rootScope.page.publishedTime = resource.created_at;
      $rootScope.page.description = resource.description;

      $scope.category = resource;
    });

    $rootScope.forceBar = true;

    // Get all topics in this category.
    $scope.topics = Topic.query({'categoryId': $routeParams.categoryId});

    // Get all articles in this category.
    $scope.articles = [{ loading: true }, { loading: true },
        { loading: true }];
    CategoryArticle.query({'categoryId': $routeParams.categoryId},
        function(articles) {
      $scope.articles = articles;
    });

    $scope.showCategoriesPicker = function() {
      $rootScope.$emit('openTopicPicker', {pickOnlyCategory: true});
    };

    var categorySelectedUnbind = $rootScope.$on('categorySelected',
        function(event, data) {
      $location.path('/categories/' + data.category.id);
    });

    $scope.getCardColor = function(color) {
      return $filter('darker')(color, -0.4);
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
