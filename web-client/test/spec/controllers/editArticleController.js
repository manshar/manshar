'use strict';

describe('Controller: EditArticleCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, httpBackend, apiBase, routeParams, rootScope, location, ArticleModel;
  var articleData = {id: 1, title: 'Hello World.', user: {id: 1}};

  beforeEach(inject(function ($controller, $location, $rootScope, $httpBackend, $routeParams, Article, API_HOST) {
    rootScope = $rootScope.$new();
    location = $location;
    routeParams = $routeParams;
    apiBase = '//' + API_HOST + '/api/v1/';
    httpBackend = $httpBackend;
    ArticleModel = Article;

    scope = $rootScope.$new();
    createController = function () {
      return $controller('EditArticleCtrl', {
        $scope: scope,
        $routeParams: routeParams,
        $rootScope: rootScope,
        $location: location
      });
    };
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });


  it('should load article/1 for edit and empty for new', function () {
    // New Article.
    createController();
    expect(scope.article.title).toBe(undefined);
    scope.$apply(function () {
      scope.article.title = '';
    });
    expect(rootScope.page.title).toBe('مقال جديد');

    // Edit Article.
    httpBackend.expectGET(apiBase + 'articles/' + articleData.id).respond(articleData);
    routeParams.articleId = articleData.id;
    rootScope.currentUser = {id: 1};
    createController();
    httpBackend.flush();
    expect(scope.article.title).toBe('Hello World.');
    expect(rootScope.page.title).toBe('Hello World.');
  });

  it('should redirect unauthorized user to view', function () {
    httpBackend.expectGET(apiBase + 'articles/1').respond(articleData);
    routeParams.articleId = articleData.id;
    rootScope.currentUser = {id: 2};
    createController();
    httpBackend.flush();
    expect(location.path()).toBe('/articles/1');
  });

  it('should listen to logged out event and unbind it when destroied', function () {
    // New Article.
    createController();
    rootScope.$emit('user.loggedOut');
    expect(location.path()).toBe('/');

    // Edit Article.
    spyOn(scope, '$on').andCallFake(function (event) {
      expect(event).toBe('$destroy');
    });
    httpBackend.expectGET(apiBase + 'articles/' + articleData.id).respond(articleData);
    routeParams.articleId = articleData.id;
    rootScope.currentUser = {id: 1};
    createController();
    httpBackend.flush();
    rootScope.$emit('user.loggedOut');
    expect(location.path()).toBe('/articles/' + articleData.id);

    expect(scope.$on).toHaveBeenCalled();
  });

  describe('EditArticleCtrl.saveArticle', function () {
    it('should update an existing article using Article.update', function () {
      httpBackend.expectGET(apiBase + 'articles/1').respond({title: 'Hello World.'});
      routeParams.articleId = 1;
      createController();
      httpBackend.flush();

      spyOn(ArticleModel, 'update').andCallFake(function(params, data, success) {
        success({id: 2});
      });
      scope.saveArticle(scope.article);
      expect(ArticleModel.update).toHaveBeenCalled();
      expect(location.path()).toBe('/articles/2');
    });

    it('should set error on scope', function () {
      createController();
      spyOn(ArticleModel, 'save').andCallFake(function(data, success, error) {
        error({});
      });
      scope.saveArticle(scope.article);
      expect(scope.error).toBe('حدث خطأ في حفظ المقال.');
    });

    it('should create a new article using Article.save', function () {
      createController();
      spyOn(ArticleModel, 'save').andCallFake(function(data, success) {
        success({id: 2});
      });
      scope.saveArticle(scope.article);
      expect(ArticleModel.save).toHaveBeenCalled();
      expect(location.path()).toBe('/articles/2');
    });
  });

});
