'use strict';

describe('Directive: highlightCode', function () {

  var scope, element;
  beforeEach(module('webClientApp'));

  beforeEach(inject(function ($compile, $rootScope) {
    // Mock hljs.highlightBlock.
    window.hljs = {
      highlightBlock: jasmine.createSpy()
    };
    scope = $rootScope;
    element = angular.element(
        '<div highlight-code>' +
          '<pre>def say_hello(name):' +
          '  print "Hello, ", name' +
          '</pre>' +
          '<pre>function sayHello(name){ ' +
          '  alert("Hello, " + name);' +
          '}</pre></div>');

    $compile(element)(scope);
  }));

  it('should call', function () {
    expect(window.hljs.highlightBlock).toHaveBeenCalled();
    expect(window.hljs.highlightBlock.calls.count()).toBe(2);
  });

});
