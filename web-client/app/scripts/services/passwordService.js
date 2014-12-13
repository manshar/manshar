'use strict';

angular.module('webClientApp')
  .service('PasswordService', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

    var baseUrl = '//' + API_HOST + '/api/v1/passwords.json';
    var PasswordResource = $resource(baseUrl, {}, {
      reset: { method: 'POST' },
      update: { method: 'PUT' }
    });

    return PasswordResource;
  }]);
