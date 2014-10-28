'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'UserArticle', 'UserDraft',
      function ($scope, $rootScope, $location, $routeParams, UserArticle, UserDraft) {

    // TODO(mkhatib): Get user info. And render the page even if the user doesn't
    // have articles yet. This is a workaround until we have a UserService.

    /**
     * If the current user is not the owner redirect the user to view.
     */
    var maybeGetDrafts = function (redirectIfNone) {
      // Only get drafts if the current profile being viewed and the logged in user
      // are the same person.
      if ($rootScope.currentUser.id === $routeParams.userId) {
        $scope.drafts = UserDraft.query({}, function(resources) {

          if (!resources || !resources.length) {
            if (redirectIfNone) {
              $location.path('/');
            }
          } else {
            $scope.user = resources[0].user;
          }

        });
      }
    };

    $scope.articles = UserArticle.query({'userId': $routeParams.userId},
      function(resources) {
        var zeroPublished = !resources || !resources.length;
        if (!zeroPublished) {
          $scope.user = resources[0].user;
        }

        maybeGetDrafts(zeroPublished);
      });

  }]);