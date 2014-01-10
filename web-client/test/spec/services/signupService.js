'use strict';

describe('Service: SignupService', function () {

  beforeEach(module('webClientApp'));
  var SignupSrv, httpBackend, http, baseUrl, handlers;

  var userCredentials = {
    email: 'user@example.me',
    password: 'password',
    'password_confirmation': 'password',
    name : 'Example Tester',
    bio : 'A tester who is an example in all tests.'
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

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(
            baseUrl + 'registrations.json', new FormData())
          .respond(200, userCredentials);
      });

      it('should POST /registrations.json and call success callback', function () {
        SignupSrv.signup(userCredentials, handlers.success);
        httpBackend.flush();
        expect(handlers.success).toHaveBeenCalledWith(userCredentials);
      });

      it('should work without callbacks', function () {
        SignupSrv.signup(userCredentials);
        httpBackend.flush();
      });

    });

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(
            baseUrl + 'registrations.json', new FormData())
          .respond(401, errorData);
      });

      it('should POST /registrations.json and call fail callback', function () {
        SignupSrv.signup(userCredentials, null, handlers.error);
        httpBackend.flush();
        expect(handlers.error).toHaveBeenCalledWith(errorData);
      });

      it('should work without callbacks', function () {
        SignupSrv.signup(userCredentials);
        httpBackend.flush();
      });

    });
  });
});
