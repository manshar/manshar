'use strict';

angular.module('webClientApp')
  .service('Topic', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var TopicResource = $resource(
        baseUrl + 'categories/:categoryId/topics/:topicId', {
          categoryId: '@categoryId',
          topicId: '@topicId'
        }, {
          get: {cache: true},
          query: {cache: true, isArray: true}
        });

      return TopicResource;
    }]);
