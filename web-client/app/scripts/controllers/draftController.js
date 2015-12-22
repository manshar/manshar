'use strict';

angular.module('webClientApp')
  .controller('DraftCtrl', ['$scope', 'drafts',
    function ($scope, drafts) {
      $scope.articles = drafts;
  }]);
