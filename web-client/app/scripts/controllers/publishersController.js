'use strict';

angular.module('webClientApp')
  .controller('PublishersCtrl', ['$scope', '$state', 'publishers',
    function ($scope, $state, publishers) {
      $scope.publishers = publishers;
      var currentState = $state.current.url;
      $scope.currentState = currentState.substring(0, currentState.length - 1);
  }]);
