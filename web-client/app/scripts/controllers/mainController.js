'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', ['$rootScope', function ($rootScope) {

    $rootScope.page.title = 'منشر - فكِّر بالعربية';
    $rootScope.page.description = 'منصة نشر متخصصة باللغة العربية مفتوحة المصدر.' +
        ' عبر عن رأيك. شارك خبراتك. اكتب عن تجاربك. دوّن بالعربية.';

  }]);
