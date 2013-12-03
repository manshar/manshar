'use strict'

angular.module('manshar.config', [])
.config ['$httpProvider', '$locationProvider', ($httpProvider, $locationProvider) ->
  $locationProvider.html5Mode true

  $httpProvider.defaults.transformRequest.push (data, headersGetter) ->
    utf8_data = data
    unless angular.isUndefined(data)
      d = angular.fromJson(data)
      d['_utf8'] = '&#9731;'
      utf8_data = angular.toJson(d)
    utf8_data

  for meta in document.getElementsByTagName('meta')
    if meta.name.toLowerCase() == 'csrf-token' && meta.content
      angular.element(document).ready =>
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = meta.content
]
