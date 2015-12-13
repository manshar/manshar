'use strict';

describe('App', function () {

  var route, location, rootScope, LoginSrv, http, httpBackend;
  beforeEach(module('webClientApp'));

  beforeEach(function () {

    inject(function($http, $httpBackend, $route, $location, $rootScope, LoginService) {
      http = $http;
      httpBackend = $httpBackend;
      route = $route;
      location = $location;
      rootScope = $rootScope;
      LoginSrv = LoginService;
    });

  });

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('config', function () {

    describe('Routing', function () {

      it('should allow access to public routes without login', function() {
        console.log(route.current);
        expect(route.current).toBeUndefined();
        location.path('/articles/1/');
        rootScope.$digest();

        expect(route.current.templateUrl).toBe('views/articles/show.html');
        expect(route.current.controller).toBe('ArticleCtrl');
      });

      it('should redirect users to login', function () {
        spyOn(LoginSrv, 'isLoggedIn').and.returnValue(false);
        location.path('/articles/1/edit/');
        rootScope.$digest();

        expect(route.current.templateUrl).toBe('views/login.html');
        expect(route.current.controller).toBe('LoginCtrl');
      });

      it('should allow logged in user to access protected routes', function () {
        spyOn(LoginSrv, 'isLoggedIn').and.returnValue(true);
        location.path('/articles/1/edit/');
        rootScope.$digest();

        expect(route.current.templateUrl).toBe('views/articles/edit.html');
        expect(route.current.controller).toBe('EditArticleCtrl');

        // Logged in users should still be able to access unprotected routes.
        location.path('/articles/1/');
        rootScope.$digest();

        expect(route.current.templateUrl).toBe('views/articles/show.html');
        expect(route.current.controller).toBe('ArticleCtrl');
      });

    });

    describe('Run', function () {
      it('should initialize rootScope variables and functions', function () {
        expect(rootScope.page.title).toBe('منصة النشر العربية');
        expect(rootScope.logout).not.toBe(undefined);
        expect(rootScope.isOwner).not.toBe(undefined);
      });

      describe('$rootScope.logout', function () {
        it('should logout and clear user data', function () {
          spyOn(LoginSrv, 'logout');
          rootScope.logout();
          expect(LoginSrv.logout).toHaveBeenCalled();
        });
      });

      describe('$rootScope.isOwner', function () {
        it('should check if the user is an owner of a resource', function () {
          var user = {id: 1};
          var resource = {title: 'hello', user: {id: 1}};

          expect(rootScope.isOwner(user, resource)).toBe(true);

          user = {id: 2};
          expect(rootScope.isOwner(user, resource)).toBe(false);
        });
      });

    });

  });
});
