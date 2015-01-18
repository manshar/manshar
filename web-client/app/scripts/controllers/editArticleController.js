'use strict';
/* jshint camelcase: false */

angular.module('webClientApp')
  .controller('EditArticleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$analytics', '$window', '$interval', '$timeout', 'Article',
      function ($rootScope, $scope, $routeParams, $location, $analytics, $window, $interval, $timeout, Article) {

    var confirmEditMessage = ('هذه العملية ستنقل المقال إلى مسوداتك. يمكنك' +
        ' نشرها مجدداً بالضغط على نشر. هل تود نقل المقال للمسودات؟');

    var lastSavedArticle = {};

    /**
     * Checks if the article has been changed since the last time it was saved.
     * @return {boolean} True if the article has been changed.
     */
    var isDirty = function () {
      // Check if the article has been updated since last edited.
      var maybeUpdatedArticle = angular.copy($scope.article);
      // To avoid updating the $scope.article model just remove updated_at
      // to make sure the updated_at is not compared when checking for changes.
      delete maybeUpdatedArticle.updated_at;
      delete lastSavedArticle.updated_at;
      return !angular.equals(maybeUpdatedArticle, lastSavedArticle);
    };

    /**
     * If the current user is not the owner redirect the user to view.
     */
    var authorizeUser = function (article) {
      if (!$rootScope.isOwner($rootScope.currentUser, article)) {
        $location.path('/articles/' + article.id);
      }
    };

    // Update the page title when the title of the article changes.
    $scope.$watch('article.title', function(){
      $rootScope.page.title = $scope.article.title || 'مقال جديد';
    });

    // Load the article if we are editing.
    $scope.article = {};
    if($routeParams.articleId) {
      $scope.article = Article.get({'articleId': $routeParams.articleId}, function (resource) {
        authorizeUser(resource);
        lastSavedArticle = angular.copy(resource);

        // Warn the user that editing an article will move it to draft until
        // they publish it again.
        $timeout(function () {
          if (resource.published) {
            if (!$window.confirm(confirmEditMessage)) {
              $location.path('/articles/' + resource.id);
            }
          }
        });
      });
    }


    var updateSuccess = function (resource) {
      lastSavedArticle = angular.copy(resource);
      $timeout(function () {
        $scope.isSaving = false;
      }, 1000);
      $scope.inProgress = null;

      if (resource.published) {
        // First time this gets published.
        if (!$scope.article.published_at) {
          $scope.article.published_at = resource.published_at;
          $analytics.eventTrack('New Article Published', {
            category: 'Article',
            label: resource.title
          });
        } else {
          // The article has been already published, moved to draft and now
          // republished again.
          $analytics.eventTrack('Article Re-Published', {
            category: 'Article',
            label: resource.title
          });
        }
      }

      if (resource.published) {
        $location.path('/articles/' + resource.id);
      }
    };

    var updateError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Update Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حفظ المقال.';
    };

    var deleteSuccess = function () {
      $analytics.eventTrack('Article Deleted', {
        category: 'Article'
      });
      $location.path('/');
    };

    var deleteError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Delete Article Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حذف المقال.';
    };

    /**
     * Saves/Updates article data.
     * @param {Object} article Article data.
     * @param {boolean} published Whether to publish the article or save as a draft.
     * @param {boolean} silent Whether to flash the controls or not.
     */
    $scope.saveArticle = function(article, published, silent) {
      article.published = published;
      var formError = $scope.articleForm.$error;
      if(published && formError && formError.required) {
        $window.alert('تأكد من ادخال جميع المعلومات المطلوبة');
        return;
      }
      if (!silent) {
        $scope.inProgress = published ? 'publish' : 'save';
      }

      Article.update(
          { 'articleId': article.id }, { article: article },
          updateSuccess, updateError);
    };

    /**
     * Deletes an article.
     * @param {Object} article Article data.
     */
    $scope.deleteArticle = function(article) {
      $scope.inProgress = 'delete';
      if ($window.confirm('متأكد من حذف المقال؟')) {
        Article.delete({ 'articleId': article.id }, {}, deleteSuccess, deleteError);
      } else {
        $scope.inProgress = null;
      }
    };

    /**
     * Cancel creating an article.
     */
    $scope.cancel = function() {
      $scope.inProgress = 'cancel';
      // Warn the user when canceling editing an existing article or when
      // canceling a new article with changed properties.
      if (!isDirty() || $window.confirm('متأكد من إلغاء المقال؟')) {
        $location.path('/');
      } else {
        $scope.inProgress = null;
      }
    };


    /**
     * Start the auto save interval and save its promise to destroy it when the
     * user is done editing.
     * @return {!angular.$promise} A promise to be notified on each iteration.
     */
    var autoSavePromise = $interval(function () {
      if (!isDirty()) {
        return;
      }

      $scope.isSaving = true;
      $scope.saveArticle($scope.article, false, true);
    }, 5000);


    /**
     * When the user logout while in edit mdoe redirect the user,
     */
    var loggedOutunbined = $rootScope.$on('user.loggedOut', function () {
      if ($scope.article.published) {
        var location = '/articles/' + $routeParams.articleId;
        $location.path(location);
      } else {
        $location.path('/');
      }
    });

    /**
     * Make sure to cleanup the binded events and intervals when the user
     * leaves to another controller.
     */
    var onDestroy = function () {
      $interval.cancel(autoSavePromise);
      loggedOutunbined();
    };

    // Make sure to cleanup the binding. Otherwise the event listener will
    // be added everytime the controller load and when the controller is
    // still loaded it would still listen to the event.
    $scope.$on('$destroy', onDestroy);

  }]);
