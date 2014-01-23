'use strict';

describe('Directive: mediumEditor', function () {

  var scope, inlineElement, richElement, defaultElement;
  beforeEach(module('webClientApp'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope;

    defaultElement = angular.element('<h1 grande-editor></h1>');

    inlineElement = angular.element(
        '<h1 grande-editor ' +
              'mode="inline" ' +
              'placeholder="My Placeholder" ' +
              'ng-model="inlineVar"' +
          '>' +
        '</h1>');

    richElement = angular.element(
        '<article grande-editor ' +
                    'mode="rich" ' +
                    'placeholder="My 2nd Placeholder" ' +
                    'ng-model="myvar" ' +
                  '>Hello World' +
        '</article>');

    $compile(defaultElement)(scope);
    $compile(inlineElement)(scope);
    $compile(richElement)(scope);
  }));

  it('should add g-editor class', function () {
    expect(inlineElement.hasClass('g-editor')).toBe(true);
    expect(richElement.hasClass('g-editor')).toBe(true);
    expect(defaultElement.hasClass('g-editor')).toBe(true);
  });

  it('should add contenteditable attributes', function () {
    expect(inlineElement.attr('contenteditable')).toBe('true');
    expect(richElement.attr('contenteditable')).toBe('true');
  });

  it('should add a placeholder in an empty editor', function () {
    var placeholderElement = inlineElement.children();
    expect(placeholderElement.hasClass('g-placeholder')).toBe(true);

    placeholderElement = richElement.children();
    expect(richElement.html()).toBe('Hello World');
    expect(defaultElement.text().trim()).toBe('');
  });

  it('should bind the ng-model to the content', function () {
    expect(scope.myvar).toBe('Hello World');

    scope.$apply(function () {
      scope.myvar = 'What';
    });
    expect(richElement.text()).toBe('What');

    expect(scope.inlineVar).toBe('');
    scope.$apply(function () {
      scope.inlineVar = 'So What';
    });
    expect(inlineElement.text()).toBe('So What');

    // The other way binding.
    inlineElement.html('Hello World');
    inlineElement.triggerHandler('change');
    expect(scope.inlineVar).toBe('Hello World');
  });

});