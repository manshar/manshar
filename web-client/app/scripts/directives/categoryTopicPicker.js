'use strict';

angular.module('webClientApp')
  .directive('categoryTopicPicker', ['$rootScope', '$window', '$location', 'Category', 'Topic',
      function ($rootScope, $window, $location, Category, Topic) {

    return {
      restrict: 'A',
      templateUrl: 'views/directives/categoryTopicPicker.html',
      link: function (scope) {
        scope.selectedCategory = null;
        scope.categories = Category.query();
        scope.topics = [];
        scope.allowCreateTopics = false;
        scope.visible = false;

        scope.selectCategory = function(category) {
          scope.selectedCategory = category;
          if (scope.pickOnlyCategory) {
            $rootScope.$emit('categorySelected', {'category': category});
            scope.visible = false;
            scope.selectedCategory = null;
          } else {
            scope.topics = Topic.query({categoryId: category.id});
          }
        };

        scope.selectTopic = function(topic) {
          $rootScope.$emit('topicSelected', {'topic': topic});
          scope.visible = false;
          scope.selectedCategory = null;
        };

        var createTopicSuccess = function(resource) {
          scope.topics.push(resource);
          scope.selectTopic(resource);
          scope.newTopic = {};
        };

        var createTopicError = function() {
          $window.alert('حدث خطأ ما، الرجاء المحاولة مرة أخرى.');
        };

        scope.saveTopic = function(topic) {
          if(topic && topic.title && topic.title.split(' ').length <= 3) {
            Topic.save({
              'categoryId': scope.selectedCategory.id,
              'topic': topic
            }, createTopicSuccess, createTopicError);
          }
          else {
            $window.alert('موضوع المقال لا يجب ان يتعدى ثلاث كلمات');
          }
        };

        var getCategoryById = function(id) {
          if (!id) {
            return null;
          }
          for (var i = 0; i < scope.categories.length; i++) {
            if (scope.categories[i].id === id) {
              return scope.categories[i];
            }
          }
        };

        $rootScope.$on('openTopicPicker', function(event, data) {
          if (data.category) {
            scope.selectCategory(getCategoryById(data.category.id));
          }
          scope.allowCreateTopics = data.allowCreateTopics;
          scope.pickOnlyCategory = data.pickOnlyCategory;
          scope.visible = true;
        });
      }
    };
  }]);
