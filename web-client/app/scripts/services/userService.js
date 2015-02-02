'use strict';

angular.module('webClientApp')

  /**
   * A service to retrieve users data.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('User', ['$rootScope', '$resource', '$http', 'API_HOST', 'StorageService',
      function ($rootScope, $resource, $http, API_HOST, StorageService) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserResource = $resource(baseUrl + 'users/:userId', {}, {
        update: {method: 'PUT'}
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
        for (var key in data.user) {
          // Remove special keys for angular resources.
          if (key.trim() === '' || key.indexOf('$') === 0 || key === 'toJSON') {
            continue;
          }
          fd.append('user[' + key + ']', data.user[key]);
        }
        return fd;
      };

      return {
        get: UserResource.get,
        query: UserResource.query,
        update: function(userId, user, optSuccess, optError) {
          $http.put(baseUrl + 'users/' + userId,
                     createFormData({user: user}), configs)
          .then(

            // Success.
            angular.bind(this, function(response) {
              var userData = StorageService.get('userData');
              userData.user = response.data;
              $rootScope.currentUser = response.data;
              StorageService.set('userData', userData);

              if (optSuccess) {
                optSuccess(response.data);
              }
            }),

            // Error.
            function(response) {
              if(optError) {
                optError(response.data);
              }
            });
        }
      };
    }])


  /**
   * A service to retrieve current user drafts.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('UserDraft', ['$resource', 'API_HOST',
      function ($resource, API_HOST) {

      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserDraftResource = $resource(baseUrl + 'me/drafts');

      return {
        query: UserDraftResource.query
      };
    }]);

