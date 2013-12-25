'use strict';

angular.module('webClientApp')
  .controller('SignupCtrl', ['$scope', '$http', '$location', '$routeParams', 'SignupService',
      function ($scope, $http, $location, $routeParams, SignupService) {

    $scope.user = {};
    $scope.error = null;

    $scope.signup = function(user) {
      SignupService.signup(user, success, error);
    };

    var success = function() {
      $location.path($routeParams.prev || '/');
    };

    var error = function() {
      $scope.error = 'Some error.';
    };

  }]);
