'use strict';

angular.module('webClientApp')
  .service('SignupService', ['$http', '$rootScope', 'API_HOST',
      function ($http, $rootScope, API_HOST) {

    var baseUrl = '//' + API_HOST + '/api/v1/';

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
        fd.append('user[' + key + ']', data.user[key]);
      }
      return fd;
    };

    return {

      signup: function(user, optSuccess, optError) {
        $http.post(baseUrl + 'registrations.json',
                   createFormData({user: user}), configs)
        .then(

          // Success.
          angular.bind(this, function(response) {
            $rootScope.$broadcast('user.signedUp');
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
      },
    };
  }]);
