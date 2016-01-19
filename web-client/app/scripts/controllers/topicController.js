'use strict';

angular.module('webClientApp')
  .controller('TopicCtrl', ['$scope', '$rootScope', '$state', '$filter', '$anchorScroll', '$stateParams', 'topic',
      function ($scope, $rootScope, $state, $filter, $anchorScroll, $stateParams, topic) {
    $anchorScroll();

    $scope.topic = topic;
    $rootScope.page.title = topic.title + ' - منشر';
    $rootScope.page.image = topic.category.original_image_url;
    $rootScope.page.publishedTime = topic.created_at;
    $rootScope.page.description = topic.category.description;

  }]);
