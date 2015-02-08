'use strict';

angular.module('webClientApp')
  .controller('EditProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'User','$analytics',
      function ($scope, $rootScope, $location, $routeParams, User, $analytics) {

    /**
     * If the current user is not the owner redirect the user to view.
     */
    var authorizeUser = function (user) {
      var id = parseInt($rootScope.user.id);
      if (id !== user.id) {
        $location.path('/profiles/' + user.id);
      }
    };

    $scope.profile = User.get({'userId': $routeParams.userId}, authorizeUser);
    $scope.error = null;
    $scope.errorMessages = {};

    $scope.update = function(profile) {
      User.update($scope.profile.id, profile, success, error);
    };

    var success = function() {
      $analytics.eventTrack('Update Success', {
        category: 'User'
      });
      $location.path($routeParams.prev || '/');
    };

    var error = function(response) {
      $analytics.eventTrack('Update Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.'; // General form error.
      $scope.errorMessages = response.errors; // Detailed error message from backend.
    };

  }]);
