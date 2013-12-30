'use strict';

describe('Service: ArticleService', function () {

  beforeEach(module('webClientApp'));
  var http, httpBackend, mockArticle, apiBase;

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

  describe('ArticleService.Article', function () {
    it('should make a GET request with :articleId', function () {
      httpBackend.expectGET(apiBase + 'articles/1').respond(200, {title: 'Hello World.'});
      var article = mockArticle.get({ 'articleId': 1 });
      httpBackend.flush();

      expect(article.title).toBe('Hello World.');
    });
  });
});