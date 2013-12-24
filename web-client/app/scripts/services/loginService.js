'use strict';

angular.module('webClientApp')
  .service('LoginService', ['$http', 'API_HOST', 'StorageService',
      function ($http, API_HOST, StorageService) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

    return {

      isAuthorized: function(isPublic) {
        return isPublic || this.isLoggedIn();
      },

      isLoggedIn: function() {
        return !!StorageService.get('user.email');
      },

      login: function(user, optSuccess, optError) {
        $http.post(baseUrl + 'sessions.json',
                   {'user': user})
        .then(

          // Success.
          angular.bind(this, function(response) {
            this.storeAuthData(response.data);
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
        StorageService.set('user.email', data.user.email);
        StorageService.set('user.authToken', data.authToken);
        this.initAuthHeaders();
      },

      initAuthHeaders: function() {
        var authToken = StorageService.get('user.authToken');
        if (authToken) {
          var authHeader = 'Token token="' + authToken + '"';
          $http.defaults.headers.common.Authorization = authHeader;
        }
      },

      reset: function() {
        StorageService.unset('user.email');
        StorageService.unset('user.authToken');
        $http.defaults.headers.common.Authorization = null;
      }
    };
  }]);
