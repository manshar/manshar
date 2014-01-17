'use strict';


describe('Service: StorageService', function () {

  beforeEach(module('webClientApp'));
  var StorageSrv, mock, storeMock = {};

  beforeEach(function () {


    // Mock localStorage.
    mock = {
      localStorage: {
        getItem: function (){},
        setItem: function (){},
        removeItem: function (){}
      }
    };
    spyOn(mock.localStorage, 'getItem').andCallFake(function (key) {
      return angular.fromJson(storeMock[key]);
    });
    spyOn(mock.localStorage, 'setItem').andCallFake(function (key, value) {
      storeMock[key] = angular.toJson(value);
      return storeMock[key];
    });
    spyOn(mock.localStorage, 'removeItem');
    module(function($provide) {
      $provide.value('$window', mock);
    });

    inject(function (StorageService) {
      StorageSrv = StorageService;
    });

  });

  it('shoud store, retrieve and remove primative types', function () {
    StorageSrv.set('key1', 'value1');
    expect(mock.localStorage.setItem).toHaveBeenCalledWith('key1', '"value1"');

    StorageSrv.set('key2', 123);
    expect(mock.localStorage.setItem).toHaveBeenCalledWith('key2', '123');

    var value1 = StorageSrv.get('key1');
    expect(mock.localStorage.getItem).toHaveBeenCalledWith('key1');
    expect(value1).toBe('value1');

    var value2 = StorageSrv.get('key2');
    expect(mock.localStorage.getItem).toHaveBeenCalledWith('key2');
    expect(value2).toBe(123);

    StorageSrv.unset('key1');
    expect(mock.localStorage.removeItem).toHaveBeenCalledWith('key1');
  });

  it('should store and retrieve objects correctly', function () {
    var obj = {'user': {'name': 'mk', 'age': 26} };
    StorageSrv.set('user', obj);
    expect(mock.localStorage.setItem)
      .toHaveBeenCalledWith('user', angular.toJson(obj));

    var value1 = StorageSrv.get('user');
    expect(mock.localStorage.getItem).toHaveBeenCalledWith('user');
    // toBe doesn't seem to work well with objects. So Stringify it first.
    expect(angular.toJson(value1)).toBe(angular.toJson(obj));
  });

});
