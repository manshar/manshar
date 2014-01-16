'use strict';

angular.module('webClientApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', '$routeParams', 'LoginService',
      function ($scope, $http, $location, $routeParams, LoginService) {

    $scope.user = {};
    $scope.error = null;

    $scope.login = function(user) {
      LoginService.login(user, success, error);
    };

    var success = function() {
      $location.path($routeParams.prev || '/')
        // Remove the prev param when redirecting.
        .search('prev', null);
    };

    var error = function() {
      $scope.error = 'خطأ في البريد الالكتروني أو كلمة المرور';
    };

  }]);
