'use strict';

angular.module('webClientApp')
  .controller('PasswordController', ['$scope', '$location', '$routeParams', '$window', '$analytics', 'PasswordService',
      function ($scope, $location, $routeParams, $window, $analytics, PasswordService) {

    $scope.user = {};
    $scope.error = null;

    if ($routeParams.resetToken) {
      /* jshint camelcase: false */
      $scope.user.reset_password_token = $routeParams.resetToken;
    }

    $scope.reset = function(user) {
      PasswordService.reset({user: user}, resetSuccess, resetError);
    };

    $scope.update = function(user) {
      PasswordService.update({}, {user: user}, updateSuccess, updateError);
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
