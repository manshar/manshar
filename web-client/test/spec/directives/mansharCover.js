'use strict';

describe('Directive: mansharCover', function () {

  var scope, element, elementWithoutUrl;
  beforeEach(module('webClientApp'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope;
    element = angular.element(
        '<div manshar-cover url="{{url}}"></div>');

    elementWithoutUrl = angular.element(
        '<div manshar-cover></div>');
    $compile(element)(scope);
    $compile(elementWithoutUrl)(scope);
  }));

  it('should add background css properties to the element', function () {
    expect(elementWithoutUrl.css('background-image')).toBe('');
    expect(elementWithoutUrl.css('background-size')).toBe('cover');
    expect(elementWithoutUrl.css('background-repeat')).toBe('no-repeat');
    expect(elementWithoutUrl.css('background-position')).toBe('50% 50%');

    scope.$apply(function() {
      scope.url = 'mybackgroundimage.png';
    });
    expect(element.css('background-image')).toContain('mybackgroundimage.png');
    expect(element.css('background-size')).toBe('cover');
    expect(element.css('background-repeat')).toBe('no-repeat');
    expect(element.css('background-position')).toBe('50% 50%');
  });

});
