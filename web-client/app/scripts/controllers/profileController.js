'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle',
      function ($scope, $rootScope, $location, $routeParams, UserArticle) {

    // TODO(mkhatib): Get user info. And render the page even if the user doesn't
    // have articles yet. This is a workaround until we have a UserService.

    $scope.articles = UserArticle.query({'userId': $routeParams.userId},
      function(resources) {
        if (!resources || !resources.length) {
          $location.path('/');
        } else {
          $scope.user = resources[0].user;
        }
      });

  }]);