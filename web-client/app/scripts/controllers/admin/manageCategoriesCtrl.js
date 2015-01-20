'use strict';

angular.module('webClientApp')
  .controller('ManageCategoriesCtrl', ['$scope', '$routeParams', '$window', 'Category', '$analytics',
      function ($scope, $routeParams, $window, Category, $analytics) {

    // Holder for creating new categories.
    $scope.category = {};
    $scope.categories = Category.query();
    $scope.error = null;
    $scope.errorMessages = {};

    $scope.saveCategory = function(category) {
      if (category.id) {
        Category.update({'categoryId': category.id}, {'category': category}, updateSuccess, updateError);
      } else {
        Category.save({'category': category}, createSuccess, updateError);
      }
    };

    $scope.deleteCategory = function(category) {
      if ($window.confirm('هل أنت متأكد من حذف الفئة؟')) {
        Category.delete({'categoryId': category.id}, function () {
          var index = $scope.categories.indexOf(category);
          $scope.categories.splice(index, 1);
        });
      }
    };

    var updateSuccess = function() {
      $analytics.eventTrack('Update Success', {
        category: 'Category'
      });
    };

    var updateError = function(response) {
      $analytics.eventTrack('Update Error', {
        category: 'Category',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.';
      $scope.errorMessages = response.errors;
    };

    var createSuccess = function(resource) {
      $scope.categories.push(resource);
      $scope.category = {};
      $analytics.eventTrack('Create Success', {
        category: 'Category'
      });
    };

    var createError = function(response) {
      $analytics.eventTrack('Create Error', {
        category: 'Category',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.';
      $scope.errorMessages = response.errors;
    };

  }]);
