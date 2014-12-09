'use strict';

angular.module('webClientApp')
  /**
   * Enables ability to add event listener for clicking anywhere but an element.
   *
   * Usage:
   *   <div click-outside="clickedOutsideDiv()"></div>
   * @param  {!angular.$document} $document Angular $document service.
   * @return {!angular.Directive} Angular directive definition.
   */
  .directive('clickOutside', ['$document',
      function ($document) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {

        element.bind('click', function(e) {
          // This part keeps it from firing the click on the document.
          e.stopPropagation();
        });

        $document.bind('click', function() {
          scope.$apply(attr.clickOutside);
        });
      }
    };
  }]);
