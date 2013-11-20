'use strict'

describe 'Home Controller', ->
  [controller, scope] = [undefined, undefined]

  beforeEach module('manshar.controllers')
  beforeEach inject(($controller, $rootScope) ->
      scope = $rootScope.$new()
      controller = $controller 'HomeCtrl',
        $scope: scope
  )

  it 'has the right title', ->
    expect(scope.title).toBe 'أهلا و سهلا في منشر!'
