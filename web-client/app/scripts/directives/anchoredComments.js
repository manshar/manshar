'use strict';

angular.module('webClientApp')
  /**
   * Enables anchored comments interactions on an article with properly tagged
   * elements.
   *
   * Usage:
   *   <article ng-bind-html="article.body"></article>
   *   <div anchored-comments article="article"
   *     guid-elements-class="guid-tagged"></div>
   * @param  {!angular.$rootScope} $rootScope Angular $rootScope.
   * @param  {!angular.$compile} $compile Angular $compile service.
   * @param  {!angular.$timeout} $timeout Angular $timeout service.
   * @param  {ArticleComment} ArticleComment Manshar's article comments service.
   * @return {!angular.Directive} Angular directive description.
   */
  .directive('anchoredComments', ['$rootScope', '$compile', '$timeout', '$window', 'ArticleComment',
      function ($rootScope, $compile, $timeout, $window, ArticleComment) {

    var COMMENT_HIGHLIGHT_CLASS = 'comment-highlighted';
    var ANCHORS_ACTIVE = 'anchored-comments-active';

    /**
     * Return the element or one of its ancestors with a data-guid tag.
     * @param  {HTMLElement} element Element to start looking from.
     * @return {HTMLElement} The element or one of its ancestor that has a guid.
     */
    var getAncestorWithGuid = function(element) {
      var guid = element.getAttribute('data-guid');
      if (!guid && element.parentNode) {
        return getAncestorWithGuid(element.parentNode);
      }
      return element;
    };

    /**
     * Broadcasts a 'show-anchor' event to show a specific anchor.
     * @param  {Event} e Mouse event.
     */
    var showAnchor = function(e) {
      // Some elements (like img inside figure) won't have guid. So rely on
      // their parent guids.
      var guidElement = getAncestorWithGuid(e.target);
      var guid = guidElement.getAttribute('data-guid');
      $rootScope.$emit('show-anchor', guid);
    };

    /**
     * Creates a new comment anchor and adding them to container.
     * @param  {HTMLElement} srcElement Element to get the GUID from.
     */
    var createNewComment = function(srcElement, scope, container, offsetTop) {
      // TODO(mkhatib): Maybe use another attribute rather than title
      // The reason I used title is Angular seems to be stripping any
      // data- attributes or id.
      var guid = srcElement.getAttribute('title');
      srcElement.removeAttribute('title');
      srcElement.setAttribute('data-guid', guid);
      // Enable comments anchors by adding anchored-comment directive to each.
      var commentEl = document.createElement('div');
      commentEl.setAttribute('anchored-comment', '');
      commentEl.setAttribute('guid', guid);
      commentEl.className = 'anchored-comment-box';
      commentEl.style.top = (srcElement.offsetTop + offsetTop) + 'px';
      $compile(commentEl)(scope);
      container.appendChild(commentEl);

      // Adding click and mouseover listeners to show anchor bubbles.
      angular.element(srcElement).on('click mouseover', showAnchor);
      // Make sure to unbind events we binded to elements.
      angular.element(srcElement).on('$destroy', function() {
        angular.element(srcElement).off('click mouseover');
      });
    };

    /**
     * Recalculate the positions of the comments.
     * @param  {HTMLElement} container Element that contains the anchors.
     */
    var repositionComments = function(container) {
      var comments = container.getElementsByClassName('anchored-comment-box');
      for (var i = 0; i < comments.length; i++) {
        var guid = comments[i].getAttribute('guid');
        if (!guid) {
          continue;
        }
        var srcElement = document.querySelector('[data-guid="' + guid + '"]');
        comments[i].style.top = srcElement.offsetTop + 'px';
      }
    };

    /**
     * Remove highlight from elements.
     */
    var clearHighlightedComment = function() {
      var el = document.getElementsByClassName(COMMENT_HIGHLIGHT_CLASS);
      if (el) {
        angular.element(el).removeClass(COMMENT_HIGHLIGHT_CLASS);
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
      templateUrl: 'views/directives/anchoredComments.html',
      restrict: 'A',
      scope: {
        article: '=',
        guidElementsClass: '@',
        guidElementsContainerId: '@'
      },
      link: function (scope, element) {
        var mainCommentBox = element.find('div')[0];
        var textarea = element.find('textarea')[0];

        $rootScope.$watch('user', function() {
          scope.user = $rootScope.user;
        });

        if (!scope.guidElementsClass) {
          scope.guidElementsClass = 'guid-tagged';
        }

        scope.$watch('article', function (newValue) {
          if (!newValue) {
            return;
          }

          // Need to render the anchors after making sure the page has
          // rendered fully.
          $timeout(function() {

            // When images get loaded in the guid elements container we need
            // to reposition the comments to calculate for hte images hieght.
            var guidContainer = document.getElementById(
                scope.guidElementsContainerId);
            angular.element(guidContainer).find('img').on('load', function() {
              repositionComments(element[0]);
            });


            // Get all comments for this article.
            ArticleComment.query({
              'articleId': scope.article.id
            }, function(comments) {
              scope.comments = comments;
            });

            // Loop over all elements with the GUID class.
            var elements = document.getElementsByClassName(
                scope.guidElementsClass);
            for (var i = 0; i < elements.length; i++) {
              createNewComment(elements[i], scope, element[0], guidContainer.offsetTop);
            }

          }, 200);

        });

        // Listen to 'show-comment' event and activate the choosen comment.
        var listener = $rootScope.$on('show-comment', function(e, data) {
          $timeout(function() {
            clearHighlightedComment();

            // Highlight the element that is showing its comments.
            var el = document.querySelector('[data-guid="' + data.guid + '"]');
            angular.element(el).addClass(COMMENT_HIGHLIGHT_CLASS);
            mainCommentBox.style.top = data.target.parentNode.offsetTop + 'px';

            // Activate the anchor sidebar and focus the new comment textarea.
            scope.activeGuid = data.guid;
            element.parent().addClass(ANCHORS_ACTIVE);
            $timeout(function() {
              textarea.focus();
            }, 50);
          });
        });
        listeners.push(listener);

        scope.$on('$destroy', cleanup);

        /**
         * On clicking outside the main comment box hide the sidebar.
         */
        scope.clickedOutside = function() {
          scope.activeGuid = null;
          clearHighlightedComment();
          element.parent().removeClass(ANCHORS_ACTIVE);
        };

        /**
         * Handles keypress event and post a comment on enter.
         * @param  {Event} e Keypress event.
         */
        scope.handleKeypress = function(e) {
          if (e.keyCode === 13) {
            ArticleComment.save({
              articleId: scope.article.id,
              comment: {
                body: scope.newComment,
                guid: scope.activeGuid
              }
            }, function(comment) {
              $timeout(function() {
                scope.comments.push(comment);
                scope.newComment = '';
              });
            });

            e.preventDefault();
          }
        };

        /**
         * Deletes a comment on an article.
         * @param {Object} comment The comment object to delete.
         */
        scope.deleteComment = function(comment) {
          ArticleComment.delete({
            'articleId': scope.article.id,
            'commentId': comment.id
          }, function () {
            var index = scope.comments.indexOf(comment);
            scope.comments.splice(index, 1);
          }, function (error) {
            $window.alert('حدث خطأ ما. الرجاء المحاولة مجدداً');
            console.log(error);
          });
        };

      }
    };
  }]);
