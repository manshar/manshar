'use strict';

angular.module('webClientApp')
  .controller('RecommendationCtrl', ['$scope', '$rootScope', 'recommendations',
    function ($scope, $rootScope, recommendations) {
      var articles = [];
      angular.forEach(recommendations, function (recommendation) {
        articles.push(recommendation.article);
      });
      $scope.articles = articles;
  }]);
