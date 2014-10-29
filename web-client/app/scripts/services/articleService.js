'use strict';

angular.module('webClientApp')
  .service('Article', ['$resource', '$http', '$q', 'API_HOST',
      function ($resource, $http, $q, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ArticleResource = $resource(baseUrl + 'articles/:articleId');

      /**
       * These configs are needed. AngularJS identity tranformer
       * can automatically figure out that this is a multipart
       * content and use the correct Content-Type.
       */
      var configs = {
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      };

      var createFormData = function (data) {
        var fd = new FormData();
        for (var key in data.article) {
          fd.append('article[' + key + ']', data.article[key]);
        }
        return fd;
      };

      return {
        // No need to rewrite these. Just use what the $resource provide.
        get: ArticleResource.get,
        query: ArticleResource.query,
        delete: ArticleResource.delete,

        // Handling uploading files with the request.
        save: function (data, optSuccess, optError) {

          var delayedObj = {};

          $http.post(baseUrl + 'articles',
                     createFormData(data), configs)
            .then(

            // Success.
            function (response) {
              if (optSuccess) {
                optSuccess(response.data);
              }
              angular.copy(response.data, delayedObj);
            },

            // Error.
            function (response) {
              if (optError) {
                optError(response.data);
              }
            });

          return delayedObj;
        },

        update: function (params, data, optSuccess, optError) {

          var delayedObj = {};

          $http.put(baseUrl + 'articles/' + params.articleId,
                    createFormData(data), configs)
            .then(

            // Success.
            function (response) {
              if (optSuccess) {
                optSuccess(response.data);
              }
              angular.copy(response.data, delayedObj);
            },

            // Error.
            function (response) {
              if (optError) {
                optError(response.data);
              }
            });

          return delayedObj;
        }
      };
    }])


  /**
   * A service to retrieve a specific user articles.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('UserArticle', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserArticleResource = $resource(
        baseUrl + 'users/:userId/articles', {
          userId: '@userId'
        });

      return {
        query: UserArticleResource.query
      };
    }]);

