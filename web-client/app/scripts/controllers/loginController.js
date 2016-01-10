'use strict';

angular.module('webClientApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', '$state', '$stateParams', '$analytics', 'LoginService', 'SignupService',
      function ($scope, $http, $location, $state, $stateParams, $analytics, LoginService, SignupService) {

    $scope.isLoginPage = $location.path() === '/login/';
    $scope.error = null;

    $scope.login = function(user) {
      LoginService.login(user, success, error);
    };

    $scope.$on('auth:login-success', function(event, data) {
      success(data);
    });

    $scope.$on('auth:login-error', function(event, data) {
      error(data);
    });

    var success = function(user) {
      $analytics.eventTrack('Login Success', {
        category: 'User'
      });
      if ($scope.isLoginPage) {
        $state.go('app.publishers.profile.user.published', {
          userId: user.id
        });
      }
    };

    var error = function(response) {
      $analytics.eventTrack('Login Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });

      // TODO(mkhatib): This is pretty ugly. Clean it up and move strings into
      // a constant file definition.
      var confirmationMessage = 'A confirmation email was sent to your account';
      var invalidMessage = 'credentials';
      var message = response.errors && response.errors[0] || '';
      if (message.indexOf(confirmationMessage) !== -1) {
        $scope.error = 'يجب عليك تفعيل حسابك. تم إرسال رسالة لبريدك الإلكتروني. تأكد من فحص مجلد السبام.';
        $scope.nonConfirmed = true;
      } else if (message.indexOf(invalidMessage) !== -1) {
        $scope.error = 'خطأ في البريد الالكتروني أو كلمة المرور';
      } else {
        $scope.error = response.errors[0] || 'حدث خطأ ما. الرجاء المحاولة مرة أخرى';
      }
      $scope.flash = null;
    };

    $scope.resendConfirmation = function(user) {
      SignupService.resendConfirmation(user.email, function() {
        $scope.flash = 'تم إرسال رسالة إلى بريدك الإلكتروني لتفعيل حسابك.';
        $scope.flashNote = '(تأكد من مجلد السبام)';
        $scope.nonConfirmed = false;
        $scope.error = null;
      });
    };

  }]);
