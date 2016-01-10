'use strict';

angular.module('webClientApp')
  .controller('DiscussionCtrl', ['$scope', '$rootScope', '$state','comments',
    function ($scope, $rootScope, $state, comments) {
      var currentState = $state.current.url;
      $scope.currentState = currentState.substring(0, currentState.length - 1);

      var articles = [];

      angular.forEach(comments, function (comment) {
        var alreadyExist = false;
        for (var i = 0; i < articles.length; i++) {
          if (angular.equals(articles[i], comment.article)) {
            alreadyExist = true;
          }
        }
        if (!alreadyExist) {
          articles.push(comment.article);
        }
      });
      $scope.articles = articles;

  }]);
