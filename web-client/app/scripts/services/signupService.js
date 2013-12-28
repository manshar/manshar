'use strict';

angular.module('webClientApp')
  .service('SignupService', ['$http', 'API_HOST', 'StorageService',
      function ($http, API_HOST, StorageService) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

    return {

      signup: function(user, optSuccess, optError) {
        $http.post(baseUrl + 'registrations.json',
                   {'user': user})
        .then(

          // Success.
          angular.bind(this, function(response) {
            //this.storeAuthData(response.data); // TODO should wait for confirmation
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
