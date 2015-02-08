'use strict';

angular.module('webClientApp')
  .service('LoginService', ['$rootScope', '$auth', function ($rootScope, $auth) {

    return {

      isAuthorized: function(isPublic, isAdmin) {
        return ((isPublic || this.isLoggedIn()) &&
                (!isAdmin || $rootScope.user.admin));
      },

      isLoggedIn: function() {
        return !!($rootScope.user && $rootScope.user.signedIn);
      },

      login: function(user, optSuccess, optError) {
        $auth.submitLogin(user)
        .then(

          // Success.
          angular.bind(this, function(response) {
            if (optSuccess) {
              optSuccess(response);
            }
          }),

          // Error.
          function(response) {
            if(optError) {
              optError(response);
            }
          });
      },

      logout: function(optSuccess, optError) {
        $auth.signOut()
        .then(
          // Success.
          angular.bind(this, function(response) {
            if(optSuccess) {
              optSuccess(response);
            }
          }),
          // Error.
          function(response) {
            if(optError) {
              optError(response);
            }
          });
      }
    };
  }]);
