'use strict';

angular.module('webClientApp')
  .filter('nohtml', [function () {
    return function(text) {
      return String(text)
        // Add a space when removing two adjacent opening and closing html tag
        // to avoid paragraphs from twingling without space between them.
        .replace(/<\/(?:.)*?><[^/](?:.)*?>/gm, ' ')
        // Remove all html entities.
        .replace(/<(?:.)*?>/gm, '')
        // Replace nbsp and \n with a space.
        .replace(/(&nbsp;)|(\n)/gm, ' ');
    };
  }]);
