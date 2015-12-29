'use strict';

(function() {
  // Requests whose URLs contain this string contain user-specific data in their corresponding
  // Responses, and should be cleared when the user logs out.
  var USER_DATA_URL_SUBSTRING = 'api/v1/me/';

  function serveFromCacheOrNetwork(request) {
    if (request.headers.get('X-Cache-Only') === 'true') {
      return toolbox.cacheOnly(request).then(function(response) {
        if (response) {
          return response;
        } else {
          return new Response('', {
            status: 204,
            statusText: 'No cached content available.'
          });
        }
      });
    }

    // If this is a request with either 'X-Cache-Only: false' or just a normal request without
    // it set, then perform a HTTP fetch and cache the result.
    return toolbox.networkFirst(request);
  }

  toolbox.router.get('/api/v1/(.+)', serveFromCacheOrNetwork, {
    origin: /https?:\/\/api(?:-staging|-dev)?\.manshar\.com/
  });

  // Note: Maybe we don't need to do this and allow the client to cache as
  // requests happen instead of precaching.

  // TODO(mkhatib): pre-cache first page articles listing and loop over them
  // to pre-cache every resource.
  // TODO(mkhatib): Figure out how to also pre-cache images in the articles
  // body - maybe also pre-cache recommendations and comments per article.

  // https://api.manshar.com/api/v1/articles?order=popular
  // https://api.manshar.com/api/v1/articles?order=best (maybe)
  // https://api.manshar.com/api/v1/articles?order=recents (maybe)
  // https://api.manshar.com/api/v1/users (maybe)

  // https://api.manshar.com/api/v1/articles/652 - TOS
  // https://api.manshar.com/api/v1/categories


  addEventListener('message', function(event) {
    if (event.data === 'clear-cached-user-data') {
      caches.open(toolbox.options.cacheName).then(function(cache) {
        cache.keys().then(function(requests) {
          return requests.filter(function(request) {
            return request.url.indexOf(USER_DATA_URL_SUBSTRING) !== -1;
          });
        }).then(function(userDataRequests) {
          userDataRequests.forEach(function(userDataRequest) {
            cache.delete(userDataRequest);
          });
        });
      });
    }
  });
})();
