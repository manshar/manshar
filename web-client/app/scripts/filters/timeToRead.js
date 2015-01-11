'use strict';

angular.module('webClientApp')
  .filter('timeToRead', [function () {
    return function(text) {
      var time =  +(Math.max(String(text).split(' ').length/200, 1).toFixed(0));
      if (time === 1) {
        return 'دقيقة للقراءة';
      } else if(time === 2) {
        return 'دقيقتان للقراءة';
      } else if(time >= 3 && time <= 10) {
        return time + ' دقائق للقراءة';
      } else {
        return time + ' دقيقة للقراءة';
      }
    };
  }]);
