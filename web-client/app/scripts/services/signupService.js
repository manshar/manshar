'use strict';

angular.module('webClientApp')
  .service('SignupService', ['$http', '$rootScope', '$auth', 'API_HOST',
      function ($http, $rootScope, $auth, API_HOST) {

    var baseUrl = '//' + API_HOST;

    return {

      resendConfirmation: function(email, optSuccess, optError) {
        $http.post(baseUrl + '/auth/confirmation', {
          'confirm_success_url': 'http://' + document.location.host + '/login',
          'user': {
            'email': email
          }
        })
        .then(

          // Success.
          angular.bind(this, function(response) {
            $rootScope.$broadcast('user.signedUp');
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

      signup: function(user, optSuccess, optError) {
        $auth.submitRegistration(user)
        .then(

          // Success.
          angular.bind(this, function(response) {
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
    };
  }]);
