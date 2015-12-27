'use strict';

angular.module('webClientApp')
  .directive('usersCarousel', ['User', function (User) {

    /* globals Animation */
    var scrollTimeout, carousel, itemWidth, autoLoadBufferCount, users,
        order, selectedUser, isLoadingAfter, isLoadingBefore, loadedUsers = {},
        orderDir, containerWidth;

    /**
     * Runs a callback once the elements of the users carousel is initialized.
     * @param  {Function} callback Callback function.
     */
    var onReady = function (callback) {
      var item = carousel.getElementsByClassName('author-block')[0];
      if (item) {
        containerWidth = parseInt(getComputedStyle(carousel).width);
        itemWidth = parseInt(getComputedStyle(item).width);
        callback();
      } else {
        setTimeout(onReady.bind(this, callback), 200);
      }
    };

    /**
     * Scrolls the carousel to the selected element.
     */
    var scrollToSelectedItem = function() {
      var selectedIndex = 0;
      for (var i = 0; i < users.length; i++) {
        if (selectedUser.id === users[i].id) {
          selectedIndex = i;
        }
      }
      var to = (users.length - selectedIndex) * itemWidth - containerWidth + 90;
      Animation.smoothScrollTo(
          carousel, carousel.scrollLeft, to, 'scrollLeft', 300,
          Animation.TimingFunctions.easeOutCuaic);
    };

    /**
     * Listens to the carousel scrolling to load more authors.
     */
    var handleCarouselScrolling = function () {
      var totalWidth = users.length * itemWidth;
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(function () {
        var autoLoadBufferWidth = autoLoadBufferCount * itemWidth;
        var scrollRight = carousel.scrollLeft + containerWidth;
        var shouldLoadBefore = scrollRight > totalWidth - autoLoadBufferWidth;
        var shouldLoadAfter = carousel.scrollLeft < autoLoadBufferWidth;
        if (shouldLoadAfter && !isLoadingAfter) {
          isLoadingAfter = true;
          loadMoreUsersAfter(users[users.length - 1].id, 10);
        } else if (shouldLoadBefore && !isLoadingBefore) {
          isLoadingBefore = true;
          loadMoreUsersBefore(users[0].id, 10);
        }
      }, 20);
    };

    /**
     * Loads more users after the pivotId and append it to users.
     * @param  {number} pivotId User ID to load more after.
     * @param  {number} count Number of users to load.
     */
    var loadMoreUsersAfter = function (pivotId, count) {
      User.query({
        'pivot_id': pivotId,
        'after_pivot_count': count,
        'before_pivot_count': 0,
        'order_dir': orderDir,
        'order': order
      }, function(newUsers) {
        for (var i = 0; i < newUsers.length; i++) {
          if (newUsers[i] && !loadedUsers[newUsers[i].id]) {
            loadedUsers[newUsers[i].id] = true;
            users.push(newUsers[i]);
          }
        }
        isLoadingAfter = false;
      });
    };

    /**
     * Loads more users before the pivotId and prepend it to users.
     * @param  {number} pivotId User ID to load more before.
     * @param  {number} count Number of users to load.
     */
    var loadMoreUsersBefore = function (pivotId, count) {
      User.query({
        'pivot_id': pivotId,
        'after_pivot_count': 0,
        'before_pivot_count': count,
        'order_dir': orderDir,
        'order': order
      }, function(newUsers) {
        var scrollLeftBefore = carousel.scrollLeft;
        for (var i = 0; i < newUsers.length; i++) {
          if (newUsers[i] && !loadedUsers[newUsers[i].id]) {
            loadedUsers[newUsers[i].id] = true;
            users.splice(0, 0, newUsers[i]);
          }
        }
        setTimeout(function() {
          carousel.scrollLeft = scrollLeftBefore;
        }, 5);
        isLoadingBefore = false;
      });
    };

    return {
      templateUrl: 'views/directives/usersCarousel.html',
      restrict: 'A',
      scope: {
        selectedUser: '=',
        users: '=',
        order: '@',
        autoLoad: '=',
        autoLoadBufferCount: '=',
        orderDir: '@'
      },
      link: function (scope, element) {
        carousel = element.find('div')[0];
        users = scope.users;
        for (var i = 0; i < users.length; i++) {
          loadedUsers[users[i].id] = true;
        }
        order = scope.order;
        selectedUser = scope.selectedUser;
        autoLoadBufferCount = scope.autoLoadBufferCount;
        orderDir = scope.orderDir;

        scope.$watch('selectedUser', function(newValue, oldValue) {
          if (newValue && oldValue && newValue !== oldValue) {
            selectedUser = newValue;
            scrollToSelectedItem(element);
          }
        });

        onReady(function() {
          scrollToSelectedItem(element);
          carousel.addEventListener('scroll', handleCarouselScrolling);
        });
      }
    };
  }]);
