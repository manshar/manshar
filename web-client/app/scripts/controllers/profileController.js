'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', 'profile', 'articles', 'publishers', '$location', '$stateParams', 'User','$analytics', '$window', 'Article', 'UserLink',
    function ($scope, $rootScope, profile, articles, publishers, $location, $stateParams, User, $analytics, $window, Article, UserLink) {

    $scope.profile = profile;
    $scope.articles = articles;
    $scope.publishers = publishers;

    $scope.editArticle = function (articleId) {
      $location.path('/articles/' + articleId + '/edit');
    };

    $scope.editProfile = function () {
      $location.path('/profiles/' + $rootScope.user.id + '/edit');
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
        var list = article.published ? $scope.articles : $scope.drafts;
        var index = list.indexOf(article);
        list.splice(index, 1);
      } else {
        $scope.inProgress = null;
      }
    };


    $scope.loadLinks = function() {
      UserLink.query({'userId': $stateParams.userId}, function (links) {
        $scope.links = links;
      });
    };

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };

    $scope.loadLinks();
    // $scope.loadArticles();

  }]);
