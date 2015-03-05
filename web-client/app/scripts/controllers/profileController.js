'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle', 'UserDraft', 'User','$analytics', '$window', 'Article', 'UserRecommendation', 'UserComment', 'UserLink',
    function ($scope, $rootScope, $location, $routeParams, UserArticle, UserDraft, User, $analytics, $window, Article, UserRecommendation, UserComment, UserLink) {

    User.get({'userId': $routeParams.userId}, function(resource) {
      /* jshint camelcase: false */
      $rootScope.page.title = resource.name;
      $rootScope.page.image = resource.cover_url;
      $rootScope.page.publishedTime = resource.created_at;
      $rootScope.page.description = resource.bio;
      $scope.profile = resource;
    });

    $rootScope.forceBar = true;

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

    $scope.loadRecommendations = function() {
      $scope.activeTab = 'recommendations';
      $scope.articles = [{ loading: true }, { loading: true },
          { loading: true }];
      var articles = [];
      UserRecommendation.query({'userId': $routeParams.userId}, function(recommendations) {
        angular.forEach(recommendations, function (recommendation) {
          articles.push(recommendation.article);
        });
        $scope.articles = articles;
      });
    };

    $scope.loadDiscussions = function() {
      $scope.activeTab = 'discussions';
      $scope.articles = [{ loading: true }, { loading: true },
            { loading: true }];
      var articles = [];
      UserComment.query({'userId': $routeParams.userId}, function(comments) {
        angular.forEach(comments, function (comment) {
          var alreadyExist = false;
          for (var i = 0; i < articles.length; i++) {
            if (angular.equals(articles[i], comment.article)) {
              alreadyExist = true;
            }
          }
          if (!alreadyExist) {
            articles.push(comment.article);
          }
        });
        $scope.articles = articles;
      });
    };

    $scope.loadArticles = function() {
      $scope.articles = [{ loading: true }, { loading: true },
            { loading: true }];
      $scope.activeTab = 'published';
      // Only get drafts if the current profile being viewed and the logged in user
      // are the same person.
      if (($rootScope.user &&
           $rootScope.user.id === parseInt($routeParams.userId))) {
        $scope.drafts = UserDraft.query({});
      }

      UserArticle.query({'userId': $routeParams.userId}, function (articles) {
        $scope.articles = articles;
      });
    };


    $scope.loadLinks = function() {
      UserLink.query({'userId': $routeParams.userId}, function (links) {
        $scope.links = links;
      });
    };

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };
    
    $scope.loadLinks();
    $scope.loadArticles();

  }]);
