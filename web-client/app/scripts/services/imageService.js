'use strict';

angular.module('webClientApp')
  .service('Image', ['$resource', '$http', '$q', '$upload', 'API_HOST',
      function ($resource, $http, $q, $upload, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var ImageResource = $resource(baseUrl + 'images/:imageId', {}, {
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
        for (var key in data.image) {
          // Remove special keys for angular resources.
          if (key.trim() === '' || key.indexOf('$') === 0 || key === 'toJSON') {
            continue;
          }
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

          // TODO(mkhatib): Until we figure out a way to rename files either
          // on the frontend or backend to not include non-english characters
          // we'll have to tell the user to fix this instead.
          var filename = data.image.asset && data.image.asset.name;
          if (filename && filename.match(/[^\x00-\x7F]+/ig, 'X')) {
            if (optError) {
              optError(
                  'اسم الملف غير صالح. الرجاء تغيير اسم الملف' +
                  ' لكي تحتوي أحرف إنجليزية فقط.');
            }
            return delayedObj;
          }

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
