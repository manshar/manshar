'use strict';

angular.module('webClientApp')
  .directive('categoryTopicPicker', ['$rootScope', '$location', 'Category', 'Topic',
      function ($rootScope, $location, Category, Topic) {

    return {
      restrict: 'A',
      templateUrl: 'views/directives/categoryTopicPicker.html',
      scope: {
        visible: '='
      },
      link: function (scope, element) {
        scope.selectedCategory = null;
        scope.categories = Category.query();
        scope.topics = [];
        // scope.allowCreateTopics = false;
        scope.visible = false;

        scope.selectCategory = function(category) {
          scope.selectedCategory = category;
          if (scope.pickOnlyCategory) {
            $rootScope.$emit('categorySelected', {'category': category});
            scope.visible = false;
            scope.selectedCategory = null;
          } else {
            scope.topics = Topic.query({categoryId: category.id});
            element.find('input')[0].focus();
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
          swal('حدث خطأ ما', 'الرجاء المحاولة مرة ثانية', 'error');
        };

        scope.saveTopic = function(topic) {
          if(topic && topic.title && topic.title.split(' ').length <= 3) {
            Topic.save({
              'categoryId': scope.selectedCategory.id,
              'topic': topic
            }, createTopicSuccess, createTopicError);
          }
          else {
            swal('موضوع المقال لا يجب ان يتعدى ثلاث كلمات', 'الرجاء تعديل الموضوع','error');
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
          if (data && data.category) {
            scope.selectCategory(getCategoryById(data.category.id));
          }
          scope.visible = true;
        });
      }
    };
  }]);
