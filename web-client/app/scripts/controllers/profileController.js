'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle', 'UserDraft', 'User',
      function ($scope, $rootScope, $location, $routeParams, UserArticle, UserDraft, User) {

    User.get({'userId': $routeParams.userId},
        function(resource) {
          /* jshint camelcase: false */
          $rootScope.page.title = resource.name;
          $rootScope.page.image = resource.cover_url;
          $rootScope.page.publishedTime = resource.created_at;
          $rootScope.page.description = resource.bio;

          $scope.user = resource;
        });

    // Only get drafts if the current profile being viewed and the logged in user
    // are the same person.
    if (($rootScope.currentUser &&
         $rootScope.currentUser.id === parseInt($routeParams.userId))) {
      $scope.drafts = UserDraft.query({});
    }

    $scope.articles = UserArticle.query({'userId': $routeParams.userId});

  }]);