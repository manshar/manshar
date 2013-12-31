'use strict';

angular.module('webClientApp')
  .service('SignupService', ['$http', 'API_HOST',
      function ($http, API_HOST) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

    return {

      signup: function(user, optSuccess, optError) {
        $http.post(baseUrl + 'registrations.json',
                   {'user': user})
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
