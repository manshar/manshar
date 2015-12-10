'use strict';

angular.module('webClientApp')
  .controller('UserDashboardCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'User','$analytics', '$window', 'ArticleStats',
      function ($scope, $rootScope, $location, $routeParams, User, $analytics, $window, ArticleStats) {

    /**
     * Loads all articles stats
     */
    $scope.loadArticlesStats = function() {
      ArticleStats.query({}, function (stats) {
        $scope.stats = stats;
      });
    };

    $scope.loadArticlesStats();

    /**
     * When the user logout while in edit mode, redirect the user to his
     * own profile
     */
    var loggedOutUnbined = $rootScope.$on('auth:logout-success', function () {
      $location.path('/profiles/' + $routeParams.userId);
    });

    var onDestroy = function () {
      loggedOutUnbined();
    };

    $scope.$on('$destroy', onDestroy);

  }]);
