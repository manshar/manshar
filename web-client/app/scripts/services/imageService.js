'use strict';

angular.module('webClientApp')
  .service('Image', ['$resource', '$http', '$q', '$upload', 'API_HOST',
      function ($resource, $http, $q, $upload, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ImageResource = $resource(baseUrl + 'images/:imageId');

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
        for (var key in data.image) {
          fd.append('image[' + key + ']', data.image[key]);
        }
        return fd;
      };

      return {
        // No need to rewrite these. Just use what the $resource provide.
        get: ImageResource.get,
        query: ImageResource.query,
        delete: ImageResource.delete,

        // Handling uploading files with the request.
        save: function (data, optSuccess, optError, optProgress) {

          var delayedObj = {};

          var file = data.image.asset;
          delete data.image.asset;
          var dataDict = {};
          for (var key in data.image) {
            dataDict['image[' + key + ']'] = data.image[key];
          }

          $upload.upload({
            url : baseUrl + 'images',
            method: 'POST',
            headers: configs.headers,
            data : dataDict,
            file: file,
            fileFormDataName: 'image[asset]'
          }).success(function(data) {
            if (optSuccess) {
              optSuccess(data);
            }
            angular.copy(data, delayedObj);
          }).progress(function(event) {
            if (optProgress) {
              optProgress(event);
            }
          });

          return delayedObj;
        },

        update: function (params, data, optSuccess, optError) {

          var delayedObj = {};

          $http.put(baseUrl + 'images/' + params.imageId,
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
