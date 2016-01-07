'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$scope', '$stateParams','$rootScope', 'Article', 'User', 'articles',
      function ($scope, $stateParams, $rootScope, Article, User, articles) {

    $scope.order = $stateParams.order;
    $scope.title = 'مَنْشَر';
    $scope.tagline = 'منصة النشر العربية';
    $scope.articles = articles;
    $scope.firstArticles = $scope.articles.splice(0, 6);
    $scope.hasNext = articles ? true: false;
    $scope.publishers = [];

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

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };

  }]);
