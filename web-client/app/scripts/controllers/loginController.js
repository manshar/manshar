'use strict';

angular.module('webClientApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', '$routeParams', '$analytics', 'LoginService',
      function ($scope, $http, $location, $routeParams, $analytics, LoginService) {

    $scope.isLoginPage = $location.path() === '/login';
    $scope.user = {};
    $scope.error = null;

    $scope.login = function(user) {
      LoginService.login(user, success, error);
    };

    var success = function() {
      $analytics.eventTrack('Login Success', {
        category: 'User'
      });
      if ($scope.isLoginPage) {
        $location.path($routeParams.prev || '/')
          // Remove the prev param when redirecting.
          .search('prev', null);
      }
    };

    var error = function(response) {
      $analytics.eventTrack('Login Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'خطأ في البريد الالكتروني أو كلمة المرور';
    };

  }]);
