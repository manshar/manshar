'use strict';

angular.module('webClientApp')
  .controller('StatCtrl', ['$scope', 'stats',
    function ($scope, stats) {
      $scope.stats = stats;
  }]);
