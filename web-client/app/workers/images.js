'use strict';

(function() {
  function imageRequests(request) {
    // Load from cacheOnly to avoid redownloading the images since if the user
    // uploads a new image its URL will change.
    return toolbox.cacheOnly(request).catch(function() {
      return toolbox.networkFirst(request);
    });
  }

  toolbox.router.get('/(.+)/(articles/covers|categories/icons|categories/images|images)/(.*)', imageRequests, {
    origin: /manshar\.s3\.amazonaws\.com/
  });
})();
