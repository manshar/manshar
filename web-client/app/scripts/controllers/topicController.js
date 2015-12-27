'use strict';

angular.module('webClientApp')
  .controller('TopicCtrl', ['$scope', '$rootScope', '$state', '$filter', '$anchorScroll', 'topic', 'articles',
      function ($scope, $rootScope, $state, $filter, $anchorScroll, topic, articles) {
    $anchorScroll();

    $scope.topic = topic;
    $scope.articles = articles;
    $scope.publishers = [];


    $rootScope.page.title = topic.title;
    $rootScope.page.image = topic.category.original_image_url;
    $rootScope.page.publishedTime = topic.created_at;
    $rootScope.page.description = topic.category.description;

    // Used to make sure no duplicates occur in the publishers array
    var publishersDict = {},
      i;

    for(i = 0; (i < articles.length) && ($scope.publishers.length<5); ++i) {
      var user = articles[i].user;
      if(!publishersDict[user.id]) {
        publishersDict[user.id] = true;
        $scope.publishers.push(user);
      }
    }

    // Topic.get({
    //   'categoryId': $routeParams.categoryId,
    //   'topicId': $routeParams.topicId
    // }, function(resource) {
    //   /* jshint camelcase: false */
    //   $rootScope.page.title = resource.title;
    //   $rootScope.page.image = resource.category.original_image_url;
    //   $rootScope.page.publishedTime = resource.created_at;
    //   $rootScope.page.description = resource.category.description;

    //   $scope.topic = resource;
    // });

    // TopicArticle.query({
    //   'categoryId': $routeParams.categoryId,
    //   'topicId': $routeParams.topicId
    // }, function(articles) {
    //   $scope.articles = articles;
    // });

    $scope.showCategoriesPicker = function() {
      $rootScope.$emit('openTopicPicker', {pickOnlyCategory: true});
    };

    var categorySelectedUnbind = $rootScope.$on('categorySelected',
        function(event, data) {
      $state.go('app.categories', {categoryId: data.category.id});
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
