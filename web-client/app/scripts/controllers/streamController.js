'use strict';

angular.module('webClientApp')
  .controller('StreamCtrl', ['$scope', '$anchorScroll', '$state', 'articles',
      function ($scope, $anchorScroll, $state, articles) {
    $anchorScroll();
    $scope.articles = articles;
    $scope.firstArticles = $scope.articles.splice(0, 6);
    $scope.publishers = [];
    $scope.order = $state.params.order;

    // Used to make sure no duplicates occur in the publishers array
    var publishersDict = {};
    function addPublishers(articles) {
      for(var i = 0; (i < articles.length) && ($scope.publishers.length < 5); ++i) {
        var user = articles[i].user;
        if(!publishersDict[user.id]) {
          publishersDict[user.id] = true;
          $scope.publishers.push(user);
        }
      }
    }

    addPublishers($scope.firstArticles);
    if($scope.publishers.length < 5) {
      addPublishers($scope.articles);
    }

  }]);
