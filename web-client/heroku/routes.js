module.exports = {
  // TODO(mkhatib): Use this in express server.
  // TODO(mkhatib): Generate cache strategy file for these routes to serve
  // index.html.
  // This is used by for two things.
  //
  // One to only serve the main app (index.html)
  // to these paths and make sure to 404 (or serve something else) on the rest.
  // See heroku/server.js
  //
  // The second usage for this is to generate caching mechanisms for these
  // paths to serve the index.html file when offline otherwise the user
  // will only be able to browse the site offline if they go directly to /
  // if they land on any other page the app won't work.
  // see gulp/tasks/production/sw-precache.js
  appRoutes: [
    // Home Page.
    '/',
    // 404 page.
    '/404/?',
    // Single Article Page.
    '/articles/:id/?',
    '/articles/:id/edit/?',

    // Articles Listings.
    '/articles/list/:order/?',

    // Categories and Topics.
    '/categories/:cid/articles/:order/?',
    '/categories/:cid/topics/:tid/articles/:order/?',

    // Publishers and Profiles.
    '/publishers/?',
    '/publishers/profile/:uid/(published|recommended|discussions|drafts|stats|edit)/?',

    // Legacy paths.
    '/profiles/:uid/?',
  ],
  staticRoutes: [

  ],
};
