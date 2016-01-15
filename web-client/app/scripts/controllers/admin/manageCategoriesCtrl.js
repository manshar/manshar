'use strict';

angular.module('webClientApp')
  .controller('ManageCategoriesCtrl', ['$scope', 'Category', '$analytics',
      function ($scope, Category, $analytics) {

    // Holder for creating new categories.
    $scope.category = {};
    $scope.categories = Category.query({all: true}, function(category) {
      console.log('category', category);
    });
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
      swal({
        title: 'هل أنت متأكد من حذف الفئة؟',
        text: 'لن تستطيع استعادة الفئة المحذوفة.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'نعم متأكد وأريد حذف الفئة.',
        cancelButtonText: 'لا، الغ الحذف.',
        closeOnConfirm: false,
        closeOnCancel: false },
      function(isConfirm){
        if (isConfirm) {
          Category.delete({'categoryId': category.id}, function () {
            var index = $scope.categories.indexOf(category);
            $scope.categories.splice(index, 1);
          });
        }
      });
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
