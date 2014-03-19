'use strict';

describe('Service: Image', function () {

  beforeEach(module('webClientApp'));
  var http, httpBackend, mockImage, apiBase;

  var imageData = {title: 'hello'};
  var errorData = {error: 'error message'};

  beforeEach(function () {
    inject(function ($httpBackend, $http, API_HOST, Image) {
      http = $http;
      httpBackend = $httpBackend;
      mockImage = Image;
      apiBase = '//'+API_HOST+'/api/v1/';
    });
  });

  afterEach(function () {

    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();

  });

  describe('Image.get', function () {
    it('should make a GET request with :imageId', function () {
      httpBackend.expectGET(apiBase + 'images/1')
        .respond(200, {title: 'Hello World.'});

      var image = mockImage.get({ 'imageId': 1 });
      httpBackend.flush();

      expect(image.title).toBe('Hello World.');
    });
  });

  describe('Image.update', function () {

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPUT(apiBase + 'images/1', new FormData())
          .respond(200, imageData);
      });

      it('should make a PUT request and call success callback', function () {
        var successFn = jasmine.createSpy();
        var image = mockImage.update(
            { 'imageId': 1 }, {image: imageData}, successFn);
        httpBackend.flush();
        expect(successFn).toHaveBeenCalledWith(imageData);
        expect(image.title).toBe(imageData.title);
      });

      it('should work without callbacks', function () {
        var image = mockImage.update(
            { 'imageId': 1 }, {image: imageData});
        httpBackend.flush();
        expect(image.title).toBe(imageData.title);
      });
    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        httpBackend.expectPUT(apiBase + 'images/1', new FormData())
          .respond(400, errorData);
      });

      it('should make a PUT request and call error callback', function () {
        mockImage.update(
            { 'imageId': 1 }, {image: imageData},
            null, function (data) {
              expect(data.error).toBe(errorData.error);
            });
        httpBackend.flush();
      });

      it('should work without callbacks', function () {
        mockImage.update(
            { 'imageId': 1 }, {image: imageData});
        httpBackend.flush();
      });
    });
  });

  describe('Image.save', function () {

    describe('Success statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(apiBase + 'images', new FormData())
          .respond(200, imageData);
      });

      it('should make a POST request and call success callback', function () {
        var successFn = jasmine.createSpy();
        var image = mockImage.save({ image: imageData}, successFn);
        httpBackend.flush();

        expect(image.title).toBe(imageData.title);
        expect(successFn).toHaveBeenCalledWith(imageData);
      });

      it('should work without callbacks', function () {
        var image = mockImage.save({ image: imageData});
        httpBackend.flush();

        expect(image.title).toBe(imageData.title);
      });

    });

    describe('Failure statuses', function () {

      beforeEach(function () {
        httpBackend.expectPOST(apiBase + 'images', new FormData())
          .respond(400, errorData);
      });

      it('should make a POST request and call error callback', function () {
        mockImage.save(
            { image: imageData.title},
            null, function (data) {
              expect(data.error).toBe(errorData.error);
            });
        httpBackend.flush();
      });

      it('should work without callbacks', function () {
        mockImage.save({ image: imageData});
        httpBackend.flush();
      });

    });
  });
});
