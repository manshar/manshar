'use strict';

angular.module('webClientApp')
  .filter('timeToRead', [function () {
    return function(time) {
      time = +time;
      if (time <= 1) {
        return 'دقيقة للقراءة';
      } else if(time === 2) {
        return 'دقيقتان للقراءة';
      } else if(time >= 3 && time <= 10) {
        return time + ' دقائق للقراءة';
      } else if(isNaN(time)) {
        return '';
      } else {
        return time + ' دقيقة للقراءة';
      }
    };
  }]);
