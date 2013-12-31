'use strict';

angular.module('webClientApp')
  .controller('SignupCtrl', ['$scope', '$location', '$routeParams', 'SignupService',
      function ($scope, $location, $routeParams, SignupService) {

    $scope.user = {};
    $scope.error = null;

    $scope.signup = function(user) {
      SignupService.signup(user, success, error);
    };

    var success = function() {
      // TODO (HammamSamara) redirect to a view that requests email confirmation
      $location.path($routeParams.prev || '/');
    };

    var error = function() {
      $scope.error = 'An error occurs.';
    };

  }]);
