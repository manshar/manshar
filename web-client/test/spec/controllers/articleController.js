'use strict';

describe('Controller: ArticleCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, httpBackend, apiBase, routeParams, articleMock, location;

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
  beforeEach(inject(function ($location, $controller, $rootScope, $httpBackend, $routeParams, Article, API_HOST) {
    routeParams = $routeParams;
    apiBase = '//' + API_HOST + '/api/v1/';
    httpBackend = $httpBackend;
    articleMock = Article;
    location = $location;
    scope = $rootScope.$new();
    createController = function () {
      return $controller('ArticleCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
    };
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should load article/1', function () {
    httpBackend.expectGET(apiBase + 'articles/1').respond({
      title: 'Hello World.',
      user: {
        name: 'mk'
      }
    });

    routeParams.articleId = 1;
    createController();
    httpBackend.flush();
    expect(scope.article.title).toBe('Hello World.');
  });

  describe('editArticle', function () {
    it('should redirect the user to edit page', function () {
      spyOn(articleMock, 'get');

      createController();
      scope.editArticle(1);
      expect(location.path()).toBe('/articles/1/edit');
    });
  });

});
