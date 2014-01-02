'use strict';

angular.module('webClientApp')
  .filter('nohtml', [function () {
    return function(text) {
      return String(text)
        // Remove all html entities.
        .replace(/<(?:.)*?>/gm, '')
        // Replace nbsp and \n with a space.
        .replace(/(&nbsp;)|(\n)/gm, ' ');
    };
  }]);