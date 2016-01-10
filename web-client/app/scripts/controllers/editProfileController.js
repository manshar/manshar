'use strict';

angular.module('webClientApp')
  .controller('EditProfileCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'User', 'profile','$analytics',
      function ($scope, $rootScope, $state, $stateParams, User, profile, $analytics) {

    $scope.profile = profile;
    $scope.error = null;
    $scope.errorMessages = {};

    /**
     * User Data update
     */
    $scope.updateUserData = function(profile) {
      User.update(
          $scope.profile.id, profile,
          updateUserDataSuccess, updateUserDataError);
    };

    var updateUserDataSuccess = function() {
      $analytics.eventTrack('Update Success', {
        category: 'User'
      });
      $state.go('app.publishers.profile.user.published', {
        userId: $stateParams.userId
      });
    };

    var updateUserDataError = function(response) {
      $analytics.eventTrack('Update Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.'; // General form error.
      $scope.errorMessages = response.errors; // Detailed error message from backend.
    };

    /**
     * When the user logout while in edit mode, redirect the user to his
     * own profile
     */
    var loggedOutUnbined = $rootScope.$on('auth:logout-success', function () {
      $state.go('app.publishers.profile.user.published', {
        userId: $stateParams.userId
      });
    });

    var onDestroy = function () {
      loggedOutUnbined();
    };

    $scope.$on('$destroy', onDestroy);

  }]);
