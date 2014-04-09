'use strict';

describe('Service: ArticleRecommendation', function () {

  beforeEach(module('webClientApp'));
  var http, httpBackend, mockRecommendation, apiBase;

  beforeEach(function () {
    inject(function ($httpBackend, $http, API_HOST, ArticleRecommendation) {
      http = $http;
      httpBackend = $httpBackend;
      mockRecommendation = ArticleRecommendation;
      apiBase = '//'+API_HOST+'/api/v1/';
    });
  });

  afterEach(function () {

    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();

  });

  describe('ArticleRecommendation.query', function () {
    it('should make a GET request with :articleId', function () {
      httpBackend.expectGET(apiBase + 'articles/1/recommendations')
        .respond(200, [{id: 55}]);

      var recommendations = mockRecommendation.query({ 'articleId': 1 });
      httpBackend.flush();

      expect(recommendations[0].id).toBe(55);
    });
  });

  describe('ArticleRecommendation.delete', function () {
    it('should make a DELETE request with :articleId and :recommendationId', function () {
      httpBackend.expectDELETE(apiBase + 'articles/1/recommendations/5')
        .respond(200);

      mockRecommendation.delete({ 'articleId': 1, 'recommendationId': 5 });
      httpBackend.flush();
    });
  });

  describe('ArticleRecommendation.save', function () {
    it('should make a POST request with :articleId', function () {
      httpBackend.expectPOST(apiBase + 'articles/1/recommendations')
        .respond(200, {id: 1});

      var recommendation = mockRecommendation.save({ 'articleId': 1 });
      httpBackend.flush();
      expect(recommendation.id).toBe(1);
    });
  });

});


describe('Service: UserRecommendation', function () {

  beforeEach(module('webClientApp'));
  var http, httpBackend, mockRecommendation, apiBase;

  beforeEach(function () {
    inject(function ($httpBackend, $http, API_HOST, UserRecommendation) {
      http = $http;
      httpBackend = $httpBackend;
      mockRecommendation = UserRecommendation;
      apiBase = '//'+API_HOST+'/api/v1/';
    });
  });

  afterEach(function () {

    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();

  });

  describe('UserRecommendation.query', function () {
    it('should make a GET request with :userId', function () {
      httpBackend.expectGET(apiBase + 'users/1/recommendations')
        .respond(200, [{id: 55}]);

      var recommendations = mockRecommendation.query({ 'userId': 1 });
      httpBackend.flush();

      expect(recommendations[0].id).toBe(55);
    });
  });

});
