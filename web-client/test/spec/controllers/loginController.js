'use strict';

describe('Controller: LoginCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, location, routeParams, LoginSrv;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $location, $rootScope, $routeParams, LoginService) {
    routeParams = $routeParams;
    location = $location;
    LoginSrv = LoginService;

    scope = $rootScope.$new();
    createController = function () {
      return $controller('LoginCtrl', {
        $scope: scope,
        $routeParams: routeParams,
        $location: location
      });
    };
  }));

  describe('LoginCtrl.login', function () {
    it('should login user and redirect', function () {
      spyOn(LoginSrv, 'login').andCallFake(function(user, success, error) {
        success();
      });

      routeParams.prev = '/articles/1';
      var controller = createController();
      scope.login({});

      expect(location.path()).toBe('/articles/1');

      // Should redirect to / if prev parameter didn't exist.
      delete routeParams.prev;
      var controller = createController();
      scope.login({});

      expect(location.path()).toBe('/');

    });

    it('should set error message when login fails', function () {
      spyOn(LoginSrv, 'login').andCallFake(function(user, success, error) {
        error();
      });

      routeParams.prev = '/articles/1';
      var controller = createController();
      scope.login({});

      expect(scope.error).toBe('Wrong username and/or password.');
    });

  });
});
