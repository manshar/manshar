'use strict';

angular.module('webClientApp')
  .controller('SignupCtrl', ['$scope', '$location', '$routeParams', '$analytics', 'SignupService',
      function ($scope, $location, $routeParams, $analytics, SignupService) {

    $scope.error = null;
    $scope.errorMessages = {};

    $scope.signup = function(user) {
      SignupService.signup(user, success, error);
    };

    var success = function() {
      $analytics.eventTrack('Register Success', {
        category: 'User'
      });

      $scope.flash = 'تم إرسال رسالة إلى بريدك الإلكتروني لتفعيل حسابك.';
      $scope.flashNote = '(تأكد من مجلد السبام)';
    };

    var error = function(response) {
      $analytics.eventTrack('Register Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.'; // General form error.
      $scope.errorMessages = response.errors; // Detailed error message from backend.
    };

  }]);
