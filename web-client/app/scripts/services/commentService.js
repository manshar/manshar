'use strict';

angular.module('webClientApp')
  .service('ArticleComment', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ArticleCommentResource = $resource(
        baseUrl + 'articles/:articleId/comments/:commentId', {
          articleId: '@articleId'
        }, {
          get: {cache: true},
          query: {cache: true, isArray: true}
        });

      return ArticleCommentResource;
    }])

  .service('UserComment', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserCommentResource = $resource(baseUrl + 'users/:userId/comments',
        {}, {
          get: {cache: true},
          query: {cache: true, isArray: true}
        });

      return {
        query: UserCommentResource.query
      };
    }]);
