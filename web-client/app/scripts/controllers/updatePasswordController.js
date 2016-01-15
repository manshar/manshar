'use strict';

angular.module('webClientApp')
  .controller('UpdatePasswordController', ['$rootScope', '$scope', '$state', '$analytics', '$auth',
      function ($rootScope, $scope, $state, $analytics, $auth) {

    $scope.error = null;
    $scope.userForm = {};

    $rootScope.$on('auth:password-reset-confirm-success', function() {
      console.log('Success');
    });

    $rootScope.$on('auth:password-reset-confirm-error', function() {
      swal('حدث خطأ!', 'لم يمكننا التحقق من حسابك. الرجاء المحاولة مرة أخرى.', 'error');
    });

    $scope.update = function(userForm) {
      $auth.updatePassword(userForm).then(updateSuccess, updateError);
    };

    var updateSuccess = function() {
      $analytics.eventTrack('Password Update Success', {
        category: 'User'
      });
      swal('تم التحديث!', 'تم تحديث كلمة المرور بنجاح. سيتم إرسالك إلى صفحة تسجيل الدخول.', 'success');
      $state.go('app.login');
    };

    var updateError = function(response) {
      $analytics.eventTrack('Password Update Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما. حاول مرة أخرى.';
    };

  }]);
