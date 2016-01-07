'use strict';

angular.module('webClientApp')
  .controller('PublishersCtrl', ['$scope', '$rootScope','$state', '$anchorScroll', 'publishers',
    function ($scope, $rootScope, $state, $anchorScroll, publishers) {
      $anchorScroll();

      $rootScope.page.title = 'الناشرون';
    	$rootScope.page.description = 'ناشرو المقالات على منصة منشر للتدوين';

      $scope.publishers = publishers;
      var currentState = $state.current.url;
      $scope.currentState = currentState.substring(0, currentState.length - 1);
  }]);
