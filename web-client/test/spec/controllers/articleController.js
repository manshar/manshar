'use strict';

describe('Controller: ArticleCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, httpBackend, apiBase, routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $routeParams, Article, API_HOST) {
    routeParams = $routeParams;
    apiBase = '//' + API_HOST + '/api/v1/';
    httpBackend = $httpBackend;

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
    httpBackend.expectGET(apiBase + 'articles/1').respond({title: 'Hello World.'});

    routeParams.articleId = 1;
    var controller = createController();
    httpBackend.flush();
    expect(scope.article.title).toBe('Hello World.');
  });

});
