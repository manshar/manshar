'use strict';

angular.module('webClientApp')
  .filter('timeToRead', [function () {
    return function(text) {
      return Math.max(String(text).split(' ').length/200, 1);
    };
  }]);
