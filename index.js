var qs = require('qs');
var cloneDeep = require('lodash.clonedeep');
var defaults = require('lodash.defaults');

// Gets, sets, syncs route state. Does not actually execute app flows based on route changes.
// That's followRoute's job.

function RouteState({followRoute, windowObject}) {
  windowObject.onhashchange = routeFromHash;

  return {
    addToRoute: addToRoute,
    routeFromHash: routeFromHash
  };

  function routeFromHash() {
    followRoute(getRouteFromHash());
  }

  function getRouteFromHash() {
    // Skip the # part of the hash.
    return qs.parse(windowObject.location.hash.slice(1));
  }

  function addToRoute(updateDict) {
    var routeDict = defaults(cloneDeep(updateDict), getRouteFromHash());
    syncHashToRoute(routeDict);
    followRoute(routeDict);
  }

  function syncHashToRoute(routeDict) {
    var updatedURL = windowObject.location.protocol + '//' + windowObject.location.host +
      windowObject.location.pathname + '#' + qs.stringify(routeDict);
    // Sync URL without triggering onhashchange.
    windowObject.history.pushState(null, null, updatedURL);
  }
}

module.exports = RouteState;
