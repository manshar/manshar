'use strict';

angular.module('webClientApp')
  .controller('SignupCtrl', ['$scope', '$analytics', 'SignupService',
      function ($scope, $analytics, SignupService) {

    $scope.error = null;
    $scope.errorMessages = {};

    $scope.signup = function(user) {
      SignupService.signup(user, success, error);
    };

    var success = function() {
      $analytics.eventTrack('Register Success', {
        category: 'User'
      });

      fbq('track', 'CompleteRegistration');

      $scope.flash = 'تم إرسال رسالة إلى بريدك الإلكتروني لتفعيل حسابك.';
      $scope.flashNote = '(تأكد من مجلد السبام)';
    };

    var error = function(response) {
      $analytics.eventTrack('Register Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });

      var emailInUseMsg = 'This email address is already in use';
      var message = (
          response.errors && response.errors[0] ||
          response.errors && response.errors.full_messages && response.errors.full_messages[0] || '');
      if (message.indexOf(emailInUseMsg) !== -1) {
        $scope.error = 'هذا الإيميل مستخدم من قبل، الرجاء تسجيل الدخول.';
      } else {
        $scope.error = message || 'حدث خطأ ما. الرجاء المحاولة مرة أخرى';
      }

      $scope.flash = null;
      console.log(response.errors); // Detailed error message from backend.
    };

  }]);
