'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$rootScope', function ($rootScope) {

    $rootScope.page.title = 'منصة النشر العربية';
    $rootScope.page.description = 'منصة نشر متخصصة باللغة العربية مفتوحة المصدر';

  }]);
