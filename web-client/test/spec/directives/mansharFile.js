'use strict';

describe('Directive: mansharFile', function () {

  var scope, fileElement;
  beforeEach(module('webClientApp'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope;
    fileElement = angular.element(
        '<input manshar-file ' +
              'file-model="myFile" ' +
              'previewUrl="myPreviewUrl"' +
        '/>');
    spyOn(angular.element.prototype, 'on');
    $compile(fileElement)(scope);
  }));

  it('should update the fileModel and previewUrl when selecting a file', function () {
    expect(fileElement.on).toHaveBeenCalled();
    // There's no easy way to test out firing change event with files on it.
    // TODO(mkhatib): Test this in an e2e test.
  });

});