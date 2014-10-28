'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle', 'UserDraft', 'User',
      function ($scope, $rootScope, $location, $routeParams, UserArticle, UserDraft, User) {

    $scope.user = User.get({'userId': $routeParams.userId});

    // Only get drafts if the current profile being viewed and the logged in user
    // are the same person.
    if (($rootScope.currentUser &&
         $rootScope.currentUser.id === parseInt($routeParams.userId))) {
      $scope.drafts = UserDraft.query({});
    }

    $scope.articles = UserArticle.query({'userId': $routeParams.userId});

  }]);