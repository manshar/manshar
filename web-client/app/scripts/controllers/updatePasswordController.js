'use strict';

angular.module('webClientApp')
  .controller('UpdatePasswordController', ['$rootScope', '$scope', '$location', '$window', '$analytics', '$auth',
      function ($rootScope, $scope, $location, $window, $analytics, $auth) {

    $scope.error = null;
    $scope.userForm = {};

    $rootScope.$on('auth:password-reset-confirm-success', function() {
      console.log('Success');
    });

    $rootScope.$on('auth:password-reset-confirm-error', function() {
      $window.alert('Unable to verify your account. Please try again.');
    });

    $scope.update = function(userForm) {
      $auth.updatePassword(userForm).then(updateSuccess, updateError);
    };

    var updateSuccess = function() {
      $analytics.eventTrack('Password Update Success', {
        category: 'User'
      });
      $window.alert('تم تحديث كلمة المرور بنجاح. سيتم إرسالك إلى صفحة تسجيل الدخول.');
      $location.path('/login');
    };

    var updateError = function(response) {
      $analytics.eventTrack('Password Update Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما. حاول مرة أخرى.';
    };

  }]);
