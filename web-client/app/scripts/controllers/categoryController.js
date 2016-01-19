'use strict';

angular.module('webClientApp')
  .controller('CategoryCtrl', ['$scope', '$rootScope', '$anchorScroll', 'category', 'topics',
      function ($scope, $rootScope, $anchorScroll, category, topics) {
    $anchorScroll();
    $scope.category = category;
    $scope.topics = topics;

    $rootScope.page.title = category.title + ' - منشر';
    $rootScope.page.image = category.original_image_url;
    $rootScope.page.publishedTime = category.created_at;
    $rootScope.page.description = category.description;

  }]);
