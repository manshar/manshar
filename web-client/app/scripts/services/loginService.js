'use strict';

angular.module('webClientApp')
  .service('LoginService', ['$http', '$rootScope', 'API_HOST', 'StorageService',
      function ($http, $rootScope, API_HOST, StorageService) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

    return {

      isAuthorized: function(isPublic, isAdmin) {
        return ((isPublic || this.isLoggedIn()) &&
                (!isAdmin || $rootScope.currentUser.admin));
      },

      isLoggedIn: function() {
        var userData = StorageService.get('userData');
        return !!(userData && userData.authToken);
      },

      login: function(user, optSuccess, optError) {
        $http.post(baseUrl + 'sessions.json',
                   {'user': user})
        .then(

          // Success.
          angular.bind(this, function(response) {
            this.storeAuthData(response.data);
            $rootScope.$broadcast('user.loggedIn');
            if (optSuccess) {
              optSuccess(response.data);
            }
          }),

          // Error.
          function(response) {
            if(optError) {
              optError(response.data);
            }
          });
      },

      logout: function(optSuccess, optError) {
        $http.delete(baseUrl + 'sessions.json')
        .then(

          // Success.
          angular.bind(this, function(response) {
            this.reset();
            $rootScope.$broadcast('user.loggedOut');
            if(optSuccess) {
              optSuccess(response.data);
            }
          }),

          // Error.
          function(response) {
            if(optError) {
              optError(response.data);
            }
          });
      },

      storeAuthData: function(data) {
        StorageService.set('userData', data);
        this.init();
      },

      initAuthHeaders: function() {
        var userData = StorageService.get('userData');
        if (userData && userData.authToken) {
          var authHeader = 'Token token="' + userData.authToken + '"';
          $http.defaults.headers.common.Authorization = authHeader;
        }
      },

      reset: function() {
        StorageService.unset('userData');
        $http.defaults.headers.common.Authorization = null;
        $rootScope.currentUser = null;
        $rootScope.isLoggedIn = false;
      },

      // TODO(mkhatib): Add tests.
      init: function() {
        this.initAuthHeaders();
        $rootScope.isLoggedIn = this.isLoggedIn();
        var userData = StorageService.get('userData');
        if (userData && userData.user) {
          $rootScope.currentUser = userData.user;
        }
      }
    };
  }]);
