'use strict';

describe('Service: SignupService', function () {

  beforeEach(module('webClientApp'));
  var SignupSrv, httpBackend, http, baseUrl, handlers;

  var userCredentials = {
    email: 'user@example.me',
    password: 'password',
    password_confirmation: 'password',
    name : 'Example Tester',
    bio : "A tester who is an example in all tests."
  };

  var returnData = {
    user: { email: 'hammam@manshar.me' },
    authToken: 'CZexzPGLYT1us1bxWQjx'
  };

  var errorData = {
    errors: 'Unauthorized'
  };

  beforeEach(function () {

    inject(function ($httpBackend, $http, SignupService, API_HOST) {
      SignupSrv = SignupService;
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

  describe('SignupService.signup', function () {

    it('should POST /registrations.json', function () {
      var data = JSON.stringify({ user: userCredentials });
      httpBackend.expectPOST(baseUrl + 'registrations.json', data).respond(200);

      SignupSrv.signup(userCredentials);
      httpBackend.flush();

    });

    it('should fail for an already used email', function () {
      var data = JSON.stringify({ user: userCredentials });
      httpBackend.expectPOST(baseUrl + 'registrations.json', data).respond(401, errorData);

      SignupSrv.signup(userCredentials, handlers.success, handlers.error);
      httpBackend.flush();
      expect(handlers.error).toHaveBeenCalledWith(errorData);
    });

  });
});
