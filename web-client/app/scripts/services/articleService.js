'use strict';

angular.module('webClientApp')
  .service('ArticleService')
    .factory('Article', ['$resource', 'API_HOST', function($resource, API_HOST){
      return $resource('//'+API_HOST+'/api/v1/articles/:articleId', null, {
        'update': { method: 'PUT' }
      });
    }]);