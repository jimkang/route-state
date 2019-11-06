var qs = require('qs');
var cloneDeep = require('lodash.clonedeep');
var defaults = require('lodash.defaults');

// Gets, sets, syncs route state. Does not actually execute app flows based on route changes.
// That's followRoute's job.

function RouteState({ followRoute, windowObject, propsToCoerceToBool }) {
  var ephemeralDict = {}; // This is the stuff that won't get synced to the hash.
  if (!propsToCoerceToBool) {
    propsToCoerceToBool = [];
  }

  windowObject.onhashchange = routeFromHash;

  return {
    addToRoute,
    removeFromRoute,
    updateEphemeralState,
    overwriteRouteEntirely,
    routeFromHash,
    unpackEncodedRoute,
    getRouteFromHash
  };

  function routeFromHash() {
    followRoute(getRouteFromHash(), ephemeralDict);
  }

  function getRouteFromHash() {
    // Skip the # part of the hash.
    var dict = qs.parse(windowObject.location.hash.slice(1));
    for (var i = 0; i < propsToCoerceToBool.length; ++i) {
      const prop = propsToCoerceToBool[i];
      let val = dict[prop];
      if (val === 'yes') {
        val = true;
      } else if (val == 'no') {
        val = false;
      } else {
        val = val ? true : false;
      }
      dict[prop] = val;
    }
    return dict;
  }

  function addToRoute(updateDict, shouldFollowNewRoute = true) {
    var routeDict = defaults(cloneDeep(updateDict), getRouteFromHash());
    syncHashToRoute(routeDict);
    if (shouldFollowNewRoute) {
      followRoute(routeDict, ephemeralDict);
    }
  }

  function removeFromRoute(key, shouldFollowNewRoute = true) {
    var routeDict = getRouteFromHash();
    delete routeDict[key];
    syncHashToRoute(routeDict);
    if (shouldFollowNewRoute) {
      followRoute(routeDict, ephemeralDict);
    }
  }

  function updateEphemeralState(updateDict, shouldFollowNewRoute = true) {
    for (var key in updateDict) {
      ephemeralDict[key] = updateDict[key];
    }

    if (shouldFollowNewRoute) {
      followRoute(getRouteFromHash(), ephemeralDict);
    }
  }

  function overwriteRouteEntirely(newDict) {
    syncHashToRoute(newDict);
    followRoute(newDict, ephemeralDict);
  }

  function syncHashToRoute(routeDict) {
    var dictCopy = cloneDeep(routeDict);
    for (var i = 0; i < propsToCoerceToBool.length; ++i) {
      const prop = propsToCoerceToBool[i];
      let val = dictCopy[prop];
      if (val) {
        val = 'yes';
      } else {
        val = 'no';
      }
      dictCopy[prop] = val;
    }
    var updatedURL =
      windowObject.location.protocol +
      '//' +
      windowObject.location.host +
      windowObject.location.pathname +
      '#' +
      qs.stringify(dictCopy);
    // Sync URL without triggering onhashchange.
    windowObject.history.pushState(null, null, updatedURL);
  }

  function unpackEncodedRoute(encodedStateFromRedirect) {
    var routeDict = qs.parse(decodeURIComponent(encodedStateFromRedirect));
    syncHashToRoute(routeDict);
    followRoute(routeDict, ephemeralDict);
  }
}

module.exports = RouteState;
