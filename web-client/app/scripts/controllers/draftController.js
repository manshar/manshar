'use strict';

angular.module('webClientApp')
  .controller('DraftCtrl', ['$scope', '$state', 'drafts',
    function ($scope, $state, drafts) {
      $scope.articles = drafts;
      var currentState = $state.current.url;
	    $scope.currentState = currentState.substring(0, currentState.length - 1);
  }]);
