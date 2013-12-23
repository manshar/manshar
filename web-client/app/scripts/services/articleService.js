'use strict';

angular.module('webClientApp')
  .service('ArticleService')
    .factory('Article', function($resource, API_HOST){
      return $resource('//'+API_HOST+'/api/v1/articles/:articleId');
    });