'use strict';

describe('Controller: SignupCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, location, routeParams, SignupSrv, errorMessages;

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
  beforeEach(inject(function ($controller, $location, $rootScope, $routeParams, SignupService) {
    routeParams = $routeParams;
    location = $location;
    SignupSrv = SignupService;

    scope = $rootScope.$new();
    createController = function () {
      return $controller('SignupCtrl', {
        $scope: scope,
        $routeParams: routeParams,
        $location: location,
        SignupService: SignupSrv
      });
    };
    errorMessages = {errors:{'email': 'can\'t be blank'}};
  }));

  describe('SignupCtrl.signup', function () {

    it('should set error message when login fails', function () {
      spyOn(SignupSrv, 'signup').and.callFake(function(user, success, error) {
        error(errorMessages);
      });

      routeParams.prev = '/articles/1';
      createController();
      scope.signup({});

      expect(scope.error).toBe('حدث خطأ ما.');
      expect(scope.errorMessages.email).toBe('can\'t be blank');
    });

  });
});
