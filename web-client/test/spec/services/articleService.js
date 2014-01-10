'use strict';

describe('Service: Article', function () {

  beforeEach(module('webClientApp'));
  var http, httpBackend, mockArticle, apiBase;

  var articleData = {title: 'hello', body: 'what'};
  var errorData = {error: 'error message'};

  beforeEach(function () {
    inject(function ($httpBackend, $http, API_HOST, Article) {
      http = $http;
      httpBackend = $httpBackend;
      mockArticle = Article;
      apiBase = '//'+API_HOST+'/api/v1/';
    });
  });

  afterEach(function () {

    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();

  });

  describe('Article.get', function () {
    it('should make a GET request with :articleId', function () {
      httpBackend.expectGET(apiBase + 'articles/1')
        .respond(200, {title: 'Hello World.'});

      var article = mockArticle.get({ 'articleId': 1 });
      httpBackend.flush();

      expect(article.title).toBe('Hello World.');
    });
  });

  describe('Article.update', function () {

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPUT(apiBase + 'articles/1', new FormData())
          .respond(200, articleData);
      });

      it('should make a PUT request and call success callback', function () {
        var successFn = jasmine.createSpy();
        var article = mockArticle.update(
            { 'articleId': 1 }, {article: articleData}, successFn);
        httpBackend.flush();
        expect(successFn).toHaveBeenCalledWith(articleData);
        expect(article.title).toBe(articleData.title);
      });

      it('should work without callbacks', function () {
        var article = mockArticle.update(
            { 'articleId': 1 }, {article: articleData});
        httpBackend.flush();
        expect(article.title).toBe(articleData.title);
      });
    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        httpBackend.expectPUT(apiBase + 'articles/1', new FormData())
          .respond(400, errorData);
      });

      it('should make a PUT request and call error callback', function () {
        var article = mockArticle.update(
            { 'articleId': 1 }, {article: articleData},
            null, function (data) {
              expect(data.error).toBe(errorData.error);
            });
        httpBackend.flush();
      });

      it('should work without callbacks', function () {
        var article = mockArticle.update(
            { 'articleId': 1 }, {article: articleData});
        httpBackend.flush();
      });
    });
  });

  describe('Article.save', function () {

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(apiBase + 'articles', new FormData())
          .respond(200, articleData);
      });

      it('should make a POST request and call success callback', function () {
        var successFn = jasmine.createSpy();
        var article = mockArticle.save({ article: articleData}, successFn);
        httpBackend.flush();

        expect(article.title).toBe(articleData.title);
        expect(successFn).toHaveBeenCalledWith(articleData);
      });

      it('should work without callbacks', function () {
        var article = mockArticle.save({ article: articleData});
        httpBackend.flush();

        expect(article.title).toBe(articleData.title);
      });

    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(apiBase + 'articles', new FormData())
          .respond(400, errorData);
      });

      it('should make a POST request and call error callback', function () {
        var article = mockArticle.save(
            { article: articleData.title},
            function (data) {}, function (data) {
              expect(data.error).toBe(errorData.error);
            });
        httpBackend.flush();
      });

      it('should work without callbacks', function () {
        var article = mockArticle.save({ article: articleData});
        httpBackend.flush();
      });

    });
  });
});