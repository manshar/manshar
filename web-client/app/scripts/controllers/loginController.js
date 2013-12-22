'use strict';

angular.module('webClientApp')
  .controller('LoginCtrl', function ($scope, $http, $location, $routeParams, LoginService) {

    $scope.user = {};
    $scope.error = null;

    $scope.login = function(user) {
      LoginService.login(user, success, error);
    };

    var success = function() {
      $location.path($routeParams.prev || '/');
    };

    var error = function() {
      $scope.error = 'Wrong username and/or password.';
    };

  });
