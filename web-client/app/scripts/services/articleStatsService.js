'use strict';

angular.module('webClientApp')
  /**
   * A service to retrieve a specific user articles stats.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('ArticleStats', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ArticleStatsResource = $resource(
        baseUrl + 'me/total_stats');

      return {
        query: ArticleStatsResource.query
      };
    }]);
