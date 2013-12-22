'use strict';

describe('Service: LoginService', function () {

  beforeEach(module('webClientApp'));
  var LoginSrv, httpBackend, http, baseUrl, StorageSrv, handlers;

  var userCredentials = {
    email: 'example@example.com',
    password: '12341234'
  };

  var returnData = {
    user: { email: 'example@example.com' },
    authToken: 'aAFSKJAHF12rqfa8f23512'
  };

  var errorData = {
    errors: 'Unauthorized'
  };

  beforeEach(function () {

    inject(function ($httpBackend, $http, LoginService, API_HOST, StorageService) {
      LoginSrv = LoginService;
      httpBackend = $httpBackend;
      http = $http;
      baseUrl = '//' + API_HOST + '/api/v1/';
      StorageSrv = StorageService;
    });

    handlers = { success: jasmine.createSpy(), error: jasmine.createSpy() };
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

      spyOn(LoginSrv, 'isLoggedIn').andReturn(true);
      expect(LoginSrv.isAuthorized(!isPublic)).toBe(true);
    });
  });

  describe('LoginService.isLoggedIn', function () {
    it('should check if user is logged in', function () {
      expect(LoginSrv.isLoggedIn()).toBe(false);

      spyOn(StorageSrv, 'get').andReturn('example@example.com');
      expect(LoginSrv.isLoggedIn()).toBe(true);
      expect(StorageSrv.get).toHaveBeenCalledWith('user.email');
    });
  });

  describe('LoginService.login', function () {

    it('should POST /sessions.json and store user data', function () {
      var data = JSON.stringify({ user: userCredentials });
      httpBackend.expectPOST(baseUrl + 'sessions.json', data).respond(200, returnData);

      spyOn(LoginSrv, 'storeAuthData');
      LoginSrv.login(userCredentials, handlers.success, handlers.error);
      httpBackend.flush();

      expect(handlers.success).toHaveBeenCalledWith(returnData);
      expect(LoginSrv.storeAuthData).toHaveBeenCalledWith(returnData);
    });

    it('should call the error callback with the data returned', function () {
      var data = JSON.stringify({ user: userCredentials });
      httpBackend.expectPOST(baseUrl + 'sessions.json', data).respond(401, errorData);

      LoginSrv.login(userCredentials, handlers.success, handlers.error);
      httpBackend.flush();
      expect(handlers.error).toHaveBeenCalledWith(errorData);
    })

  });

  describe('LoginService.logout', function () {

    it('should DELETE /sessions.json and remove user data', function () {
      httpBackend.expectDELETE(baseUrl + 'sessions.json').respond(200, {});

      spyOn(LoginSrv, 'reset');
      LoginSrv.logout(handlers.success, handlers.error);
      httpBackend.flush();

      expect(handlers.success).toHaveBeenCalledWith({});
      expect(LoginSrv.reset).toHaveBeenCalled();
    });

    it('should call the error callback with the data returned', function () {
      httpBackend.expectDELETE(baseUrl + 'sessions.json').respond(401, errorData);

      LoginSrv.logout(handlers.success, handlers.error);
      httpBackend.flush();
      expect(handlers.error).toHaveBeenCalledWith(errorData);
    });

  });

  describe('LoginService.storeAuthData', function () {
    it('should store user data and init headers', function () {
      spyOn(StorageSrv, 'set');
      spyOn(LoginSrv, 'initAuthHeaders');
      LoginSrv.storeAuthData(returnData);

      expect(LoginSrv.initAuthHeaders).toHaveBeenCalled();
      expect(StorageSrv.set).toHaveBeenCalledWith('user.email', returnData.user.email);
      expect(StorageSrv.set).toHaveBeenCalledWith('user.authToken', returnData.authToken);
    });
  });

  describe('LoginService.initAuthHeaders', function () {
    it('should set auth headers', function () {
      spyOn(StorageSrv, 'get').andReturn(returnData.authToken);
      LoginSrv.initAuthHeaders();
      expect(StorageSrv.get).toHaveBeenCalledWith('user.authToken');

      // Make HTTP request to confirm the Authorization header has been set.
      var expectedHeaders = {
        Authorization: 'Token token="' + returnData.authToken + '"',
        Accept: 'application/json, text/plain, */*'
      };
      httpBackend.expectGET('/', expectedHeaders).respond(200);
      http.get('/');
      httpBackend.flush();
    });
  });

  describe('LoginService.reset', function () {
    it('should remove user data and unset auth header', function () {
      var authHeader = 'Token token="' + returnData.authToken + '"';
      http.defaults.headers.common.Authorization = authHeader;

      spyOn(StorageSrv, 'unset');
      LoginSrv.reset();

      expect(StorageSrv.unset).toHaveBeenCalledWith('user.email');
      expect(StorageSrv.unset).toHaveBeenCalledWith('user.authToken');
      expect(http.defaults.headers.common.Authorization).toBe(null);
    });

  });
});
