'use strict'

angular.module 'manshar',
 ['ngResource'
  'ngRoute'
  'ngCookies'
  'ngSanitize'
  'manshar.config'
  'manshar.filters'
  'manshar.services'
  'manshar.directives'
  'manshar.controllers' ]

angular.element(document).ready ->
  angular.bootstrap(document, ['manshar'])
