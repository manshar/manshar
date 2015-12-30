'use strict';

(function() {
  var DEFAULT_PROFILE_IMAGE_URL = 'images/default-avatar@200x150.png';

  function profileImageRequest(request) {
    // Load from cacheOnly to avoid redownloading the images since if the user
    // updates their avatar its URL will change.
    return toolbox.cacheOnly(request).catch(function() {
      return toolbox.networkFirst(request).catch(function() {
        return toolbox.cacheOnly(new Request(DEFAULT_PROFILE_IMAGE_URL));
      });
    });
  }

  toolbox.precache([DEFAULT_PROFILE_IMAGE_URL]);
  toolbox.router.get('/(.+)/users/avatars/(.*)', profileImageRequest, {
    origin: /manshar\.s3\.amazonaws\.com/
  });
})();
