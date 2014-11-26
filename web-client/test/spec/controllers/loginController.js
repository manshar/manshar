'use strict';

describe('Controller: LoginCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, location, routeParams, LoginSrv, errorMessages;

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
    errorMessages = {errors:{'email': 'can\'t be blank'}};
  }));

  describe('LoginCtrl.login', function () {
    it('should login user and redirect', function () {
      spyOn(LoginSrv, 'login').andCallFake(function(user, success) {
        success();
      });

      routeParams.prev = '/articles/1';
      createController();
      scope.login({});

      expect(location.path()).toBe('/articles/1');

      // Should redirect to / if prev parameter didn't exist.
      delete routeParams.prev;
      createController();
      scope.login({});

      expect(location.path()).toBe('/');

    });

    it('should set error message when login fails', function () {
      spyOn(LoginSrv, 'login').andCallFake(function(user, success, error) {
        error(errorMessages);
      });

      routeParams.prev = '/articles/1';
      createController();
      scope.login({});

      expect(scope.error).toBe('خطأ في البريد الالكتروني أو كلمة المرور');
    });

  });
});
