'use strict';

angular.module('webClientApp')
  .controller('MainCtrl', function ($scope) {
    $scope.title = 'منشر';
    $scope.tagline = 'منصة نشر مخصصة بالعربية';
    $scope.articles = [{
      title: 'مرحباً بالعالم',
      body: 'أهلاً وسهلاً بكم'
    }, {
      title: 'كيف الحال',
      body: 'بخير وكل شيء تمام'
    }];
  });
