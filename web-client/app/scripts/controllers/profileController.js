'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle', 'UserDraft', 'User','$analytics', '$window', 'Article',
      function ($scope, $rootScope, $location, $routeParams, UserArticle, UserDraft, User, $analytics, $window, Article) {
       User.get({'userId': $routeParams.userId},
        function(resource) {
          /* jshint camelcase: false */
          $rootScope.page.title = resource.name;
          $rootScope.page.image = resource.cover_url;
          $rootScope.page.publishedTime = resource.created_at;
          $rootScope.page.description = resource.bio;
          $scope.user = resource;
        });

    // Only get drafts if the current profile being viewed and the logged in user
    // are the same person.
    if (($rootScope.currentUser &&
         $rootScope.currentUser.id === parseInt($routeParams.userId))) {
      $scope.drafts = UserDraft.query({});
    }

    $scope.articles = UserArticle.query({'userId': $routeParams.userId});

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

    $scope.editProfile = function () {
      $location.path('/profiles/' + $rootScope.currentUser.id + '/edit');
    };

    var deleteSuccess = function () {
      $analytics.eventTrack('Article Deleted', {
        category: 'Article'
      });
       $scope.inProgress = null;
    };

    var deleteError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Delete Article Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حذف المقال.';
      $scope.inProgress = null;
    };

    /**
     * Deletes an article.
     * @param {Object} article Article data.
     */
    $scope.deleteArticle = function(article) {
      $scope.inProgress = 'delete';
      if ($window.confirm('متأكد من حذف المقال؟')) {
        Article.delete({ 'articleId': article.id }, {}, deleteSuccess, deleteError);
        var index = $scope.drafts.indexOf(article);
        $scope.drafts.splice(index, 1);
      } else {
        $scope.inProgress = null;
      }
    };

  }]);
