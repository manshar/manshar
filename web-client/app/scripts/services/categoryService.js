'use strict';

angular.module('webClientApp')
  .service('Category', ['$resource', '$http', '$q', 'API_HOST',
      function ($resource, $http, $q, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var CategoryResource = $resource(baseUrl + 'categories/:categoryId', {}, {
        get: {cache: true},
        query: {cache: true, isArray: true}
      });

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
        for (var key in data.category) {
          // Remove special keys for angular resources.
          if (key.trim() === '' || key.indexOf('$') === 0 || key === 'toJSON') {
            continue;
          }
          fd.append('category[' + key + ']', data.category[key]);
        }
        return fd;
      };

      return {
        // No need to rewrite these. Just use what the $resource provide.
        get: CategoryResource.get,
        query: CategoryResource.query,
        delete: CategoryResource.delete,

        // Handling uploading files with the request.
        save: function (data, optSuccess, optError) {

          var delayedObj = {};

          $http.post(baseUrl + 'categories',
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

          $http.put(baseUrl + 'categories/' + params.categoryId,
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
    }]);
