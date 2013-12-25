'use strict';

angular.module('webClientApp')
  .service('SignupService', ['$http', 'API_HOST', 'StorageService',
      function ($http, API_HOST, StorageService) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

    return {

      signup: function(user, optSuccess, optError) {
        console.log('Yaaaa');
      },
    };
  }]);
