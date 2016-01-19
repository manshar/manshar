'use strict';

angular.module('webClientApp')

  /**
   * Creates and attach comments icon and handle events to show the comments
   * in the comments sidebar. This works with the anchorComments directive.
   *
   * @param  {!angular.$rootScope} $rootScope Angular $rootScope.
   * @param  {!angular.$timeout} $timeout Angular $timeout service.
   * @return {!angular.Directive} Angular directive definition.
   */
  .directive('anchoredComment', ['$rootScope', '$timeout', '$analytics',
      function ($rootScope, $timeout, $analytics) {

    /**
     * Returns the parent of an element that has the class name.
     * @param  {string} className Class name to find on parent.
     * @param  {HTMLElement} element To start looking from and up.
     * @return {HTMLElement|null} An element with the specified class.
     */
    var getParentWithClassName = function(className, element) {
      if (!element) {
        return null;
      }

      if (angular.element(element).hasClass(className)) {
        return element;
      } else {
        return getParentWithClassName(className, element.parentNode);
      }
    };

    var listeners = [];
    /**
     * Cleans up event listeners we added on $rootScope when the directive
     * is destroyed.
     */
    var cleanup = function() {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
      listeners = [];
    };

    return {
      templateUrl: 'views/directives/anchoredComment.html',
      restrict: 'A',
      scope: {
        guid: '@'
      },
      link: function (scope, element) {
        scope.commentsCount = 0;
        scope.commentsCountToShow = 4;

        // Shows the anchor icon for the user to click.
        var listener = $rootScope.$on('show-anchor', function(e, data) {
          $timeout(function() {
            scope.isActive = (data === scope.guid);
          });
        });
        listeners.push(listener);

        // On clicking the bubble icon send an event to show the comment.
        var commentButton = element.find('div').find('div');
        commentButton.on('click', function(e) {
          // Get the clicked anchor.
          var clickedEl = getParentWithClassName(
              'anchored-comment-box', e.target);

          $analytics.eventTrack('click', {
            category: 'UI',
            label: 'Comments Anchor',
            value: scope.commentsCount
          });

          $rootScope.$emit(
              'show-comment', {target: clickedEl, guid: scope.guid});
        });
        // Make sure to unbind events we binded to elements.
        commentButton.on('$destroy', function() {
          commentButton.off('click');
        });

        // All we care about here is the length of the array to update
        // the counts of the comments on each anchor.
        scope.$watch('$parent.comments.length', function() {
          scope.commentsCount = 0;
          // Calculate how many comments this GUID have.
          var comments = scope.$parent.comments || [];
          for (var i = 0; i < comments.length; i++) {
            if (comments[i].guid === scope.guid) {
              scope.commentsCount++;
            }
          }

          scope.latestComments = getLatestComments(scope.commentsCountToShow);
        });

        var getLatestComments = function(count) {
          var comments = [];
          var usersAlreadyAdded = {};
          var allComments = scope.$parent.comments || [];
          for (var i = 0; i < allComments.length; i++) {
            if (allComments[i].guid === scope.guid &&
                !usersAlreadyAdded[allComments[i].user.id]) {
              usersAlreadyAdded[allComments[i].user.id] = true;
              comments.push(allComments[i]);
            }
          }

          var startIndex = Math.max(0, comments.length - count);
          var endIndex = Math.min(
              comments.length, Math.max(comments.length, count));
          comments.reverse();
          return comments.slice(startIndex, endIndex);
        };

        scope.$on('$destroy', cleanup);
      }
    };
  }]);
