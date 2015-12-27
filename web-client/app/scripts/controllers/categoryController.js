'use strict';

angular.module('webClientApp')
  .controller('CategoryCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$filter', '$anchorScroll', 'category', 'topics', 'articles',
      function ($scope, $rootScope, $stateParams, $state, $filter, $anchorScroll, category, topics, articles) {
    $anchorScroll();
    $scope.category = category;
    $scope.articles = articles;
    $scope.topics = topics;
    $scope.publishers = [];
    console.log('topics', $scope.topics);

    console.log('hello?');

    $rootScope.page.title = category.title;
    $rootScope.page.image = category.original_image_url;
    $rootScope.page.publishedTime = category.created_at;
    $rootScope.page.description = category.description;

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
