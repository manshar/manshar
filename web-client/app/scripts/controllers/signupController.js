'use strict';

angular.module('webClientApp')
  .controller('SignupCtrl', ['$scope', '$location', '$routeParams', '$analytics', 'SignupService',
      function ($scope, $location, $routeParams, $analytics, SignupService) {

    $scope.user = {};
    $scope.error = null;
    $scope.errorMessages = {};

    $scope.signup = function(user) {
      SignupService.signup(user, success, error);
    };

    var success = function() {
      // TODO (HammamSamara) redirect to a view that requests email confirmation
      $analytics.eventTrack('Register Success', {
        category: 'User'
      });
      $location.path($routeParams.prev || '/');
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
