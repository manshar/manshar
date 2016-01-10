'use strict';

angular.module('webClientApp')

  /**
   * A service to retrieve users data.
   * @param  {!angular.$resource} $resource
   * @param  {string} API_HOST Manshar API host.
   * @return {!angular.Service} Angualr service definition.
   */
  .service('User', ['$rootScope', '$resource', '$http', '$cacheFactory', 'API_HOST',
      function ($rootScope, $resource, $http, $cacheFactory, API_HOST) {

      var usersCache = $cacheFactory('users');
      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserResource = $resource(baseUrl + 'users/:userId', {}, {
        update: {method: 'PUT'},
        get: {cache: usersCache},
        query: {cache: usersCache, isArray: true}
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
          var url = baseUrl + 'users/' + userId;
          $http.put(url, createFormData({user: user}), configs).then(

            // Success.
            angular.bind(this, function(response) {
              usersCache.removeAll();
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
  .service('UserDraft', ['$resource', '$cacheFactory', 'API_HOST',
      function ($resource, $cacheFactory, API_HOST) {

      var articlesCache = (
          $cacheFactory.get('articles') || $cacheFactory('articles'));
      var baseUrl = '//' + API_HOST + '/api/v1/';
      var UserDraftResource = $resource(baseUrl + 'me/drafts', {}, {
        query: {cache: articlesCache, isArray: true}
      });

      return {
        query: UserDraftResource.query
      };
    }]);

