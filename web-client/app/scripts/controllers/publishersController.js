'use strict';

angular.module('webClientApp')
  .controller('PublishersCtrl', ['$scope', '$state', '$anchorScroll', 'publishers',
    function ($scope, $state, $anchorScroll, publishers) {
      $anchorScroll();
      $scope.publishers = publishers;
      var currentState = $state.current.url;
      $scope.currentState = currentState.substring(0, currentState.length - 1);
  }]);
