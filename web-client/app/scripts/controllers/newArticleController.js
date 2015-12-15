'use strict';

angular.module('webClientApp')
  .controller('NewArticleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$analytics', '$window', 'Article',
      function ($rootScope, $scope, $routeParams, $location, $analytics, $window, Article) {

    var createSuccess = function (resource) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Created', {
        category: 'Article',
        label: resource.title
      });
      $location.path('/articles/' + resource.id + '/edit');
      $location.replace();
    };

    var createError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Create Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حفظ المقال.';
    };

    Article.save({ article: { published: false } }, createSuccess, createError);

  }]);
