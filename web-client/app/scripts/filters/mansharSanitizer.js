'use strict';

angular.module('webClientApp')
  /**
   * This filter allows custom sanitization to some part of html body.
   *
   * This runs most of the html through Angular's sanitizer. But for
   * some parts like iframes are run through a custom sanitizer to only
   * allow YouTube embeds.
   *
   * @param  {!angular.$sce} $sce Angular $sce service.
   * @return {!angular.Filter} Angular filter definition.
   */
  .filter('mansharSanitizer', ['$sce', function ($sce) {

    /**
     * This expects an input of the format:
     *   <figure title="xxx">
     *     <iframe src="xxx"></iframe>
     *   </figure>
     *
     * This will allow iframes for YouTube embeds but not anything else.
     *
     * @param  {string} iframeHtml HTML represents the iframe to sanitize.
     * @return {string} Sanitized HTML string for the iframe.
     */
    var sanitizeIframe = function(iframeHtml) {
      var embedRegex = /src="(((https?:)?\/\/(?:www\.)?youtube.com\/.+?)|(http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13})\/embed\/simple))"/;
      var iFrameParts = embedRegex.exec(iframeHtml);
      var figureParts = /title="(.+)"/.exec(iframeHtml);
      if (iFrameParts && iFrameParts.length) {
        var src = iFrameParts[1];
        var classNames = /(youtube|vine)/.exec(src);
        return '<figure class="' + classNames[0] + '" title="' + figureParts[1] + '">' +
                 '<iframe src="' + src + '" frameborder="0" allowfullscreen></iframe>' +
               '</figure>';
      }
      return '';
    };

    return function(body) {

      if (!body) {
        return '';
      } else if (body.indexOf('<iframe') === -1) {
        return body;
      }

      // Split the body by the figures that contains iframes.
      // These should all run through the angular $sce.getTrustedHtml  to make
      // sure they are sanitized and don't contain any harmful code.
      var noIframes = body.split(/<figure.*?><iframe.+?><\/iframe><\/figure>/gmi);
      for (var i = 0; i < noIframes.length; i++) {
        noIframes[i] = $sce.getTrustedHtml(noIframes[i]);
      }


      // Get the iframes that needs to be manually sanitized by our code.
      // And sanitize them manually to make sure we only include YouTube embeds.
      var iframeRegex = /(<figure.*?><iframe.+?><\/iframe><\/figure>)/gmi;
      var iframes = body.match(iframeRegex);
      for (i = 0; i < iframes.length; i++) {
        iframes[i] = sanitizeIframe(iframes[i]);
      }

      // Now restitch the whole HTML to put the original body back together.
      var allHtmlItems = [];
      for (i = 0; i < noIframes.length; i++) {
        allHtmlItems.push(noIframes[i]);
        allHtmlItems.push(iframes[i]);
      }
      allHtmlItems.push(noIframes[i]);

      // And now that we sanitized all parts seprately, trust the restitched
      // body to make sure the (already sanitized) iframes don't get escaped
      // by ng-bind-html directive.
      return $sce.trustAsHtml(allHtmlItems.join(''));
    };
  }]);
