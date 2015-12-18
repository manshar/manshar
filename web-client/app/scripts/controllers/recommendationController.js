'use strict';

angular.module('webClientApp')
  .controller('RecommendationCtrl', ['$scope', '$rootScope', 'recommendations',
    function ($scope, $rootScope, recommendations) {
      var articles = [];
      console.log('recommendations', recommendations);
      angular.forEach(recommendations, function (recommendation) {
        console.log('recommendation', recommendation);
        articles.push(recommendation.article);
      });
      $scope.articles = articles;
  }]);
