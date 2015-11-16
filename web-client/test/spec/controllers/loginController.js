'use strict';

describe('Controller: LoginCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, location, routeParams, LoginSrv, errorMessages;

  module(function($provide) {
    $provide.service('$auth', function() {
      this.apiUrl = jasmine.createSpy('apiUrl');
      this.initialize = jasmine.createSpy('initialize');
      this.authenticate = jasmine.createSpy('authenticate');
      this.validateUser = jasmine.createSpy('validateUser');
      this.submitRegistration = jasmine.createSpy('submitRegistration');
      this.submitLogin = jasmine.createSpy('submitLogin');
      this.signOut = jasmine.createSpy('signOut');
      this.requestPasswordReset = jasmine.createSpy('requestPasswordReset');
      this.updatePassword = jasmine.createSpy('updatePassword');
      this.updateAccount = jasmine.createSpy('updateAccount');
      this.destroyAccount = jasmine.createSpy('destroyAccount');
    });
  });

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

    it('should set error message when login fails', function () {
      spyOn(LoginSrv, 'login').and.callFake(function(user, success, error) {
        error(errorMessages);
      });

      routeParams.prev = '/articles/1';
      createController();
      scope.login({});

      expect(scope.error).toBe('حدث خطأ ما. الرجاء المحاولة مرة أخرى');
    });

  });
});
