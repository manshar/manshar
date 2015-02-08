'use strict';

angular.module('webClientApp')
  .controller('ResetPasswordController', ['$scope', '$location', '$window', '$analytics', '$auth',
      function ($scope, $location, $window, $analytics, $auth) {

    $scope.error = null;
    $scope.userForm = {};

    $scope.reset = function(userForm) {
      $auth.requestPasswordReset(userForm).then(resetSuccess, resetError);
    };

    var resetSuccess = function() {
      $analytics.eventTrack('Password Reset Success', {
        category: 'User'
      });
      $window.alert('تم إرسال تعليمات استرجاع كلمة المرور إلى بريدك الإلكتروني.');
    };

    var resetError = function(response) {
      $analytics.eventTrack('Password Reset Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما. حاول مرة أخرى.';
    };

  }]);
