var qs = require('qs');
var cloneDeep = require('lodash.clonedeep');
var defaults = require('lodash.defaults');

// Gets, sets, syncs route state. Does not actually execute app flows based on route changes.
// That's followRoute's job.

function RouteState(opts) {
  var followRoute;
  var windowObject;

  if (opts) {
    followRoute = opts.followRoute;
    windowObject = opts.windowObject;
  }

  windowObject.onhashchange = routeFromHash;

  return {
    addToRoute: addToRoute,
    overwriteRouteEntirely: overwriteRouteEntirely,
    routeFromHash: routeFromHash,
    unpackEncodedRoute: unpackEncodedRoute
  };

  function routeFromHash() {
    followRoute(getRouteFromHash());
  }

  function getRouteFromHash() {
    // Skip the # part of the hash.
    return qs.parse(windowObject.location.hash.slice(1));
  }

  function addToRoute(updateDict, shouldFollowNewRoute = true) {
    var routeDict = defaults(cloneDeep(updateDict), getRouteFromHash());
    syncHashToRoute(routeDict);
    if (shouldFollowNewRoute) {
      followRoute(routeDict);
    }
  }

  function overwriteRouteEntirely(newDict) {
    syncHashToRoute(newDict);
    followRoute(newDict);
  }

  function syncHashToRoute(routeDict) {
    var updatedURL = windowObject.location.protocol + '//' + windowObject.location.host +
      windowObject.location.pathname + '#' + qs.stringify(routeDict);
    // Sync URL without triggering onhashchange.
    windowObject.history.pushState(null, null, updatedURL);
  }

  function unpackEncodedRoute(encodedStateFromRedirect) {
    var routeDict =  qs.parse(decodeURIComponent(encodedStateFromRedirect));
    syncHashToRoute(routeDict);
    followRoute(routeDict);
  }
}

module.exports = RouteState;
