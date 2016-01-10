'use strict';

angular.module('webClientApp')
  .controller('RecommendationCtrl', ['$scope', '$rootScope', '$state', 'recommendations',
    function ($scope, $rootScope, $state, recommendations) {
    	var currentState = $state.current.url;
	    $scope.currentState = currentState.substring(0, currentState.length - 1);

      var articles = [];
      angular.forEach(recommendations, function (recommendation) {
        articles.push(recommendation.article);
      });
      $scope.articles = articles;
  }]);
