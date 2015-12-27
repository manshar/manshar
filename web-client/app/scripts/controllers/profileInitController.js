'use strict';

angular.module('webClientApp')
  .controller('ProfileInitCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.publishers = [];

    var publishersLoaded = $rootScope.$on('publishers:loaded', function (
        event, data) {
      $scope.publishers = data.publishers;
    });

    var profileLoaded = $rootScope.$on('profile:loaded', function (
        event, data) {
      $scope.profile = data.profile;
    });

    /**
     * Make sure to cleanup the binded events and intervals when the user
     * leaves to another controller.
     */
    var onDestroy = function() {
      publishersLoaded();
      profileLoaded();
    };
    $scope.$on('$destroy', onDestroy);

  }]);
