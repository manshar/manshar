'use strict';

angular.module('webClientApp')
  .service('Link', ['$resource', '$http', '$q', 'API_HOST',
      function ($resource, $http, $q, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var LinkResource = $resource(baseUrl + 'links/:linkId');

      return LinkResource;
    }])


  /**
   * A service to retrieve a specific user links.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('UserLink', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserLinkResource = $resource(
        baseUrl + 'users/:userId/links', {
          userId: '@userId'
        });

      return {
        query: UserLinkResource.query
      };
    }]);
