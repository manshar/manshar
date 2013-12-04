'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webClientApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of articles to the scope', function () {
    expect(scope.articles.length).toBe(2);
    expect(scope.articles[0].title).toBe('مرحباً بالعالم');
    expect(scope.articles[0].body).toBe('أهلاً وسهلاً بكم');
  });

  it('should attach a title and a tagline to the scope', function() {
    expect(scope.title).toBe('منشر');
    expect(scope.tagline).toBe('منصة نشر مخصصة بالعربية');
  });
});
