'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webClientApp'));

  var MainCtrl, httpBackend, scope, apiBase, location;

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
  beforeEach(inject(function ($httpBackend, $location, $controller, $rootScope, API_HOST) {
    location = $location;
    apiBase = '//' + API_HOST + '/api/v1/';
    httpBackend = $httpBackend;
    scope = $rootScope.$new();

    httpBackend.expectGET(apiBase + 'articles?order=popular').
        respond([{title: 'Hello World.'}, {title: 'Hey.'}]);
    httpBackend.expectGET(apiBase + 'users').
        respond([{}]);

    MainCtrl = $controller('MainCtrl', { $scope: scope });
    httpBackend.flush();
  }));

  it('should attach a list of articles to the scope', function () {
    expect(scope.articles.length).toBe(2);
    expect(scope.articles[0].title).toBe('Hello World.');
  });

  it('should attach a title and a tagline to the scope', function() {
    expect(scope.title).toBe('مَنْشَر');
    expect(scope.tagline).toBe('منصة النشر العربية');
  });

  describe('MainCtrl.showArticle', function () {
    it('should redirect the user to /articles/1', function () {
      scope.showArticle(1);
      expect(location.path()).toBe('/articles/1');
    });
  });

  describe('MainCtrl.newArticle', function () {
    it('should redirect the user to /articles/new', function () {
      scope.newArticle();
      expect(location.path()).toBe('/articles/new');
    });
  });

});
