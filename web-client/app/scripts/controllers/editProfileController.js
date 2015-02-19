'use strict';

angular.module('webClientApp')
  .controller('EditProfileCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'User','$analytics', '$window', 'Link', 'UserLink',
      function ($scope, $rootScope, $location, $routeParams, User, $analytics, $window, Link, UserLink) {

    /**
     * If the current user is not the owner redirect the user to view.
     */
    var authorizeUser = function (user) {
      var id = parseInt($rootScope.user.id);
      if (id !== user.id) {
        $location.path('/profiles/' + user.id);
      }
    };

    $scope.profile = User.get({'userId': $routeParams.userId}, authorizeUser);
    $scope.error = null;
    $scope.errorMessages = {};
    
    /**
     * User Data update
     */
    $scope.updateUserData = function(profile) {
      User.update($scope.profile.id, profile, updateUserDataSuccess, updateUserDataError);
    };

    var updateUserDataSuccess = function() {
      $analytics.eventTrack('Update Success', {
        category: 'User'
      });
      $location.path('/profiles/' + $routeParams.userId);
    };

    var updateUserDataError = function(response) {
      $analytics.eventTrack('Update Error', {
        category: 'User',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ ما.'; // General form error.
      $scope.errorMessages = response.errors; // Detailed error message from backend.
    };
    
    /**
     * Loads all user links
     */
    $scope.loadLinks = function() {
      UserLink.query({'userId': $routeParams.userId}, function (links) {
        $scope.links = links;
      });
    };
    
    $scope.loadLinks();

    /**
     * Creates a link
     */
    $scope.createLink = function(link) {
      $scope.inProgress = 'createLink';
      link.userId = $routeParams.userId;
      Link.save(link, createLinkSuccess, createLinkError);
    };

    var createLinkSuccess = function() {
      $analytics.eventTrack('Create Link Success', {
        category: 'Link'
      });
      $scope.inProgress = null;
    };

    var createLinkError = function(response) {
      $analytics.eventTrack('Create Link Error', {
        category: 'Link',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في إنشاء الرابط.';
      $scope.inProgress = null;
    };

    /**
     * Updates a link
     */
    $scope.updateLink = function(link) {
      $scope.inProgress = 'updateLink';
      Link.update({ 'linkId': link.id}, link, updateLinkSuccess, updateLinkError);
    };

    var updateLinkSuccess = function() {
      $analytics.eventTrack('Update Link Success', {
        category: 'Link'
      });
      $scope.inProgress = null;
    };

    var updateLinkError = function(response) {
      $analytics.eventTrack('Update Link Error', {
        category: 'Link',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في تحديث الرابط.';
      $scope.inProgress = null;
    };
    
    /**
     * Deletes a link
     */
    $scope.deleteLink = function(link) {
      $scope.inProgress = 'delete';
      if ($window.confirm('متأكد من حذف الرابط؟')) {
        Link.delete({ 'linkId': link.id }, {}, deleteLinkSuccess, deleteLinkError);
      } else {
        $scope.inProgress = null;
      }
    };

    var deleteLinkSuccess = function () {
      $analytics.eventTrack('Link Deleted', {
        category: 'Link'
      });
      $scope.inProgress = null;
    };

    var deleteLinkError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Delete Link Error', {
        category: 'Link',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حذف الرابط.';
      $scope.inProgress = null;
    };


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
