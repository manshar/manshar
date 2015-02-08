'use strict';

angular.module('webClientApp')
  .controller('CategoryCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$filter', 'Category', 'Topic', 'CategoryArticle',
      function ($scope, $rootScope, $routeParams, $location, $filter, Category, Topic, CategoryArticle) {

    Category.get({'categoryId': $routeParams.categoryId},
        function(resource) {
      /* jshint camelcase: false */
      $rootScope.page.title = resource.title;
      $rootScope.page.image = resource.original_image_url;
      $rootScope.page.publishedTime = resource.created_at;
      $rootScope.page.description = resource.description;

      $scope.category = resource;
    });

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
  }]);
