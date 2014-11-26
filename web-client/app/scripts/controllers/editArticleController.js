'use strict';

angular.module('webClientApp')
  .controller('EditArticleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$analytics', '$window', 'Article',
      function ($rootScope, $scope, $routeParams, $location, $analytics, $window, Article) {

    var isEdit = false;

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
      isEdit = true;
      $scope.article = Article.get({'articleId': $routeParams.articleId}, authorizeUser);
    }


    var createSuccess = function (resource) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Created', {
        category: 'Article',
        label: resource.title
      });
      $location.path('/articles/' + resource.id);
    };

    var updateSuccess = function (resource) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Updated', {
        category: 'Article',
        label: resource.title
      });
      $location.path('/articles/' + resource.id);
    };

    var createError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Article Create Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حفظ المقال.';
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
     */
    $scope.saveArticle = function(article, published) {
      if (!published && article.published) {
        if (!$window.confirm('هذه العملية ستنقل المقال إلى مسوداتك. يمكنك نشرها مجدداً بالضغط على نشر. هل تود نقل المقال للمسودات؟')) {
          return;
        }
      }
      article.published = published;
      var formError = $scope.articleForm.$error;
      if(formError && formError.required) {
        $window.alert('تأكد من ادخال جميع المعلومات المطلوبة');
        return;
      }
      $scope.inProgress = published ? 'publish' : 'save';
      if(isEdit) {
        Article.update({ 'articleId': article.id }, { article: article }, updateSuccess, updateError);
      } else {
        Article.save({ article: article }, createSuccess, createError);
      }
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
      var isDirty = (isEdit || $scope.article.title || $scope.article.cover ||
                     $scope.article.tagline || $scope.article.body);
      if (!isDirty || $window.confirm('متأكد من إلغاء المقال؟')) {
        $location.path('/');
      } else {
        $scope.inProgress = null;
      }
    };

    /**
     * When the user logout while in edit mdoe redirect the user,
     */
    var loggedOutunbined = $rootScope.$on('user.loggedOut', function () {
      var location = '/';
      if (isEdit) {
        location = '/articles/' + $routeParams.articleId;
      }
      $location.path(location);
    });

    // Make sure to cleanup the binding. Otherwise the event listener will
    // be added everytime the controller load and when the controller is
    // still loaded it would still listen to the event.
    $scope.$on('$destroy', loggedOutunbined);

  }]);
