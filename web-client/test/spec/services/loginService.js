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

    describe('Success statuses', function () {

      beforeEach(function () {
        var data = JSON.stringify({ user: userCredentials });
        httpBackend.expectPOST(baseUrl + 'sessions.json', data)
          .respond(200, returnData);
      });

      it('should POST /sessions.json and store user data', function () {
        spyOn(LoginSrv, 'storeAuthData');
        LoginSrv.login(userCredentials, handlers.success, handlers.error);
        httpBackend.flush();

        expect(handlers.success).toHaveBeenCalledWith(returnData);
        expect(LoginSrv.storeAuthData).toHaveBeenCalledWith(returnData);
      });

      it('should work without a callback', function () {
        LoginSrv.login(userCredentials);
        httpBackend.flush();
      });

    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        var data = JSON.stringify({ user: userCredentials });
        httpBackend.expectPOST(baseUrl + 'sessions.json', data)
          .respond(401, errorData);
      });

      it('should call the error callback with the data returned', function () {
        LoginSrv.login(userCredentials, handlers.success, handlers.error);
        httpBackend.flush();
        expect(handlers.error).toHaveBeenCalledWith(errorData);
      });

      it('should work without a callback', function () {
        LoginSrv.login(userCredentials);
        httpBackend.flush();
      });

    });
  });

  describe('LoginService.logout', function () {

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectDELETE(baseUrl + 'sessions.json')
          .respond(200, {});
      });

      it('should DELETE /sessions.json and remove user data and calls callback', function () {
        spyOn(LoginSrv, 'reset');
        LoginSrv.logout(handlers.success, handlers.error);
        httpBackend.flush();

        expect(handlers.success).toHaveBeenCalledWith({});
        expect(LoginSrv.reset).toHaveBeenCalled();
      });

      it('should work without a callback', function () {
        LoginSrv.logout();
        httpBackend.flush();
      });

    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        httpBackend.expectDELETE(baseUrl + 'sessions.json')
          .respond(401, errorData);
      });

      it('should call the error callback with the data returned', function () {
        LoginSrv.logout(handlers.success, handlers.error);
        httpBackend.flush();
        expect(handlers.error).toHaveBeenCalledWith(errorData);
      });

      it('should work without a callback', function () {
        LoginSrv.logout();
        httpBackend.flush();
      });
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
