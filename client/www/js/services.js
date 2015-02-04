angular.module('starter.services', [])

.factory('Search', function($http, $q) {
  var S = {};

  var address = 'http://104.131.140.95:5000/';
  //var address = 'http://localhost:5000/';

  function request(location) {
    return $http.get(address + location).then(function (data) {
      console.log(data);
      return data.data.businesses;
    });
  }

  S.search = function(location) {

    var query = '?';

    if (location && location.length > 0) {
      query += 'l=' + location;
    }

    var deferred = $q.defer();

    var opts = {};

    try {
      var watchId = navigator.geolocation.watchPosition(success, failure, opts);
    } catch (e) {
      deferred.resolve(request(query));
    }



    function success(position) {
      navigator.geolocation.clearWatch(watchId);
      var coords = position.coords.latitude + ',' + position.coords.longitude;

      if (query.length > 1) {
        query += '&';
      }

      query += ('c=' + coords)

      console.log(query);

      deferred.resolve(request(query));
    }

    function failure() {
      navigator.geolocation.clearWatch(watchId);
      alert('Failed to get current position. Is geolocation enabled?');

      deferred.resolve(request(query));
    }

    return deferred.promise;
  };

  return S;
})

.filter('range', function() {
  var memo = {};
  return function(n) {
    n = Math.floor(n);

    if (memo[n]) return memo[n];

    var arry = [];
    for (var i = 0; i < n; i++) {
      arry.push(i);
    }
    return memo[n] = arry;

    //return arry;
  }
})

.filter('round', function () {
  return function(n) {
    if (typeof n !== 'number') return '?';

    if (n > 3) {
      return Math.floor(n);
    } else if (n > 1) {
      return n.toPrecision(1);
    } else {
      return (n.toPrecision(1)).substr(1);
    }
  }
});
