'use strict';

describe('Filter: nohtml', function () {

  beforeEach(module('webClientApp'));

  var nohtml;

  beforeEach(inject(function (nohtmlFilter) {
    nohtml = nohtmlFilter;
  }));

  it('should remove all html tags', function () {
    var html = '<a href="#">Hello <b>world!</b></a>';
    var expectedOutput = 'Hello world!';
    expect(nohtml(html)).toBe(expectedOutput);

    html = '<p>Hello</p><p>world!</p>';
    expectedOutput = 'Hello world!';
    expect(nohtml(html)).toBe(expectedOutput);
  });

  it('should replace &nbsp; and \n with space', function () {
    var html = '&nbsp;Hello\nworld!';
    var expectedOutput = ' Hello world!';
    expect(nohtml(html)).toBe(expectedOutput);
  });
});
