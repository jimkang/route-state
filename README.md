route-state
==================

Gets, sets, and syncs state from the URL hash and an internal dictionary. Calls your callback when it changes.
This is a way of keeping as much of your app state in the URL hash as possible, while keeping your app in sync with it and the other way around.

Installation
------------

    npm install route-state

Usage
-----

    var RouteState = require('route-state');

    var routeState = RouteState({
      followRoute,
      windowObject: window  
    });

    wireGetAudioUI({useURI: addTrackURIToRoute});
    routeState.routeFromHash();

    function addTrackURIToRoute(uri) {
      routeState.addToRoute({trackURI: uri});
    }

    function followRoute(routeDict, ephemeralDict) {
      if (routeDict.remix && routeDict.trackURI) {
    	runRandomClipFlow(routeDict.trackURI);
      }
      else if (routeDict.trackURI) {
       runSampleFlow(routeDict.trackURI);
      }

      if (ephemeralDict.buffer) {
        // Play buffer or something
      }
    }

The `updateEphemeralState` method is like `addToRoute` except it does not update (or draw from) the hash. It's ideal for storing too-large things like buffers.

You can pass an array in `propsToCoerceToBool` in the constructor to have it convert properties with values like 'yes' or 'no' to boolean `true` and `false` when parsing from the hash and converting `true` and `false` in the in-memory state to 'yes and 'no' when writing back to the hash.

Tests
-----

Run tests with `make test`...when they are actually there.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
