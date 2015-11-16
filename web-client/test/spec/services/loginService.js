'use strict';

describe('Service: LoginService', function () {

  beforeEach(module('webClientApp'));
  var LoginSrv, httpBackend, http, baseUrl, handlers, rootScope;

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

  beforeEach(function () {

    inject(function ($httpBackend, $http, LoginService, API_HOST, $rootScope) {
      rootScope = $rootScope;
      LoginSrv = LoginService;
      httpBackend = $httpBackend;
      http = $http;
      baseUrl = '//' + API_HOST + '/api/v1/';
    });

    handlers = { success: function() {}, error: function() {} };
    spyOn(handlers, 'success');
    spyOn(handlers, 'error');
  });

  afterEach(function () {

    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();

  });

  describe('LoginService.isAuthorized', function () {
    it('should check user access', function () {
      var isPublic = true;
      expect(LoginSrv.isAuthorized(isPublic)).toBe(true);
      expect(LoginSrv.isAuthorized(!isPublic)).toBe(false);

      spyOn(LoginSrv, 'isLoggedIn').and.returnValue(true);
      expect(LoginSrv.isAuthorized(!isPublic)).toBe(true);
    });
  });

  describe('LoginService.isLoggedIn', function () {
    it('should check if user is logged in', function () {
      expect(LoginSrv.isLoggedIn()).toBe(false);

      rootScope.user.signedIn = true;
      expect(LoginSrv.isLoggedIn()).toBe(true);
    });
  });

});
