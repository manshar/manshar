'use strict';

angular.module('webClientApp')
  .controller('TopicCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$filter', '$anchorScroll', 'Category', 'Topic', 'TopicArticle',
      function ($scope, $rootScope, $routeParams, $location, $filter, $anchorScroll, Category, Topic, TopicArticle) {

    Topic.get({
      'categoryId': $routeParams.categoryId,
      'topicId': $routeParams.topicId
    }, function(resource) {
      /* jshint camelcase: false */
      $rootScope.page.title = resource.title;
      $rootScope.page.image = resource.category.original_image_url;
      $rootScope.page.publishedTime = resource.created_at;
      $rootScope.page.description = resource.category.description;

      $scope.topic = resource;
    });

    $rootScope.forceBar = true;

    // Get all articles in this category.
    $scope.articles = [{ loading: true }, { loading: true },
        { loading: true }];
    TopicArticle.query({
      'categoryId': $routeParams.categoryId,
      'topicId': $routeParams.topicId
    }, function(articles) {
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
