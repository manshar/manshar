'use strict';

angular.module('webClientApp')
  .controller('DiscussionCtrl', ['$scope', '$rootScope','comments',
    function ($scope, $rootScope, comments) {
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
