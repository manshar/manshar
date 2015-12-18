'use strict';

(function() {
  toolbox.router.any('/.*', toolbox.networkFirst, {
    origin: /ajax\.cloudflare\.com/
  });

  toolbox.router.get('/.*', toolbox.networkFirst, {
    origin: /www\.google-analytics\.com/
  });

})();
