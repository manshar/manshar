'use strict';

describe('Controller: EditArticleCtrl', function () {

  beforeEach(module('webClientApp'));

  var createController, scope, httpBackend, apiBase, routeParams, rootScope, location, ArticleModel, mock;
  var articleData = {id: 1, title: 'Hello World.', user: {id: 1}};

  beforeEach(function() {


    // Mock confirm.
    mock = {
      confirm: function() {},
      localStorage: {
        getItem: function (){},
        setItem: function (){},
        removeItem: function (){}
      }
    };

    module(function($provide) {
      $provide.value('$window', mock);
    });

    inject(function ($controller, $location, $rootScope, $httpBackend, $routeParams, Article, API_HOST) {
      rootScope = $rootScope.$new();
      location = $location;
      routeParams = $routeParams;
      apiBase = '//' + API_HOST + '/api/v1/';
      httpBackend = $httpBackend;
      ArticleModel = Article;

      scope = $rootScope.$new();

      // Mock articleForm from the edit.html view for the test.
      scope.articleForm = {};
      createController = function () {
        return $controller('EditArticleCtrl', {
          $scope: scope,
          $routeParams: routeParams,
          $rootScope: rootScope,
          $location: location
        });
      };
    });
  });

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
        success({id: 2, published: true});
      });
      scope.saveArticle(scope.article);
      expect(ArticleModel.update).toHaveBeenCalled();
      expect(location.path()).toBe('/articles/2');
    });

    it('should set error on scope', function () {
      createController();
      spyOn(ArticleModel, 'update').andCallFake(function(params, data, success, error) {
        error({});
      });
      scope.saveArticle(scope.article);
      expect(scope.error).toBe('حدث خطأ في حفظ المقال.');
    });
  });

  describe('EditArticleCtrl.deleteArticle', function () {
    it('should delete an article when the user confirm', function () {
      createController();
      spyOn(mock, 'confirm').andCallFake(function() {return true;});
      spyOn(ArticleModel, 'delete').andCallFake(function(params, data, success) {
        success();
      });
      scope.deleteArticle({id: 1});
      expect(mock.confirm).toHaveBeenCalled();
      expect(ArticleModel.delete).toHaveBeenCalled();
      expect(location.path()).toBe('/');
    });

    it('should not delete an article when the user does not confirm', function () {
      createController();
      spyOn(mock, 'confirm').andReturn(false);
      spyOn(ArticleModel, 'delete');
      scope.deleteArticle({id: 1});
      expect(mock.confirm).toHaveBeenCalled();
      expect(ArticleModel.delete).not.toHaveBeenCalled();
    });

    it('should set error on scope', function () {
      createController();
      spyOn(mock, 'confirm').andReturn(true);
      spyOn(ArticleModel, 'delete').andCallFake(function(params, data, success, error) {
        error({});
      });
      scope.deleteArticle({id: 1});
      expect(mock.confirm).toHaveBeenCalled();
      expect(ArticleModel.delete).toHaveBeenCalled();
      expect(scope.error).toBe('حدث خطأ في حذف المقال.');
    });

  });


  describe('EditArticleCtrl.cancel', function () {
    it('should confirm before canceling when editing', function () {
      httpBackend.expectGET(apiBase + 'articles/1').respond({title: 'Hello World.'});
      routeParams.articleId = 1;
      createController();
      httpBackend.flush();
      spyOn(mock, 'confirm').andCallFake(function() {return true;});
      scope.cancel();
      expect(mock.confirm).not.toHaveBeenCalled();
      expect(location.path()).toBe('/');

      httpBackend.expectGET(apiBase + 'articles/1').respond({title: 'Hello World.'});
      routeParams.articleId = 1;
      createController();
      httpBackend.flush();
      scope.article.title = 'Bye World.';
      scope.cancel();
      expect(mock.confirm).toHaveBeenCalled();
      expect(location.path()).toBe('/');
    });

    it('should not confirm before canceling unchanged new article', function () {
      createController();
      spyOn(mock, 'confirm');
      scope.cancel();
      expect(mock.confirm).not.toHaveBeenCalled();
      expect(location.path()).toBe('/');
    });

    it('should not cancel a changed new article when not confirming', function () {
      location.path('/articles/new');
      createController();
      scope.article.title = 'hello';
      spyOn(mock, 'confirm').andCallFake(function() {return false;});
      scope.cancel();
      expect(mock.confirm).toHaveBeenCalled();
      expect(location.path()).toBe('/articles/new');
    });

    it('should cancel before a new changed article when confirming', function () {
      createController();
      scope.article.title = 'hello';
      spyOn(mock, 'confirm').andCallFake(function() {return true;});
      scope.cancel();
      expect(mock.confirm).toHaveBeenCalled();
      expect(location.path()).toBe('/');
    });

  });

});
