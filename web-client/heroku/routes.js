module.exports = {
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

  // These are important to allow service-worker cache to fallback to index.html
  // only in the application routes and allow the rest to 404 normally.
  //
  // Without this any path would fallback to index.html (including service-worker.js).
  appRoutesRegexes: [
    /^\/$/,
    /^\/404\/?$/,
    /^\/articles\/\d+\/?$/,
    /^\/articles\/\d+\/edit\/?$/,
    /^\/articles\/list\/(popular|recent|best)\/?$/,
    /^\/categories\/\d+\/articles\/(popular|recent|best)\/?$/,
    /^\/categories\/\d+\/topics\/\d+\/articles\/(popular|recent|best)\/?$/,
    /^\/publishers\/?$/,
    /^\/publishers\/profile\/\d+\/(published|recommended|discussions|drafts|stats|edit)\/?$/,
    /^\/profiles\/\d+\/?$/,
  ],
};
