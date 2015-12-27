'use strict';

angular.module('webClientApp')
  .controller('PublishersCtrl', ['$scope', 'publishers',
    function ($scope, publishers) {

      $scope.publishers = publishers;
  }]);
