'use strict';

angular.module('webClientApp')
  .service('ArticleRecommendation', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ArticleRecommendationResource = $resource(
        baseUrl + 'articles/:articleId/recommendations/:recommendationId', {
          articleId: '@articleId'
        }, {
          get: {cache: true},
          query: {cache: true, isArray: true}
        });

      return {
        query: ArticleRecommendationResource.query,
        delete: ArticleRecommendationResource.delete,
        save: ArticleRecommendationResource.save
      };
    }])

  .service('UserRecommendation', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserRecommendationResource = $resource(
        baseUrl + 'users/:userId/recommendations', {}, {
          get: {cache: true},
          query: {cache: true, isArray: true}
        });

      return {
        query: UserRecommendationResource.query
      };
    }]);
