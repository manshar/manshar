'use strict';

angular.module('webClientApp')
.directive('loadMoreArticles', ['$document', '$rootScope', '$state', 'Article', 'TopicArticle', 'CategoryArticle', 'UserArticle', 'UserRecommendation', 'UserComment', 'UserDraft',
  function ($document, $rootScope, $state, Article, TopicArticle, CategoryArticle, UserArticle, UserRecommendation, UserComment, UserDraft) {

    // Pass order and category id
  	return {
      restrict: 'E',
      scope: {
        order: '=',
        category: '=',
        topic: '=',
        articles: '=',
        profile: '=',
        state: '='
      },
      link: function(scope) {
        var page = 1;
        scope.hasNext = true;

        // Success callback for querying articles. Appends retrieved articles.
        var addArticles = function(articles) {
          if (!articles || !articles.length) {
            scope.hasNext = false;
          }
          Array.prototype.push.apply(scope.articles, articles);
          scope.inProgress = null;
        };

        var loadedArticles = {};

        var loopAddArticles = function(articles) {
          if (!articles || !articles.length) {
            scope.hasNext = false;
          }
          for(var i = 0; i < articles.length; ++i) {
            var article = articles[i].article;
            if(!loadedArticles[article.id]) {
              scope.articles.push(article);
              loadedArticles[article.id] = true;
            }
          }
          scope.inProgress = null;
        };

        scope.loadMoreArticles = function() {
          scope.inProgress = 'load-more';
          if(scope.topic) {
            TopicArticle.query({
              'categoryId': scope.topic.category.id,
              'topicId': scope.topic.id,
              'page': ++page
            }, addArticles);
          } else if(scope.category) {
            CategoryArticle.query({
              'categoryId': scope.category.id,
              'page': ++page
            }, addArticles);
          } else if(scope.profile) {
            if(scope.state === 'published') {
              UserArticle.query({
                'userId': scope.profile.id,
                'page': ++page
              }, addArticles);
            } else if(scope.state === 'recommended') {
              UserRecommendation.query({
                'userId': scope.profile.id,
                'page': ++page
              }, loopAddArticles);
            } else if(scope.state === 'discussions') {
              UserComment.query({
                'userId': scope.profile.id,
                'page': ++page
              }, loopAddArticles);
            } else if(scope.state === 'drafts') {
              UserDraft.query({
                'userId': scope.profile.id,
                'page': ++page
              }, addArticles);
            }
          } else if(scope.order) {
            Article.query({
              'order': scope.order,
              'page': ++page
            }, addArticles);
          }
        };

      },
      template: '<div class="more-articles section">'+
                  '<h3 class="section-title" ng-click="loadMoreArticles()"'+
                    'ng-show="hasNext">'+
                    '<i class="circle-icon fa fa-refresh"></i>'+
                  '</h3>'+
                '</div>'
    };
  }]);
